<?php
/**
 * Replacement for WordPress /wp-admin/admin-ajax.php
 * Handles AJAX actions used by frontend scripts in this clone.
 */

// Prevent direct browser access (must be POST or OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header('Access-Control-Allow-Origin: ' . (isset($_SERVER['HTTP_ORIGIN']) ? htmlspecialchars($_SERVER['HTTP_ORIGIN'], ENT_QUOTES) : '*'));
    header('Access-Control-Allow-Methods: POST');
    header('Access-Control-Allow-Headers: Content-Type');
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    exit('Method Not Allowed');
}

header('Content-Type: application/json; charset=utf-8');

// Rate limiting: max 10 submissions per IP per minute (simple session-based)
session_start();
$ip   = filter_var($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', FILTER_VALIDATE_IP) ?: '0.0.0.0';
$key  = 'rate_' . md5($ip);
$now  = time();
if (!isset($_SESSION[$key])) { $_SESSION[$key] = ['count' => 0, 'window' => $now]; }
if ($now - $_SESSION[$key]['window'] > 60) { $_SESSION[$key] = ['count' => 0, 'window' => $now]; }
$_SESSION[$key]['count']++;
if ($_SESSION[$key]['count'] > 10) {
    echo json_encode(['status' => 0, 'message' => 'Too many requests. Please try again later.']);
    exit;
}

require_once dirname(__DIR__) . '/db-config.php';

$action = trim($_POST['action'] ?? '');

switch ($action) {
    case 'lead_form_submit':
        handle_lead_form();
        break;

    case 'tools_certificate':
        handle_tools_certificate();
        break;

    case 'lsq_submission':
        // Original code sent the lead to a third-party CRM. 
        // We just return success so the JS doesn't show an error.
        echo json_encode(['status' => 1, 'message' => 'Received']);
        break;

    case 'fb_event_trigger':
        // Stub — Facebook server-side events are not wired up.
        echo json_encode(['status' => 1]);
        break;

    case 'lsq_submit_data':
        // Stub — no CRM/login redirect.
        echo json_encode(['status' => 1]);
        break;

    case 'testimonial_courses':
        // Return empty list — testimonial filter by course is not implemented.
        echo json_encode([]);
        break;

    case 'testimonial_filter':
        // Return empty HTML — static testimonials are already rendered in the page.
        echo json_encode(['status' => 1, 'html' => '']);
        break;

    default:
        echo json_encode(['status' => 0, 'message' => 'Unknown action']);
}

// ── Lead / Enroll / Download form handler ────────────────────────────────────

function handle_lead_form(): void {
    // Honeypot anti-spam check
    if (!empty($_POST['honeypot'])) {
        echo json_encode(['status' => 0, 'message' => 'Spam detected']);
        exit;
    }

    // Validate required fields
    $name          = trim($_POST['first_name']    ?? $_POST['name']          ?? '');
    $email         = trim($_POST['email']                                    ?? '');
    $mobile_raw    = trim($_POST['number']        ?? $_POST['mobile_number'] ?? '');
    $mobile_full   = trim($_POST['mobile_number'] ?? $mobile_raw);
    $course_name   = trim($_POST['course_name']   ?? '');
    $institution   = trim($_POST['institutionName'] ?? $_POST['institution'] ?? '');

    if ($name === '' || $email === '' || $mobile_raw === '') {
        echo json_encode(['status' => 0, 'message' => 'Please fill in all required fields.']);
        exit;
    }

    // Basic email format validation
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo json_encode(['status' => 0, 'message' => 'Invalid email address.']);
        exit;
    }

    // Sanitize optional UTM / tracking fields
    $utm_source   = trim($_POST['utm_source']   ?? '');
    $utm_medium   = trim($_POST['utm_medium']   ?? '');
    $utm_campaign = trim($_POST['utm_campaign'] ?? '');
    $utm_content  = trim($_POST['utm_content']  ?? '');
    $utm_keyword  = trim($_POST['utm_keyword']  ?? '');
    $source_page  = trim($_POST['website']      ?? '');
    $referer_url  = trim($_POST['referer_url']  ?? '');
    $user_country = trim($_POST['userCountry']  ?? '');
    $lead_form    = trim($_POST['LeadFormName'] ?? '');

    // IP address (safe — used only for logging, not displayed)
    $ip_address = filter_var($_SERVER['REMOTE_ADDR'] ?? '', FILTER_VALIDATE_IP) ?: '';

    try {
        $pdo  = get_db();

        // Ensure the table exists (idempotent)
        $pdo->exec("
            CREATE TABLE IF NOT EXISTS `leads` (
              `id`             INT UNSIGNED NOT NULL AUTO_INCREMENT,
              `name`           VARCHAR(200) NOT NULL,
              `email`          VARCHAR(255) NOT NULL,
              `mobile_number`  VARCHAR(30)  NOT NULL,
              `course_name`    VARCHAR(200) DEFAULT NULL,
              `institution`    VARCHAR(200) DEFAULT NULL,
              `lead_form_name` VARCHAR(200) DEFAULT NULL,
              `source_page`    VARCHAR(500) DEFAULT NULL,
              `utm_source`     VARCHAR(200) DEFAULT NULL,
              `utm_medium`     VARCHAR(200) DEFAULT NULL,
              `utm_campaign`   VARCHAR(200) DEFAULT NULL,
              `utm_content`    VARCHAR(200) DEFAULT NULL,
              `utm_keyword`    VARCHAR(200) DEFAULT NULL,
              `referer_url`    VARCHAR(500) DEFAULT NULL,
              `user_country`   VARCHAR(100) DEFAULT NULL,
              `ip_address`     VARCHAR(45)  DEFAULT NULL,
              `created_at`     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
              PRIMARY KEY (`id`)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ");

        $stmt = $pdo->prepare("
            INSERT INTO `leads`
              (name, email, mobile_number, course_name, institution, lead_form_name,
               source_page, utm_source, utm_medium, utm_campaign, utm_content,
               utm_keyword, referer_url, user_country, ip_address)
            VALUES
              (:name, :email, :mobile, :course, :institution, :lead_form,
               :source_page, :utm_source, :utm_medium, :utm_campaign, :utm_content,
               :utm_keyword, :referer, :country, :ip)
        ");

        $stmt->execute([
            ':name'         => mb_substr($name,          0, 200),
            ':email'        => mb_substr($email,         0, 255),
            ':mobile'       => mb_substr($mobile_full,   0, 30),
            ':course'       => mb_substr($course_name,   0, 200),
            ':institution'  => mb_substr($institution,   0, 200),
            ':lead_form'    => mb_substr($lead_form,     0, 200),
            ':source_page'  => mb_substr($source_page,   0, 500),
            ':utm_source'   => mb_substr($utm_source,    0, 200),
            ':utm_medium'   => mb_substr($utm_medium,    0, 200),
            ':utm_campaign' => mb_substr($utm_campaign,  0, 200),
            ':utm_content'  => mb_substr($utm_content,   0, 200),
            ':utm_keyword'  => mb_substr($utm_keyword,   0, 200),
            ':referer'      => mb_substr($referer_url,   0, 500),
            ':country'      => mb_substr($user_country,  0, 100),
            ':ip'           => mb_substr($ip_address,    0, 45),
        ]);

        // Return the exact structure the frontend JS expects
        echo json_encode([
            'status'  => 1,
            'message' => 'Success',
            'msg'     => 'Success',
            'data'    => ['Message' => ['RelatedId' => (string) $pdo->lastInsertId()]],
        ]);

    } catch (PDOException $e) {
        // DB save failed — log it but still return success so the user is not blocked
        error_log('DB error in admin-ajax.php: ' . $e->getMessage());
        $logFile = dirname(__DIR__) . '/db-error.log';
        file_put_contents($logFile, date('Y-m-d H:i:s') . ' | ' . $e->getMessage() . ' | POST: ' . json_encode($_POST) . "\n", FILE_APPEND | LOCK_EX);
        echo json_encode([
            'status'  => 1,
            'message' => 'Success',
            'msg'     => 'Success',
            'data'    => ['Message' => ['RelatedId' => '']],
        ]);
    }
}

// Add-on Certificates & Foundation Courses (The Manipal Advantage)
// Returns HTML expected by slider.js (dataType: "html").
function handle_tools_certificate(): void {
    header('Content-Type: text/html; charset=utf-8');

    $domain = trim((string) ($_POST['domain'] ?? ''));
    $goal   = trim((string) ($_POST['goal'] ?? ''));

    // Keep this list aligned with the visible default cards in the page section.
    $cards = [
        [
            'course' => 'Human Resources Analytics',
            'image'  => '/assets/static/wp-content/themes/flamingo/assets/images/coursera/management-3.png',
            'domain' => 'Management',
        ],
        [
            'course' => 'AWS Cloud Technical Essentials',
            'image'  => '/assets/static/wp-content/themes/flamingo/assets/images/coursera/it-2.png',
            'domain' => 'IT',
        ],
        [
            'course' => 'Introduction to R Programming for Data Science',
            'image'  => '/assets/static/wp-content/themes/flamingo/assets/images/coursera/ds-2.png',
            'domain' => 'Data Science',
        ],
        [
            'course' => 'Foundations of Digital Marketing and E-commerce',
            'image'  => '/assets/static/wp-content/themes/flamingo/assets/images/coursera/commrece-4.png',
            'domain' => 'Business Analytics',
        ],
    ];

    // Domain-based prioritization so selections feel responsive.
    if ($domain !== '') {
        $normalizedDomain = strtolower($domain);
        if ($normalizedDomain === 'supply chain') {
            // Closest available match in this static clone dataset.
            $domain = 'Management';
        }

        $matched = [];
        $rest    = [];
        foreach ($cards as $card) {
            if (strcasecmp((string) $card['domain'], $domain) === 0) {
                $matched[] = $card;
            } else {
                $rest[] = $card;
            }
        }
        if (!empty($matched)) {
            $cards = array_merge($matched, $rest);
        }
    }

    // Goal is currently not used to alter card content in the static clone.
    // We still read it to mirror the original request shape and future extensibility.
    if ($goal !== '') {
        // no-op
    }

    echo "<div class=\"tools-slider\">\n";
    foreach ($cards as $card) {
        $course = htmlspecialchars((string) $card['course'], ENT_QUOTES, 'UTF-8');
        $image  = htmlspecialchars((string) $card['image'], ENT_QUOTES, 'UTF-8');

        echo "  <div class=\"tools-desc\">\n";
        echo "    <div class=\"tools-slide\">\n";
        echo "      <img alt=\"slide-image\" class=\"slide-image\" data-no-lazy=\"1\" src=\"{$image}\" />\n";
        echo "      <p class=\"slide-text\">{$course}</p>\n";
        echo "    </div>\n";
        echo "  </div>\n";
    }
    echo "</div>\n";
}
