<?php
$topbarTitle = $topbarTitle ?? "Online Manipal Blog CMS";
$admin = cms_current_admin();
?>
<header class="topbar">
  <div class="container topbar-inner">
    <h1><?= cms_h($topbarTitle) ?></h1>
    <nav class="topbar-nav">
      <?php if ($admin): ?>
        <a href="<?= cms_h(cms_url("/admin/index.php")) ?>" style="color:#dbeafe;">Dashboard</a>
        <a href="<?= cms_h(cms_url("/admin/blog-form.php")) ?>" style="color:#dbeafe;">Add Blog</a>
        <a href="<?= cms_h(cms_url("/admin/leads.php")) ?>" style="color:#dbeafe;">Leads</a>
        <a href="<?= cms_h(cms_url("/blogs/")) ?>" style="color:#dbeafe;">View Blogs</a>
        <form method="post" action="<?= cms_h(cms_url("/admin/logout.php")) ?>" style="margin:0;">
          <button class="btn ghost" type="submit">Logout</button>
        </form>
      <?php else: ?>
        <a href="<?= cms_h(cms_url("/blogs/")) ?>" style="color:#dbeafe;">Blogs</a>
        <a href="<?= cms_h(cms_url("/")) ?>" style="color:#dbeafe;">Website</a>
        <a href="<?= cms_h(cms_url("/admin/login.php")) ?>" style="color:#dbeafe;">Admin Login</a>
      <?php endif; ?>
    </nav>
  </div>
</header>

<?php $flash = cms_flash_get(); ?>
<?php if ($flash && isset($flash["message"])): ?>
  <div class="flash <?= cms_h((string) ($flash["type"] ?? "info")) ?>">
    <?= cms_h((string) $flash["message"]) ?>
  </div>
<?php endif; ?>
