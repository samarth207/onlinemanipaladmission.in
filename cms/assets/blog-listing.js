(function () {
  "use strict";

  var cards = Array.prototype.slice.call(document.querySelectorAll(".course-card"));
  var pagination = document.querySelector("[data-pagination]");
  if (!cards.length || !pagination) {
    return;
  }

  var searchInput = document.getElementById("blogSearch");
  var categoryLinks = Array.prototype.slice.call(document.querySelectorAll(".blog-cat[data-category]"));
  var noResults = document.querySelector("[data-no-results]");

  var state = {
    query: "",
    category: "all",
    page: 1,
    perPage: 12,
    filtered: cards.slice(),
  };

  function normalize(value) {
    return String(value || "").toLowerCase().trim();
  }

  function getCardCategories(card) {
    return String(card.dataset.categories || "")
      .split("|")
      .map(function (item) {
        return normalize(item);
      })
      .filter(Boolean);
  }

  function matches(card) {
    var query = normalize(state.query);
    var category = normalize(state.category);
    var title = normalize(card.dataset.title);
    var excerpt = normalize(card.dataset.excerpt);
    var categories = getCardCategories(card);
    var categoryLabels = normalize(card.dataset.categoryLabels);

    var matchesQuery =
      !query ||
      title.indexOf(query) > -1 ||
      excerpt.indexOf(query) > -1 ||
      categoryLabels.indexOf(query) > -1 ||
      categories.some(function (name) {
        return name.indexOf(query) > -1;
      });

    var matchesCategory = category === "all" || categories.indexOf(category) > -1;

    return matchesQuery && matchesCategory;
  }

  function pageTokens(totalPages, currentPage) {
    var out = [];
    if (totalPages <= 7) {
      for (var i = 1; i <= totalPages; i += 1) {
        out.push(i);
      }
      return out;
    }

    out.push(1);

    if (currentPage > 4) {
      out.push("...");
    }

    var start = Math.max(2, currentPage - 1);
    var end = Math.min(totalPages - 1, currentPage + 1);

    if (currentPage <= 4) {
      start = 2;
      end = 4;
    } else if (currentPage >= totalPages - 3) {
      start = totalPages - 3;
      end = totalPages - 1;
    }

    for (var page = start; page <= end; page += 1) {
      out.push(page);
    }

    if (currentPage < totalPages - 3) {
      out.push("...");
    }

    out.push(totalPages);
    return out;
  }

  function renderPagination(totalPages) {
    pagination.innerHTML = "";
    if (totalPages <= 1) {
      return;
    }

    var prev = document.createElement("span");
    prev.className = "nav prev" + (state.page === 1 ? " disabled" : "");
    prev.dataset.next = "0";
    prev.textContent = "<";
    pagination.appendChild(prev);

    pageTokens(totalPages, state.page).forEach(function (token) {
      if (token === "...") {
        var ellipsis = document.createElement("span");
        ellipsis.className = "ellipsis";
        ellipsis.textContent = "...";
        pagination.appendChild(ellipsis);
        return;
      }

      var page = document.createElement("span");
      page.className = "page" + (token === state.page ? " current" : "");
      page.dataset.page = String(token);
      page.textContent = String(token);
      pagination.appendChild(page);
    });

    var next = document.createElement("span");
    next.className = "nav next" + (state.page === totalPages ? " disabled" : "");
    next.dataset.next = "1";
    next.textContent = ">";
    pagination.appendChild(next);
  }

  function renderCards() {
    var total = state.filtered.length;
    var totalPages = Math.max(1, Math.ceil(total / state.perPage));
    if (state.page > totalPages) {
      state.page = totalPages;
    }

    var start = (state.page - 1) * state.perPage;
    var end = start + state.perPage;

    cards.forEach(function (card) {
      card.style.display = "none";
    });

    state.filtered.slice(start, end).forEach(function (card) {
      card.style.display = "block";
    });

    if (noResults) {
      noResults.hidden = total !== 0;
    }

    renderPagination(totalPages);
  }

  function applyFilters() {
    state.filtered = cards.filter(matches);
    state.page = 1;
    renderCards();
  }

  function setActiveCategory(link) {
    categoryLinks.forEach(function (item) {
      item.classList.remove("active");
    });
    link.classList.add("active");
  }

  if (searchInput) {
    searchInput.addEventListener("input", function (event) {
      state.query = event.target.value || "";
      applyFilters();
    });
  }

  categoryLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      state.category = link.dataset.category || "all";
      setActiveCategory(link);
      applyFilters();
    });
  });

  pagination.addEventListener("click", function (event) {
    var target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (target.classList.contains("page")) {
      var toPage = Number(target.dataset.page || "1");
      if (toPage > 0) {
        state.page = toPage;
        renderCards();
        return;
      }
    }

    if (target.classList.contains("nav") && !target.classList.contains("disabled")) {
      var isNext = target.dataset.next === "1";
      state.page = isNext ? state.page + 1 : state.page - 1;
      renderCards();
    }
  });

  renderCards();
})();
