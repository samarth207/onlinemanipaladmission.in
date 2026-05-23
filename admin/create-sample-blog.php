<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    cms_redirect("/admin/index.php");
}

try {
    $id = cms_blog_create_sample_post();
    $blog = cms_blog_find_by_id($id);
    cms_flash_set("success", "Sample published blog is ready.");
    if ($blog) {
        cms_redirect("/blogs/" . (string) $blog["slug"]);
    }
    cms_redirect("/blogs/");
} catch (Throwable $e) {
    cms_flash_set("error", "Unable to create sample blog: " . $e->getMessage());
    cms_redirect("/admin/index.php");
}
