<?php
declare(strict_types=1);

function cms_blog_allowed_image_exts(): array
{
    return ["jpg", "jpeg", "png", "webp", "gif", "svg", "avif"];
}

function cms_blog_defaults(): array
{
    return [
        "id" => "",
        "title" => "",
        "url_slug" => "",
        "excerpt" => "",
        "meta_title" => "",
        "meta_description" => "",
        "focus_keyword" => "",
        "primary_keyword" => "",
        "content_html" => "",
        "categories" => [],
        "tags" => "",
        "status" => "draft",
        "publish_date" => "",
        "publish_time" => "",
        "last_updated_at" => "",
        "feature_image_url" => "",
        "feature_image_alt" => "",
        "feature_image_title" => "",
        "author_name" => "",
        "author_bio" => "",
        "author_page" => "",
        "author_image_url" => "",
        "lead_headline" => "Talk to our counselors",
        "lead_button_text" => "Apply Now",
        "faq_items" => [
            ["question" => "", "answer" => ""],
        ],
        "image_blocks" => [],
    ];
}

function cms_blog_row_to_entity(array $row): array
{
    return [
        "id" => (int) $row["id"],
        "slug" => (string) $row["slug"],
        "title" => (string) $row["title"],
        "excerpt" => (string) $row["excerpt"],
        "meta_title" => (string) $row["meta_title"],
        "meta_description" => (string) $row["meta_description"],
        "focus_keyword" => (string) $row["focus_keyword"],
        "primary_keyword" => (string) $row["primary_keyword"],
        "content_html" => (string) $row["content_html"],
        "toc" => cms_json_decode_array((string) $row["toc_json"]),
        "categories" => cms_json_decode_array((string) $row["categories_json"]),
        "tags" => cms_json_decode_array((string) $row["tags_json"]),
        "status" => (string) $row["status"],
        "publish_at" => $row["publish_at"] ? (string) $row["publish_at"] : null,
        "published_at" => $row["published_at"] ? (string) $row["published_at"] : null,
        "feature_image" => [
            "url" => (string) $row["feature_image_url"],
            "alt" => (string) $row["feature_image_alt"],
            "title" => (string) ($row["feature_image_title"] ?? ""),
        ],
        "author" => [
            "name" => (string) $row["author_name"],
            "bio" => (string) ($row["author_bio"] ?? ""),
            "page" => (string) ($row["author_page"] ?? ""),
            "image_url" => (string) ($row["author_image_url"] ?? ""),
        ],
        "lead_form" => [
            "headline" => (string) $row["lead_headline"],
            "button_text" => (string) $row["lead_button_text"],
        ],
        "faq_items" => cms_json_decode_array((string) $row["faq_json"]),
        "image_blocks" => cms_json_decode_array((string) $row["image_blocks_json"]),
        "search_text" => (string) $row["search_text"],
        "created_at" => (string) $row["created_at"],
        "updated_at" => (string) $row["updated_at"],
        "last_updated_at" => (string) $row["last_updated_at"],
    ];
}

function cms_blog_entity_to_form(array $blog): array
{
    $dt = cms_to_datetime_input($blog["publish_at"] ?? null);
    return [
        "id" => (string) $blog["id"],
        "title" => (string) $blog["title"],
        "url_slug" => (string) $blog["slug"],
        "excerpt" => (string) $blog["excerpt"],
        "meta_title" => (string) $blog["meta_title"],
        "meta_description" => (string) $blog["meta_description"],
        "focus_keyword" => (string) $blog["focus_keyword"],
        "primary_keyword" => (string) $blog["primary_keyword"],
        "content_html" => (string) $blog["content_html"],
        "categories" => is_array($blog["categories"]) ? $blog["categories"] : [],
        "tags" => implode(", ", is_array($blog["tags"]) ? $blog["tags"] : []),
        "status" => (string) $blog["status"],
        "publish_date" => $dt["date"],
        "publish_time" => $dt["time"],
        "last_updated_at" => (string) $blog["last_updated_at"],
        "feature_image_url" => (string) ($blog["feature_image"]["url"] ?? ""),
        "feature_image_alt" => (string) ($blog["feature_image"]["alt"] ?? ""),
        "feature_image_title" => (string) ($blog["feature_image"]["title"] ?? ""),
        "author_name" => (string) ($blog["author"]["name"] ?? ""),
        "author_bio" => (string) ($blog["author"]["bio"] ?? ""),
        "author_page" => (string) ($blog["author"]["page"] ?? ""),
        "author_image_url" => (string) ($blog["author"]["image_url"] ?? ""),
        "lead_headline" => (string) ($blog["lead_form"]["headline"] ?? ""),
        "lead_button_text" => (string) ($blog["lead_form"]["button_text"] ?? ""),
        "faq_items" => is_array($blog["faq_items"]) && count($blog["faq_items"]) > 0
            ? $blog["faq_items"]
            : [["question" => "", "answer" => ""]],
        "image_blocks" => is_array($blog["image_blocks"]) ? $blog["image_blocks"] : [],
    ];
}

