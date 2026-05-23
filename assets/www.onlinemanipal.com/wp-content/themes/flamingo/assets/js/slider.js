let pathName = window.location.href.split("?")[0];
const body = document.body;
// Custom Pagination for slider
const customPagination = (sliderSelector) => {
  $(sliderSelector).on('afterChange', function (event, slick, currentSlide) {
    $(sliderSelector + ' .slick-dots li').hide();
    let activeIndex = $(sliderSelector + ' .slick-dots li.slick-active').index();
    $(sliderSelector + ' .slick-dots li').eq(activeIndex).show();
    $(sliderSelector + ' .slick-dots li').eq(activeIndex - 1).show();
    $(sliderSelector + ' .slick-dots li').eq(activeIndex - 2).show();
    $(sliderSelector + ' .slick-dots li').eq(activeIndex + 1).show();
    $(sliderSelector + ' .slick-dots li').eq(activeIndex + 2).show();
  });
  $(sliderSelector).slick('slickGoTo', 0);
}


function fixAccessibilityInAllSlickSliders() {
  const allSlides = document.querySelectorAll(".slick-slide");

  allSlides.forEach((slide) => {
    const isHidden = slide.getAttribute("aria-hidden") === "true";
    slide.setAttribute("tabindex", isHidden ? "-1" : "0");
  });
}

