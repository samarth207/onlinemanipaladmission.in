<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";

function cms_blog_detail_date(?string $datetime): string
{
    if (!$datetime) {
        return "";
    }
    $ts = strtotime($datetime);
    if ($ts === false) {
        return "";
    }
    return gmdate("d M Y", $ts);
}

function cms_blog_detail_read_minutes(string $html): int
{
    $words = str_word_count(cms_strip_html($html));
    if ($words <= 0) {
        return 5;
    }
    return max(1, (int) ceil($words / 220));
}

function cms_blog_detail_first_category(array $blog): string
{
    $cats = $blog["categories"] ?? [];
    if (!is_array($cats) || count($cats) === 0) {
        return "General";
    }
    $first = trim((string) ($cats[0] ?? ""));
    return $first !== "" ? $first : "General";
}

function cms_blog_detail_cover(array $blog): string
{
    $url = trim((string) ($blog["feature_image"]["url"] ?? ""));
    if ($url !== "") {
        return $url;
    }
    return cms_url("/assets/static/wp-content/uploads/2023/03/blogpage-banner.jpg");
}

function cms_blog_detail_author_image(array $blog): string
{
    $url = trim((string) ($blog["author"]["image_url"] ?? ""));
    if ($url !== "") {
        return $url;
    }
    return cms_url("/assets/static/wp-content/themes/flamingo/assets/images/icons/web-user.png");
}

$slug = cms_slugify(cms_string($_GET["slug"] ?? ""));
try {
    $blog = cms_blog_find_by_slug($slug);
} catch (Throwable $e) {
    $blog = null;
}
$admin = cms_current_admin();
$isPreview = isset($_GET["preview"]) && (string) $_GET["preview"] === "1";

$isPublicVisible = false;
if ($blog) {
    $visibleStatus = cms_published_status($blog);
    $isPublicVisible = $visibleStatus === "published";
}

if (!$blog || (!$isPublicVisible && !($admin && $isPreview))) {
    http_response_code(404);
    $styleCss = cms_url("/assets/static/wp-content/themes/flamingo/assets/css/style.css");
    $publicCss = cms_url("/cms/assets/public-blog.css");
    ?>
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>Blog Not Found</title>
        <link rel="stylesheet" href="<?= cms_h($styleCss) ?>" />
        <link rel="stylesheet" href="<?= cms_h($publicCss) ?>" />
      </head>
      <body class="wp-theme-flamingo om-blog-page">
        <main class="section-mt section-mb">
          <div class="container">
            <div class="om-no-blog-card">
              <h2>Blog Not Found</h2>
              <p>The blog you requested is not available or not yet published.</p>
              <p style="margin-top:10px;">
                <a href="<?= cms_h(cms_url("/blogs/")) ?>">Back to blogs</a>
                <?php if ($admin): ?>
                  | <a href="<?= cms_h(cms_url("/admin/index.php")) ?>">Open dashboard</a>
                <?php endif; ?>
              </p>
            </div>
          </div>
        </main>
      </body>
    </html>
    <?php
    exit;
}

$pageTitle = (string) ($blog["meta_title"] ?: $blog["title"]);
$metaDescription = (string) $blog["meta_description"];
$canonicalUrl = rtrim((string) cms_cfg("site_url"), "/") . "/blogs/" . $blog["slug"];
$faqItems = is_array($blog["faq_items"] ?? null) ? $blog["faq_items"] : [];
$tocItems = is_array($blog["toc"] ?? null) ? $blog["toc"] : [];

$faqSchema = "";
if (count($faqItems) > 0) {
    $schema = [
        "@context" => "https://schema.org",
        "@type" => "FAQPage",
        "mainEntity" => [],
    ];
    foreach ($faqItems as $faq) {
        if (!is_array($faq)) {
            continue;
        }
        $q = cms_string($faq["question"] ?? "");
        $a = cms_string($faq["answer"] ?? "");
        if ($q === "" || $a === "") {
            continue;
        }
        $schema["mainEntity"][] = [
            "@type" => "Question",
            "name" => $q,
            "acceptedAnswer" => [
                "@type" => "Answer",
                "text" => $a,
            ],
        ];
    }
    if (count($schema["mainEntity"]) > 0) {
        $faqSchema = json_encode($schema, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT) ?: "";
    }
}

