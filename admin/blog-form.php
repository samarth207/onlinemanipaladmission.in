<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

$mode = "create";
$existingBlog = null;
$id = (int) ($_GET["id"] ?? 0);

if ($id > 0) {
    $existingBlog = cms_blog_find_by_id($id);
    if (!$existingBlog) {
        cms_flash_set("error", "Blog not found.");
        cms_redirect("/admin/index.php");
    }
    $mode = "edit";
}

$form = $existingBlog ? cms_blog_entity_to_form($existingBlog) : cms_blog_defaults();
$errors = [];

if (isset($_SESSION["cms_blog_form_state"]) && is_array($_SESSION["cms_blog_form_state"])) {
    $state = $_SESSION["cms_blog_form_state"];
    unset($_SESSION["cms_blog_form_state"]);

    $stateForm = $state["form"] ?? null;
    if (is_array($stateForm)) {
        $stateId = (int) ($stateForm["id"] ?? 0);
        if (($id > 0 && $stateId === $id) || ($id === 0 && $stateId === 0)) {
            $form = array_replace_recursive($form, $stateForm);
            $errors = is_array($state["errors"] ?? null) ? $state["errors"] : [];
        }
    }
}

$pageTitle = $mode === "create" ? "Create Blog" : "Edit Blog";
$topbarTitle = $mode === "create" ? "Create Blog" : "Edit Blog";
$categoryOptions = cms_cfg("category_options");
$statusOptions = cms_cfg("publish_statuses");
$existingBlocksJson = json_encode($form["image_blocks"] ?? [], JSON_UNESCAPED_UNICODE);
if ($existingBlocksJson === false) {
    $existingBlocksJson = "[]";
}