jQuery(document).ready(function ($) {
  const width = $(window).width();

  if ($(".placement-slider").length) {
    $(".placement-slider").slick({
      slidesToShow: 3.5,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1.2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 420,
          settings: {
            slidesToShow: 1.2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
      ],
    });
    customPagination(".placement-slider")
  }


  if ($(".specialization-slider").length) {
    $(".specialization-slider").slick({
      slidesToShow: 5.5,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      variableWidth: true,
      touchThreshold: 10,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1.8,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
      ],
    });
    customPagination(".specialization-slider")
  }
  if ($(".specialization-offered-slider").length) {
    let rowCount = 4;
    if (width > 992) {
      let slideCount = $('.specialization-offered-slider').children().length;
      rowCount = slideCount >= 8 ? 2 : 1;
    }
    $(".specialization-offered-slider").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      infinite: false,
      autoplay: false,
      variableWidth: false,
      rows: rowCount,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            rows: rowCount,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            rows: 2,
            dots: true,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
            rows: 4,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
            rows: 4,
          },
        },
      ],
    });
    setTimeout(() => {
      let specializationDots = $('.specialization-offered-slider .slick-dots').children().length;
      if (specializationDots === 1) {
        $('.specialization-offered-slider .slick-dots').hide();
      }
    }, 1000);
    customPagination(".specialization-offered-slider");
  }

  if ($(".real-stories-real-impact-slider").length) {
    let rowCount = 1;
    if (width > 992) {
      let slideCount = $('.real-stories-real-impact-slider').children().length;
      rowCount = slideCount >= 8 ? 3 : 1;
    }
    var slidesCard = 3;
    if (window.location.pathname == "/learner-testimonials") {
      slidesCard = 4;
    }

    $(".real-stories-real-impact-slider").slick({
      slidesToShow: slidesCard,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      infinite: false,
      autoplay: false,
      variableWidth: false,
      rows: rowCount,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
            rows: rowCount,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            arrows: false,
            rows: rowCount,
            dots: true,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
            rows: rowCount,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
            rows: rowCount,
          },
        },
      ],
    });
    setTimeout(() => {
      let specializationDots = $('.real-stories-real-impact-slider .slick-dots').children().length;
      if (specializationDots === 1) {
        $('.real-stories-real-impact-slider .slick-dots').hide();
      }
    }, 1000);
    customPagination(".real-stories-real-impact-slider");
  }


  var colors = ["pink", "blue", "yellow", "lineGreen", "beige"];
  $(".secialization-desc").each(function (index) {
    var colorIndex = index % colors.length;
    $(this)
      .find(".left")
      .addClass("color-" + colors[colorIndex]);
  });

  // Flag to track autoplay status
  let isAutoplayEnabled = false;
  function initSlider() {
    $(".homepage-banner-slider").slick({
      dots: false,
      infinite: true,
      slidesToShow: 5,
      slidesToScroll: 3,
      autoplay: true,
      autoplaySpeed: 2500,
      arrows: false,
      initialSlide: 0,
      centerMode: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 5,
            slidesToScroll: 1,
            autoplay: true,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: isAutoplayEnabled,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            autoplay: isAutoplayEnabled,
            centerMode: false,
          },
        },
      ],
    });
  }

  initSlider();
  $(window).on('scroll', function () {
    if ($(window).width() <= 1025) {
      if ($(window).scrollTop() >= 100 && !isAutoplayEnabled) {
        isAutoplayEnabled = true;
        $('.homepage-banner-slider').slick('unslick');
        initSlider();
      }
    }
  });

  var $slider = $('.testimonial-section');
  var slidesToShowdesk, slidesToShowsmdesk, slidesToShowtab, slidesToShowmob, dotsToShow;

  if (body.classList.contains("single-post")) {
    slidesToShowdesk = 1;
    slidesToShowsmdesk = 1;
    slidesToShowtab = 1;
    slidesToShowmob = 1;
    dotsToShow = false;
  } else if (body.classList.contains("page-template-home") || body.classList.contains("page-template-home-v2")) {
    slidesToShowdesk = 4;
    slidesToShowsmdesk = 2;
    slidesToShowtab = 1.6;
    slidesToShowmob = 1.03;
    dotsToShow = true;
  } else {
    slidesToShowdesk = 4;
    slidesToShowsmdesk = 2;
    slidesToShowtab = 1.6;
    slidesToShowmob = 1.03;
    dotsToShow = true;
  }
  var rowsToUse = 1;
  if (window.location.pathname == "/placements") {
    rowsToUse = 2;
  }

  $(".testimonial-section")
    .not(".slick-initialized")
    .slick({
      slidesToShow: slidesToShowdesk,
      dots: dotsToShow,
      arrows: true,
      infinite: false,
      autoplay: false,
      rows: rowsToUse,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: slidesToShowdesk,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: slidesToShowsmdesk,
            slidesToScroll: 1,
            dots: dotsToShow,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: slidesToShowtab,
            slidesToScroll: 1,
            arrows: false,
            dots: dotsToShow,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: slidesToShowmob,
            slidesToScroll: 1,
            arrows: false,
            dots: dotsToShow,
          },
        },
      ],
    });

  customPagination(".testimonial-section");

  var checkDotsVisibility = function () {
    var currentSlidesToShow;
    var totalSlides = $slider.slick('getSlick').slideCount;

    // Get the current slidesToShow value based on screen width
    if ($(window).width() >= 1200) {
      currentSlidesToShow = slidesToShowdesk;
    } else if ($(window).width() >= 1025) {
      currentSlidesToShow = slidesToShowsmdesk;
    } else if ($(window).width() >= 900) {
      currentSlidesToShow = slidesToShowtab;
    } else {
      currentSlidesToShow = slidesToShowmob;
    }

    // If total slides are less than or equal to slidesToShow, hide the dots
    if (totalSlides <= currentSlidesToShow) {
      $('.testimonial-section .slick-dots').hide();
      $(".client-slider").length ? $('.client-slider .slick-dots').show() : '';
      $(".industries-slider").length ? $('.industries-slider .slick-dots').show() : '';
    } else {
      $('.testimonial-section .slick-dots').show();
    }
  };

  // Run the check on initialization
  checkDotsVisibility();

  // Re-run the check on window resize
  $(window).on('resize', function () {
    checkDotsVisibility();
  });



  function topOnlineCourseSliderInitialize(
    dots = true,
    slideshow = 4,
    slidestoscroll = 4, tabdots = false, tabScroll = 1, slideshowmob = 1.2, pagination = true) {
    const body = document.body;
    if (body.classList.contains("page-template-institution")) {
      tabScroll = 1;
      tabdots = true;
    }

    if (body.classList.contains("page-template-mba-degrees-generic")) {
      slideshow = 3;
      dots = false;
      tabdots = true;
      slideshowmob = 1.1;
      tabScroll = 1;
    }

    if (body.classList.contains("page-template-msc-degrees-generic") || body.classList.contains("page-template-msc-degrees-generic-v2")) {
      slideshow = 3;
      dots = false;
      tabdots = true;
      slideshowmob = 1.1;
      tabScroll = 1;
    }

    if (body.classList.contains("page-template-institution")) {
      slidestoscroll = 1;
    }

    if (body.classList.contains("page-template-lp-online-degree-courses-new") && $(window).width() > 769) {
      const cardlength = $(".top-course-slider").eq(0).find('.line-item').length;
      if (cardlength < 5) {
        dots = false;
      }
    }

    if (body.classList.contains("page-template-seo-all-courses-page") || body.classList.contains("page-template-seo-all-courses-page-v2") || body.classList.contains("page-template-seo-admission-page") || body.classList.contains("page-template-seo-syllabus-page")) {
      slideshow = 3;
      slidestoscroll = 1;
      dots = true;
      tabdots = true;
      slideshowmob = 1.1;
      tabScroll = 1;
      if ($(window).width() > 769) {
        const cardlength = $(".top-course-slider").eq(0).find('.line-item').length;
        if (cardlength <= 3) {
          dots = false;
        }
      }
    }

    if ($(".top-course-slider").length) {
      $(".top-course-slider").each(function () {
        if (!$(this).hasClass("slick-initialized")) {
          $(this).slick({
            slidesToShow: slideshow,
            slidesToScroll: slidestoscroll,
            dots: dots,
            arrows: false,
            infinite: false,
            autoplay: false,
            responsive: [
              {
                breakpoint: 1025,
                settings: {
                  slidesToShow: 4,
                  slidesToScroll: 4,
                },
              },
              {
                breakpoint: 1441,
                settings: {
                  slidesToShow: slideshow,
                  slidesToScroll: slidestoscroll,
                },
              },
              {
                breakpoint: 900,
                settings: {
                  slidesToShow: 1.8,
                  slidesToScroll: tabScroll,
                  dots: tabdots,
                  arrows: false,
                  centerMode: false,
                },
              },
              {
                breakpoint: 768,
                settings: {
                  slidesToShow: slideshowmob,
                  slidesToScroll: 1,
                  dots: true,
                  arrows: false,
                  centerMode: false,
                },
              },
              {
                breakpoint: 480,
                settings: {
                  slidesToShow: 1.1,
                  slidesToScroll: 1,
                  dots: true,
                  arrows: false,
                  centerMode: false,
                },
              },
            ],
          });
        }
      });
      if (pagination == true) {
        customPagination(".top-course-slider");
      }
    }
  }

  // Read Blog sect slider
  topOnlineCourseSliderInitialize(true);
  // Read Blog sect slider
  blogSliderInitialize(true);
  // Read Blog sect slider end

  $(document).on('click', '.btn-find-course, .quiz-link', function () {
    if ($('#find_courses_popup .top-course-slider').length) {
      $('#find_courses_popup .top-course-slider').slick('unslick');
      topOnlineCourseSliderInitialize(true, 3, 1, true, 1, 1.2, false);
    }
  });

  // Ranking accredition sect slider start
  if ($(".rank-card-container").length) {
    $(".rank-card-container").slick({
      slidesToShow: 6,
      slidesToScroll: 1,
      dots: true,
      arrows: true,
      infinite: false,
      autoplay: false,
      variableWidth: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 5.1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 5.1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2.6,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 431,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 390,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false
          },
        },
      ],
    });
    customPagination(".rank-card-container")
  }
  // Ranking accredition sect slider end

  $(".maheUniversity").click(function () {
    $(".rank-card-container.mahe").slick('refresh');
    customPagination(".rank-card-container.mahe");
  });

  $(".mujUniversity").click(function () {
    $(".rank-card-container.muj").slick('refresh');
    customPagination(".rank-card-container.muj");
  });

  $(".smuUniversity").click(function () {
    $(".rank-card-container.smu").slick('refresh');
    customPagination(".rank-card-container.smu");
  });

  //Webinar section slider start
  if ($(".webinar-card-item").length) {
    $(".webinar-card-item").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 376,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
      ],
    });
    customPagination(".webinar-card-item");
  }
  //Webinar slider end

  //Webinar section slider start
  if ($(".webinar-card-item-slider").length) {
    $(".webinar-card-item-slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 376,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
      ],
    });
    customPagination(".webinar-card-item-slider");
  }
  //Webinar slider end

  //Journey of excellence slider
  if ($(".top-Journey-of-excellence").length) {
    $(".top-Journey-of-excellence").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      infinite: true,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            infinite: true,
          },
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 376,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
      ],
    });
    customPagination(".top-Journey-of-excellence");
  }

  if ($(".news-headline-cards").length) {
    $(".news-headline-cards").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 376,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
      ],
    });
    customPagination(".news-headline-cards");
  }

  if ($(".placement-section-logo-slider-new").length) {
    $(".placement-section-logo-slider-new").slick({
      slidesToShow: 3.4,
      slidesToScroll: 1,
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      responsive: [
        {
          breakpoint: 769,
          settings: {
            slidesToShow: 5.5,
            slidesToScroll: 1,
            accessibility: false,
            focusOnSelect: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 2.5,
            slidesToScroll: 1,
            accessibility: false,
            focusOnSelect: false,
          },
        },
      ],
    });
    customPagination(".placement-section-logo-slider-new");
  }
  if ($(".faculty-main").length) {
    if (window.location.pathname == "/institution/manipal-university-jaipur" ||
      window.location.pathname == "/institution/manipal-academy-of-higher-education" ||
      window.location.pathname == "/institution/sikkim-manipal-university") {
      $(".faculty-main").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: false,
        centerMode: true,
        centerPadding: 0,
        cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
        responsive: [
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              dots: true,
              arrows: false,
            },
          },
          {
            breakpoint: 481,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              dots: true,
            },
          },
        ],
      });
      customPagination(".faculty-main");
    } else {
      $(".faculty-main").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        infinite: true,
        autoplay: false,
        centerMode: true,
        centerPadding: 0,
        cssEase: "cubic-bezier(0.4, 0, 0.2, 1)",
        responsive: [
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              arrows: true,
              dots: false,
            },
          },
          {
            breakpoint: 481,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              centerMode: true,
              dots: true,
            },
          },
        ],
      });
    }
    customPagination(".faculty-main");
  }

  if (body.classList.contains("page-template-home") || body.classList.contains("page-template-home-v2") || body.classList.contains("page-template-program-listing") || body.classList.contains("page-template-program-specializations-listing")) {
    $(document).on("click", ".find-course", function () {
      $(".loading-image").css("display", "block");
      $(".choose-course-section .loading-image").css("display", "none");
      $(".find-right-course .loading-image").css("display", "none");
      var institution = $("#institution_field").val();
      if (institution == "12th") {
        var domain = $("#domain1").val();
      } else {
        var domain = $("#domain").val();
      }
      var duration = $("#duration").val();

      var type = $("#type").val();
      var course_name = $("#find_course_name").val();
      $.ajax({
        url: "/wp-admin/admin-ajax.php",
        type: "POST",
        dataType: "html",
        data: {
          action: "find_my_course_filter",
          institution: institution,
          duration: duration,
          domain: domain,
          type: type,
          course_name: course_name,
          page_url: window.location.href,
        },
        success: function (response) {
          $(".loading-image").css("display", "none");
          $("#find_courses_popup h5").text("Recommended courses");
          $("#find_courses_popup p").text(
            "Based on your answers, below are the recommended courses"
          );
          nextSection(1);
          if (!response || $.trim(response) === "") {
            $(".courseResultNew").html(
              "<span class='no-result'>No result found</span>"
            );
          } else {
            $(".courseResultNew").html(response);

            // Hide fee in find my course result if URL contains /global
            if (window.location.href.includes("/global")) {
              $(".pricing").hide();
            }

            if ($(".top-course-slider").length) {
              setTimeout(function () {
                topOnlineCourseSliderInitialize(true, 3, 1, true, 1, 1.2, false);
                if (
                  $(
                    "#find_courses_popup .top-online-course-section .slick-slide"
                  ).length == 1
                ) {
                  $(
                    "#find_courses_popup .top-online-course-section .slick-dots"
                  ).css("display", "none");
                } else {
                  $(
                    "#find_courses_popup .top-online-course-section .slick-dots"
                  ).css("display", "block");
                }
              }, 100);
            }
          }
        },
      });
    });
  }

  let windowWidth = $(window).width();
  if (windowWidth >= 1270 && windowWidth < 1910) {
    if (window.location.pathname == "/placements") {
      var slidesToShowJob = 5;
    } else {
      var slidesToShowJob = 4;
    }
  } else if (windowWidth <= 480) {
    if (window.location.pathname == "/placements") {
      var slidesToShowJobMobile = 2;
    } else {
      var slidesToShowJobMobile = 1.9;
    }
  } else {
    if (window.location.pathname == "/placements") {
      var slidesToShowJob = 6;
    } else {
      var slidesToShowJob = 5;
    }

  }



  if (body.classList.contains("page-template-placement")) {

    if ($(".industries-slider").length) {
      $(".industries-slider").slick({
        slidesToShow: 4,
        slidesToScroll: 1,
        rows: 2,
        slidesPerRow: 1,
        dots: true,
        arrows: false,
        autoplay: false,
        infinite: false,
        variableWidth: false,
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              slidesToShow: 4,
              rows: 2,
              slidesPerRow: 1,
              variableWidth: false,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
              rows: 2,
              slidesPerRow: 1,
              variableWidth: false,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
              rows: 1,
              slidesPerRow: 1,
              variableWidth: false,
            },
          },
        ],
      });

      customPagination(".industries-slider");
    }
  } else {
    if ($(".industries-slider").length) {
      $(".industries-slider").slick({
        slidesToShow: slidesToShowJob,
        slidesToScroll: 1,
        dots: true,
        arrows: false,
        autoplay: false,
        touchThreshold: 10,
        variableWidth: true,
        infinite: false,
        responsive: [
          {
            breakpoint: 1025,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
              variableWidth: true,
            },
          },
          {
            breakpoint: 900,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: true,
              variableWidth: true,
            },
          },
          {
            breakpoint: 640,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: false,
              arrows: false,
              centerMode: false,
              variableWidth: true,
            },
          },
          {
            breakpoint: 481,
            settings: {
              slidesToShow: slidesToShowJobMobile,
              slidesToScroll: 1,
              dots: true,
              arrows: false,
              centerMode: false,
              variableWidth: true,
            },
          },
          {
            breakpoint: 416,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              arrows: false,
              centerMode: false,
              variableWidth: true,
            },
          },
        ],
      });
      customPagination(".industries-slider");
    }
  }

  //certificate carousel
  if ($(".certificate-slider").length) {
    $(".certificate-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      fade: true,
      speed: 500,
      cssEase: "linear",
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 767,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
      ],
    });
  }

  $(".course-card-slider").slick({
    slidesToShow: 3,
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false
        }
      }
    ]
  });

  //alumni-slider
  if ($(".alumni-slider").length) {
    $(".alumni-slider").slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.0,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.05,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
      ],
    });
  }

  //alumni-slider
  if ($(".featured-alumni-slider").length) {
    $(".featured-alumni-slider").slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
            arrows: true,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.0,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.05,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
      ],
    });
  }

  if ($(".our-repurated-hiring-partner").length) {
    $('.our-repurated-hiring-partner').slick({
      slidesPerRow: 8,
      rows: 2,
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      dots: true,
      arrows: true,
      autoplay: false,
      autoplaySpeed: 3000,
      responsive: [
        {
          breakpoint: 1441,
          settings: {
            slidesPerRow: 6,
            rows: 2,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: true
          }
        },
        {
          breakpoint: 900,
          settings: {
            slidesPerRow: 3,
            rows: 3,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        },
        {
          breakpoint: 480,
          settings: {
            slidesPerRow: 3,
            rows: 3,
            slidesToShow: 1,
            slidesToScroll: 1,
            arrows: false
          }
        }
      ],

      onInit: function () {
        setTimeout(function () {
        }, 500);
      }
    });
    customPagination(".our-repurated-hiring-partner");
  }

  if ($(".placement-statistics-slider").length) {
    $('.placement-statistics-slider').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dots: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.7,
            slidesToScroll: 1,
            dots: true
          }
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true
          }
        }
      ]
    });
    customPagination(".placement-statistics-slider");
  }

  if ($(".curated-wrapper").length) {
    $('.curated-wrapper').slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      infinite: false,
      arrows: false,
      dots: true,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false
          }
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          }
        }
      ]
    });
    if ($(window).width() < 769) {
      var svgCode = `<svg class="doodle animate" width="704" height="750" viewBox="0 0 704 750" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-54.9999 689.063C-33.7026 689.598 19.0378 685.532 59.6205 664.986C100.203 644.44 154.442 590.152 176.488 565.576C365.596 364.613 327.389 -191.951 24.6244 -30.1532C-217.588 99.2852 218.869 498.27 386.786 565.576C554.704 632.883 982.427 758.96 1240.82 673.012C1648.24 489.157 2332.5 55.7587 1810.21 -207" stroke="white" stroke-opacity="0.4" stroke-width="95"/>
    </svg>;`
    } else {
      var svgCode = `<svg class="doodle animate" width="1721" height="510" viewBox="0 0 1721 510" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M-73.4999 689.063C-52.2026 689.598 0.537809 685.532 41.1205 664.986C81.7032 644.44 135.942 590.152 157.988 565.576C347.096 364.613 308.889 -191.951 6.12438 -30.1532C-236.088 99.2852 200.369 498.27 368.286 565.576C536.204 632.883 963.927 758.96 1222.32 673.012C1629.74 489.157 2314 55.7587 1791.71 -207" stroke="white" stroke-opacity="0.4" stroke-width="95"/>
      </svg>`;
    }

    $('.curated-wrapper .slick-list').append(svgCode);
    customPagination(".curated-wrapper");
  }

  if ($(window).width() < 769) {
    if ($(".top-university-details").length) {
      $(".top-university-details").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        infinite: false,
        autoplay: false,
        touchThreshold: 10,
        swipeToSlide: true,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            },
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 3.2,
              slidesToScroll: 1,
              dots: false,
              arrows: false,
              autoplay: false,
              variableWidth: false,
            },
          },
        ],
      });
      customPagination(".top-university-details");
    }
    $(".top-university").click(function () {
      $(".top-university-details").slick("setPosition");
      topUniversitySlider(false, 3.2);
    });
    if ($(".banner-counter").length) {
      $(".banner-counter").slick({
        slidesToShow: 3,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        infinite: false,
        autoplay: false,
        touchThreshold: 10,
        swipeToSlide: true,
        variableWidth: true,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
            },
          },
          {
            breakpoint: 769,
            settings: {
              slidesToShow: 3.2,
              slidesToScroll: 1,
              dots: false,
              arrows: false,
              autoplay: false,
              variableWidth: false,
            },
          },
          {
            breakpoint: 481,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 1,
              dots: false,
              arrows: false,
              autoplay: false,
              variableWidth: false,
            },
          },
        ],
      });
      customPagination(".banner-counter");
    }
  }

  //manipal advantage banner
  if ($(".advt-banner-slider").length) {
    $(".advt-banner-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      fade: true,
      speed: 500,
      autoplaySpeed: 2000,
      cssEase: "ease-in-out",
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            autoplay: true,
            fade: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            autoplay: true,
            fade: false,
          },
        },
      ],
    });
    customPagination(".advt-banner-slider");
  }

  if ($(".epic-u-slider").length) {
    $(".epic-u-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: false,
      infinite: true,
      autoplay: true,
      autoplaySpeed: 2000,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            infinite: true,
            autoplay: true,
          },
        },
      ],
    });
    customPagination(".epic-u-slider");
  }

  if ($(window).width() < 786) {
    $(".institution-message-slider").slick({
      slidesToShow: 1.1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      variableWidth: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            variableWidth: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            variableWidth: false,
          },
        },
      ],
    });
    customPagination(".institution-message-slider");
  }

  if (body.classList.contains("page-template-blog-listing")) {
    slidesToShow_desk = 3.01;
  } else {
    slidesToShow_desk = 3;
  }
  if ($(".learners-spotlight-slider").length) {
    $(".learners-spotlight-slider").slick({
      slidesToShow: slidesToShow_desk,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      autoplay: false,
      touchThreshold: 10,
      variableWidth: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: slidesToShow_desk,
            slidesToScroll: 1,
            variableWidth: false,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            variableWidth: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.05,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
            variableWidth: false,
          },
        },
      ],
    });
    customPagination(".learners-spotlight-slider");
  }

  //featured blog slider
  if ($(".featured-blog-slider").length) {
    $(".featured-blog-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          },
        },
      ],
    });
    customPagination(".featured-blog-slider");
  }
  if ($(".testimonial-section").length) {
    let $slider_testimonial = $('.testimonial-section');
    let $button = $('.view-more-testimonial');
    let $buttonTestimonial = $('.view-more-btn-testimonial');
    let $section = $('.testimonial-section');

    let slideCount = $slider_testimonial.find('.slick-slide').length;
    if ($(window).width() > 480) {
      var count_no = 1;
    } else {
      var count_no = 4;
    }
    if (slideCount <= count_no) {

      // Case 2: Less than or equal to 4
      $button.show();

      $section.addClass('arrow-align');

    } else {
      // Case 1: More than 4
      $button.hide();



      $slider_testimonial.on('afterChange', function (event, slick, currentSlide) {
        let slidesToShow = slick.options.slidesToShow;

        // Handle responsive breakpoints (slick might override slidesToShow dynamically)
        if (slick.breakpointSettings && slick.breakpointSettings[slick.currentBreakpoint]) {
          slidesToShow = slick.breakpointSettings[slick.currentBreakpoint].slidesToShow || slidesToShow;
        }

        if (currentSlide + slidesToShow >= slick.slideCount) {
          // last set of slides visible
          $(".testimonial-section .slick-next").addClass("next-btn");
          $(".testimonial-section .slick-prev").addClass("prev-btn");
          $button.show();
          $section.addClass('arrow-align');
          $buttonTestimonial.show();
        } else {
          $(".testimonial-section .slick-next").removeClass("next-btn");
          $(".testimonial-section .slick-prev").removeClass("prev-btn");
          $button.hide();
          $section.removeClass('arrow-align');
          $buttonTestimonial.hide();

        }
      });
    }
  }


  //featured blog slider
  if ($(".online-courses-banner-slider").length) {
    $(".online-courses-banner-slider").slick({
      slidesToShow: 1,
      slidesToScroll: 1,
      dots: false,
      arrows: false,
      infinite: false,
      autoplay: true,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            autoplay: true,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            autoplay: true,
          },
        },
      ],
    });
    customPagination(".featured-blog-slider");
  }

  //Webinar section slider start
  if ($(".webinar-card-item-slider").length) {
    $(".webinar-card-item-slider").slick({
      slidesToShow: 4,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1400,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 1500,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 800,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 2.1,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 376,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
      ],
    });
    customPagination(".webinar-card-item-slider");
  }
  //Webinar slider end
  if ($(".course-factor-slider").length) {
    $(".course-factor-slider").slick({
      slidesToShow: 2.1,
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1480,
          settings: {
            slidesToShow: 2.3,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 770,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 490,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    });
  }

});

