<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    cms_redirect("/admin/login.php");
}

cms_logout();
cms_flash_set("success", "Logged out.");
cms_redirect("/admin/login.php");
