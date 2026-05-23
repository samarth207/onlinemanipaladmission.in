<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";

function cms_blog_list_format_date(?string $datetime): string
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

function cms_blog_list_read_minutes(string $html): int
{
    $plain = cms_strip_html($html);
    $words = str_word_count($plain);
    if ($words <= 0) {
        return 5;
    }
    return max(1, (int) ceil($words / 220));
}

function cms_blog_list_first_category(array $blog): string
{
    $cats = $blog["categories"] ?? [];
    if (!is_array($cats) || count($cats) === 0) {
        return "General";
    }
    $first = trim((string) ($cats[0] ?? ""));
    return $first !== "" ? $first : "General";
}

function cms_blog_list_all_categories(array $blogs): array
{
    $unique = [];
    foreach ($blogs as $blog) {
        $cats = $blog["categories"] ?? [];
        if (!is_array($cats)) {
            continue;
        }
        foreach ($cats as $cat) {
            $name = trim((string) $cat);
            if ($name === "") {
                continue;
            }
            $unique[$name] = true;
        }
    }
    $out = array_keys($unique);
    natcasesort($out);
    return array_values($out);
}

function cms_blog_list_cover_image(array $blog): string
{
    $cover = trim((string) ($blog["feature_image"]["url"] ?? ""));
    if ($cover !== "") {
        return $cover;
    }
    return cms_url("/assets/www.onlinemanipal.com/wp-content/uploads/2023/03/blogpage-banner.jpg");
}

function cms_blog_list_author_image(array $blog): string
{
    $img = trim((string) ($blog["author"]["image_url"] ?? ""));
    if ($img !== "") {
        return $img;
    }
    return cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/web-user.png");
}

$blogs = cms_blog_list_published();
$featuredBlog = $blogs[0] ?? null;
$allCategories = cms_blog_list_all_categories($blogs);
$pageTitle = "Explore Online Manipal Blogs | Industry Insights & Resources";
$metaDescription = "Transform your learning journey with curated blog articles on online education, careers, admissions, and industry insights.";
$canonicalUrl = rtrim((string) cms_cfg("site_url"), "/") . "/blogs";