function topOnlineCourseSliderInitialize(dots = true) {
  if ($(".top-course-slider").length) {
    if (body.classList.contains("page-template-lp-online-degree-courses-new") && $(window).width() > 769) {
      const cardlength = $(".top-course-slider").eq(0).find('.line-item').length;
      if (cardlength < 5) {
        dots = false;
      }
    }
    $(".top-course-slider").each(function () {
      if (!$(this).hasClass("slick-initialized")) {
        $(this).slick({
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: dots,
          arrows: false,
          infinite: false,
          autoplay: false,
          responsive: [
            {
              breakpoint: 1025,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
              },
            },
            {
              breakpoint: 900,
              settings: {
                slidesToShow: 1.8,
                slidesToScroll: 2,
                dots: false,
                arrows: false,
                centerMode: false,
              },
            },
            {
              breakpoint: 768,
              settings: {
                slidesToShow: 1.2,
                slidesToScroll: 1,
                dots: true,
                arrows: false,
                centerMode: false,
              },
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1.1,
                slidesToScroll: 1,
                dots: true,
                arrows: false,
                centerMode: false,
              },
            },
          ],
        });
      }
    });
    customPagination(".top-course-slider");
  }
}
function blogSliderInitialize(dots = true) {
  if ($(".top-read-blog-slider").length) {
    $(".top-read-blog-slider").slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      dots: dots,
      arrows: false,
      infinite: false,
      autoplay: false,
      variableWidth: false,
      touchThreshold: 10,
      responsive: [
        {
          breakpoint: 1025,
          settings: {
            slidesToShow: 4,
            slidesToScroll: 1,
          },
        },
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1.8,
            slidesToScroll: 1,
            dots: false,
            arrows: false,
            centerMode: false,
          },
        },
        {
          breakpoint: 481,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            centerMode: false,
          },
        },
      ],
      accessibility: false,
      onInit: function (slider) {
        slider.$slides.each(function () {
          $(this)
            .removeAttr("role tabindex aria-describedby")
            .attr("role", "none")
            .attr("aria-hidden", "false");
        });
      },
    });
    customPagination(".top-read-blog-slider");
  }
}
// const body = document.body;
if (body.classList.contains('page-template-home') || body.classList.contains('page-template-home-v2') || body.classList.contains('page-template-program-listing') || body.classList.contains("page-template-program-specializations-listing")) {
  let currentStep = 1;
  // Observe each section
  function nextSection(currentSection) {
    const current = document.getElementById(`section${currentSection}`);
    const next = document.getElementById(`section${currentSection + 1}`);

    current.classList.remove("active");
    if (next) {
      next.classList.add("active");
      currentStep++;
    }
    document.querySelector(".right-arrow-content").style.display =
      currentStep > 1 ? "flex" : "none";
  }

  document.querySelector(".right-arrow-content").style.display = "none";

  function prevSection() {
    $("#find_courses_popup h5").text("Find My Course");
    $("#find_courses_popup p").text("Answer a few quick questions and we’ll guide you to the perfect course!");
    if (currentStep > 1) {
      const current = document.getElementById(`section${currentStep}`);
      const prev = document.getElementById(`section${currentStep - 1}`);

      // Hide current section
      current.classList.remove("active");

      // Show previous section
      prev.classList.add("active");
      currentStep--;
    }

    // Disable the Back button if on the first step
    document.querySelector(".right-arrow-content").style.display =
      currentStep > 1 ? "flex" : "none";
  }
}


