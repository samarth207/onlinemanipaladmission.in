<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    cms_redirect("/admin/index.php");
}

$id = (int) ($_POST["id"] ?? 0);
if ($id <= 0) {
    cms_flash_set("error", "Invalid blog id.");
    cms_redirect("/admin/index.php");
}

try {
    cms_blog_delete($id);
    cms_flash_set("success", "Blog deleted.");
} catch (Throwable $e) {
    cms_flash_set("error", "Failed to delete blog.");
}

cms_redirect("/admin/index.php");
