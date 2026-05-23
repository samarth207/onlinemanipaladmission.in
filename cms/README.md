# PHP Blog CMS (Hostinger-Friendly)

This CMS is pure `PHP + MySQL` and does not require Node.js or npm on hosting.

## What it provides

- Admin login (`/admin/login.php`)
- Blog create/edit/delete
- SEO fields:
  - Meta title (max 60)
  - Meta description (200-250)
  - Focus keyword
  - Primary keyword
  - URL slug
- Feature image + ALT text
- Rich editor (TinyMCE self-hosted locally)
- FAQ block
- Content image blocks with mandatory ALT
- Category multi-select + tags
- Scheduling (draft/pending/published/scheduled)
- Public blog listing and detail pages:
  - `/blogs/`
  - `/blogs/{slug}`
- TOC (index in book style) auto-generated from H2/H3/H4

## Setup on Hostinger

1. Upload `onlinemanipal-local` to your Hostinger `public_html` (or required web root).
2. Create a MySQL database/user in Hostinger panel.
3. Edit `cms/config.local.php` with Hostinger MySQL credentials.
   - You can also start from `cms/config.local.example.php`.
5. Open `https://your-domain.com/admin/login.php`
   - Tables will auto-create on first request.
   - Default admin credentials come from `config.php` / `config.local.php` (`admin_seed`).

## Optional manual SQL import

You can import this file in phpMyAdmin:

- `cms/sql/schema.sql`

## Important folders

- `cms/uploads/feature`
- `cms/uploads/author`
- `cms/uploads/content`

These must be writable by PHP.