//Job role silder 
const $slider = $(".job-roles-slider");
let sliderInitialized = false;

let windowWidth = $(window).width();
if (windowWidth >= 1270 && windowWidth < 1910) {
  var slidesToShowJob = 5;
} else {
  var slidesToShowJob = 6;
}
function initializeSlider(rows) {
  if (!$slider.hasClass("slick-initialized")) {
    $slider.slick({
      slidesToShow: slidesToShowJob, // 3 full slides + some of the next one
      slidesToScroll: 1,
      dots: true,
      arrows: false,
      infinite: false,
      autoplay: false,
      variableWidth: true,
      centerMode: false,
      rows: rows,
      rtl: false,
      responsive: [
        {
          breakpoint: 900,
          settings: {
            slidesToShow: 2.2,
            slidesToScroll: 1,
            dots: false,
            rows: 1,
            arrows: false,
            variableWidth: true,
          },
        },
        {
          breakpoint: 640,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            rows: 1,
            arrows: false,
            variableWidth: false,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1.1,
            slidesToScroll: 1,
            dots: true,
            rows: 1,
            arrows: false,
            variableWidth: false,
          },
        },
      ],
    });

    setTimeout(() => {
      $slider.slick("setPosition");
    }, 500);
    customPagination(".job-roles-slider");
  }
}