$styleCss = cms_url("/assets/static/wp-content/themes/flamingo/assets/css/style.css");
$detailCss = cms_url("/assets/static/wp-content/themes/flamingo/assets/css/blog-detail.css");
$publicCss = cms_url("/cms/assets/public-blog.css");
$logoUrl = cms_url("/assets/static/wp-content/themes/flamingo/assets/images/OM_Logo.svg");
$breadcrumbArrow = cms_url("/assets/static/wp-content/themes/flamingo/assets/images/icons/breadcrumb-arrow.svg");
$dateIcon = cms_url("/assets/static/wp-content/themes/flamingo/assets/images/icons/calendar.svg");
$timeIcon = cms_url("/assets/static/wp-content/themes/flamingo/assets/images/icons/cal.svg");
$star2 = cms_url("/assets/static/wp-content/themes/flamingo/assets/images/icons/star-orange-2.svg");
$publishedDate = cms_blog_detail_date((string) ($blog["published_at"] ?: $blog["updated_at"]));
$updatedDate = cms_blog_detail_date((string) ($blog["last_updated_at"] ?: $blog["updated_at"]));
$readMinutes = cms_blog_detail_read_minutes((string) ($blog["content_html"] ?? ""));
$category = cms_blog_detail_first_category($blog);
$cover = cms_blog_detail_cover($blog);
$authorImage = cms_blog_detail_author_image($blog);
$authorName = trim((string) ($blog["author"]["name"] ?? ""));
if ($authorName === "") {
    $authorName = "Editorial Team";
}

