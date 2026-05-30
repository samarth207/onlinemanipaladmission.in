<?php
declare(strict_types=1);

require_once __DIR__ . "/config.php";
require_once __DIR__ . "/lib/util.php";
require_once __DIR__ . "/lib/db.php";
require_once __DIR__ . "/lib/auth.php";
require_once __DIR__ . "/lib/blog.php";

cms_start_session();
try {
    cms_db_init();
} catch (Throwable $e) {
    $GLOBALS['cms_db_error'] = $e->getMessage();
}
