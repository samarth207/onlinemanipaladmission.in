<?php
declare(strict_types=1);

function cms_start_session(): void
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
}

function cms_cfg(string $key = "")
{
    global $CMS_CONFIG;
    if ($key === "") {
        return $CMS_CONFIG;
    }
    $parts = explode(".", $key);
    $cursor = $CMS_CONFIG;
    foreach ($parts as $part) {
        if (!is_array($cursor) || !array_key_exists($part, $cursor)) {
            return null;
        }
        $cursor = $cursor[$part];
    }
    return $cursor;
}

function cms_url(string $path): string
{
    $base = (string) cms_cfg("base_path");
    $base = trim($base, "/");
    $path = "/" . ltrim($path, "/");
    if ($base === "") {
        return $path;
    }
    return "/" . $base . $path;
}

function cms_h(string $value): string
{
    return htmlspecialchars($value, ENT_QUOTES | ENT_SUBSTITUTE, "UTF-8");
}

function cms_redirect(string $path): void
{
    header("Location: " . cms_url($path));
    exit;
}

function cms_now_utc(): string
{
    return gmdate("Y-m-d H:i:s");
}

function cms_slugify(string $value): string
{
    $slug = strtolower(trim($value));
    $slug = preg_replace("/['\"`]/", "", $slug) ?? "";
    $slug = preg_replace("/[^a-z0-9]+/", "-", $slug) ?? "";
    $slug = trim($slug, "-");
    if ($slug === "") {
        $slug = "untitled-blog";
    }
    return $slug;
}

function cms_string(mixed $value): string
{
    return trim((string) ($value ?? ""));
}

function cms_str_limit(string $value, int $limit): string
{
    if (cms_strlen($value) <= $limit) {
        return $value;
    }
    return trim(cms_substr($value, 0, $limit));
}

function cms_json_decode_array(?string $json): array
{
    if (!$json) {
        return [];
    }
    $data = json_decode($json, true);
    return is_array($data) ? $data : [];
}

function cms_flash_set(string $type, string $message): void
{
    cms_start_session();
    $_SESSION["cms_flash"] = [
        "type" => $type,
        "message" => $message,
    ];
}

function cms_flash_get(): ?array
{
    cms_start_session();
    if (!isset($_SESSION["cms_flash"])) {
        return null;
    }
    $flash = $_SESSION["cms_flash"];
    unset($_SESSION["cms_flash"]);
    return is_array($flash) ? $flash : null;
}

function cms_published_status(array $blog): string
{
    if (($blog["status"] ?? "") === "scheduled" && !empty($blog["publish_at"])) {
        $publishAt = strtotime((string) $blog["publish_at"]);
        if ($publishAt !== false && $publishAt <= time()) {
            return "published";
        }
    }
    return (string) ($blog["status"] ?? "draft");
}

function cms_to_datetime_input(?string $datetime): array
{
    if (!$datetime) {
        return ["date" => "", "time" => ""];
    }
    $ts = strtotime($datetime);
    if ($ts === false) {
        return ["date" => "", "time" => ""];
    }
    return [
        "date" => gmdate("Y-m-d", $ts),
        "time" => gmdate("H:i", $ts),
    ];
}

function cms_strip_html(string $content): string
{
    $content = preg_replace("/<script\\b[^>]*>(.*?)<\\/script>/is", "", $content) ?? "";
    $content = preg_replace("/<style\\b[^>]*>(.*?)<\\/style>/is", "", $content) ?? "";
    return trim(strip_tags($content));
}

function cms_strlen(string $value): int
{
    if (function_exists("mb_strlen")) {
        return mb_strlen($value, "UTF-8");
    }
    return strlen($value);
}

function cms_substr(string $value, int $start, int $length): string
{
    if (function_exists("mb_substr")) {
        return (string) mb_substr($value, $start, $length, "UTF-8");
    }
    return substr($value, $start, $length);
}