require __DIR__ . "/../cms/templates/head.php";
require __DIR__ . "/../cms/templates/topbar.php";
?>
<main class="page">
  <div class="container">
    <section class="card section-block">
      <h2 style="margin-top:0;"><?= $mode === "create" ? "Create New Blog" : "Edit Blog" ?></h2>
      <p class="muted" style="margin:0;">
        SEO-first blog editor with metadata, scheduling, FAQ, lead form block, table support, and TOC auto-generation.
      </p>
    </section>

    <?php if (count($errors) > 0): ?>
      <div class="error-list">
        <strong>Please fix the following:</strong>
        <ul>
          <?php foreach ($errors as $err): ?>
            <li><?= cms_h((string) $err) ?></li>
          <?php endforeach; ?>
        </ul>
      </div>
    <?php endif; ?>

    <form class="card" method="post" action="<?= cms_h(cms_url("/admin/save-blog.php")) ?>" enctype="multipart/form-data" data-blog-form>
      <input type="hidden" name="id" value="<?= cms_h((string) ($form["id"] ?? "")) ?>" />
      <input type="hidden" name="existingFeatureImageUrl" value="<?= cms_h((string) ($form["feature_image_url"] ?? "")) ?>" />
      <input type="hidden" name="existingAuthorImageUrl" value="<?= cms_h((string) ($form["author_image_url"] ?? "")) ?>" />
      <input type="hidden" id="existingImageBlocks" name="existingImageBlocks" value="<?= cms_h($existingBlocksJson) ?>" />
      <input type="hidden" name="slugTouched" value="<?= $mode === "edit" ? "1" : "0" ?>" data-slug-touched />

      <section class="section-block">
        <h3 class="section-title">1) Meta Data Fields</h3>
        <div class="form-grid">
          <div class="field">
            <label for="metaTitle">Meta Title (max 60)</label>
            <input id="metaTitle" name="metaTitle" maxlength="60" value="<?= cms_h((string) $form["meta_title"]) ?>" required />
            <small data-counter="metaTitle" data-limit="60"><span data-current>0</span>/60</small>
          </div>
          <div class="field">
            <label for="focusKeyword">Focus Keyword</label>
            <input id="focusKeyword" name="focusKeyword" value="<?= cms_h((string) $form["focus_keyword"]) ?>" required />
          </div>
          <div class="field" style="grid-column:1/-1;">
            <label for="metaDescription">Meta Description (200-250)</label>
            <textarea id="metaDescription" name="metaDescription" maxlength="250" required><?= cms_h((string) $form["meta_description"]) ?></textarea>
            <small data-counter="metaDescription" data-limit="250"><span data-current>0</span>/250</small>
          </div>
          <div class="field">
            <label for="urlSlug">URL Slug (lowercase-with-hyphen)</label>
            <input id="urlSlug" name="urlSlug" value="<?= cms_h((string) $form["url_slug"]) ?>" required data-slug-input />
          </div>
        </div>
      </section>

      <section class="section-block">
        <h3 class="section-title">2) Feature Image</h3>
        <div class="form-grid">
          <div class="field">
            <label for="featureImageFile">Feature Image (JPG/WebP, 1200x628)</label>
            <input id="featureImageFile" type="file" name="featureImageFile" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.avif" <?= $mode === "create" ? "required" : "" ?> />
          </div>
          <div class="field">
            <label for="featureImageAlt">Image ALT Text</label>
            <input id="featureImageAlt" name="featureImageAlt" value="<?= cms_h((string) $form["feature_image_alt"]) ?>" required />
          </div>
          <div class="field">
            <label for="featureImageTitle">Image Title (Optional)</label>
            <input id="featureImageTitle" name="featureImageTitle" value="<?= cms_h((string) $form["feature_image_title"]) ?>" />
          </div>
        </div>
        <?php if (!empty($form["feature_image_url"])): ?>
          <div class="cover-preview" style="margin-top:0.8rem;">
            <img src="<?= cms_h((string) $form["feature_image_url"]) ?>" alt="<?= cms_h((string) ($form["feature_image_alt"] ?: "Feature image")) ?>" />
            <div>
              <strong>Current feature image</strong><br />
              <span class="muted"><?= cms_h((string) $form["feature_image_url"]) ?></span>
            </div>
          </div>
        <?php endif; ?>
      </section>

      <section class="section-block">
        <h3 class="section-title">3) Blog Content Structure</h3>
        <div class="form-grid">
          <div class="field">
            <label for="title">Blog Title (H1, max 70)</label>
            <input id="title" name="title" maxlength="70" value="<?= cms_h((string) $form["title"]) ?>" required data-title-input />
            <small data-counter="title" data-limit="70"><span data-current>0</span>/70</small>
          </div>
          <div class="field">
            <label for="excerpt">Short Description / Excerpt (max 250)</label>
            <textarea id="excerpt" name="excerpt" maxlength="250" required><?= cms_h((string) $form["excerpt"]) ?></textarea>
            <small data-counter="excerpt" data-limit="250"><span data-current>0</span>/250</small>
          </div>
        </div>
        <div class="field section-block">
          <label for="contentHtml">Blog Content Editor</label>
          <small>
            Supports: H2, H3, H4, paragraph, bold, italic, lists, internal/external links, image insert (ALT&nbsp;mandatory), and editable tables with <strong>cell/row/column background colour</strong> — click inside any table cell then use the <em>Cell Properties</em> button (🎨) in the toolbar or right-click → Cell Properties → Advanced → Background Color. To colour an entire row: select all cells in the row, then apply. TOC is auto-generated from H2–H4 headings.
          </small>
          <div class="editor-wrap">
            <textarea id="contentHtml" name="contentHtml"><?= cms_h((string) $form["content_html"]) ?></textarea>
          </div>
        </div>
      </section>

      <section class="section-block">
        <h3 class="section-title">4) Image Block (Inside Content)</h3>
        <p class="muted">Upload optional supporting image blocks with mandatory ALT text.</p>

        <div data-image-wrap>
          <?php foreach (($form["image_blocks"] ?? []) as $block): ?>
            <div class="image-row">
              <div class="inline-actions" style="justify-content:space-between;">
                <strong>Existing Image</strong>
                <button type="button" class="btn secondary" data-remove-existing-image data-key="<?= cms_h((string) ($block["url"] ?? "")) ?>">Remove</button>
              </div>
              <div class="cover-preview" style="margin-top:0.6rem;">
                <img src="<?= cms_h((string) ($block["url"] ?? "")) ?>" alt="<?= cms_h((string) ($block["alt"] ?? "")) ?>" />
                <div>
                  <div><strong>Alt:</strong> <?= cms_h((string) ($block["alt"] ?? "")) ?></div>
                  <?php if (!empty($block["title"])): ?><div><strong>Title:</strong> <?= cms_h((string) $block["title"]) ?></div><?php endif; ?>
                  <?php if (!empty($block["caption"])): ?><div><strong>Caption:</strong> <?= cms_h((string) $block["caption"]) ?></div><?php endif; ?>
                </div>
              </div>
            </div>
          <?php endforeach; ?>
          <div style="margin-top:0.5rem;"></div>
        </div>
        <button class="btn secondary" type="button" data-add-image-block>Add Image Block</button>

        <template data-image-template>
          <div class="image-row">
            <div class="form-grid three">
              <div class="field">
                <label>Image Upload</label>
                <input type="file" name="contentImageFiles[]" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.avif" />
              </div>
              <div class="field">
                <label>Alt Text (Required)</label>
                <input name="contentImageAlt[]" />
              </div>
              <div class="field">
                <label>Image Title (Optional)</label>
                <input name="contentImageTitle[]" />
              </div>
              <div class="field" style="grid-column:1/-1;">
                <label>Caption (Optional)</label>
                <input name="contentImageCaption[]" />
              </div>
            </div>
            <button class="btn secondary" type="button" data-remove-image>Remove Block</button>
          </div>
        </template>
      </section>

      <section class="section-block">
        <h3 class="section-title">FAQ Section Block</h3>
        <div data-faq-wrap>
          <?php foreach (($form["faq_items"] ?? [["question" => "", "answer" => ""]]) as $faq): ?>
            <div class="faq-row">
              <div class="field section-block">
                <label>Question</label>
                <input name="faqQuestion[]" value="<?= cms_h((string) ($faq["question"] ?? "")) ?>" />
              </div>
              <div class="field">
                <label>Answer</label>
                <textarea name="faqAnswer[]"><?= cms_h((string) ($faq["answer"] ?? "")) ?></textarea>
              </div>
              <button class="btn secondary" type="button" data-remove-faq>Remove FAQ</button>
            </div>
          <?php endforeach; ?>
        </div>
        <button class="btn secondary" type="button" data-add-faq>Add FAQ</button>
        <template data-faq-template>
          <div class="faq-row">
            <div class="field section-block">
              <label>Question</label>
              <input name="faqQuestion[]" />
            </div>
            <div class="field">
              <label>Answer</label>
              <textarea name="faqAnswer[]"></textarea>
            </div>
            <button class="btn secondary" type="button" data-remove-faq>Remove FAQ</button>
          </div>
        </template>
      </section>

      <section class="section-block">
        <h3 class="section-title">Lead Form Block (Fixed Name/Number/Course fields)</h3>
        <div class="form-grid">
          <div class="field">
            <label for="leadHeadline">Form Headline</label>
            <input id="leadHeadline" name="leadHeadline" value="<?= cms_h((string) $form["lead_headline"]) ?>" />
          </div>
          <div class="field">
            <label for="leadButtonText">Button Text</label>
            <input id="leadButtonText" name="leadButtonText" value="<?= cms_h((string) $form["lead_button_text"]) ?>" />
          </div>
        </div>
      </section>

      <section class="section-block">
        <h3 class="section-title">5) Author Section</h3>
        <div class="form-grid">
          <div class="field">
            <label for="authorName">Author Name</label>
            <input id="authorName" name="authorName" value="<?= cms_h((string) $form["author_name"]) ?>" required />
          </div>
          <div class="field">
            <label for="authorPage">Author Page (Optional)</label>
            <input id="authorPage" name="authorPage" value="<?= cms_h((string) $form["author_page"]) ?>" />
          </div>
          <div class="field" style="grid-column:1/-1;">
            <label for="authorBio">Author Bio (Optional)</label>
            <textarea id="authorBio" name="authorBio"><?= cms_h((string) $form["author_bio"]) ?></textarea>
          </div>
          <div class="field">
            <label for="authorImageFile">Author Image (Optional)</label>
            <input id="authorImageFile" type="file" name="authorImageFile" accept=".jpg,.jpeg,.png,.webp,.gif,.svg,.avif" />
          </div>
        </div>
        <?php if (!empty($form["author_image_url"])): ?>
          <div class="cover-preview" style="margin-top:0.8rem;">
            <img src="<?= cms_h((string) $form["author_image_url"]) ?>" alt="Author image" />
            <div><span class="muted"><?= cms_h((string) $form["author_image_url"]) ?></span></div>
          </div>
        <?php endif; ?>
      </section>

      <section class="section-block">
        <h3 class="section-title">6) Category & Tags</h3>
        <div class="form-grid">
          <div class="field">
            <label for="categories">Category (Multi Select)</label>
            <select id="categories" name="categories[]" multiple size="8" required>
              <?php foreach (($categoryOptions ?? []) as $cat): ?>
                <?php $isSelected = in_array($cat, $form["categories"] ?? [], true); ?>
                <option value="<?= cms_h((string) $cat) ?>" <?= $isSelected ? "selected" : "" ?>><?= cms_h((string) $cat) ?></option>
              <?php endforeach; ?>
            </select>
            <small>Hold Ctrl/Cmd to select multiple categories.</small>
          </div>
          <div class="field">
            <label for="tags">Tags (comma-separated)</label>
            <input id="tags" name="tags" value="<?= cms_h((string) $form["tags"]) ?>" />
          </div>
        </div>
      </section>

      <section class="section-block">
        <h3 class="section-title">7) SEO Analytics</h3>
        <div class="form-grid">
          <div class="field">
            <label for="primaryKeyword">Primary Keyword <span style="color:#b42318">*</span></label>
            <input id="primaryKeyword" name="primaryKeyword" value="<?= cms_h((string) $form["primary_keyword"]) ?>" required placeholder="e.g. online mba degree india" />
            <small>Used for SEO focus analysis. Make sure this keyword appears in the title, slug, meta description, and content.</small>
          </div>
          <div class="field">
            <label>Focus Keyword density hint</label>
            <div id="kwDensityHint" class="serp-hint">Fill in Primary Keyword and content to see density hint.</div>
          </div>
        </div>

        <!-- Live Google SERP Preview -->
        <div class="serp-preview-wrap" style="margin-top:1.2rem;">
          <label style="font-size:0.84rem;font-weight:700;color:#334155;display:block;margin-bottom:0.5rem;">Live Google Search Preview</label>
          <div class="serp-card">
            <div class="serp-url" id="serpUrl"></div>
            <div class="serp-title" id="serpTitle">Blog Title will appear here</div>
            <div class="serp-desc" id="serpDesc">Meta description will appear here…</div>
            <div class="serp-chars">
              Title: <span id="serpTitleLen">0</span>/60 chars &nbsp;|&nbsp;
              Description: <span id="serpDescLen">0</span>/250 chars
            </div>
          </div>
        </div>
      </section>

      <section class="section-block">
        <h3 class="section-title">8) Blog Scheduling</h3>
        <div class="form-grid three">
          <div class="field">
            <label for="status">Publish Status</label>
            <select id="status" name="status" required>
              <?php foreach (($statusOptions ?? []) as $stat): ?>
                <option value="<?= cms_h((string) $stat) ?>" <?= ((string) $form["status"] === (string) $stat) ? "selected" : "" ?>>
                  <?= cms_h((string) $stat) ?>
                </option>
              <?php endforeach; ?>
            </select>
          </div>
          <div class="field">
            <label for="publishDate">Publish Date</label>
            <input id="publishDate" type="date" name="publishDate" value="<?= cms_h((string) $form["publish_date"]) ?>" />
          </div>
          <div class="field">
            <label for="publishTime">Publish Time</label>
            <input id="publishTime" type="time" name="publishTime" value="<?= cms_h((string) $form["publish_time"]) ?>" />
          </div>
        </div>
        <?php if (!empty($form["last_updated_at"])): ?>
          <div class="field" style="margin-top:0.8rem;">
            <label>Last Updated Date (Auto)</label>
            <input value="<?= cms_h((string) $form["last_updated_at"]) ?>" readonly />
          </div>
        <?php endif; ?>
      </section>

      <div class="inline-actions">
        <button class="btn" type="submit"><?= $mode === "create" ? "Create Blog" : "Update Blog" ?></button>
        <a class="btn secondary" href="<?= cms_h(cms_url("/admin/index.php")) ?>">Back to Dashboard</a>
      </div>
    </form>
  </div>
</main>

<script src="<?= cms_h(cms_url("/cms/assets/tinymce/tinymce.min.js")) ?>"></script>
<script>window.CMS_UPLOAD_URL = "<?= cms_h(cms_url("/admin/upload-image.php")) ?>";</script>
<script src="<?= cms_h(cms_url("/cms/assets/admin.js")) ?>"></script>
<?php require __DIR__ . "/../cms/templates/foot.php"; ?>
