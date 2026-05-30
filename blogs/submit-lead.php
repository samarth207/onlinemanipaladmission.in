<?php
declare(strict_types=1);
/**
 * Blog lead form submission handler.
 * Accepts POST from /blogs/view.php lead form.
 * Stores to the `leads` table using the site's db-config.php connection.
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 0, 'message' => 'Method Not Allowed']);
    exit;
}

// ── Rate limiting ────────────────────────────────────────────────────────────
session_start();
$ip  = filter_var($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', FILTER_VALIDATE_IP) ?: '0.0.0.0';
$key = 'rate_lead_' . md5($ip);
$now = time();
if (!isset($_SESSION[$key])) {
    $_SESSION[$key] = ['count' => 0, 'window' => $now];
}
if ($now - $_SESSION[$key]['window'] > 60) {
    $_SESSION[$key] = ['count' => 0, 'window' => $now];
}
$_SESSION[$key]['count']++;
if ($_SESSION[$key]['count'] > 5) {
    http_response_code(429);
    echo json_encode(['status' => 0, 'message' => 'Too many requests. Please try again in a minute.']);
    exit;
}

// ── Load helpers ─────────────────────────────────────────────────────────────
require_once __DIR__ . '/../db-config.php';
require_once __DIR__ . '/../cms/lib/courses.php';

// ── Collect & sanitise input ─────────────────────────────────────────────────
$name          = trim(strip_tags($_POST['name']          ?? ''));
$email         = trim($_POST['email']         ?? '');
$mobile_number = trim(strip_tags($_POST['mobile_number'] ?? ''));
$course_name   = trim(strip_tags($_POST['course_name']   ?? ''));
$lead_form_name = trim(strip_tags($_POST['lead_form_name'] ?? ''));
$source_page   = trim($_POST['source_page']   ?? '');

// ── Validate ─────────────────────────────────────────────────────────────────
$errors = [];

if ($name === '') {
    $errors[] = 'Name is required.';
} elseif (mb_strlen($name) > 200) {
    $errors[] = 'Name is too long.';
}

if ($email === '') {
    $errors[] = 'Email is required.';
} elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors[] = 'Please enter a valid email address.';
} elseif (mb_strlen($email) > 255) {
    $errors[] = 'Email is too long.';
}

if ($mobile_number === '') {
    $errors[] = 'Contact number is required.';
} elseif (!preg_match('/^[+\d][\d\s\-().]{5,28}$/', $mobile_number)) {
    $errors[] = 'Please enter a valid contact number.';
}

if ($course_name === '') {
    $errors[] = 'Please select a course.';
} elseif (!in_array($course_name, cms_course_list(), true)) {
    $errors[] = 'Invalid course selection.';
}

// Sanitise optional meta fields
$source_page    = filter_var($source_page, FILTER_SANITIZE_URL);
$source_page    = mb_substr($source_page, 0, 500);
$lead_form_name = mb_substr($lead_form_name, 0, 200);

if ($errors) {
    http_response_code(422);
    echo json_encode(['status' => 0, 'message' => implode(' ', $errors)]);
    exit;
}

// ── Persist ──────────────────────────────────────────────────────────────────
try {
    $pdo = get_db();
    $stmt = $pdo->prepare(
        "INSERT INTO `leads`
            (name, email, mobile_number, course_name, lead_form_name, source_page, ip_address)
         VALUES
            (:name, :email, :mobile, :course, :form_name, :source, :ip)"
    );
    $stmt->execute([
        ':name'      => $name,
        ':email'     => $email,
        ':mobile'    => $mobile_number,
        ':course'    => $course_name,
        ':form_name' => $lead_form_name,
        ':source'    => $source_page,
        ':ip'        => $ip,
    ]);

    echo json_encode(['status' => 1, 'message' => 'Thank you! We will contact you shortly.']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['status' => 0, 'message' => 'Something went wrong. Please try again.']);
}
