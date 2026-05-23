<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

header("Content-Type: application/json; charset=utf-8");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit;
}

if (!isset($_FILES["file"]) || !is_array($_FILES["file"])) {
    http_response_code(422);
    echo json_encode(["error" => "Missing file"]);
    exit;
}

try {
    $url = cms_blog_upload_file($_FILES["file"], "content");
    echo json_encode(["location" => $url]);
} catch (Throwable $e) {
    http_response_code(422);
    echo json_encode(["error" => $e->getMessage()]);
}
