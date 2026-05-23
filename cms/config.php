<?php
declare(strict_types=1);

define("CMS_ROOT", __DIR__);
define("CMS_PUBLIC_ROOT", dirname(__DIR__));

$CMS_CONFIG = [
    "app_name" => "Online Manipal Blog CMS",
    "base_path" => "",
    "site_url" => "https://www.onlinemanipaladmission.in",
    "db" => [
        "host" => "127.0.0.1",
        "port" => 3306,
        "name" => "onlinemanipal_blog_cms",
        "user" => "root",
        "pass" => "",
        "charset" => "utf8mb4",
    ],
    "admin_seed" => [
        "email" => "admin@onlinemanipal.local",
        "password" => "ChangeThisPassword123!",
    ],
    "category_options" => [
        "MBA",
        "MCA",
        "BBA",
        "BCA",
        "BCom",
        "MA",
        "MSc",
        "MCom",
        "Online Learning",
        "Careers",
        "Admissions",
        "Finance",
        "Technology",
        "Marketing",
    ],
    "publish_statuses" => ["draft", "pending", "published", "scheduled"],
    "upload_limits" => [
        "max_file_size_bytes" => 10 * 1024 * 1024,
    ],
];

$localConfig = CMS_ROOT . "/config.local.php";
if (file_exists($localConfig)) {
    $overrides = require $localConfig;
    if (is_array($overrides)) {
        $CMS_CONFIG = array_replace_recursive($CMS_CONFIG, $overrides);
    }
}
