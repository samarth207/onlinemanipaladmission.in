<?php
/**
 * Testimonial form submission handler.
 * Handles multipart/form-data including optional image upload.
 * Called directly via form action="/submit-testimonial.php"
 * or via AJAX in testimonial.js (if it exists).
 */

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['status' => 0, 'message' => 'Method Not Allowed']);
    exit;
}

// Rate limiting
session_start();
$ip  = filter_var($_SERVER['REMOTE_ADDR'] ?? '0.0.0.0', FILTER_VALIDATE_IP) ?: '0.0.0.0';
$key = 'rate_t_' . md5($ip);
$now = time();
if (!isset($_SESSION[$key])) { $_SESSION[$key] = ['count' => 0, 'window' => $now]; }
if ($now - $_SESSION[$key]['window'] > 60) { $_SESSION[$key] = ['count' => 0, 'window' => $now]; }
$_SESSION[$key]['count']++;
if ($_SESSION[$key]['count'] > 5) {
    echo json_encode(['status' => 0, 'message' => 'Too many requests. Please try again later.']);
    exit;
}

require_once __DIR__ . '/db-config.php';

$user_name     = trim($_POST['user_name']     ?? '');
$mobile_number = trim($_POST['mobile_number'] ?? '');
$user_email    = trim($_POST['user_email']    ?? '');
$course_name   = trim($_POST['course_name']   ?? '');
$review        = trim($_POST['userReview']    ?? '');

// Validate required fields
if ($user_name === '' || $mobile_number === '' || $user_email === '' || $review === '') {
    echo json_encode(['status' => 0, 'message' => 'Please fill in all required fields.']);
    exit;
}

if (!filter_var($user_email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['status' => 0, 'message' => 'Invalid email address.']);
    exit;
}

// Handle optional image upload
$image_path = null;
if (!empty($_FILES['userImage']['name'])) {
    $allowed_types = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    $max_size_bytes = 200 * 1024; // 200 KB as stated in the form UI

    $file     = $_FILES['userImage'];
    $tmp_path = $file['tmp_name'];
    $size     = $file['size'];

    if ($size > $max_size_bytes) {
        echo json_encode(['status' => 0, 'message' => 'Image must be under 200 KB.']);
        exit;
    }

    // Validate MIME type from file content, not the client-supplied type
    $finfo     = new finfo(FILEINFO_MIME_TYPE);
    $mime_type = $finfo->file($tmp_path);
    if (!in_array($mime_type, $allowed_types, true)) {
        echo json_encode(['status' => 0, 'message' => 'Invalid image type. Allowed: JPG, PNG, GIF, WebP.']);
        exit;
    }

    $ext        = pathinfo($file['name'], PATHINFO_EXTENSION);
    $safe_name  = bin2hex(random_bytes(16)) . '.' . preg_replace('/[^a-z0-9]/i', '', strtolower($ext));
    $upload_dir = __DIR__ . '/cms-uploads/testimonials/';

    if (!is_dir($upload_dir)) {
        mkdir($upload_dir, 0755, true);
    }

    $dest = $upload_dir . $safe_name;
    if (!move_uploaded_file($tmp_path, $dest)) {
        echo json_encode(['status' => 0, 'message' => 'Image upload failed. Please try again.']);
        exit;
    }

    $image_path = '/cms-uploads/testimonials/' . $safe_name;
}

try {
    $pdo = get_db();

    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `testimonials` (
          `id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,
          `user_name`     VARCHAR(200) NOT NULL,
          `mobile_number` VARCHAR(30)  NOT NULL,
          `user_email`    VARCHAR(255) NOT NULL,
          `course_name`   VARCHAR(200) DEFAULT NULL,
          `review`        TEXT         NOT NULL,
          `image_path`    VARCHAR(500) DEFAULT NULL,
          `status`        ENUM('pending','approved','rejected') NOT NULL DEFAULT 'pending',
          `created_at`    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
          PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");

    $stmt = $pdo->prepare("
        INSERT INTO `testimonials` (user_name, mobile_number, user_email, course_name, review, image_path)
        VALUES (:name, :mobile, :email, :course, :review, :image)
    ");

    $stmt->execute([
        ':name'   => mb_substr($user_name,     0, 200),
        ':mobile' => mb_substr($mobile_number, 0, 30),
        ':email'  => mb_substr($user_email,    0, 255),
        ':course' => mb_substr($course_name,   0, 200),
        ':review' => $review,
        ':image'  => $image_path,
    ]);

    echo json_encode([
        'status'  => 1,
        'message' => 'Thank you for your testimonial! We will review it shortly.',
    ]);

} catch (PDOException $e) {
    error_log('DB error in submit-testimonial.php: ' . $e->getMessage());
    echo json_encode(['status' => 0, 'message' => 'Something went wrong. Please try again.']);
}
