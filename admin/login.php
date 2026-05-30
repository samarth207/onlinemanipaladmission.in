<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";

if (cms_current_admin()) {
    cms_redirect("/admin/index.php");
}

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $email = cms_string($_POST["email"] ?? "");
    $password = (string) ($_POST["password"] ?? "");
    try {
        if (cms_try_login($email, $password)) {
            cms_flash_set("success", "Logged in successfully.");
            cms_redirect("/admin/index.php");
        }
        cms_flash_set("error", "Invalid email or password.");
    } catch (Throwable $e) {
        cms_flash_set("error", "DB error: " . $e->getMessage());
    }
    cms_redirect("/admin/login.php");
}

$pageTitle = "Admin Login";
$topbarTitle = "Blog Admin Login";
require __DIR__ . "/../cms/templates/head.php";
require __DIR__ . "/../cms/templates/topbar.php";
?>
<main class="login-wrap">
  <section class="card login-card">
    <?php if (!empty($GLOBALS['cms_db_error'])): ?>
      <p style="color:red;font-size:0.85rem;word-break:break-all;margin-bottom:1rem;">
        <strong>DB init error:</strong> <?= htmlspecialchars($GLOBALS['cms_db_error']) ?>
      </p>
    <?php endif; ?>
    <h2 style="margin-top:0;">Admin Login</h2>
    <p class="muted">Sign in to manage blogs, SEO fields, and publishing.</p>
    <form method="post" action="<?= cms_h(cms_url("/admin/login.php")) ?>">
      <div class="field section-block">
        <label for="email">Email</label>
        <input id="email" type="email" name="email" required />
      </div>
      <div class="field section-block">
        <label for="password">Password</label>
        <input id="password" type="password" name="password" required />
      </div>
      <button class="btn" type="submit">Login</button>
    </form>
  </section>
</main>
<?php require __DIR__ . "/../cms/templates/foot.php"; ?>
