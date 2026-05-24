jQuery(document).ready(function ($) {
  const pathName = window.location.pathname;
  function setDefaultDescription() {
    if (pathName === "/institution/manipal-university-jaipur" || pathName.search('/institution/manipal-university-jaipur') > 0) {
      $(".campus-sldr-desc").text("Celebrate graduation during the Convocation event at MUJ campus, interact with fellow graduates, meet faculty, and foster professional connections for career growth.");
    } else if (pathName === "/institution/manipal-academy-of-higher-education" || pathName.search('/institution/manipal-academy-of-higher-education') > 0) {
      $(".campus-sldr-desc").text("Graduates are invited to the MAHE campus to celebrate their achievements, interact with peers and faculty, and get their degree certificates.");
    } else if (pathName === "/institution/sikkim-manipal-university" || pathName.search('/institution/sikkim-manipal-university') > 0) {
      $(".campus-sldr-desc").text("Graduates attend the SMU campus convocation to honor their hard work, reconnect with peers and faculty, and receive their official degree certificates.");  
    } else if (pathName === "/placements"){
      $(".campus-sldr-desc").text("Launchpad is a one-of-a-kind hybrid career fair connecting online learners with top recruiters across industries for real-world job opportunities.");
    } else {
      $(".campus-sldr-desc").text("Experience 'Ekam', an exclusive in-person event where online learners connect with peers & faculty, explore the vibrant Manipal University Jaipur campus, participate in fun activities and build valuable connections.");
    }
  }

  // Call the function to set the default description on page load
  setDefaultDescription();

  let campSwiper;
  function initCampSwiper(sliderSelector) {
    campSwiper = new Swiper(sliderSelector, {
      effect: "coverflow",
      slidesPerView: 6.5,
      grabCursor: true,
      slidesPerGroup: 1,
      centeredSlides: true,
      loop: true,
      loopedSlides: 3,
      autoplay: {
        delay: 1500,
      },
      coverflowEffect: {
        rotate: 80,
        depth: -80,
        scale: 1.1,
        slideShadows: false,
        stretch: 10,
        modifier: .3,
      },

      on: {
        beforeTransitionStart: function () {
          const windowWidth = $(window).width();
          const centerSlide = sliderSelector + ' .swiper-slide-active';
          if (windowWidth > 1600) {
            // 1920
            $(centerSlide).next().next().css({ 'transform': 'translate3d(0px, -10px, 55.0071px) rotateX(0deg) rotateY(-55.0071deg) scale(1.105)' });
            $(centerSlide).next().next().next().css({ 'transform': 'translate3d(15px, -30px, 82.5676px) rotateX(0deg) rotateY(-82.5676deg) scale(1.25321)' });
            $(centerSlide).prev().prev().css({ 'transform': 'translate3d(0px, -10px, 55.0427px) rotateX(0deg) rotateY(55.0427deg) scale(1.10688)' });
            $(centerSlide).prev().prev().prev().css({ 'transform': 'translate3d(-15.6808px, -30px, 82.5534px) rotateX(0deg) rotateY(82.5534deg) scale(1.24319)' });
          }
          else if (windowWidth <= 1600 && windowWidth > 1441) {
            // 1600
            $(centerSlide).next().next().css({ 'transform': 'translate3d(0px, -8px, 28.0071px) rotateX(0deg) rotateY(-55.0071deg) scale(1.13)' });
            $(centerSlide).next().next().next().css({ 'transform': 'translate3d(0px, -25px, 42.5676px) rotateX(0deg) rotateY(-82.5676deg) scale(1.25321)' });
            $(centerSlide).prev().prev().css({ 'transform': 'translate3d(0px, -8px, 35.0427px) rotateX(0deg) rotateY(55.0427deg) scale(1.12688)' });
            $(centerSlide).prev().prev().prev().css({ 'transform': 'translate3d(0px, -30px, 42.5534px) rotateX(0deg) rotateY(82.5534deg) scale(1.24319)' });
          }
          else if (windowWidth <= 1441 && windowWidth > 1400) {
            $(centerSlide).next().next().css({ 'transform': 'translate3d(0px, -5px, 35.0071px) rotateX(0deg) rotateY(-55.0071deg) scale(1.15088) scaleX(1.05)' });
            $(centerSlide).next().next().next().css({ 'transform': 'translate3d(0px, -18px, 42.5676px) rotateX(0deg) rotateY(-82.5676deg) scale(1.27321)' });
            $(centerSlide).prev().prev().css({ 'transform': 'translate3d(0px, 0px, 35.0427px) rotateX(0deg) rotateY(55.0427deg) scale(1.15088) scaleX(1.12)' });
            $(centerSlide).prev().prev().prev().css({ 'transform': 'translate3d(0px, -15px, 52.5534px) rotateX(0deg) rotateY(82.5534deg) scale(1.24319)' });
          }
          else if (windowWidth <= 1400 && windowWidth > 1024) {
            // 1366
            $(centerSlide).next().css({ 'transform': 'translate3d(-2px, 0px, 30.0657px) rotateX(0deg) rotateY(-30.0657deg) scale(1.03758) scaleX(1.036)' });
            $(centerSlide).next().next().css({ 'transform': 'translate3d(1px, 0px, 55.9437px) rotateX(0deg) rotateY(-55.9437deg) scale(1.14) scaleX(1.05)' });
            $(centerSlide).next().next().next().css({ 'transform': 'translate3d(-8.3887px, 0px, 81.9437px) rotateX(0deg) rotateY(-81.9437deg) scale(1.32243)' });
            $(centerSlide).prev().css({ 'transform': 'translate3d(0px, 0px, 25.9155px) rotateX(0deg) rotateY(25.9155deg) scale(1.03239) scaleX(1.036)' });
            $(centerSlide).prev().prev().css({ 'transform': 'translate3d(-3px, 0px, 51.9155px) rotateX(0deg) rotateY(51.9155deg) scale(1.1) scaleX(1.1)' });
            $(centerSlide).prev().prev().prev().css({ 'transform': 'translate3d(7.5681px, -6px, 77.8404px) rotateX(0deg) rotateY(77.8404deg) scale(1.22973)' });
          }
          else if (windowWidth <= 992 && windowWidth > 420) {
            // 768
            $(centerSlide).next().css({ 'transform': 'translate3d(-15.7977px, 0px, 30.674px) rotateX(0deg) rotateY(-30.674deg) scale(1.0236) scaleX(0.95)' });
            $(centerSlide).prev().css({ 'transform': 'translate3d(20.3147px, 0px, 32.0183px) rotateX(0deg) rotateY(32.0183deg) scale(1.02463) scaleX(0.95)' });
          }
          else if (windowWidth <= 420) {
            // 375
            $(centerSlide).next().css({ 'transform': 'translate3d(-32.8677px, 0px, 24.9917px) rotateX(0deg) rotateY(-46.8594deg) scale(1.05686)' });
            $(centerSlide).css({ 'transform': 'translate3d(-15.86663px, 0px, 3.27615px) rotateX(0deg) rotateY(-6.14278deg) scale(1.00614)' });
            $(centerSlide).prev().css({ 'transform': 'translate3d(0px, 0px, 21.7266px) rotateX(0deg) rotateY(40.7374deg) scale(1.04074)' });
          }
        }
      },
      breakpoints: {
        360: {
          slidesPerView: 1.8,
          spaceBetween: 17,
          coverflowEffect: {
            rotate: 150,
            depth: -80,
            scale: 1.15,
            slideShadows: false,
            stretch: 70,
            modifier: .25,
          },
        },
        410: {
          slidesPerView: 1.8,
          spaceBetween: 17,
          coverflowEffect: {
            rotate: 180,
            depth: -90,
            scale: 1.2,
            slideShadows: false,
            stretch: 95,
            modifier: .25,
          },
        },
        576: {
          slidesPerView: 3,
          spaceBetween: 17,
          coverflowEffect: {
            rotate: 130,
            depth: -130,
            scale: 1.1,
            slideShadows: false,
            stretch: 50,
            modifier: .23,
          },
        },
        1200: {
          spaceBetween: 16,
          coverflowEffect: {
            rotate: 80,
            depth: -80,
            scale: 1.1,
            slideShadows: false,
            stretch: 16,
            modifier: .3,
          },
        },
        1440: {
          spaceBetween: 24,
          coverflowEffect: {
            rotate: 80,
            depth: -80,
            scale: 1.1,
            slideShadows: false,
            stretch: 20,
            modifier: .34,
          },
        },
      }

    });
  }
  if ($(".campus-swiper").length) {
    var sliderName = ".campus-swiper";
    if (pathName == "/institution/manipal-university-jaipur" || pathName.search('/institution/manipal-university-jaipur') > 0) {
      $('.convocation-muj-swiper').css('display', 'block');
      sliderName = '.convocation-muj-swiper';
      $('.campus-swiper').css('display', 'none');
    } else if (pathName == "/institution/manipal-academy-of-higher-education" || pathName.search('/institution/manipal-academy-of-higher-education') > 0) {
      $('.convocation-mahe-swiper').css('display', 'block');
      sliderName = '.convocation-mahe-swiper';
      $('.campus-swiper').css('display', 'none');
    } else if (pathName == "/institution/sikkim-manipal-university" || pathName.search('/institution/sikkim-manipal-university') > 0) {
      $('.convocation-smu-swiper').css('display', 'block');
      sliderName = '.convocation-smu-swiper';
      $('.campus-swiper').css('display', 'none');  
    } else if (pathName == "/placements" || pathName.search('/placements') > 0) {
      $('.convocation-launchpad-swiper').css('display', 'block');
      sliderName = '.convocation-launchpad-swiper';
      $('.campus-swiper').css('display', 'none');
    }
    initCampSwiper(sliderName);
  }
  function destroySwiper() {
    if (campSwiper) {
      campSwiper.destroy(true, true);
      campSwiper = null;
    }
  }
  if ($(".campus-immersions .event-wrapper").length) {
    if ($(window).width() < 400) {
      $(".campus-immersions .event-wrapper .event-text").addClass('container');
    }
  }
  if ($(".other-page-block").length) {
    if ($(window).width() < 768) {
      $(".other-page-block").addClass('container');
    }
  }
  $(document).on("click", ".campus-immersions .select2-container", function () {
    const drp_struct = $('.select2-container').html();
    $('.campus-immersions .select2-container--open .select2-dropdown--below').attr('style', 'border-radius: 0px 0px 20px 20px !important; margin-top:0px;');
    $('.select2-container--default .select2-results>.select2-results__options').css('max-height', 'auto');
  });

  $(document).on("change", ".campus-immersions select[name=camp_immer_drpdwn]", function () {
    const drpdwnVal = $(this).val();
    var classArr = $(".campus-immersions .swiper-initialized").attr('class').split(" ");
    const currSldr = classArr[0];
    destroySwiper();
    $('.' + currSldr).css('display', 'none');
    $('.' + drpdwnVal + '-swiper').css('display', 'block');
    initCampSwiper('.' + drpdwnVal + '-swiper');
    if (drpdwnVal === "campus") {
      $(".campus-sldr-desc").text(
        "Experience 'Ekam', an exclusive in-person event where online learners connect with peers & faculty, explore the vibrant Manipal University Jaipur campus, participate in fun activities and build valuable connections."
      );
    } else if (drpdwnVal === "panorama") {
      $(".campus-sldr-desc").text(
        "'Panorama' brings online learners together at the Manipal Academy of Higher Education campus to meet fellow students & faculty, attend insightful sessions, and connect with professionals from diverse industries and experiences."
      );
    } else if (drpdwnVal === "convocation-muj") {
      $(".campus-sldr-desc").text(
        "Celebrate graduation during the Convocation event at MUJ campus, interact with fellow graduates, meet faculty, and foster professional connections for career growth."
      );
    } else if (drpdwnVal === "convocation-mahe") {
      $(".campus-sldr-desc").text(
        "Graduates are invited to the MAHE campus to celebrate their achievements, interact with peers and faculty, and get their degree certificates."
      );
    } else if (drpdwnVal === "convocation-smu") {
      $(".campus-sldr-desc").text(
        "Graduates attend the SMU campus convocation to honor their hard work, reconnect with peers and faculty, and receive their official degree certificates."
      );
    } else if (drpdwnVal === "convocation-launchpad") {
      $(".campus-sldr-desc").text(
        "Launchpad is a one-of-a-kind hybrid career fair connecting online learners with top recruiters across industries for real-world job opportunities."
      );
    } 
  });

  var sliderOptionData = [
    {
      id: "campus",
      text: "Ekam",
      html: "<div>Ekam</div>",
    },
    {
      id: "panorama",
      text: "Panorama",
      html: "<div>Panorama</div>",
    },
    {
      id: "convocation-muj",
      text: "Convocation MUJ",
      html: '<div>Convocation <span class="sldr-opt-label" style="background: #CCC1FF;">MUJ</span></div>',
    },
    {
      id: "convocation-mahe",
      text: "Convocation MAHE",
      html: '<div>Convocation <span class="sldr-opt-label" style="background: #A9D8FF;">MAHE</span></div>',
    },
    {
      id: "convocation-smu",
      text: "Convocation SMU",
      html: '<div>Convocation <span class="sldr-opt-label" style="background: #BEFFFE;">SMU</span></div>',
    },
    {
      id: "convocation-launchpad",
      text: "Launchpad",
      html: "<div>Launchpad</div>",
    },
  ];

  var sliderOptionDataplacement = [
     {
      id: 'convocation-launchpad',
      text: 'Launchpad',
      html: '<div>Launchpad</div>',
    },
  ];

  var mujSliderOptionData = [
    {
      id: 'convocation-muj',
      text: 'Convocation MUJ',
      html: '<div>Convocation <span class="sldr-opt-label" style="background: #CCC1FF;">MUJ</span></div>',
    },
    {
      id: 'campus',
      text: 'Ekam',
      html: '<div>Ekam</div>',
    }
  ];

  var maheSliderOptionData = [
    {
      id: 'convocation-mahe',
      text: 'Convocation MAHE',
      html: '<div>Convocation <span class="sldr-opt-label" style="background: #A9D8FF;">MAHE</span></div>',
    },
    {
      id: 'panorama',
      text: 'Panorama',
      html: '<div>Panorama</div>',
    },
  ];

  var smuSliderOptionData = [
    {
      id: "convocation-smu",
      text: "Convocation SMU",
      html: '<div>Convocation <span class="sldr-opt-label" style="background: #A9D8FF;">MAHE</span></div>',
    },    
  ];

   var testimonialData = [
     {
      id: 'filter',
      text: 'Filter',
      html: '<div>Filter</div>',
    },
    // {
    //   id: 'pg',
    //   text: 'Institution ',
    //   html: '<div>Institution</div>',
    // },
     {
      id: 'convocation-muj',
      text: 'MUJ',
      html: '<div><span class="sldr-opt-label" style="background: #CCC1FF;">MUJ</span></div>',
    },
    {
      id: 'convocation-mahe',
      text: 'MAHE',
       html: '<div> <span class="sldr-opt-label" style="background: #A9D8FF;">MAHE</span></div>',
    },
    {
      id: 'convocation-smu',
      text: 'SMU',
       html: '<div><span class="sldr-opt-label" style="background: #BEFFFE;">SMU</span></div>',
    }
  ];

  if ($(".camp-immer-drpdwn").length) {
    if (pathName == "/institution/manipal-university-jaipur" || pathName.search('/institution/manipal-university-jaipur') > 0) {
      sliderOptionData = mujSliderOptionData;
    } else if (pathName == "/institution/manipal-academy-of-higher-education" || pathName.search('/institution/manipal-academy-of-higher-education') > 0) {
      sliderOptionData = maheSliderOptionData;
    } else if (pathName == "/institution/sikkim-manipal-university" || pathName.search('/institution/sikkim-manipal-university') > 0) {
      sliderOptionData = smuSliderOptionData;
    } else if (pathName == "/learner-testimonials" || pathName.search('/learner-testimonial') > 0) {
      sliderOptionData = testimonialData;
    } else if(pathName == "/placements") {
      sliderOptionData = sliderOptionDataplacement; 
    }
    $(".camp-immer-drpdwn").select2({
      data: sliderOptionData,
      dropdownParent: $('.other-page-block'),
      escapeMarkup: function (markup) {
        return markup;
      },
      templateResult: function (data) {
        return data.html;
      },
      templateSelection: function (data) {
        return data.text;
      }
    });
  }
});