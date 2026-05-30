(function () {
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  const titleInput = qs("[data-title-input]");
  const slugInput = qs("[data-slug-input]");
  const slugTouchedInput = qs("[data-slug-touched]");

  function slugify(text) {
    return String(text || "")
      .toLowerCase()
      .trim()
      .replace(/['"`]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .replace(/-{2,}/g, "-");
  }

  if (slugInput && slugTouchedInput) {
    slugInput.addEventListener("input", function () {
      slugTouchedInput.value = "1";
    });
  }

  if (titleInput && slugInput && slugTouchedInput) {
    titleInput.addEventListener("input", function () {
      if (slugTouchedInput.value === "1") return;
      slugInput.value = slugify(titleInput.value);
    });
  }

  qsa("[data-counter]").forEach(function (el) {
    const input = qs("#" + el.dataset.counter);
    const limit = Number(el.dataset.limit || 0);
    const currentEl = qs("[data-current]", el);

    function refresh() {
      if (!input || !currentEl) return;
      const len = String(input.value || "").length;
      currentEl.textContent = String(len);
      if (limit && len > limit) {
        currentEl.style.color = "#b42318";
      } else {
        currentEl.style.color = "";
      }
    }

    if (input) {
      input.addEventListener("input", refresh);
      refresh();
    }
  });

  const faqWrap = qs("[data-faq-wrap]");
  const faqTemplate = qs("[data-faq-template]");
  const addFaqBtn = qs("[data-add-faq]");
  if (faqWrap && faqTemplate && addFaqBtn) {
    addFaqBtn.addEventListener("click", function () {
      const clone = faqTemplate.content.cloneNode(true);
      faqWrap.appendChild(clone);
    });
    faqWrap.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-remove-faq]");
      if (!btn) return;
      const row = btn.closest(".faq-row");
      if (row) row.remove();
    });
  }

  const imageWrap = qs("[data-image-wrap]");
  const imageTemplate = qs("[data-image-template]");
  const addImageBtn = qs("[data-add-image-block]");
  if (imageWrap && imageTemplate && addImageBtn) {
    addImageBtn.addEventListener("click", function () {
      const clone = imageTemplate.content.cloneNode(true);
      imageWrap.appendChild(clone);
    });
    imageWrap.addEventListener("click", function (event) {
      const btn = event.target.closest("[data-remove-image]");
      if (!btn) return;
      const row = btn.closest(".image-row");
      if (row) row.remove();
    });
  }

  qsa("[data-remove-existing-image]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const key = btn.dataset.key || "";
      const holder = qs("#existingImageBlocks");
      if (!holder) return;
      let list = [];
      try {
        list = JSON.parse(holder.value || "[]");
      } catch (error) {
        list = [];
      }
      list = list.filter(function (item) {
        return item.url !== key;
      });
      holder.value = JSON.stringify(list);
      const row = btn.closest(".image-row");
      if (row) row.remove();
    });
  });

  const TABLE_COLOR_MAP = [
    "FFFFFF", "White",       "F9FAFB", "Gray 50",    "F3F4F6", "Gray 100",
    "E5E7EB", "Gray 200",    "D1D5DB", "Gray 300",   "9CA3AF", "Gray 400",
    "6B7280", "Gray 500",    "374151", "Gray 700",   "111827", "Gray 900",
    "000000", "Black",
    "EFF6FF", "Blue 50",     "DBEAFE", "Blue 100",   "BFDBFE", "Blue 200",
    "93C5FD", "Blue 300",    "60A5FA", "Blue 400",   "3B82F6", "Blue 500",
    "2563EB", "Blue 600",    "1D4ED8", "Blue 700",   "1E40AF", "Blue 800",
    "1E3A8A", "Blue 900",
    "F0FDF4", "Green 50",    "DCFCE7", "Green 100",  "BBF7D0", "Green 200",
    "86EFAC", "Green 300",   "4ADE80", "Green 400",  "22C55E", "Green 500",
    "16A34A", "Green 600",   "15803D", "Green 700",  "166534", "Green 800",
    "14532D", "Green 900",
    "FFF1F2", "Red 50",      "FFE4E6", "Red 100",    "FECDD3", "Red 200",
    "FDA4AF", "Red 300",     "FB7185", "Red 400",    "F43F5E", "Red 500",
    "E11D48", "Red 600",     "BE123C", "Red 700",    "9F1239", "Red 800",
    "881337", "Red 900",
    "FEFCE8", "Yellow 50",   "FEF9C3", "Yellow 100", "FEF08A", "Yellow 200",
    "FDE047", "Yellow 300",  "FACC15", "Yellow 400", "EAB308", "Yellow 500",
    "CA8A04", "Yellow 600",  "A16207", "Yellow 700", "854D0E", "Yellow 800",
    "FAFAFA", "Neutral 50",  "F5F3FF", "Purple 50",  "EDE9FE", "Purple 100",
    "DDD6FE", "Purple 200",  "C4B5FD", "Purple 300", "A78BFA", "Purple 400",
    "8B5CF6", "Purple 500",  "7C3AED", "Purple 600", "6D28D9", "Purple 700",
    "FFF7ED", "Orange 50",   "FFEDD5", "Orange 100", "FED7AA", "Orange 200",
    "FDBA74", "Orange 300",  "FB923C", "Orange 400", "F97316", "Orange 500",
    "EA580C", "Orange 600",  "C2410C", "Orange 700", "9A3412", "Orange 800",
    "E0F2FE", "Sky 100",     "BAE6FD", "Sky 200",    "7DD3FC", "Sky 300",
    "38BDF8", "Sky 400",     "0EA5E9", "Sky 500",    "0284C7", "Sky 600",
    "FCE7F3", "Pink 100",    "FBCFE8", "Pink 200",   "F9A8D4", "Pink 300",
    "F472B6", "Pink 400",    "EC4899", "Pink 500",   "DB2777", "Pink 600",
  ];

  const initEditor = function () {
    if (!window.tinymce || !qs("#contentHtml")) return;
    const uploadUrl = window.CMS_UPLOAD_URL || "/admin/upload-image.php";
    window.tinymce.init({
      license_key: "gpl",
      selector: "#contentHtml",
      height: 620,
      toolbar_sticky: true,
      toolbar_sticky_offset: 64,   // matches the sticky topbar height
      menubar: "edit view insert format table tools",
      plugins:
        "lists link image table code charmap preview searchreplace visualblocks wordcount autoresize",

      // Two-row toolbar — row 2 is dedicated to table operations
      toolbar: [
        "undo redo | blocks | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright | bullist numlist | removeformat | code preview",
        "link unlink | image | table | tableprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tabledelete",
      ],

      // Floating toolbar that appears when cursor is inside a table
      table_toolbar:
        "tableprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | tabledelete",

      block_formats: "Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4",

      // ── Table colour support ──────────────────────────────────────
      table_advtab: true,        // Advanced tab in Table Properties (bgcolor, border-color)
      table_cell_advtab: true,   // Advanced tab in Cell Properties  (bgcolor)
      table_row_advtab: true,    // Advanced tab in Row Properties   (bgcolor)
      table_appearance_options: true,
      table_default_styles: { "border-collapse": "collapse", "width": "100%" },
      table_default_attributes: { border: "1" },
      table_class_list: [
        { title: "Default", value: "" },
        { title: "Striped", value: "tbl-striped" },
        { title: "Bordered", value: "tbl-bordered" },
      ],

      // ── Colour picker (used for forecolor, backcolor, and table cell bgcolor) ──
      custom_colors: true,
      color_cols: 10,
      color_map: TABLE_COLOR_MAP,
      color_default_background: "DBEAFE",

      images_upload_url: uploadUrl,
      images_upload_handler: undefined,
      automatic_uploads: true,
      relative_urls: false,
      remove_script_host: false,
      convert_urls: false,
      link_default_target: "_self",
      link_target_list: [
        { title: "Same tab", value: "_self" },
        { title: "New tab", value: "_blank" },
      ],
      image_description: true,

      // Keep inline styles for table cells so colors are preserved on the website
      valid_styles: {
        "*": "color,background-color,background,font-weight,font-style,text-decoration,text-align,padding,padding-top,padding-right,padding-bottom,padding-left,border,border-top,border-right,border-bottom,border-left,border-color,border-style,border-width,width,height,vertical-align",
      },
      extended_valid_elements:
        "table[style|class|border|cellpadding|cellspacing|width]," +
        "thead[style],tbody[style],tfoot[style]," +
        "tr[style|class]," +
        "td[style|class|colspan|rowspan|width|height]," +
        "th[style|class|colspan|rowspan|width|height|scope]",

      setup: function (editor) {
        // Tip label shown in status bar
        editor.on("init", function () {
          var bar = editor.getContainer().querySelector(".tox-statusbar__text-container");
          if (bar) {
            bar.innerHTML =
              '<span style="color:#64748b;font-size:0.75rem;">💡 Table colors: click inside a table → use Cell Properties (🎨) button to colour cells/rows/columns.</span>';
          }
        });
      },
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initEditor);
  } else {
    initEditor();
  }

  const blogForm = qs("[data-blog-form]");
  if (blogForm) {
    blogForm.addEventListener("submit", function (event) {
      if (window.tinymce) {
        window.tinymce.triggerSave();
      }
      const content = qs("#contentHtml");
      if (!content) return;
      const images = (content.value || "").match(/<img\b[^>]*>/gi) || [];
      const missing = [];
      images.forEach(function (imgTag, index) {
        const altMatch = imgTag.match(/\balt\s*=\s*("([^"]*)"|'([^']*)')/i);
        const altValue = altMatch ? (altMatch[2] || altMatch[3] || "").trim() : "";
        if (!altValue) missing.push(index + 1);
      });
      if (missing.length > 0) {
        event.preventDefault();
        window.alert(
          "Each image in blog content needs ALT text. Missing ALT in image #" +
            missing.join(", ")
        );
      }
    });
  }

  // ── Live SERP / SEO Preview ──────────────────────────────────────────────
  (function () {
    var siteOrigin = window.location.origin || "";

    var serpTitle  = qs("#serpTitle");
    var serpDesc   = qs("#serpDesc");
    var serpUrl    = qs("#serpUrl");
    var serpTLen   = qs("#serpTitleLen");
    var serpDLen   = qs("#serpDescLen");
    var serpHint   = qs("#kwDensityHint");

    var metaTitleEl = qs("#metaTitle");
    var metaDescEl  = qs("#metaDescription");
    var slugEl      = qs("[data-slug-input]");
    var kwEl        = qs("#primaryKeyword");
    var titleEl     = qs("[data-title-input]");

    if (!serpTitle) return; // only run on blog-form page

    function truncate(str, max) {
      str = String(str || "");
      if (str.length <= max) return str;
      return str.slice(0, max - 1) + "…";
    }

    function updateSerp() {
      var title    = (metaTitleEl ? metaTitleEl.value : "") || (titleEl ? titleEl.value : "");
      var desc     = metaDescEl  ? metaDescEl.value  : "";
      var slug     = slugEl      ? slugEl.value       : "";
      var kw       = (kwEl       ? kwEl.value         : "").trim().toLowerCase();

      var displayUrl = siteOrigin + "/blogs/" + (slug || "your-blog-slug");

      if (serpUrl)   serpUrl.textContent   = displayUrl;
      if (serpTitle) {
        serpTitle.textContent = truncate(title || "Blog Title will appear here", 60);
        serpTitle.classList.toggle("over", title.length > 60);
      }
      if (serpDesc)  serpDesc.textContent  = truncate(desc || "Meta description will appear here…", 160);
      if (serpTLen)  serpTLen.textContent  = String(title.length);
      if (serpDLen)  serpDLen.textContent  = String(desc.length);

      // Keyword density hint (rough – from metaTitle + metaDesc)
      if (serpHint && kw) {
        var corpus = ((title || "") + " " + (desc || "")).toLowerCase();
        var words  = corpus.split(/\s+/).filter(Boolean);
        var kwWords = kw.split(/\s+/).filter(Boolean);
        if (words.length > 0 && kwWords.length > 0) {
          // count phrase occurrences
          var count = 0;
          var joined = words.join(" ");
          var idx = 0;
          while ((idx = joined.indexOf(kw, idx)) !== -1) { count++; idx += kw.length; }
          var density = words.length > 0 ? ((kwWords.length * count) / words.length * 100).toFixed(1) : 0;
          var inTitle = (title || "").toLowerCase().includes(kw);
          var inDesc  = (desc  || "").toLowerCase().includes(kw);
          var msgs = [];
          if (!inTitle) msgs.push("⚠ Keyword not in meta title");
          if (!inDesc)  msgs.push("⚠ Keyword not in meta description");
          if (msgs.length === 0) {
            serpHint.textContent = "✅ Keyword \"" + kw + "\" found in title + description. Density in meta ~" + density + "%.";
            serpHint.className = "serp-hint good";
          } else {
            serpHint.textContent = msgs.join("  |  ");
            serpHint.className = "serp-hint warn";
          }
        } else {
          serpHint.textContent = "Enter a primary keyword to see density hints.";
          serpHint.className = "serp-hint";
        }
      } else if (serpHint) {
        serpHint.textContent = "Fill in Primary Keyword and meta fields to see density hint.";
        serpHint.className = "serp-hint";
      }
    }

    [metaTitleEl, metaDescEl, slugEl, kwEl, titleEl].forEach(function (el) {
      if (el) el.addEventListener("input", updateSerp);
    });
    updateSerp();
  })();

})();
