jQuery(document).ready(function ($) {

  // Code for blog social share
  jsSocials.shares.x_twitter = {
    label: "Post on X",
    logo: "x-twitter-icon",
    shareUrl: "https://x.com/intent/post?text={text}&url={url}",
    countUrl: "",
    shareIn: "blank",
  };

  jsSocials.shares.instagram = {
    label: "Share on Instagram",
    logo: "instagram-icon",
    shareUrl: "https://www.instagram.com/?url={url}",
    countUrl: "",
    shareIn: "blank",
  };

  jsSocials.shares.copy_link = {
    label: "Copy Link",
    logo: "fa fa-link", // Font Awesome link icon
    shareUrl: "#", // Set to "#" to prevent refresh
    countUrl: "",
    shareIn: "self", // No new tab
  };

  if ($("#share").length) {
    $("#share").jsSocials({
      showLabel: false,
      showCount: false,
      shares: [
        "facebook",
        "x_twitter",
        "linkedin",
        "instagram",
        "copy_link",
      ],
    });
    $(".jssocials-share-link").attr("aria-label", "Follow us on social media");
  }

  // Handle Copy Link Click Separately
  $(document).on("click", ".jssocials-share-copy_link a", function (e) {
    e.preventDefault();
    navigator.clipboard
      .writeText(window.location.href)
      .then(() => {
        alert("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Clipboard copy failed: ", err);
        alert("Failed to copy link. Please copy manually.");
      });
  });

  if ($(".bandLayout").length) {
    const $paragraphs = $(".blogContent");
    if ($paragraphs.length) {
      $(".bandLayout").insertAfter($paragraphs.last());
    }
  }

  if ($(".blog-details-mobile-lead-form").length) {
    if ($(".blog-details-mobile-lead-form").length > 0) {
      $(".blog-details-mobile-lead-form").insertAfter($(".blogContent p:eq(1)"));
    }
  }

  $(document).ready(checkBannerVisibility);
  $(document).on("scroll", checkBannerVisibility);

  if ($(".testimonial").length) {
    if ($(".blogContent p").length > 0) {
      let lastPara = $(".blogContent p").last();
      $(".testimonial").insertBefore(lastPara);
    }
  }

  if ($(window).width() < 993) {
    $(".desktop-des").hide();
    $(document).on("click", ".blog-read-more", function () {
      if ($(".brief-info.mobile-des").css("display") === "block") {
        $(this).text("...Show More");
        $(".mobile-des").hide();
        $(".desktop-des").show();
        $(".desktop-des").append(
          '<span class="blog-read-more">Show less</span>'
        );
      } else {
        $(".mobile-des").show();
        $(".desktop-des").hide();
        $(".desktop-des .blog-read-more").remove();
      }
    });
  }
  setTimeout(() => {
    if ($('.ez-toc-pull-right').length) {
      $('.ez-toc-pull-right').attr('href', '');
    }
  }, 1000);
});


// Code for blog detail read the blog section
document.addEventListener("DOMContentLoaded", function () {
  let speech = null;
  let isPaused = false;
  let text = "";
  let charIndex = 0;
  let cps = 15;
  let duration = 0;
  let currentTime = 0;
  let interval = null;
  let speechRate = 1;
  const speedLevels = [1, 1.5, 2];

  // Function to clean up speech and intervals
  function cleanupSpeech() {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    speech = null;
    isPaused = false;
    updatePlayButton(false);
  }

  // Clean up when page is unloaded
  window.addEventListener("beforeunload", cleanupSpeech);
  window.addEventListener("unload", cleanupSpeech);

  setTimeout(() => {
    let textElement = document.querySelector(".blogContent");
    if (textElement) {
      text = textElement.innerText.trim();
      duration = Math.ceil(text.length / cps);
    }
  }, 1000);

  function startSpeech(startFrom = 0) {
    if (!text) {
      console.error("No text found to read.");
      return;
    }

    // Clean up any existing speech first
    cleanupSpeech();

    speech = new SpeechSynthesisUtterance(text.substring(startFrom));
    speech.lang = "en-US";
    speech.rate = speechRate;
    speech.volume = 1;
    speech.pitch = 1;

    speech.onboundary = function (event) {
      charIndex = startFrom + event.charIndex;
      currentTime = Math.floor(charIndex / cps);
      updateProgress();
    };

    speech.onend = function () {
      updatePlayButton(false);
      isPaused = false;
      charIndex = 0;
      clearInterval(interval);
      interval = null;
    };

    // Fix for Mobile
    setTimeout(() => {
      window.speechSynthesis.speak(speech);
    }, 200);

    updatePlayButton(true);
    isPaused = false;
    interval = setInterval(updateProgress, 1000);
  }

  function pauseSpeech() {
    window.speechSynthesis.pause();
    updatePlayButton(false);
    isPaused = true;
    clearInterval(interval);
    interval = null;
  }

  function resumeSpeech() {
    window.speechSynthesis.resume();
    updatePlayButton(true);
    isPaused = false;
    interval = setInterval(updateProgress, 1000);
  }

  function rewindSpeech() {
    charIndex = Math.max(0, charIndex - cps * 5);
    startSpeech(charIndex);
  }

  function forwardSpeech() {
    charIndex = Math.min(text.length, charIndex + cps * 5);
    startSpeech(charIndex);
  }

  function updateProgress() {
    if (!text) return;

    let progressPercent = (charIndex / text.length) * 100;
    document.getElementById("progress").style.width = progressPercent + "%";

    let min = Math.floor(currentTime / 60);
    let sec = currentTime % 60;
    let durationMin = Math.floor(duration / 60);
    let durationSec = duration % 60;

    document.getElementById("timeDisplay").innerText = `${min}:${sec < 10 ? "0" + sec : sec
      } / ${durationMin}:${durationSec < 10 ? "0" + durationSec : durationSec}`;
  }

  function updatePlayButton(isPlaying) {
    let playButton = document.getElementById("playPauseButton");
    if (!playButton) return;

    let playImg = playButton.querySelector("img");
    if (!playImg) return;

    if (isPlaying) {
      playImg.src = playButton.getAttribute("data-pause");
    } else {
      playImg.src = playButton.getAttribute("data-play");
    }
  }

  // Event listeners with null checks
  const playButton = document.getElementById("playPauseButton");
  if (playButton) {
    playButton.addEventListener("click", function () {
      if (!speech || !window.speechSynthesis.speaking) {
        startSpeech(charIndex);
      } else if (isPaused) {
        resumeSpeech();
      } else {
        pauseSpeech();
      }
    });
  }

  const rewindButton = document.getElementById("rewindButton");
  if (rewindButton) {
    rewindButton.addEventListener("click", rewindSpeech);
  }

  const forwardButton = document.getElementById("forwardButton");
  if (forwardButton) {
    forwardButton.addEventListener("click", forwardSpeech);
  }

  const speedButton = document.getElementById("speedButton");
  if (speedButton) {
    speedButton.addEventListener("click", function () {
      let currentIndex = speedLevels.indexOf(speechRate);
      speechRate = speedLevels[(currentIndex + 1) % speedLevels.length];
      const speedLabel = document.getElementById("speedLabel");
      if (speedLabel) {
        speedLabel.innerText = speechRate + "X";
      }

      if (speech && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        startSpeech(charIndex);
      }
    });
  }
});