$styleCss = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/css/style.css");
$blogCss = cms_url("/assets/www.onlinemanipal.com/wp-content/cache/min/1/wp-content/themes/flamingo/assets/css/blog__q_7e4f073632.css");
$publicCss = cms_url("/cms/assets/public-blog.css");
$logoUrl = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/OM_Logo.svg");
$star1 = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/star-orange.svg");
$star2 = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/star-orange-2.svg");
$breadcrumbArrow = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/breadcrumb-arrow.svg");
$dateIcon = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/calendar.svg");
$timeIcon = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/cal.svg");
$searchIcon = cms_url("/assets/www.onlinemanipal.com/wp-content/themes/flamingo/assets/images/icons/search.svg");
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
    <link rel="stylesheet" href="<?= cms_h($blogCss) ?>" />
    <link rel="stylesheet" href="<?= cms_h($publicCss) ?>" />
  </head>
  <body class="wp-theme-flamingo om-blog-page">
    <header class="om-blog-header">
      <div class="container om-blog-header-inner">
        <a href="<?= cms_h(cms_url("/")) ?>" class="om-logo" aria-label="Online Manipal Home">
          <img src="<?= cms_h($logoUrl) ?>" alt="Online Manipal" />
        </a>
        <nav class="om-blog-header-nav">
          <a href="<?= cms_h(cms_url("/")) ?>">Home</a>
          <a href="<?= cms_h(cms_url("/blogs/")) ?>" class="active">Blogs</a>
        </nav>
      </div>
    </header>

    <main>
      <section class="blog-banner pageTopSpace">
        <div class="container">
          <div class="breadcrumb">
            <a href="<?= cms_h(cms_url("/")) ?>" class="bcrumb-title">Home</a>
            <span class="separator"><img src="<?= cms_h($breadcrumbArrow) ?>" alt=">" /></span>
            <span class="active">Blogs</span>
          </div>

          <div class="featured-blog-banner section-mt">
            <img src="<?= cms_h($star1) ?>" alt="" class="star1" />
            <img src="<?= cms_h($star2) ?>" alt="" class="star2" />
            <h1 class="section-title featured-title">
              Transform your learning journey with our <span class="circle-word">blogs</span>
            </h1>

            <?php if ($featuredBlog): ?>
              <?php
              $featuredDate = cms_blog_list_format_date((string) ($featuredBlog["published_at"] ?: $featuredBlog["updated_at"]));
              $featuredMins = cms_blog_list_read_minutes((string) ($featuredBlog["content_html"] ?? ""));
              $featuredCat = cms_blog_list_first_category($featuredBlog);
              $featuredAuthor = trim((string) ($featuredBlog["author"]["name"] ?? ""));
              if ($featuredAuthor === "") {
                  $featuredAuthor = "Editorial Team";
              }
              $featuredCover = cms_blog_list_cover_image($featuredBlog);
              $featuredAuthorImg = cms_blog_list_author_image($featuredBlog);
              ?>
              <div class="featured-blog-slider">
                <article class="blog-banner-card">
                  <a
                    class="card"
                    href="<?= cms_h(cms_url("/blogs/" . (string) $featuredBlog["slug"])) ?>"
                    style="background-image: linear-gradient(180deg, rgba(0,0,0,.2) 0%, rgba(0,0,0,.75) 100%), url('<?= cms_h($featuredCover) ?>');"
                  >
                    <div class="category-wrapper">
                      <span class="blog-category"><?= cms_h($featuredCat) ?></span>
                    </div>
                    <div class="blog-content-wrapper">
                      <div class="blog-duration">
                        <div class="blog-date"><img src="<?= cms_h($dateIcon) ?>" alt="" /><span><?= cms_h($featuredDate) ?></span></div>
                        <span class="dot-blog"></span>
                        <div class="blog-time"><img src="<?= cms_h($timeIcon) ?>" alt="" /><span><?= (int) $featuredMins ?> mins</span></div>
                      </div>
                      <h2 class="section-title"><?= cms_h((string) $featuredBlog["title"]) ?></h2>
                    </div>
                  </a>
                  <div class="author-details">
                    <img src="<?= cms_h($featuredAuthorImg) ?>" alt="<?= cms_h($featuredAuthor) ?>" width="42" height="42" />
                    <p class="author-name"><?= cms_h($featuredAuthor) ?></p>
                  </div>
                </article>
              </div>
            <?php else: ?>
              <div class="featured-blog-slider">
                <article class="blog-banner-card">
                  <div class="card om-empty-featured">
                    <h2 class="section-title">No published blogs yet</h2>
                    <p>No blogs have been published yet. Check back soon!</p>
                  </div>
                </article>
              </div>
            <?php endif; ?>
          </div>
        </div>
      </section>

      <section class="blog-listing-sec section-mt section-mb">
        <div class="container">
          <div class="read-blog-section">
            <div class="blog-wrapper">
              <?php if (count($blogs) > 0): ?>
                <div class="serach-wrapper">
                  <div class="search-container">
                    <div class="search-bar">
                      <input
                        id="blogSearch"
                        class="search-input"
                        type="search"
                        placeholder="Search blog title, excerpt, or category"
                        aria-label="Search blogs"
                      />
                      <span class="search-img"><img src="<?= cms_h($searchIcon) ?>" alt="Search" /></span>
                    </div>
                  </div>
                </div>

                <div class="category-main-block">
                  <div class="browse-category-label"><span>Browse by category</span></div>
                  <div class="category-block">
                    <ul class="blog-category-list">
                      <li class="blog-category-item"><a href="#" class="blog-cat active" data-category="all">All</a></li>
                      <?php foreach ($allCategories as $cat): ?>
                        <li class="blog-category-item">
                          <a href="#" class="blog-cat" data-category="<?= cms_h(cms_slugify($cat)) ?>"><?= cms_h($cat) ?></a>
                        </li>
                      <?php endforeach; ?>
                    </ul>
                  </div>
                </div>

                <div class="blog-container">
                  <div class="blog-listing-sec blog-cards">
                    <?php foreach ($blogs as $blog): ?>
                      <?php
                      $postDate = cms_blog_list_format_date((string) ($blog["published_at"] ?: $blog["updated_at"]));
                      $readMins = cms_blog_list_read_minutes((string) ($blog["content_html"] ?? ""));
                      $author = trim((string) ($blog["author"]["name"] ?? ""));
                      if ($author === "") {
                          $author = "Editorial Team";
                      }
                      $category = cms_blog_list_first_category($blog);
                      $title = (string) ($blog["title"] ?? "");
                      $excerpt = (string) ($blog["excerpt"] ?? "");
                      $cover = cms_blog_list_cover_image($blog);
                      $authorImg = cms_blog_list_author_image($blog);
                      $cardCategories = [];
                      $cardCategoryNames = [];
                      $cardCatsRaw = $blog["categories"] ?? [];
                      if (is_array($cardCatsRaw)) {
                          foreach ($cardCatsRaw as $rawCat) {
                              $name = trim((string) $rawCat);
                              if ($name === "") {
                                  continue;
                              }
                              $cardCategories[] = cms_slugify($name);
                              $cardCategoryNames[] = strtolower($name);
                          }
                      }
                      if (count($cardCategories) === 0) {
                          $cardCategories[] = "general";
                          $cardCategoryNames[] = "general";
                      }
                      ?>
                      <article
                        class="blog-item course-card"
                        data-title="<?= cms_h($title) ?>"
                        data-excerpt="<?= cms_h($excerpt) ?>"
                        data-categories="<?= cms_h(implode("|", $cardCategories)) ?>"
                        data-category-labels="<?= cms_h(implode("|", $cardCategoryNames)) ?>"
                      >
                        <a href="<?= cms_h(cms_url("/blogs/" . (string) $blog["slug"])) ?>" class="om-card-link">
                          <div class="blog-img">
                            <img src="<?= cms_h($cover) ?>" alt="<?= cms_h((string) ($blog["feature_image"]["alt"] ?? $title)) ?>" />
                          </div>

                          <div class="read-blog-course-enroll">
                            <span class="blog-course-ranked"><?= cms_h($category) ?></span>
                          </div>

                          <div class="read-blog-wrapper">
                            <div class="blog-duration">
                              <div class="blog-date">
                                <img src="<?= cms_h($dateIcon) ?>" alt="" />
                                <span><?= cms_h($postDate) ?></span>
                              </div>
                              <span class="dot-blog"></span>
                              <div class="blog-time">
                                <img src="<?= cms_h($timeIcon) ?>" alt="" />
                                <span><?= (int) $readMins ?> mins</span>
                              </div>
                            </div>

                            <div class="blog-deatil">
                              <h3 class="blog-name"><?= cms_h($title) ?></h3>
                            </div>

                            <div class="author-details">
                              <img src="<?= cms_h($authorImg) ?>" alt="<?= cms_h($author) ?>" width="32" height="32" />
                              <p class="author-name"><?= cms_h($author) ?></p>
                            </div>
                          </div>
                        </a>
                      </article>
                    <?php endforeach; ?>
                  </div>
                  <p class="noReuslt" data-no-results hidden>Sorry, we couldn't find any results.</p>
                  <div class="pagination" data-pagination></div>
                </div>
              <?php else: ?>
                <div class="om-no-blog-card">
                  <h2>No published blogs yet</h2>
                  <p>No blogs have been published yet. Check back soon!</p>
                </div>
              <?php endif; ?>
            </div>
          </div>
        </div>
      </section>
    </main>

    <script src="<?= cms_h(cms_url("/cms/assets/blog-listing.js")) ?>"></script>
  </body>
</html>