// Tools covered slider
if ($(".toolsCovered").length) {
  $(".toolsCovered").slick({
    slidesToShow: 8,
    slidesToScroll: 2,
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1600,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 4.3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 3.3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
      {
        breakpoint: 381,
        settings: {
          slidesToShow: 2.3,
          slidesToScroll: 1,
          infinite: false,
          dots: true,
          arrows: false,
        },
      },
    ],
  });
  const $dots = $(".toolsCovered .slick-dots");
  if ($dots.find("li").length <= 1) {
    $dots.hide();
  }
  customPagination(".toolsCovered");
}

function handleResponsiveSlider() {
  let windowWidth = $(window).width();
  if (windowWidth < 640) {
    if ($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }
    setTimeout(() => initializeSlider(2), 300);
  } else {
    if ($slider.hasClass("slick-initialized")) {
      $slider.slick("unslick");
    }
    setTimeout(() => initializeSlider(1), 300);
  }
}

// Function to check if the slider is in viewport
function isElementInViewport(el) {
  let rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

// Scroll event to initialize slider when it appears in viewport
$(window).on("scroll", function () {
  if ($(".job-roles-slider").length) {
    // if (!sliderInitialized && isElementInViewport($slider[0])) {
    if (!sliderInitialized) {
      sliderInitialized = true;
      handleResponsiveSlider();
    }
  }
});

// Check on page load
$(document).ready(function () {
  if ($(".job-roles-slider").length) {
    if (isElementInViewport($slider[0])) {
      sliderInitialized = true;
      handleResponsiveSlider();
    }

  }
});
function tools_certificate_slider() {
  if ($(".tools-slider").length) {
    $(".tools-slider").slick({
      slidesToShow: 2,
      slidesToScroll: 1,
      dots: false,
      arrows: true,
      infinite: false,
      autoplay: false,
      responsive: [
        {
          breakpoint: 1200,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 1,
            dots: false,
          }
        },
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.5,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          }
        },
        {
          breakpoint: 490,
          settings: {
            slidesToShow: 1.2,
            slidesToScroll: 1,
            dots: true,
            arrows: false,
            autoplay: false,
          }
        }
      ]
    });
    customPagination(".tools-slider");
  }
}