function cms_blog_find_by_email_admin(string $email): ?array
{
    $stmt = cms_db()->prepare("SELECT * FROM admins WHERE email = :email LIMIT 1");
    $stmt->execute(["email" => strtolower(trim($email))]);
    $row = $stmt->fetch();
    return $row ?: null;
}

function cms_blog_find_by_id(int $id): ?array
{
    $stmt = cms_db()->prepare("SELECT * FROM blogs WHERE id = :id LIMIT 1");
    $stmt->execute(["id" => $id]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }
    return cms_blog_row_to_entity($row);
}

function cms_blog_find_by_slug(string $slug): ?array
{
    $stmt = cms_db()->prepare("SELECT * FROM blogs WHERE slug = :slug LIMIT 1");
    $stmt->execute(["slug" => $slug]);
    $row = $stmt->fetch();
    if (!$row) {
        return null;
    }
    return cms_blog_row_to_entity($row);
}

function cms_blog_list_admin(): array
{
    $stmt = cms_db()->query("SELECT * FROM blogs ORDER BY updated_at DESC");
    $rows = $stmt->fetchAll();
    return array_map("cms_blog_row_to_entity", $rows ?: []);
}

function cms_blog_list_published(): array
{
    $sql = "
        SELECT * FROM blogs
        WHERE status = 'published'
           OR (status = 'scheduled' AND publish_at IS NOT NULL AND publish_at <= UTC_TIMESTAMP())
        ORDER BY COALESCE(published_at, updated_at) DESC, updated_at DESC
    ";
    $stmt = cms_db()->query($sql);
    $rows = $stmt->fetchAll();
    return array_map("cms_blog_row_to_entity", $rows ?: []);
}

function cms_blog_safe_rich_html(string $html): string
{
    $html = preg_replace("/<script\\b[^>]*>(.*?)<\\/script>/is", "", $html) ?? "";
    $html = preg_replace("/<iframe\\b[^>]*>(.*?)<\\/iframe>/is", "", $html) ?? "";
    return trim($html);
}

function cms_blog_check_content_image_alt(string $html): array
{
    $matches = [];
    preg_match_all("/<img\\b[^>]*>/i", $html, $matches);
    $imgTags = $matches[0] ?? [];
    $missingIndexes = [];
    foreach ($imgTags as $index => $imgTag) {
        $altMatch = [];
        preg_match('/\\balt\\s*=\\s*("([^"]*)"|\'([^\']*)\')/i', $imgTag, $altMatch);
        $alt = trim((string) ($altMatch[2] ?? $altMatch[3] ?? ""));
        if ($alt === "") {
            $missingIndexes[] = $index + 1;
        }
    }
    return $missingIndexes;
}

