jQuery(document).ready(function ($) {

  // if ($(window).width() < 800) {
  $(".toggleText").on("click", function () {
    let $this = $(this);
    let $parent = $this.closest(".content");

    let $dots = $parent.find(".dots");
    let $more = $parent.find(".more");

    if ($more.is(":visible")) {
      $more.hide();
      $dots.show();
      $this.text(" Read more");
    } else {
      $more.show();
      $dots.hide();
      $this.text(" Read less");
    }
  });
  // }
  const width = $(window).width();
  if ($(window).width() < 575) {
    var count = $(".mobile-des").length;
    var textContent = $(".desktop-des").text();
    if (($(window).width() <= 390)) {
      var banner_height = '560px';
      var text_height = 400;
    } else {
      var banner_height = '600px';
      var text_height = 400;
    }
    $(document).on("click", ".read-more", function () {
      if ($(".description.mobile-des").css("display") === "block") {
        $(this).html("...<span>Read more</span>");
        $('.mobile-des').hide();
        $('.desktop-des').show();
        var bannerContent = $(".banner-details").height();
        bannerHeight = text_height + bannerContent;
        $('.institution-banner-sec.SMU').css('height', bannerHeight + 'px');
        $('.institution-banner-sec.MUJ').css('height', bannerHeight + 'px');
        $(".desktop-des p:last").append('<span class="read-more">  <span>Read less</span></span>');
      } else {
        $('.mobile-des').show();
        $('.desktop-des').hide();
        $('.institution-banner-sec.SMU').css('height', banner_height);
        $('.institution-banner-sec.MUJ').css('height', banner_height);
        $(".desktop-des p:last .read-more").remove();
      }
    });
  }

  //Get University 
  var univercityId = document.getElementById("university");
  var univercityName = univercityId.getAttribute("data-args");
  if (univercityName == 'SMU') {
    $('.mahe-card').show();
    $('.muj-card').show();
    $('.smu-card').hide();
  } else if (univercityName == 'MUJ') {
    $('.mahe-card').show();
    $('.muj-card').hide();
    $('.smu-card').show();
  } else if (univercityName == 'MAHE') {
    $('.mahe-card').hide();
    $('.muj-card').show();
    $('.smu-card').show();
  }

  $("#seeMore").click(function () {
    $("#extraText").removeClass("hidden");
    $(this).hide();
  });

  $("#seeLess").click(function () {
    $("#extraText").addClass("hidden");
    $("#seeMore").show();
  });

  $(document).on('click', '.read-more-btn', function () {
    const wrapper = $(this).closest('.faculty-desc');
    wrapper.find('.description-wrap').hide();
    wrapper.find('.full-description').show();
  });

  $(document).on('click', '.read-less-btn', function () {
    const wrapper = $(this).closest('.faculty-desc');
    wrapper.find('.full-description').hide();
    wrapper.find('.description-wrap').show();
  });

  let currentPercentage = 13; // Start from 13%
  let intervalId;
  let validPercentages = [13, 10, 9, 8, 6, 5, 4, 3, 2, 1]; // Reversed order for auto highlight (SMU)
  if (window.location.pathname == '/institution/manipal-university-jaipur') {
    validPercentages = [13, 11, 9, 8, 7, 6, 5, 4, 3, 2, 1]; // Reversed order for auto highlight
  }
  let isHovering = false;
  let isSectionInView = false;

  function highlightPercentage(percentage) {
    $('.label').removeClass('highlighted');
    $('.india-map path').removeClass('active');

    const $labelToHighlight = $(`.label[data-percentage="${percentage}"]`);
    if ($labelToHighlight.length) {
      $labelToHighlight.addClass('highlighted');
      $(`.india-map path[data-percentage="${percentage}"]`).addClass('active');
    }
  }

  function clearHighlights() {
    $('.label').removeClass('highlighted');
    $('.india-map path').removeClass('active');
  }

  function startAutoHighlight() {
    if (!isSectionInView) return; // Don't start auto-highlight unless section is in view

    intervalId = setInterval(() => {
      if (!isHovering) {
        const currentIndex = validPercentages.indexOf(currentPercentage);
        const nextIndex = (currentIndex + 1) % validPercentages.length;
        currentPercentage = validPercentages[nextIndex];
        highlightPercentage(currentPercentage);
      }
    }, 5000);
  }

  function stopAutoHighlight() {
    clearInterval(intervalId);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        isSectionInView = true;
        currentPercentage = 12;
        highlightPercentage(currentPercentage);
        startAutoHighlight();
      } else {
        isSectionInView = false;
        clearHighlights();
        stopAutoHighlight();
      }
    });
  }, { threshold: 0.5 });

  $(document).ready(() => {
    const section = document.querySelector('.india-map');
    if (section) {
      observer.observe(section);
    }

    highlightPercentage(currentPercentage);
    enableHoverHighlight();
  });

  function enableHoverHighlight() {
    $('.label').on('mouseenter', function () {
      isHovering = true;
      const percentage = $(this).data('percentage');
      highlightPercentage(percentage);
    });

    $('.label').on('mouseleave', function () {
      isHovering = false;
      clearHighlights();
    });
  }

});

// leading result section count

document.addEventListener("DOMContentLoaded", function () {
  let countElements = document.querySelectorAll(".lead-count");

  countElements.forEach(function (item, index) {
    let targetNumber = parseInt(item.dataset.number, 10); // Convert data-number to an integer
    let startNumber = 0;
    let duration = 2000; // 2 seconds animation duration
    let steps = 100; // Number of animation steps
    let increment = Math.ceil(targetNumber / steps); // Increment value per step
    let interval = setInterval(function () {
      startNumber += increment;
      if (startNumber >= targetNumber) {
        startNumber = targetNumber; // Ensure it stops exactly at target number
        clearInterval(interval);
      }
      if (index === 2 && window.location.pathname == '/institution/sikkim-manipal-university') {
        item.innerHTML = startNumber.toLocaleString() + " <span class='counter-subtext'>Lakhs+</span>"; // Normal format for others
      } else {
        item.innerHTML = startNumber.toLocaleString() + "+"; // Normal format for others
      }
    }, duration / steps);
  });
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