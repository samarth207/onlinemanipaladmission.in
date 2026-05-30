<?php
/**
 * Database Configuration
 * Fill in your Hostinger MySQL credentials below.
 * This file must NOT be publicly accessible — it is protected by .htaccess.
 */

define('DB_HOST',     'localhost');        // Hostinger MySQL host (usually localhost)
define('DB_NAME',     'u261758575_onlinemanipal');     // e.g. u123456789_admissions
define('DB_USER',     'u261758575_onlinemanipal');     // e.g. u123456789_admin
define('DB_PASS',     's8jlXp3*Le'); // Your MySQL password
define('DB_CHARSET',  'utf8mb4');

/**
 * Returns a PDO connection.
 * Throws PDOException on failure (caught by callers).
 */
function get_db(): PDO {
    static $pdo = null;
    if ($pdo !== null) return $pdo;

    $dsn = 'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=' . DB_CHARSET;
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $options);
    return $pdo;
}
