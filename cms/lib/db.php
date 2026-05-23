<?php
declare(strict_types=1);

function cms_db(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $cfg = cms_cfg("db");
    $host = (string) ($cfg["host"] ?? "127.0.0.1");
    $port = (int) ($cfg["port"] ?? 3306);
    $name = (string) ($cfg["name"] ?? "");
    $user = (string) ($cfg["user"] ?? "");
    $pass = (string) ($cfg["pass"] ?? "");
    $charset = (string) ($cfg["charset"] ?? "utf8mb4");

    $dsn = "mysql:host={$host};port={$port};dbname={$name};charset={$charset}";

    $pdo = new PDO(
        $dsn,
        $user,
        $pass,
        [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]
    );

    return $pdo;
}

function cms_db_init(): void
{
    static $initialized = false;
    if ($initialized) {
        return;
    }
    $initialized = true;

    $schemaPath = CMS_ROOT . "/sql/schema.sql";
    $sql = file_get_contents($schemaPath);
    if ($sql === false) {
        throw new RuntimeException("Unable to read schema file.");
    }

    $statements = array_filter(array_map("trim", explode(";", $sql)));
    $pdo = cms_db();
    foreach ($statements as $statement) {
        if ($statement !== "") {
            $pdo->exec($statement);
        }
    }

    cms_seed_admin();
}

function cms_seed_admin(): void
{
    $seedEmail = strtolower((string) cms_cfg("admin_seed.email"));
    $seedPassword = (string) cms_cfg("admin_seed.password");
    if ($seedEmail === "" || $seedPassword === "") {
        return;
    }

    $pdo = cms_db();
    $check = $pdo->prepare("SELECT id FROM admins WHERE email = :email LIMIT 1");
    $check->execute(["email" => $seedEmail]);
    if ($check->fetch()) {
        return;
    }

    $hash = password_hash($seedPassword, PASSWORD_DEFAULT);
    $insert = $pdo->prepare(
        "INSERT INTO admins (email, password_hash, role, created_at) VALUES (:email, :password_hash, 'admin', :created_at)"
    );
    $insert->execute([
        "email" => $seedEmail,
        "password_hash" => $hash,
        "created_at" => cms_now_utc(),
    ]);
}
