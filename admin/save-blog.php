<?php
declare(strict_types=1);
require_once __DIR__ . "/../cms/bootstrap.php";
cms_require_admin();

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    cms_redirect("/admin/index.php");
}

$id = (int) ($_POST["id"] ?? 0);
$isEdit = $id > 0;
$existing = null;
if ($isEdit) {
    $existing = cms_blog_find_by_id($id);
    if (!$existing) {
        cms_flash_set("error", "Blog not found.");
        cms_redirect("/admin/index.php");
    }
}

$validation = cms_blog_validate($_POST, $_FILES, $isEdit, $existing);
$errors = $validation["errors"];
$form = $validation["form"];
$payload = $validation["payload"];

$featureFile = $_FILES["featureImageFile"] ?? null;
if (is_array($featureFile) && (int) ($featureFile["error"] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    try {
        $featureUrl = cms_blog_upload_file($featureFile, "feature");
        $payload["feature_image_url"] = $featureUrl;
        $form["feature_image_url"] = $featureUrl;
    } catch (Throwable $e) {
        $errors[] = "Feature image upload failed: " . $e->getMessage();
    }
}

$authorFile = $_FILES["authorImageFile"] ?? null;
if (is_array($authorFile) && (int) ($authorFile["error"] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE) {
    try {
        $authorUrl = cms_blog_upload_file($authorFile, "author");
        $payload["author_image_url"] = $authorUrl;
        $form["author_image_url"] = $authorUrl;
    } catch (Throwable $e) {
        $errors[] = "Author image upload failed: " . $e->getMessage();
    }
}

if (!$isEdit && ($payload["feature_image_url"] ?? "") === "") {
    $errors[] = "Feature image upload is required.";
}

$mergeBlocks = cms_blog_merge_uploaded_blocks(
    is_array($payload["image_blocks"] ?? null) ? $payload["image_blocks"] : [],
    $_FILES,
    $_POST
);
$payload["image_blocks"] = $mergeBlocks["blocks"];
$form["image_blocks"] = $mergeBlocks["blocks"];
foreach ($mergeBlocks["errors"] as $blockError) {
    $errors[] = $blockError;
}

if (count($errors) > 0) {
    $form["id"] = (string) $id;
    $_SESSION["cms_blog_form_state"] = [
        "errors" => $errors,
        "form" => $form,
    ];
    $redirect = "/admin/blog-form.php";
    if ($isEdit) {
        $redirect .= "?id=" . $id;
    }
    cms_redirect($redirect);
}

try {
    if ($isEdit && $existing) {
        cms_blog_update($id, $payload, $existing);
        cms_flash_set("success", "Blog updated successfully.");
    } else {
        cms_blog_insert($payload);
        cms_flash_set("success", "Blog created successfully.");
    }
    cms_redirect("/admin/index.php");
} catch (PDOException $e) {
    $isDuplicate = $e->getCode() === "23000" || strpos($e->getMessage(), "Duplicate") !== false;
    if ($isDuplicate) {
        $errors[] = "Slug already exists. Please use a different URL slug.";
    } else {
        $errors[] = "Failed to save blog: " . $e->getMessage();
    }
} catch (Throwable $e) {
    $errors[] = "Failed to save blog: " . $e->getMessage();
}

$form["id"] = (string) $id;
$_SESSION["cms_blog_form_state"] = [
    "errors" => $errors,
    "form" => $form,
];
$redirect = "/admin/blog-form.php";
if ($isEdit) {
    $redirect .= "?id=" . $id;
}
cms_redirect($redirect);