tools_certificate_slider();

if ($(".client-slider").length) {
  $(".client-slider").slick({
    slidesToShow: 1.2,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      }
    ]
  });
  customPagination(".client-slider");
}

// Blog videos slider

if (body.classList.contains("author")) {
  sliderArrow = true;
  sliderdots = false;
  mobileArrow = false;
  mobiledots = true;
} else {
  sliderArrow = false;
  sliderdots = true;
  mobileArrow = false;
  mobiledots = true;
}
if ($(".featuredAuthorSlider").length) {
  $(".featuredAuthorSlider").slick({
    slidesToShow: 3.01,
    dots: sliderdots,
    arrows: sliderArrow,
    infinite: false,
    autoplay: false,
    sautoplaySpeed: 3000,
    speed: 800,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1.7,
          slidesToScroll: 1,
          arrows: mobileArrow,
          dots: mobiledots,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1.3,
          slidesToScroll: 1,
          dots: mobiledots,
          arrows: mobileArrow,
          centerMode: false,
        }
      },
      {
        breakpoint: 481,
        settings: {
          slidesToShow: 1.09,
          slidesToScroll: 1,
          dots: mobiledots,
          arrows: mobileArrow,
          centerMode: false,
        }
      }
    ]
  });
  customPagination(".featuredAuthorSlider");
}

