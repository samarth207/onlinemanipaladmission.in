<?php
declare(strict_types=1);

function cms_current_admin(): ?array
{
    cms_start_session();
    if (!isset($_SESSION["cms_admin"]) || !is_array($_SESSION["cms_admin"])) {
        return null;
    }
    return $_SESSION["cms_admin"];
}

function cms_require_admin(): void
{
    if (!cms_current_admin()) {
        cms_flash_set("error", "Please login to continue.");
        cms_redirect("/admin/login.php");
    }
}

function cms_try_login(string $email, string $password): bool
{
    $email = strtolower(trim($email));
    if ($email === "" || $password === "") {
        return false;
    }

    $pdo = cms_db();
    $stmt = $pdo->prepare("SELECT * FROM admins WHERE email = :email LIMIT 1");
    $stmt->execute(["email" => $email]);
    $admin = $stmt->fetch();
    if (!$admin) {
        return false;
    }

    if (!password_verify($password, (string) $admin["password_hash"])) {
        return false;
    }

    cms_start_session();
    session_regenerate_id(true);
    $_SESSION["cms_admin"] = [
        "id" => (int) $admin["id"],
        "email" => (string) $admin["email"],
        "role" => (string) $admin["role"],
    ];
    return true;
}

function cms_logout(): void
{
    cms_start_session();
    unset($_SESSION["cms_admin"]);
    session_regenerate_id(true);
}
