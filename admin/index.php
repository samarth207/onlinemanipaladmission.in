<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

$blogs = cms_blog_list_admin();
$hasPublished = false;
foreach ($blogs as $blogItem) {
    if (cms_published_status($blogItem) === "published") {
        $hasPublished = true;
        break;
    }
}
$pageTitle = "Blog Dashboard";
$topbarTitle = "Blog CMS Dashboard";
require __DIR__ . "/../cms/templates/head.php";
require __DIR__ . "/../cms/templates/topbar.php";
?>
<main class="page">
  <div class="container">
    <section class="card section-block">
      <div style="display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap;">
        <div>
          <h2 style="margin:0;">Blogs</h2>
          <p class="muted" style="margin:0.35rem 0 0;">Manage blog SEO, content, publishing schedule, and visibility.</p>
        </div>
        <div class="inline-actions">
          <a class="btn" href="<?= cms_h(cms_url("/admin/blog-form.php")) ?>">Add New Blog</a>
          <?php if (!$hasPublished): ?>
            <form method="post" action="<?= cms_h(cms_url("/admin/create-sample-blog.php")) ?>" style="margin:0;">
              <button class="btn secondary" type="submit">Create Sample Published Blog</button>
            </form>
          <?php endif; ?>
        </div>
      </div>
    </section>

    <section class="card">
      <div style="overflow:auto;">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Slug</th>
              <th>Status</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <?php if (count($blogs) === 0): ?>
              <tr>
                <td colspan="5">No blogs created yet.</td>
              </tr>
            <?php endif; ?>
            <?php foreach ($blogs as $blog): ?>
              <?php $visibleStatus = cms_published_status($blog); ?>
              <tr>
                <td>
                  <strong><?= cms_h((string) $blog["title"]) ?></strong><br />
                  <span class="muted"><?= cms_h((string) $blog["meta_title"]) ?></span>
                </td>
                <td><code><?= cms_h((string) $blog["slug"]) ?></code></td>
                <td><span class="tag <?= cms_h($visibleStatus) ?>"><?= cms_h($visibleStatus) ?></span></td>
                <td><?= cms_h((string) $blog["updated_at"]) ?></td>
                <td>
                  <div class="inline-actions">
                    <a class="btn secondary" href="<?= cms_h(cms_url("/admin/blog-form.php?id=" . $blog["id"])) ?>">Edit</a>
                    <?php if ($visibleStatus === "published"): ?>
                      <a class="btn secondary" href="<?= cms_h(cms_url("/blogs/" . $blog["slug"])) ?>" target="_blank">View</a>
                    <?php else: ?>
                      <a class="btn secondary" href="<?= cms_h(cms_url("/blogs/" . $blog["slug"] . "?preview=1")) ?>" target="_blank">Preview</a>
                    <?php endif; ?>
                    <form method="post" action="<?= cms_h(cms_url("/admin/delete-blog.php")) ?>" onsubmit="return confirm('Delete this blog?');" style="margin:0;">
                      <input type="hidden" name="id" value="<?= (int) $blog["id"] ?>" />
                      <button class="btn danger" type="submit">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            <?php endforeach; ?>
          </tbody>
        </table>
      </div>
    </section>
  </div>
</main>
<?php require __DIR__ . "/../cms/templates/foot.php"; ?>
