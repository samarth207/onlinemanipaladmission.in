// ===== Scrollbar Toggle Helper =====
function toggleBodyScroll(toggle) {
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  const header = document.querySelector("header");

  if (toggle) {
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollbarWidth}px`;
    if (header) header.style.width = `calc(100% - ${scrollbarWidth}px)`;
  } else {
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    if (header) header.style.width = "";
  }
}

// ===== Header Menus =====
// document.addEventListener("DOMContentLoaded", () => {
  const overlaymenu = document.getElementById("overlay");
  const popups = document.querySelectorAll(".popup");
  const menuLinks = document.querySelectorAll(".menu-item.has-submenu .menu-text");

  // Hide all submenus initially
  document.querySelectorAll(".submenu").forEach(submenu => {
    submenu.style.display = "none";
  });

  menuLinks.forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      const parentItem = link.parentElement;
      const submenu = link.nextElementSibling;
      const dotContainer = document.querySelector(".blinkdot-container");

      if (dotContainer) dotContainer.style.display = "none";

      // Close all popups
      popups.forEach(popup => popup.classList.add("hidden"));
      overlaymenu.classList.remove("show");

      if (parentItem.classList.contains("active")) {
        parentItem.classList.remove("active");
        submenu.style.display = "none";
        if (submenu.classList.contains("megamenu")) {
          overlaymenu.classList.remove("show");
          toggleBodyScroll(false);
        }
      } else {
        document.querySelectorAll(".menu-item.has-submenu").forEach(item => {
          item.classList.remove("active");
          const sub = item.querySelector(".submenu");
          if (sub) sub.style.display = "none";
        });

        toggleBodyScroll(false);
        parentItem.classList.add("active");
        submenu.style.display = "flex";

        if (submenu.classList.contains("megamenu")) {
          overlaymenu.classList.add("show");
          toggleBodyScroll(true);
        }
      }
    });
  });

  // Close submenu when clicking outside
  document.addEventListener("click", e => {
    if (!e.target.closest(".header") && !e.target.closest(".menu-item")) {
      document.querySelectorAll(".submenu").forEach(sub => (sub.style.display = "none"));
      document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));

      const dotContainer = document.querySelector(".blinkdot-container");
      const banner = document.querySelector(".home-banner");

      if (dotContainer) {
        if (banner) {
          const bannerBottom = banner.getBoundingClientRect().bottom;
          dotContainer.style.display = bannerBottom > 0 ? "flex" : "none";
        } else {
          if (!document.querySelector(".course-overview")) {
            dotContainer.style.display = "flex";
          }
        }
      }
    }
  });
// });

// ===== Scroll + Enroll Button + Dot Logic =====
document.addEventListener("DOMContentLoaded", () => {
  const banner = document.querySelector(".home-banner");
  const enrollButton = document.querySelector(".top-enroll");
  const footerenrollButton = document.querySelector(".mobileWidgetBottom");
  const dotContainer = document.querySelector(".blinkdot-container");
  const pathName = window.location.pathname;

  if (pathName !== "/online-bba-v2") {
    if (banner) {
      if (dotContainer) dotContainer.style.display = "flex";

      document.addEventListener("scroll", () => {
        const bannerBottom = banner.getBoundingClientRect().bottom;
        if (bannerBottom <= 0) {
          if (dotContainer) dotContainer.style.display = "none";
          if (enrollButton) enrollButton.style.display = "block";
          if (footerenrollButton && window.innerWidth <= 992) {
            footerenrollButton.style.display = "block";
          }
        } else {
          if (dotContainer) dotContainer.style.display = "flex";
          if (enrollButton) enrollButton.style.display = "none";
          if (footerenrollButton && window.innerWidth <= 992) {
            footerenrollButton.style.display = "none";
          }
        }
      });
    } else {
      if (dotContainer) dotContainer.style.display = "flex";
      if (enrollButton) enrollButton.style.display = "block";
      if (footerenrollButton && window.innerWidth <= 992) {
        footerenrollButton.style.display = "block";
      }
    }
  }
});

// ===== Popup Functionality =====
const overlay = document.getElementById("overlay");

document.addEventListener("click", e => {
  if (e.target && e.target.classList.contains("show-popup")) {
    const whichpopup = e.target.getAttribute("data-showpopup");
    showPopup(whichpopup);
  }
});

function showPopup(whichpopup) {
  document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
  const newPopup = document.getElementById(whichpopup);
  if (newPopup) newPopup.classList.remove("hidden");
  overlay.classList.add("show");
  document.querySelectorAll(".submenu").forEach(sub => (sub.style.display = "none"));
  document.querySelectorAll(".menu-item").forEach(item => item.classList.remove("active"));
  toggleBodyScroll(true);
}

document.addEventListener("click", e => {
  if (e.target && e.target.classList.contains("close-btn")) {
    const whichpopup = e.target.parentElement.id;
    closePopup(whichpopup);
  }
});

function closePopup(whichpopup) {
  const popup = document.getElementById(whichpopup);
  overlay.classList.remove("show");
  if (popup) popup.classList.add("hidden");
  toggleBodyScroll(false);
}

if (overlay) {
  overlay.addEventListener("click", () => {
    overlay.classList.remove("show");
    document.querySelectorAll(".popup").forEach(p => p.classList.add("hidden"));
    toggleBodyScroll(false);
  });
}

// ===== Mobile Menu =====
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenu = document.querySelector(".mobile-menu");
  const body = document.body;
  const headerOverlay = document.querySelector(".header-overlay");
  const topEnroll = document.querySelector(".top-enroll");
  const hamburgerIcon = document.querySelector(".hamburger");
  const baseURL = `${window.location.protocol}//${window.location.host}/`;

  function showScreen(screenClass) {
    document.querySelectorAll(".screen").forEach(s => {
      s.style.display = "none";
      s.classList.remove("active");
    });
    const target = document.querySelector(`.${screenClass}`);
    if (target) {
      target.style.display = "block";
      target.classList.add("active");
    }

    if (screenClass === "filterSearch-screen") {
      const headerSearch = document.querySelector(".header-search");
      if (headerSearch) headerSearch.style.display = "none";
    } else {
      const headerSearch = document.querySelector(".header-search");
      if (headerSearch) headerSearch.style.display = "flex";
    }
  }

  function openMobileNav() {
    mobileMenu.classList.toggle("show");
    body.classList.toggle("overflow-hidden");
    headerOverlay.classList.toggle("show");
    if (topEnroll) topEnroll.classList.toggle("hidden");

    if (hamburgerIcon) {
      const currentSrc = hamburgerIcon.getAttribute("src");
      const newSrc = currentSrc.includes("ham-menu.svg")
        ? baseURL + "wp-content/themes/flamingo/assets/images/icons/ham-close.svg"
        : baseURL + "wp-content/themes/flamingo/assets/images/icons/ham-menu.svg";
      hamburgerIcon.setAttribute("src", newSrc);
    }

    if (mobileMenu.classList.contains("show")) {
      showScreen("menu-screen");
    }
  }

  const menuItems = document.querySelectorAll(".menu > li");
  menuItems.forEach(item => {
    item.addEventListener("click", e => {
      e.stopPropagation();
      document.querySelectorAll(".submenu").forEach(sub => {
        if (sub !== item.querySelector(".submenu")) {
          sub.classList.remove("active");
          sub.style.display = "none";
        }
      });
      document.querySelectorAll(".menu > li").forEach(li => {
        if (li !== item) li.classList.remove("active");
      });

      const submenu = item.querySelector(".submenu");
      if (submenu) {
        const isActive = submenu.classList.contains("active");
        submenu.classList.toggle("active");
        submenu.style.display = isActive ? "none" : "block";
      }
      item.classList.toggle("active");
    });
  });

  document.querySelectorAll("[data-target]").forEach(btn => {
    btn.addEventListener("click", () => {
      const targetScreen = btn.getAttribute("data-target");
      showScreen(targetScreen);
    });
  });

  document.querySelectorAll(".back-button").forEach(btn => {
    btn.addEventListener("click", () => {
      const backScreen = btn.getAttribute("data-back");
      showScreen(backScreen);
      const searchInput = document.getElementById("header-search");
      if (searchInput) searchInput.value = "";
    });
  });

  window.openMobileNav = openMobileNav; // keep global for toggle
});
