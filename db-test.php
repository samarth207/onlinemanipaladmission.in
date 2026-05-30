<?php
// TEMPORARY DIAGNOSTIC - DELETE THIS FILE AFTER TESTING
require_once __DIR__ . '/db-config.php';

echo "<pre>\n";
echo "PHP version: " . phpversion() . "\n";
echo "PDO drivers: " . implode(', ', PDO::getAvailableDrivers()) . "\n\n";

try {
    $pdo = get_db();
    echo "✅ DB connection OK\n\n";

    // Try creating the table
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
    echo "✅ Table `leads` exists / created\n\n";

    // Try a test insert
    $stmt = $pdo->prepare("INSERT INTO `leads` (name, email, mobile_number, course_name, institution) VALUES (?, ?, ?, ?, ?)");
    $stmt->execute(['TEST USER', 'test@test.com', '9999999999', 'MBA', 'MUJ']);
    $id = $pdo->lastInsertId();
    echo "✅ Test row inserted, ID = $id\n\n";

    // Clean up test row
    $pdo->exec("DELETE FROM `leads` WHERE email = 'test@test.com'");
    echo "✅ Test row cleaned up\n";

} catch (PDOException $e) {
    echo "❌ ERROR: " . $e->getMessage() . "\n";
    echo "Error code: " . $e->getCode() . "\n";
}

echo "</pre>\n";
echo "<p style='color:red'><strong>DELETE this file (db-test.php) after checking!</strong></p>";
