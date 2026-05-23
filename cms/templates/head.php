<?php
/** @var string $pageTitle */
/** @var string|null $metaDescription */
/** @var string|null $canonicalUrl */
$metaDescription = $metaDescription ?? null;
$canonicalUrl    = $canonicalUrl    ?? null;
?>
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title><?= cms_h($pageTitle ?? "Blog CMS") ?></title>
    <?php if ($metaDescription): ?>
      <meta name="description" content="<?= cms_h($metaDescription) ?>" />
    <?php endif; ?>
    <?php if ($canonicalUrl): ?>
      <link rel="canonical" href="<?= cms_h($canonicalUrl) ?>" />
    <?php endif; ?>
    <link rel="stylesheet" href="<?= cms_h(cms_url("/cms/assets/cms.css")) ?>" />
  </head>
  <body>