$(window).on("load", function () {
  if ($(window).width() >= 768 && $(".learners-slider").length) {
    $(".learners-slider").slick({
      lazyLoad: "ondemand",
      slidesToShow: 2,
      slidesToScroll: 1,
      infinite: false,
      autoplay: false,
      dots: true,
      arrows: false,
      responsive: [
        {
          breakpoint: 992,
          settings: {
            slidesToShow: 1.5,
          }
        }
      ]
    });
    setTimeout(() => $(".learners-slider").slick("refresh"), 500);
  }
});
if (body.classList.contains("page-template-manipal-advantage")) {
  $(document).on("click", ".tools-cert-sumbit-btn", function () {
    $(".loading-image").css("display", "block");
    var domain = $(".select-domain-field").val();
    var goal = $(".select-goal-field").val();
    // alert(domain);
    $.ajax({
      url: "/wp-admin/admin-ajax.php",
      type: "POST",
      dataType: "html",
      data: {
        action: "tools_certificate",
        domain: domain,
        goal: goal,
      },
      success: function (response) {
        $(".loading-image").css("display", "none");
        if (!response || $.trim(response) === "") {
          $(".tool-slider-sec").html(
            "<span class='no-result'>No result found</span>"
          );
        } else {
          $(".tool-slider-sec").html(response);
          if ($(".tool-slider-sec").length) {
            setTimeout(function () {
              tools_certificate_slider();
              if (
                $(
                  "#find_courses_popup .top-online-course-section .slick-slide"
                ).length == 1
              ) {
                $(
                  "#find_courses_popup .top-online-course-section .slick-dots"
                ).css("display", "none");
              } else {
                $(
                  "#find_courses_popup .top-online-course-section .slick-dots"
                ).css("display", "block");
              }
            }, 100);
          }
        }
      },
    });
  });
}

