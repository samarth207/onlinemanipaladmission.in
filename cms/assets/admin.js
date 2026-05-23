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

  const initEditor = function () {
    if (!window.tinymce || !qs("#contentHtml")) return;
    const uploadUrl = window.CMS_UPLOAD_URL || "/admin/upload-image.php";
    window.tinymce.init({
      selector: "#contentHtml",
      height: 520,
      menubar: "edit view insert format table tools",
      plugins:
        "lists link image table code charmap preview searchreplace visualblocks wordcount autoresize",
      toolbar:
        "undo redo | blocks | bold italic | bullist numlist | link unlink | image table | alignleft aligncenter alignright | removeformat code preview",
      block_formats: "Paragraph=p;Heading 2=h2;Heading 3=h3;Heading 4=h4",
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
      setup: function (editor) {
        editor.on("BeforeSetContent", function () {});
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
})();