$relatedBlogs = [];
foreach (cms_blog_list_published() as $publishedBlog) {
    if ((int) $publishedBlog["id"] === (int) $blog["id"]) {
        continue;
    }
    $relatedBlogs[] = $publishedBlog;
    if (count($relatedBlogs) >= 3) {
        break;
    }
}
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?= cms_h($pageTitle) ?></title>
    <meta name="description" content="<?= cms_h($metaDescription) ?>" />
    <link rel="canonical" href="<?= cms_h($canonicalUrl) ?>" />
    <link rel="stylesheet" href="<?= cms_h($styleCss) ?>" />
    <link rel="stylesheet" href="<?= cms_h($detailCss) ?>" />
    <link rel="stylesheet" href="<?= cms_h($publicCss) ?>" />
  </head>
  <body class="wp-theme-flamingo om-blog-page blog-details">
    <header class="om-blog-header">
      <div class="container om-blog-header-inner">
        <a href="<?= cms_h(cms_url("/")) ?>" class="om-logo" aria-label="Online Manipal Home">
          <img src="<?= cms_h($logoUrl) ?>" alt="Online Manipal" />
        </a>
        <nav class="om-blog-header-nav">
          <a href="<?= cms_h(cms_url("/")) ?>">Home</a>
          <a href="<?= cms_h(cms_url("/blogs/")) ?>" class="active">Blogs</a>
          <?php if ($admin): ?>
            <a href="<?= cms_h(cms_url("/admin/index.php")) ?>">Dashboard</a>
          <?php endif; ?>
        </nav>
      </div>
    </header>

    <main>
      <section class="blog-detail-banner pageTopSpace">
        <div class="container">
          <div class="breadcrumb">
            <a href="<?= cms_h(cms_url("/")) ?>" class="bcrumb-title">Home</a>
            <span class="separator"><img src="<?= cms_h($breadcrumbArrow) ?>" alt=">" /></span>
            <a href="<?= cms_h(cms_url("/blogs/")) ?>" class="bcrumb-title">Blogs</a>
            <span class="separator"><img src="<?= cms_h($breadcrumbArrow) ?>" alt=">" /></span>
            <span class="active"><?= cms_h((string) $blog["title"]) ?></span>
          </div>

          <div class="main-wrapper blogd-banner-wrapper section-mt">
            <img src="<?= cms_h($star2) ?>" alt="" class="star2" />
            <div class="blog-banner-details">
              <div class="left">
                <div class="blog-container">
                  <h1 class="section-title blog-title"><?= cms_h((string) $blog["title"]) ?></h1>
                  <p class="brief-info"><?= cms_h((string) $blog["excerpt"]) ?></p>

                  <div class="blog-duration">
                    <div class="blog-date"><img src="<?= cms_h($dateIcon) ?>" alt="" /><span><?= cms_h($publishedDate) ?></span></div>
                    <span class="dot-blog"></span>
                    <div class="blog-time"><img src="<?= cms_h($timeIcon) ?>" alt="" /><span><?= (int) $readMinutes ?> mins</span></div>
                    <span class="dot-blog"></span>
                    <div class="blog-time"><span>Updated <?= cms_h($updatedDate) ?></span></div>
                  </div>

                  <div class="author-name">
                    <img src="<?= cms_h($authorImage) ?>" alt="<?= cms_h($authorName) ?>" width="34" height="34" style="border-radius:50%;" />
                    <a href="<?= cms_h((string) ($blog["author"]["page"] ?? "#")) ?>"<?= !empty($blog["author"]["page"]) ? ' target="_blank" rel="noopener"' : "" ?>><?= cms_h($authorName) ?></a>
                    <?php if ($admin && $isPreview && !$isPublicVisible): ?>
                      <span class="dot"></span><span>Preview Mode</span>
                    <?php endif; ?>
                  </div>

                  <div class="card" style="background-image: linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.45)), url('<?= cms_h($cover) ?>');">
                    <div class="category-wrapper">
                      <span class="blog-category"><?= cms_h($category) ?></span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="right">
                <div class="programLeadForm formBlock">
                  <div class="title-section">
                    <h3 class="section-title"><?= cms_h((string) ($blog["lead_form"]["headline"] ?? "Talk to our counselors")) ?></h3>
                  </div>
                  <form method="post" action="#" onsubmit="return false;">
                    <div class="form-group">
                      <label>Name</label>
                      <input type="text" name="name" placeholder="Enter your name" />
                    </div>
                    <div class="form-group">
                      <label>Phone Number</label>
                      <input type="tel" name="phone" placeholder="Enter phone number" />
                    </div>
                    <div class="form-group">
                      <label>Course</label>
                      <input type="text" name="course" placeholder="Enter interested course" />
                    </div>
                    <button type="submit" class="lead-submit"><?= cms_h((string) ($blog["lead_form"]["button_text"] ?? "Apply Now")) ?></button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="content-area section-mt section-mb">
        <div class="container">
          <div class="main-wrapper">
            <div class="left">
              <article class="blogContent">
                <?= (string) $blog["content_html"] ?>
              </article>

              <?php if (is_array($blog["image_blocks"] ?? null) && count($blog["image_blocks"]) > 0): ?>
                <div class="blogContent">
                  <?php foreach ($blog["image_blocks"] as $block): ?>
                    <?php if (!is_array($block) || empty($block["url"]) || empty($block["alt"])) { continue; } ?>
                    <figure>
                      <img src="<?= cms_h((string) $block["url"]) ?>" alt="<?= cms_h((string) $block["alt"]) ?>"<?= !empty($block["title"]) ? ' title="' . cms_h((string) $block["title"]) . '"' : "" ?> />
                      <?php if (!empty($block["caption"])): ?>
                        <figcaption><?= cms_h((string) $block["caption"]) ?></figcaption>
                      <?php endif; ?>
                    </figure>
                  <?php endforeach; ?>
                </div>
              <?php endif; ?>

              <?php if (count($faqItems) > 0): ?>
                <div class="blogContent">
                  <h2>Frequently Asked Questions</h2>
                  <?php foreach ($faqItems as $faq): ?>
                    <?php if (!is_array($faq)) { continue; } ?>
                    <?php $q = cms_string($faq["question"] ?? ""); $a = cms_string($faq["answer"] ?? ""); ?>
                    <?php if ($q === "" || $a === "") { continue; } ?>
                    <details style="margin-bottom:12px; border:1px solid rgba(21,20,25,.15); border-radius:12px; padding:12px 14px; background:#f7f6f6;">
                      <summary><strong><?= cms_h($q) ?></strong></summary>
                      <p style="margin-top:10px; margin-bottom:0;"><?= cms_h($a) ?></p>
                    </details>
                  <?php endforeach; ?>
                </div>
              <?php endif; ?>

              <div class="tags section-mt">
                <ul>
                  <?php foreach ((is_array($blog["tags"]) ? $blog["tags"] : []) as $tag): ?>
                    <?php $tagName = trim((string) $tag); if ($tagName === "") { continue; } ?>
                    <li class="tagName"><?= cms_h($tagName) ?></li>
                  <?php endforeach; ?>
                </ul>
                <p style="margin-top:12px;">
                  <strong>Categories:</strong> <?= cms_h(implode(", ", is_array($blog["categories"]) ? $blog["categories"] : [])) ?: "-" ?><br />
                  <strong>Focus Keyword:</strong> <?= cms_h((string) $blog["focus_keyword"]) ?><br />
                  <strong>Primary Keyword:</strong> <?= cms_h((string) $blog["primary_keyword"]) ?>
                </p>
              </div>
            </div>

            <aside class="right">
              <div class="sticky-container">
                <?php if (count($tocItems) > 0): ?>
                  <div id="ez-toc-container">
                    <div class="ez-toc-title-container">
                      <p class="ez-toc-title">Table Of Contents</p>
                    </div>
                    <nav>
                      <ul class="ez-toc-list">
                        <?php foreach ($tocItems as $toc): ?>
                          <?php if (!is_array($toc)) { continue; } ?>
                          <?php $id = cms_string($toc["id"] ?? ""); $text = cms_string($toc["text"] ?? ""); if ($id === "" || $text === "") { continue; } ?>
                          <li>
                            <a href="#<?= cms_h($id) ?>"><?= cms_h($text) ?></a>
                          </li>
                        <?php endforeach; ?>
                      </ul>
                    </nav>
                  </div>
                <?php endif; ?>

                <?php if (count($relatedBlogs) > 0): ?>
                  <div class="suggested_article">
                    <p class="suggested-title">Related Articles</p>
                    <?php foreach ($relatedBlogs as $related): ?>
                      <?php
                      $relatedTitle = cms_string($related["title"] ?? "");
                      $relatedDate = cms_blog_detail_date((string) ($related["published_at"] ?: $related["updated_at"]));
                      $relatedCover = cms_blog_detail_cover($related);
                      ?>
                      <div class="article">
                        <div class="details">
                          <a class="title" href="<?= cms_h(cms_url("/blogs/" . (string) $related["slug"])) ?>">
                            <div class="aticle-img-related">
                              <img class="post-thumb" src="<?= cms_h($relatedCover) ?>" alt="<?= cms_h((string) ($related["feature_image"]["alt"] ?? $relatedTitle)) ?>" />
                            </div>
                            <div class="blog-info">
                              <span class="post-title"><?= cms_h($relatedTitle) ?></span>
                              <span class="postDate"><?= cms_h($relatedDate) ?></span>
                            </div>
                          </a>
                        </div>
                      </div>
                    <?php endforeach; ?>
                  </div>
                <?php endif; ?>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>

    <?php if ($faqSchema !== ""): ?>
      <script type="application/ld+json"><?= $faqSchema ?></script>
    <?php endif; ?>
  </body>
</html>