function cms_blog_build_toc_and_inject_ids(string $html): array
{
    $toc = [];
    $slugCounts = [];

    $processed = preg_replace_callback(
        "/<(h[2-4])([^>]*)>(.*?)<\\/\\1>/is",
        static function (array $m) use (&$toc, &$slugCounts): string {
            $tag = strtolower($m[1]);
            $attrs = (string) $m[2];
            $inner = (string) $m[3];
            $text = trim(strip_tags($inner));
            if ($text === "") {
                return $m[0];
            }

            $id = "";
            if (preg_match('/\\sid\\s*=\\s*("([^"]*)"|\'([^\']*)\')/i', $attrs, $idMatch)) {
                $id = (string) ($idMatch[2] ?? $idMatch[3] ?? "");
            }
            if ($id === "") {
                $base = cms_slugify($text);
                $count = (int) ($slugCounts[$base] ?? 0);
                $slugCounts[$base] = $count + 1;
                $id = $count === 0 ? $base : ($base . "-" . ($count + 1));
                $attrs .= ' id="' . cms_h($id) . '"';
            }

            $toc[] = [
                "id" => $id,
                "text" => $text,
                "level" => (int) str_replace("h", "", $tag),
            ];

            return "<{$tag}{$attrs}>{$inner}</{$tag}>";
        },
        $html
    );

    return [
        "html" => $processed ?? $html,
        "toc" => $toc,
    ];
}

function cms_blog_collect_tags(string $raw): array
{
    $parts = explode(",", $raw);
    $tags = [];
    foreach ($parts as $part) {
        $value = trim($part);
        if ($value === "") {
            continue;
        }
        $tags[$value] = true;
    }
    return array_keys($tags);
}

function cms_blog_collect_faq(array $post): array
{
    $questions = $post["faqQuestion"] ?? [];
    $answers = $post["faqAnswer"] ?? [];
    if (!is_array($questions)) {
        $questions = [$questions];
    }
    if (!is_array($answers)) {
        $answers = [$answers];
    }

    $items = [];
    $max = max(count($questions), count($answers));
    for ($i = 0; $i < $max; $i++) {
        $q = cms_string($questions[$i] ?? "");
        $a = cms_string($answers[$i] ?? "");
        if ($q === "" && $a === "") {
            continue;
        }
        if ($q !== "" && $a !== "") {
            $items[] = ["question" => $q, "answer" => $a];
        }
    }
    return $items;
}

function cms_blog_existing_image_blocks_from_json(string $raw): array
{
    $items = cms_json_decode_array($raw);
    $result = [];
    foreach ($items as $item) {
        if (!is_array($item)) {
            continue;
        }
        $url = cms_string($item["url"] ?? "");
        $alt = cms_string($item["alt"] ?? "");
        if ($url === "" || $alt === "") {
            continue;
        }
        $result[] = [
            "url" => $url,
            "alt" => $alt,
            "caption" => cms_string($item["caption"] ?? ""),
            "title" => cms_string($item["title"] ?? ""),
        ];
    }
    return $result;
}