$(document).ready(function () {
  setTimeout(function () {
    const $slider = $(".top-course-slider");
    const cardlength = $slider.find('.line-item').length;
    if (cardlength <= 4) {
      $slider.find('.slick-dots').css("display", "none");
    } else {
      $slider.find('.slick-dots').css("display", "block");
    }
  }, 100);
});

function checkBannerVisibility() {
  if ($(window).width() > 992) {
    return;
  }
  const progbanner = $(".current-blog");
  const footerprogenrollButton = $(".mobileWidgetBottom");
  if (footerprogenrollButton.length === 0) {
    return;
  }
  if (progbanner.length === 0) {
    footerprogenrollButton[0].style.setProperty('display', 'block', 'important');
    return;
  }
  const progbannerBottom = progbanner[0].getBoundingClientRect().bottom;
  if (progbannerBottom <= 0) {
    footerprogenrollButton[0].style.setProperty('display', 'block', 'important');
  } else {
    footerprogenrollButton[0].style.setProperty('display', 'none', 'important');
  }
}

// Script for blog detail page desktop table of content accordion
// Blog detail page TOC script (Desktop)
document.addEventListener("DOMContentLoaded", function () {

  if (window.innerWidth < 992) return;

  const tocWrapper = document.querySelector(".right #ez-toc-container");
  if (!tocWrapper) return;

  const tocList = tocWrapper.querySelector(".ez-toc-list");
  const tocToggle = tocWrapper.querySelector(".ez-toc-icon-toggle-span");

  // -------------------------------
  // FORCE TOC OPEN ON PAGE LOAD
  // -------------------------------
// FORCE TOC OPEN AFTER EZ-TOC INITIALIZES
setTimeout(function () {

  const tocList = tocWrapper.querySelector(".ez-toc-list");

  if (tocList) {
    tocList.style.display = "block";
  }

  tocWrapper.classList.remove("ez-toc-collapsed");

}, 300);

  // -------------------------------
  // ACCORDION FOR SUB ITEMS
  // -------------------------------
  const allLis = tocWrapper.querySelectorAll("li");

  allLis.forEach(function (li) {

    const childUl = li.querySelector(":scope > ul");
    const link = li.querySelector(":scope > a");

    if (childUl && link) {

      const arrow = document.createElement("span");
      arrow.className = "toc-arrow";

      link.after(arrow);

      arrow.addEventListener("click", function (e) {

        e.preventDefault();
        e.stopPropagation();

        // close others
        allLis.forEach(function (otherLi) {
          if (otherLi !== li) {
            otherLi.classList.remove("toc-open");
          }
        });

        // toggle current
        li.classList.toggle("toc-open");

      });
    }

  });

  // -------------------------------
  // AUTO COLLAPSE AT END OF BLOG
  // -------------------------------
  const tocLinks = tocWrapper.querySelectorAll("li > a");
  if (!tocLinks.length) return;

  const lastLink = tocLinks[tocLinks.length - 1];
  const targetId = lastLink.getAttribute("href");

  if (!targetId || !targetId.startsWith("#")) return;

  const lastHeading = document.querySelector(targetId);
  if (!lastHeading) return;

  function getLastSectionEnd() {

    const nextEl = lastHeading.nextElementSibling;

    if (!nextEl) {
      return lastHeading.getBoundingClientRect().bottom;
    }

    return nextEl.getBoundingClientRect().bottom;

  }

  let isCollapsed = false;

  window.addEventListener("scroll", function () {

    const sectionBottom = getLastSectionEnd();
    const viewportHeight = window.innerHeight;

    // collapse TOC
    if (sectionBottom <= viewportHeight && !isCollapsed) {

      if (tocToggle) tocToggle.click();
      isCollapsed = true;

    }

    // expand again
    if (sectionBottom > viewportHeight + 150 && isCollapsed) {

      if (tocToggle) tocToggle.click();
      isCollapsed = false;

    }

  });

});