if ($(".benefits-slider").length) {
  $(".benefits-slider").slick({
    slidesToShow: 2.5,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      }
    ]
  });
  customPagination(".benefits-slider")
}

if ($(".testmonial-slider-block").length) {
  $(".testmonial-slider-block").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: false,
    arrows: true,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 10000,
    vertical: true,
    verticalSwiping: true,
    asNavFor: '.details-block-slider',
    focusOnSelect: true,
    responsive: [
      {
        breakpoint: 769,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: false,
          arrows: true,
          centerMode: false,
          vertical: false,
          verticalSwiping: false,
          autoplay: false,
          infinite: true,
        }
      },
    ]
  });
}

if ($(".details-block-slider").length) {
  $(".details-block-slider").slick({
    slidesToShow: 1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: true,
    autoplaySpeed: 10000,
    vertical: true,
    verticalSwiping: true,
    asNavFor: '.testmonial-slider-block',
    responsive: [
      {
        breakpoint: 769,
        settings: {
          vertical: false,
          verticalSwiping: false,
          infinite: true,
        }
      }
    ]
  });
}

if ($(".program-benefit-card").length) {
  $(".program-benefit-card").slick({
    slidesToShow: 4.1,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1.2,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      }
    ]
  });
  customPagination(".benefits-slider")
}

$(".slick-slider").on("setPosition", function () {
  fixAccessibilityInAllSlickSliders();
});

window.addEventListener("load", fixAccessibilityInAllSlickSliders);

if (body.classList.contains("page-template-lp-online-degree-courses-new") || body.classList.contains("page-template-lp-masters-bachelors") || body.classList.contains("page-template-mahe-landing-page-generic")) {
  jQuery(document).ready(function ($) {
    $(document).on("click", ".tab-btn", function () {
      if ($('.top-course-slider').hasClass('slick-initialized')) {
        $('.top-course-slider').slick('unslick');
      }
      topOnlineCourseSliderInitialize();
    });
  });
}
if (body.classList.contains("page-template-lp-online-degree-courses-new")) {
  jQuery(document).ready(function ($) {
    $(document).on("click", ".tab-btn", function () {
      let target = $(this).data("tab");
      let $activeTab = $("#" + target);
      let $slider = $activeTab.find('.top-course-slider');
      if (!$slider.hasClass('slick-initialized')) {
        $slider.slick({
          slidesToShow: 4,
          slidesToScroll: 4,
          dots: true,
          arrows: false,
          infinite: false,
          autoplay: false,
        });
      }
      setTimeout(function () {
        if ($slider.hasClass('slick-initialized')) {
          $slider.slick('setPosition');
          $slider.slick('refresh');
          $slider.slick('slickGoTo', 0);
          customPagination("#" + target + " .top-course-slider");
        }
      }, 300);
    });
  });
}

$(document).on("change", ".courseSelect", function () {
  $(".loader").css("display", "block");
  var course_name = $(".courseSelect").val();
  $.ajax({
    url: "/wp-admin/admin-ajax.php",
    type: "POST",
    dataType: "html",
    data: {
      action: "course_card_select",
      course_name: course_name,
    },
    success: function (response) {
      if (!response || $.trim(response) === "") {
        $(".course-tab").html(
          "<span class='no-result'>No result found</span>"
        );
      } else {
        $(".course-tab").html(response);
        $(".loader").css("display", "none");
        if ($(".top-course-slider").length) {
          setTimeout(function () {
            topOnlineCourseSliderInitialize(true, 3, 1, true, 1, 1.2, false);
            let onlineDegreeCoursesDots = $('.mahe-landing-page-generic .top-online-course-section .slick-dots').children().length;
            if (onlineDegreeCoursesDots === 1) {
              $('.top-course-slider .slick-dots').hide();
            }
          }, 100);
        }
      }
    },
  });
});

if (window.location.pathname == "/online-degree-courses-all-manipal-universities-v2") {
  $(document).on("click", ".online-degree-courses .tab-btn", function () {
    var target = $(this).data("tab");
    $(".online-degree-courses .tab-btn").removeClass("active");
    $(".online-degree-courses .tab-panel").removeClass("active").hide();
    $(this).addClass("active");
    $(".online-degree-courses #" + target).addClass("active").fadeIn();
  });
}

if ($(".degree-advantage-slider").length) {
  $(".degree-advantage-slider").slick({
    slidesToShow: 2.5,
    slidesToScroll: 1,
    dots: true,
    arrows: false,
    infinite: false,
    autoplay: false,
    adaptiveHeight: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true,
        }
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 1.5,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      },
      {
        breakpoint: 490,
        settings: {
          slidesToShow: 1.1,
          slidesToScroll: 1,
          dots: true,
          arrows: false,
          autoplay: false,
        }
      }
    ]
  });
}

function initSelect2() {

  $('[id="electives-subject"], [id="electives-subject1"]').each(function () {

    if (!$(this).hasClass("select2-hidden-accessible")) {
      $(this).select2({
        width: "100%"
      });
    }

  });

}