function cms_blog_upload_file(array $file, string $targetFolder): string
{
    if (($file["error"] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
        throw new RuntimeException("File upload failed.");
    }
    $maxBytes = (int) cms_cfg("upload_limits.max_file_size_bytes");
    $size = (int) ($file["size"] ?? 0);
    if ($maxBytes > 0 && $size > $maxBytes) {
        throw new RuntimeException("Uploaded file is too large.");
    }

    $name = (string) ($file["name"] ?? "");
    $tmp = (string) ($file["tmp_name"] ?? "");
    $ext = strtolower(pathinfo($name, PATHINFO_EXTENSION));
    if (!in_array($ext, cms_blog_allowed_image_exts(), true)) {
        throw new RuntimeException("Invalid image extension.");
    }

    $uploadDir = CMS_ROOT . "/uploads/" . trim($targetFolder, "/");
    if (!is_dir($uploadDir) && !mkdir($uploadDir, 0775, true) && !is_dir($uploadDir)) {
        throw new RuntimeException("Unable to create upload directory.");
    }

    $safeName = gmdate("YmdHis") . "-" . bin2hex(random_bytes(5)) . "." . $ext;
    $targetPath = $uploadDir . "/" . $safeName;
    if (!move_uploaded_file($tmp, $targetPath)) {
        throw new RuntimeException("Unable to move uploaded file.");
    }

    return cms_url("/cms/uploads/" . trim($targetFolder, "/") . "/" . $safeName);
}

function cms_blog_validate(array $post, array $files, bool $isEdit = false, ?array $existing = null): array
{
    $form = cms_blog_defaults();
    $errors = [];

    $form["id"] = cms_string($post["id"] ?? ($existing["id"] ?? ""));
    $form["title"] = cms_string($post["title"] ?? "");
    $form["url_slug"] = cms_slugify(cms_string($post["urlSlug"] ?? ""));
    if ($form["url_slug"] === "untitled-blog" && $form["title"] !== "") {
        $form["url_slug"] = cms_slugify($form["title"]);
    }
    $form["excerpt"] = cms_string($post["excerpt"] ?? "");
    $form["meta_title"] = cms_string($post["metaTitle"] ?? "");
    $form["meta_description"] = cms_string($post["metaDescription"] ?? "");
    $form["focus_keyword"] = cms_string($post["focusKeyword"] ?? "");
    $form["primary_keyword"] = cms_string($post["primaryKeyword"] ?? "");
    $form["content_html"] = cms_blog_safe_rich_html(cms_string($post["contentHtml"] ?? ""));
    $form["categories"] = $post["categories"] ?? [];
    if (!is_array($form["categories"])) {
        $form["categories"] = [$form["categories"]];
    }
    $form["categories"] = array_values(array_filter(array_map("cms_string", $form["categories"])));
    $form["tags"] = cms_string($post["tags"] ?? "");
    $form["status"] = strtolower(cms_string($post["status"] ?? "draft"));
    $form["publish_date"] = cms_string($post["publishDate"] ?? "");
    $form["publish_time"] = cms_string($post["publishTime"] ?? "");
    $form["feature_image_alt"] = cms_string($post["featureImageAlt"] ?? "");
    $form["feature_image_title"] = cms_string($post["featureImageTitle"] ?? "");
    $form["feature_image_url"] = cms_string($post["existingFeatureImageUrl"] ?? ($existing["feature_image"]["url"] ?? ""));
    $form["author_name"] = cms_string($post["authorName"] ?? "");
    $form["author_bio"] = cms_string($post["authorBio"] ?? "");
    $form["author_page"] = cms_string($post["authorPage"] ?? "");
    $form["author_image_url"] = cms_string($post["existingAuthorImageUrl"] ?? ($existing["author"]["image_url"] ?? ""));
    $form["lead_headline"] = cms_string($post["leadHeadline"] ?? "Talk to our counselors");
    $form["lead_button_text"] = cms_string($post["leadButtonText"] ?? "Apply Now");
    $form["faq_items"] = cms_blog_collect_faq($post);
    if (count($form["faq_items"]) === 0) {
        $form["faq_items"] = [["question" => "", "answer" => ""]];
    }
    $form["image_blocks"] = cms_blog_existing_image_blocks_from_json(cms_string($post["existingImageBlocks"] ?? "[]"));

    if ($form["title"] === "") {
        $errors[] = "Blog title is required.";
    } elseif (cms_strlen($form["title"]) > 70) {
        $errors[] = "Blog title must be 70 characters or less.";
    }

    if ($form["excerpt"] === "") {
        $errors[] = "Short description/excerpt is required.";
    } elseif (cms_strlen($form["excerpt"]) > 250) {
        $errors[] = "Short description/excerpt must be 250 characters or less.";
    }

    if ($form["meta_title"] === "") {
        $errors[] = "Meta title is required.";
    } elseif (cms_strlen($form["meta_title"]) > 60) {
        $errors[] = "Meta title must be 60 characters or less.";
    }

    if ($form["meta_description"] === "") {
        $errors[] = "Meta description is required.";
    } else {
        $len = cms_strlen($form["meta_description"]);
        if ($len < 200 || $len > 250) {
            $errors[] = "Meta description must be between 200 and 250 characters.";
        }
    }

    if ($form["focus_keyword"] === "") {
        $errors[] = "Focus keyword is required.";
    }
    if ($form["primary_keyword"] === "") {
        $errors[] = "Primary keyword is required.";
    }

    if (!preg_match("/^[a-z0-9]+(?:-[a-z0-9]+)*$/", $form["url_slug"])) {
        $errors[] = "URL slug must be lowercase and hyphen-separated.";
    }

    if ($form["content_html"] === "") {
        $errors[] = "Blog content is required.";
    }

    $missingAlt = cms_blog_check_content_image_alt($form["content_html"]);
    if (count($missingAlt) > 0) {
        $errors[] = "All images in content must include ALT text. Missing ALT on image block(s): " . implode(", ", $missingAlt);
    }

    if (count($form["categories"]) === 0) {
        $errors[] = "At least one category is required.";
    }

    $allowedStatuses = cms_cfg("publish_statuses");
    if (!is_array($allowedStatuses) || !in_array($form["status"], $allowedStatuses, true)) {
        $errors[] = "Invalid publish status.";
    }

    if ($form["status"] === "scheduled") {
        if ($form["publish_date"] === "" || $form["publish_time"] === "") {
            $errors[] = "Publish date and publish time are required for scheduled status.";
        }
    }

    if ($form["author_name"] === "") {
        $errors[] = "Author name is required.";
    }

    if ($form["feature_image_alt"] === "") {
        $errors[] = "Feature image alt text is required.";
    }

    $featureUpload = $files["featureImageFile"] ?? null;
    if (!$isEdit && (!is_array($featureUpload) || ($featureUpload["error"] ?? UPLOAD_ERR_NO_FILE) === UPLOAD_ERR_NO_FILE)) {
        $errors[] = "Feature image upload is required.";
    }

    $publishAt = null;
    if ($form["publish_date"] !== "") {
        $safeTime = $form["publish_time"] !== "" ? $form["publish_time"] : "00:00";
        $publishAtRaw = $form["publish_date"] . " " . $safeTime . ":00";
        $ts = strtotime($publishAtRaw . " UTC");
        if ($ts !== false) {
            $publishAt = gmdate("Y-m-d H:i:s", $ts);
        }
    }

    $tocResult = cms_blog_build_toc_and_inject_ids($form["content_html"]);
    $form["content_html"] = $tocResult["html"];
    $toc = $tocResult["toc"];

    $tags = cms_blog_collect_tags($form["tags"]);

    $payload = [
        "slug" => $form["url_slug"],
        "title" => cms_str_limit($form["title"], 70),
        "excerpt" => cms_str_limit($form["excerpt"], 250),
        "meta_title" => cms_str_limit($form["meta_title"], 60),
        "meta_description" => $form["meta_description"],
        "focus_keyword" => $form["focus_keyword"],
        "primary_keyword" => $form["primary_keyword"],
        "content_html" => $form["content_html"],
        "toc" => $toc,
        "categories" => $form["categories"],
        "tags" => $tags,
        "status" => $form["status"],
        "publish_at" => $publishAt,
        "feature_image_url" => $form["feature_image_url"],
        "feature_image_alt" => $form["feature_image_alt"],
        "feature_image_title" => $form["feature_image_title"],
        "author_name" => $form["author_name"],
        "author_bio" => $form["author_bio"],
        "author_page" => $form["author_page"],
        "author_image_url" => $form["author_image_url"],
        "lead_headline" => $form["lead_headline"] !== "" ? $form["lead_headline"] : "Talk to our counselors",
        "lead_button_text" => $form["lead_button_text"] !== "" ? $form["lead_button_text"] : "Apply Now",
        "faq_items" => array_values(array_filter($form["faq_items"], static function (array $item): bool {
            return cms_string($item["question"] ?? "") !== "" && cms_string($item["answer"] ?? "") !== "";
        })),
        "image_blocks" => $form["image_blocks"],
        "search_text" => cms_strip_html(
            implode(" ", [
                $form["title"],
                $form["excerpt"],
                $form["meta_description"],
                $form["focus_keyword"],
                $form["primary_keyword"],
            ])
        ),
    ];

    return [
        "errors" => $errors,
        "form" => $form,
        "payload" => $payload,
    ];
}

function cms_blog_merge_uploaded_blocks(array $existingBlocks, array $files, array $post): array
{
    $errors = [];
    $blocks = $existingBlocks;
    $altList = $post["contentImageAlt"] ?? [];
    $capList = $post["contentImageCaption"] ?? [];
    $titleList = $post["contentImageTitle"] ?? [];

    if (!is_array($altList)) {
        $altList = [$altList];
    }
    if (!is_array($capList)) {
        $capList = [$capList];
    }
    if (!is_array($titleList)) {
        $titleList = [$titleList];
    }

    $uploads = $files["contentImageFiles"] ?? null;
    if (!is_array($uploads) || !isset($uploads["name"]) || !is_array($uploads["name"])) {
        return ["errors" => $errors, "blocks" => $blocks];
    }

    $fileCount = count($uploads["name"]);
    for ($i = 0; $i < $fileCount; $i++) {
        $errorCode = (int) ($uploads["error"][$i] ?? UPLOAD_ERR_NO_FILE);
        if ($errorCode === UPLOAD_ERR_NO_FILE) {
            continue;
        }

        $file = [
            "name" => $uploads["name"][$i] ?? "",
            "type" => $uploads["type"][$i] ?? "",
            "tmp_name" => $uploads["tmp_name"][$i] ?? "",
            "error" => $errorCode,
            "size" => $uploads["size"][$i] ?? 0,
        ];
        $alt = cms_string($altList[$i] ?? "");
        if ($alt === "") {
            $errors[] = "Image block #" . ($i + 1) . " requires alt text.";
            continue;
        }
        try {
            $url = cms_blog_upload_file($file, "content");
            $blocks[] = [
                "url" => $url,
                "alt" => $alt,
                "caption" => cms_string($capList[$i] ?? ""),
                "title" => cms_string($titleList[$i] ?? ""),
            ];
        } catch (Throwable $e) {
            $errors[] = "Image block #" . ($i + 1) . " upload failed: " . $e->getMessage();
        }
    }

    return ["errors" => $errors, "blocks" => $blocks];
}

function cms_blog_insert(array $payload): int
{
    $now = cms_now_utc();
    $publishedAt = null;
    if ($payload["status"] === "published") {
        $publishedAt = $payload["publish_at"] ?: $now;
    }

    $sql = "
        INSERT INTO blogs (
            slug, title, excerpt, meta_title, meta_description, focus_keyword, primary_keyword,
            content_html, toc_json, categories_json, tags_json, status, publish_at, published_at,
            feature_image_url, feature_image_alt, feature_image_title, author_name, author_bio,
            author_page, author_image_url, lead_headline, lead_button_text, faq_json,
            image_blocks_json, search_text, created_at, updated_at, last_updated_at
        ) VALUES (
            :slug, :title, :excerpt, :meta_title, :meta_description, :focus_keyword, :primary_keyword,
            :content_html, :toc_json, :categories_json, :tags_json, :status, :publish_at, :published_at,
            :feature_image_url, :feature_image_alt, :feature_image_title, :author_name, :author_bio,
            :author_page, :author_image_url, :lead_headline, :lead_button_text, :faq_json,
            :image_blocks_json, :search_text, :created_at, :updated_at, :last_updated_at
        )
    ";

    $stmt = cms_db()->prepare($sql);
    $stmt->execute([
        "slug" => $payload["slug"],
        "title" => $payload["title"],
        "excerpt" => $payload["excerpt"],
        "meta_title" => $payload["meta_title"],
        "meta_description" => $payload["meta_description"],
        "focus_keyword" => $payload["focus_keyword"],
        "primary_keyword" => $payload["primary_keyword"],
        "content_html" => $payload["content_html"],
        "toc_json" => json_encode($payload["toc"], JSON_UNESCAPED_UNICODE),
        "categories_json" => json_encode($payload["categories"], JSON_UNESCAPED_UNICODE),
        "tags_json" => json_encode($payload["tags"], JSON_UNESCAPED_UNICODE),
        "status" => $payload["status"],
        "publish_at" => $payload["publish_at"],
        "published_at" => $publishedAt,
        "feature_image_url" => $payload["feature_image_url"],
        "feature_image_alt" => $payload["feature_image_alt"],
        "feature_image_title" => $payload["feature_image_title"] !== "" ? $payload["feature_image_title"] : null,
        "author_name" => $payload["author_name"],
        "author_bio" => $payload["author_bio"] !== "" ? $payload["author_bio"] : null,
        "author_page" => $payload["author_page"] !== "" ? $payload["author_page"] : null,
        "author_image_url" => $payload["author_image_url"] !== "" ? $payload["author_image_url"] : null,
        "lead_headline" => $payload["lead_headline"],
        "lead_button_text" => $payload["lead_button_text"],
        "faq_json" => json_encode($payload["faq_items"], JSON_UNESCAPED_UNICODE),
        "image_blocks_json" => json_encode($payload["image_blocks"], JSON_UNESCAPED_UNICODE),
        "search_text" => $payload["search_text"],
        "created_at" => $now,
        "updated_at" => $now,
        "last_updated_at" => $now,
    ]);

    return (int) cms_db()->lastInsertId();
}

function cms_blog_update(int $id, array $payload, array $existing): void
{
    $now = cms_now_utc();
    $publishedAt = $existing["published_at"] ?? null;
    if ($payload["status"] === "published") {
        $publishedAt = $payload["publish_at"] ?: ($publishedAt ?: $now);
    }

    $sql = "
        UPDATE blogs SET
            slug = :slug,
            title = :title,
            excerpt = :excerpt,
            meta_title = :meta_title,
            meta_description = :meta_description,
            focus_keyword = :focus_keyword,
            primary_keyword = :primary_keyword,
            content_html = :content_html,
            toc_json = :toc_json,
            categories_json = :categories_json,
            tags_json = :tags_json,
            status = :status,
            publish_at = :publish_at,
            published_at = :published_at,
            feature_image_url = :feature_image_url,
            feature_image_alt = :feature_image_alt,
            feature_image_title = :feature_image_title,
            author_name = :author_name,
            author_bio = :author_bio,
            author_page = :author_page,
            author_image_url = :author_image_url,
            lead_headline = :lead_headline,
            lead_button_text = :lead_button_text,
            faq_json = :faq_json,
            image_blocks_json = :image_blocks_json,
            search_text = :search_text,
            updated_at = :updated_at,
            last_updated_at = :last_updated_at
        WHERE id = :id
    ";

    $stmt = cms_db()->prepare($sql);
    $stmt->execute([
        "id" => $id,
        "slug" => $payload["slug"],
        "title" => $payload["title"],
        "excerpt" => $payload["excerpt"],
        "meta_title" => $payload["meta_title"],
        "meta_description" => $payload["meta_description"],
        "focus_keyword" => $payload["focus_keyword"],
        "primary_keyword" => $payload["primary_keyword"],
        "content_html" => $payload["content_html"],
        "toc_json" => json_encode($payload["toc"], JSON_UNESCAPED_UNICODE),
        "categories_json" => json_encode($payload["categories"], JSON_UNESCAPED_UNICODE),
        "tags_json" => json_encode($payload["tags"], JSON_UNESCAPED_UNICODE),
        "status" => $payload["status"],
        "publish_at" => $payload["publish_at"],
        "published_at" => $publishedAt,
        "feature_image_url" => $payload["feature_image_url"],
        "feature_image_alt" => $payload["feature_image_alt"],
        "feature_image_title" => $payload["feature_image_title"] !== "" ? $payload["feature_image_title"] : null,
        "author_name" => $payload["author_name"],
        "author_bio" => $payload["author_bio"] !== "" ? $payload["author_bio"] : null,
        "author_page" => $payload["author_page"] !== "" ? $payload["author_page"] : null,
        "author_image_url" => $payload["author_image_url"] !== "" ? $payload["author_image_url"] : null,
        "lead_headline" => $payload["lead_headline"],
        "lead_button_text" => $payload["lead_button_text"],
        "faq_json" => json_encode($payload["faq_items"], JSON_UNESCAPED_UNICODE),
        "image_blocks_json" => json_encode($payload["image_blocks"], JSON_UNESCAPED_UNICODE),
        "search_text" => $payload["search_text"],
        "updated_at" => $now,
        "last_updated_at" => $now,
    ]);
}

function cms_blog_delete(int $id): void
{
    $stmt = cms_db()->prepare("DELETE FROM blogs WHERE id = :id");
    $stmt->execute(["id" => $id]);
}

function cms_blog_create_sample_post(): int
{
    $baseSlug = "welcome-to-online-manipal-blogs";
    $existing = cms_blog_find_by_slug($baseSlug);
    if ($existing) {
        return (int) $existing["id"];
    }

    $slug = $baseSlug;
    $suffix = 2;
    while (cms_blog_find_by_slug($slug) !== null) {
        $slug = $baseSlug . "-" . $suffix;
        $suffix++;
    }

    $title = "Welcome to Online Manipal Blogs: Your Learning Guide for 2026";
    $excerpt = "This is your starting point for practical guides on online learning, course selection, admissions, and career planning. We publish easy-to-follow articles that help you make smarter academic and professional decisions.";
    $metaTitle = "Welcome to Online Manipal Blogs | Student Learning Guide 2026";
    $metaDescription = "Kick-start your online learning journey with actionable insights on admissions, career growth, skills, and student success. This first post explains what to expect from our blog and how each article can help you make smarter academic decisions.";
    $contentHtml = <<<HTML
<p>Welcome to our official blog space. Here, we share practical, easy-to-understand guidance for students and working professionals who want to build a strong future through online education.</p>
<h2>What you can expect from this blog</h2>
<p>Every article is written to help you take clear next steps, whether you are exploring a new degree, planning your schedule, or comparing career options.</p>
<h3>Career-focused learning tips</h3>
<p>We publish topic-wise guides, skill roadmaps, and decision checklists you can use immediately.</p>
<h3>Admissions and program guidance</h3>
<p>From eligibility basics to course outcomes, we break complex details into simple actions.</p>
<h2>How to use blog content effectively</h2>
<p>Start by exploring the <a href="/all-courses">all courses section</a>, then read related blogs to shortlist the right path for your goals.</p>
<table>
  <thead>
    <tr>
      <th>Goal</th>
      <th>Recommended Action</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Choose the right program</td>
      <td>Read category blogs and compare outcomes.</td>
    </tr>
    <tr>
      <td>Build employability</td>
      <td>Follow monthly skill and career articles.</td>
    </tr>
  </tbody>
</table>
<h2>Stay consistent, stay future-ready</h2>
<p>Bookmark this page and check back regularly. For broader updates on online higher education, you can also refer to <a href="https://www.onlinemanipaladmission.in/blogs" target="_blank" rel="noopener">Online Manipal blogs</a>.</p>
HTML;

    $tocResult = cms_blog_build_toc_and_inject_ids($contentHtml);
    $contentHtml = (string) ($tocResult["html"] ?? $contentHtml);
    $toc = is_array($tocResult["toc"] ?? null) ? $tocResult["toc"] : [];

    $payload = [
        "slug" => $slug,
        "title" => $title,
        "excerpt" => $excerpt,
        "meta_title" => $metaTitle,
        "meta_description" => $metaDescription,
        "focus_keyword" => "online manipal blogs",
        "primary_keyword" => "online learning guide",
        "content_html" => $contentHtml,
        "toc" => $toc,
        "categories" => ["Online Learning", "Careers"],
        "tags" => ["online education", "career growth", "student guide"],
        "status" => "published",
        "publish_at" => cms_now_utc(),
        "feature_image_url" => cms_url("/assets/static/wp-content/uploads/2023/03/blogpage-banner.jpg"),
        "feature_image_alt" => "Students exploring online learning opportunities",
        "feature_image_title" => "Online learning journey",
        "author_name" => "Editorial Team",
        "author_bio" => "The Online Manipal editorial team publishes student-first resources to support informed academic decisions.",
        "author_page" => "",
        "author_image_url" => cms_url("/assets/static/wp-content/themes/flamingo/assets/images/icons/web-user.png"),
        "lead_headline" => "Talk to our counselors",
        "lead_button_text" => "Apply Now",
        "faq_items" => [
            [
                "question" => "How often are new blogs published?",
                "answer" => "New blogs are published regularly with fresh updates on courses, admissions, and career guidance.",
            ],
            [
                "question" => "Can I use these blogs to choose a course?",
                "answer" => "Yes. Start with category-specific posts and compare programs based on your goals, timeline, and skill needs.",
            ],
        ],
        "image_blocks" => [],
        "search_text" => cms_strip_html(implode(" ", [
            $title,
            $excerpt,
            $metaDescription,
            "online manipal blogs",
            "online learning guide",
        ])),
    ];

    return cms_blog_insert($payload);
}
