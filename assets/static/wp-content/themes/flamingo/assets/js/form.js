// Set Cookie
const setCustomCookie = (key, value) => {
  var expires = new Date();
  expires.setTime(expires.getTime() + 31536000000);
  document.cookie = key + '=' + value + ';expires=' + expires.toUTCString();
}

// Get Cookie
const getCustomCookie = (key) => {
  var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
  return keyValue ? keyValue[2] : null;
}

document.addEventListener("DOMContentLoaded", function () {
  const $bar = $(".countryBar");
  if (!$bar.length) return;

  const applyHiddenClasses = () => {
    if (sessionStorage.getItem("countryBarClosed") !== "true") {
      $bar.addClass("hideCountryBar").removeClass("showCountryBar");
      $(".home-banner, .header-mob-wrapper, .pageTopSpace, .floating-Widget").removeClass("topBar");
      $("#overlay").removeClass("show");
    }
  };

  const hideBarCompletely = () => {
    $bar.hide();
    applyHiddenClasses();
  };

  if (sessionStorage.getItem("countryBarClosed") !== "true") {
    $bar.addClass("hideCountryBar").removeClass("showCountryBar");
    $(".home-banner, .header-mob-wrapper, .pageTopSpace, .floating-Widget").removeClass("topBar");
    $("#overlay").removeClass("show");
  }

  //If user closed earlier → hide popup + apply classes
  if (sessionStorage.getItem("countryBarClosed") === "true") {
    hideBarCompletely();
    return;
  }

  // Close button click → hide & save state
  $(document).on("click", ".close-button", function () {
    hideBarCompletely();
    sessionStorage.setItem("countryBarClosed", "true");
  });
});

jQuery(document).ready(function ($) {
  //sujects Cards hide
  $('.master-card').hide();
  $('input[name="education"]').on('click', function () {
    selectdValue = $(this).val();

    if (selectdValue == 'Bachelor Degree' || selectdValue == 'Master Degree') {
      $('.master-card').show();
      $('.managment-sub').text('MBA');
      $('.information-sub').text('MCA');
      $('.commerce-sub').text('M.Com');
      $('.arts-sub').text('English, Political Science, Sociology');
    } else {
      $('.master-card').hide();
      $('.managment-sub').text('').text('BBA');
      $('.information-sub').text('').text('BCA');
      $('.commerce-sub').text('').text('B.Com');
      $('.arts-sub').text('').text('English, Political Science, Sociology');
    }
  });

  const pathName = window.location.pathname;
  const width = $(window).width();
  const baseURL = `${window.location.protocol}//${window.location.host}/`;
  const ajaxURL = `${baseURL}wp-admin/admin-ajax.php`
  const leadForm = "#leadForm";
  const enrollForm = "#enrollForm";
  const downloadForm = "#downloadForm";
  const programLeadForm = '#programLeadForm';
  const footerLeadForm = '#footerLeadForm';
  const personalizationForm = "#personalizationForm";
  const enquiryForm = "#enquiryForm";
  const testimonialForm = "#testimonialForm";

  // Form submission false on page load
  localStorage.setItem('formSubmitted', "No");

  // Form Submission Tracking
  const customDataLayerPush = (payload = {}) => {
    if (typeof dataLayer === "undefined") {
      console.warn("dataLayer not found");
      return false;
    }

    const { LeadFormName, Course, University, email } = payload;

    // GTM Tracking
    dataLayer.push({
      event: "formSubmitted",
      formName: "Lead Form",
      form_type: LeadFormName || "",
      Course: Course || "",
      University: University || "",
    });

    dataLayer.push({
      event: "enhanced_lead",
      enhanced_conversion_data: { email: email || "" },
    });

    // Sharechat Tracking
    const utmSource = localStorage.getItem("utm_source");
    if (utmSource === "sharechat") {
      const clickId = localStorage.getItem("clickId");
      if (clickId) {
        const params = new URLSearchParams({
          clickId,
          gaid: "",
          campaignName: localStorage.getItem("utm_campaign") || "",
          adId: localStorage.getItem("adId") || "",
          userId: localStorage.getItem("userId") || "",
          EventTime: Date.now(),
          eventName: "registration",
          eventValue: 1,
        });
        $.get(`https://apis.sharechat.com/a1s-s2s-service/v1/events/manipal/post?${params}`)
          .done(() => console.info("Sharechat event sent"))
          .fail(() => console.error("Sharechat event failed"));
      }
    }

    return true;
  };

  // FB Event Trigger
  const fbEventTrigger = (email, mobileNumer) => {
    fbq('track', 'Purchase', { currency: "INR", value: 10000.00 });
    const websiteURL = window.location.href;
    $.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      async: true,
      data: {
        action: 'fb_event_trigger',
        email: email,
        mobile_no: mobileNumer,
        website: websiteURL
      },
      success: function (res) {
      }
    });
    return true;
  }

  // Mobile number validation
  const mobileNumberValidation = (formSelector) => {
    $(document).on("input", formSelector + " input[name=mobile_number]", function () {
      this.value = this.value.replace(/\D/g, '');
    });
    const dialCode = $(formSelector + " .iti__selected-dial-code").text();
    if (dialCode == "+91") {
      $(formSelector + ' input[name=mobile_number]').attr('maxlength', '10');
    } else {
      $(formSelector + ' input[name=mobile_number]').attr('maxlength', '15');
    }
  }

  const validateEmail = (email) => {
    var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailReg.test(email);
  }

  // Success message display
  const successDisplay = (formSelector, response) => {
    const message = response.message ? response.message : response.msg;
    $(formSelector + " #successMessage").removeClass("hidden");
    $(formSelector + " #errorMessage").addClass("hidden");
    $(formSelector + " #successMessage").fadeIn('slow');
    $(formSelector + " #successMessage").html(message);
    setTimeout(function () { $(formSelector + " #successMessage").fadeOut('slow'); }, 10000);
  }

  // Error message display
  const errorDisplay = (formSelector, response) => {
    const message = response.message ? response.message : response.msg;
    $(formSelector + " #errorMessage").removeClass("hidden");
    $(formSelector + " #successMessage").addClass("hidden");
    $(formSelector + " #errorMessage").html(message);
    $(formSelector + " #errorMessage").fadeIn('slow');
    setTimeout(function () { $(formSelector + " #errorMessage").fadeOut('slow'); }, 10000);
  }

  // Download Functionality
  const download_file = (fileURL, fileName) => {
    if (!window.ActiveXObject) {
      var save = document.createElement('a');
      save.href = fileURL;
      save.target = '_blank';
      var filename = fileURL.substring(fileURL.lastIndexOf('/') + 1);
      save.download = fileName || filename;
      if (navigator.userAgent.toLowerCase().match(/(ipad|iphone|safari)/) && navigator.userAgent.search("Chrome") < 0) {
        document.location = save.href;
      } else {
        var evt = new MouseEvent('click', {
          'view': window,
          'bubbles': true,
          'cancelable': false
        });
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
      }
    } else if (!!window.ActiveXObject && document.execCommand) {
      var _window = window.open(fileURL, '_blank');
      _window.document.close();
      _window.document.execCommand('SaveAs', true, fileName || fileURL)
      _window.close();
    }
  }

  const downloadSubmission = (formSelector) => {
    const ua = navigator.userAgent.toLowerCase();
    const isSafari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("chromium") && !ua.includes("android");
    const isFirefox = ua.includes("firefox");
    const isWindows = ua.includes("windows");
    const isMac = ua.includes("macintosh") || ua.includes("mac os x");
    let fileURL = $(".download-url").text();
    let fileName = 'brochure.pdf';

    if ($("#ebookDownloadUrl").length) {
      fileURL = $("#ebookDownloadUrl").text().trim();
      fileName = "ebook.pdf";
    }

    if ($(window).width() > 768 && !fileURL.toLowerCase().includes("syllabus.html")) {
      openPdfPopup(fileURL);
      if (!isSafari) {
        download_file(fileURL, fileName);
      }
    } else {
      download_file(fileURL, fileName);
    }

    document.getElementById("downloadForm").reset();
    $(formSelector + " .lead-submit").prop('disabled', true).text('Download Now');
    $(formSelector + " .lsq-submit").prop('disabled', true).text('Submit');
    $(formSelector + ' .form-details-block').removeClass("hidden");
    $(formSelector + ' .otp-verification-block').addClass("hidden");
    if ($(window).width() < 768) {
      successDisplay(formSelector, { message: 'Thank you for your interest. Our counsellor will get back to you.' });
    }
    if ($('#course_name_select').length > 0) {
      $("#course_name_select").val('').trigger('change');
    }
  }
  $("#pdfPopup .close-btn").on('click', function () {
    $(".fancybox__backdrop").css("background", "none");
    $(".fancybox__container").css("display", "none");
    $(".header").css("display", "block");
    Fancybox.close(true);
  });

  const linkService = {
    getDestinationHash(dest) { return ""; },
    navigateTo(dest) { },
    getAnchorUrl(hash) { return ""; },
    setHash(hash) { },
    executeNamedAction(action) { },
    cachePageRef(pageRef, pageIndex) { },
    addLinkAttributes(link) {
      // Prevent PDF.js crash
      link.rel = "noopener noreferrer";
      link.target = "_blank";
    },
    openExternalLink(url) {
      window.open(url, "_blank");
    }
  };
  // === Fully Corrected PDF Popup Viewer ===
  function openPdfPopup(pdfLink) {
    $("#downloadForm_popup").addClass("hidden");
    $("#pdfPopup").removeClass("hidden");
    $(".header").css("display", "none");

    const prevBtn = document.getElementById("prevPage");
    const nextBtn = document.getElementById("nextPage");

    let pdfDoc = null,
      pageNum = 1,
      canvas = document.getElementById("pdfCanvas"),
      ctx = canvas.getContext("2d"),
      isRendering = false,
      renderTask = null;

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.14.305/pdf.worker.min.js";

    // =====================
    // RENDER PAGE
    // =====================
    async function renderPage(num) {
      if (!pdfDoc) return;
      isRendering = true;

      if (renderTask) renderTask.cancel();

      const page = await pdfDoc.getPage(num);
      const viewport = page.getViewport({ scale: 1.2 });

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      renderTask = page.render({ canvasContext: ctx, viewport });
      await renderTask.promise;

      // Annotation Layer fix
      const annotationDiv = document.getElementById("pdfAnnotations");
      annotationDiv.innerHTML = "";
      annotationDiv.style.height = canvas.height + "px";
      annotationDiv.style.width = canvas.width + "px";

      const annotations = await page.getAnnotations();

      pdfjsLib.AnnotationLayer.render({
        annotations,
        div: annotationDiv,
        viewport,
        page,
        linkService,
      });

      setTimeout(() => {
        console.log("Calling overlay for:", num);

        addOverlayLinkForPage(num);
      }, 200);

      const pn = document.getElementById("pageNum");
      const pc = document.getElementById("pageCount");

      if (pn) pn.textContent = num;
      if (pc) pc.textContent = pdfDoc.numPages;

      isRendering = false;
      updateNavButtons();
    }


    function updateNavButtons() {
      if (!pdfDoc) return;

      // Disable Prev on first page
      if (pageNum <= 1) {
        prevBtn.classList.add("disabled");
      } else {
        prevBtn.classList.remove("disabled");
      }

      // Disable Next on last page
      if (pageNum >= pdfDoc.numPages) {
        nextBtn.classList.add("disabled");
      } else {
        nextBtn.classList.remove("disabled");
      }
    }
    // =====================
    // OVERLAY BUTTON
    // =====================
    function addOverlayLinkForPage(pageNum) {
      var university_url = $("#university-url").text();
      if (university_url == "MUJ") {
        var login_url = "https://login.muj.onlinemanipaladmission.in/";
      } else if (university_url == "SMU") {
        var login_url = "https://login.smu.onlinemanipaladmission.in/";
      } else {
        var login_url = "https://login.mahe.onlinemanipaladmission.in/";
      }
      const old = document.getElementById("pdfOverlayBtn");
      if (old) old.remove();

      if (pageNum !== 15) return;

      const link = document.createElement("a");
      link.id = "pdfOverlayBtn";
      link.href = login_url;
      link.target = "_blank";
      const scale = 1.2;

      const btnX = 6;
      const btnY = 12;
      const btnWidth = 173;
      const btnHeight = 51;

      link.style.left = btnX + "%";
      link.style.bottom = btnY + "%";
      link.style.width = btnWidth + "px";
      link.style.height = btnHeight + "px";

      // TESTING ONLY — show overlay area
      link.style.background = "transparent";

      link.style.position = "absolute";
      link.style.zIndex = "999999";
      console.log("Overlay function fired for page:", pageNum);

      document.getElementById("pdfWrapper").appendChild(link);
    }

    // =====================
    // OPEN POPUP
    // =====================
    Fancybox.show([{ src: "#pdfPopup", type: "inline" }], {
      closeButton: "top",
      click: false,
      dragToClose: false,
      trapFocus: true,
      hideScrollbar: false
    });


    // =====================
    // LOAD PDF
    // =====================
    (async () => {
      try {
        const loadingTask = pdfjsLib.getDocument(pdfLink);
        pdfDoc = await loadingTask.promise;
        pageNum = 1;
        await renderPage(pageNum);
      } catch (err) {
        alert("Failed to load PDF: " + err.message);
      }

      document.getElementById("downloadPDF").onclick = function () {
        const a = document.createElement("a");
        a.href = pdfLink;
        a.download = pdfLink.split("/").pop();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    })();

    // =====================
    // NAVIGATION
    // =====================
    prevBtn.onclick = () => {
      if (!pdfDoc) return;
      if (pageNum <= 1) return;
      pageNum--;
      renderPage(pageNum);
    };

    nextBtn.onclick = () => {
      if (!pdfDoc) return;
      if (pageNum >= pdfDoc.numPages) return;
      pageNum++;
      renderPage(pageNum);
    };
  }

  $(document).on("click", ".pdf-btn", function () {
    var university_url = $("#university-url").text();
    if (university_url == "MUJ") {
      var login_url = "https://login.muj.onlinemanipaladmission.in/";
    } else if (university_url == "SMU") {
      var login_url = "https://login.smu.onlinemanipaladmission.in/";
    } else {
      var login_url = "https://login.mahe.onlinemanipaladmission.in/";
    }
    window.open(login_url, "_blank");

  });


  setInterval(function () {
    if (document.querySelector(".fancybox__container.is-closing")) {
      document.body.style.overflow = "auto";
    }
  }, 200);


  $(document).on("afterClose.fb", () => {
    $("html, body").css("overflow", "auto");
  });



  // OTP input functionality
  $(".otp-input").on("input", function () {
    const inputValue = $(this).val();
    const maxLength = $(this).attr("maxlength");
    if (inputValue.length >= maxLength) {
      $(this).parents(".otp-wrap").next(".otp-wrap").children(".otp-input").focus();
    }
  });
  $(".otp-input").on("keydown", function (e) {
    const key = e.key;
    if (key === "Backspace" && $(this).val() === "") {
      $(this).parents(".otp-wrap").prev(".otp-wrap").children(".otp-input").focus();
    }
  });

  // Fetch site details based on program/course name
  const fetchSiteDetails = (courseName) => {
    let siteName = '';
    let app_login_url = '';
    let universityName = '';
    const MUJcourseList = ["BBA", "MBA", "BCA", "MCA", "B.Com", "M.Com", "MA.JMC", "MA in Economics", "MSc in Mathematics"];
    const MAHEcourseList = ["MSc Data Science", "MSc Business Analytics", "PGCP Business Analytics", "PGCP Logistics and Supply Chain", "Master of Business Administration", "PGCP E&I", "PGD Entrepreneurship and Innovation", "MCA-MAHE", "PGCP Data Science", "BBA-MAHE", "B.Com-MAHE"];
    const SMUcourseList = ["BA", "MA", "MA in English", "MA in Sociology", "MA in Political Science", "MCA-SMU", "MCOM", "BCOM", "MBA-SMU", "BBA-SMU"];
    if (MUJcourseList.includes(courseName)) {
      siteName = 'MUJ';
      app_login_url = 'https://login.muj.onlinemanipaladmission.in/';
      universityName = 'Manipal University Jaipur';
    } else if (MAHEcourseList.includes(courseName)) {
      siteName = 'MAHE';
      app_login_url = 'https://login.mahe.onlinemanipaladmission.in/';
      universityName = 'Manipal Academy of Higher Education';
    } else if (SMUcourseList.includes(courseName)) {
      siteName = 'SMU';
      app_login_url = 'https://login.smu.onlinemanipaladmission.in/';
      universityName = 'Sikkim Manipal University';
    }
    const output = {
      siteName,
      app_login_url,
      universityName
    }
    return output;
  }

  // Map the course name when it's same
  const courseMapping = (courseName, institutionName) => {
    const inst = institutionName.trim();

    const MAHE = ["Manipal Academy of Higher Education", "MAHE"];
    const SMU = ["Sikkim Manipal University", "SMU"];

    const mapMAHE = {
      "MBA": "Master of Business Administration",
      "MCA": "MCA-MAHE",
      "BBA": "BBA-MAHE",
      "B.Com": "B.Com-MAHE"
    };

    const mapSMU = {
      "B.Com": "BCOM",
      "M.Com": "MCOM",
      "MCA": "MCA-SMU",
      "MBA": "MBA-SMU",
      "BBA": "BBA-SMU"
    };

    if (MAHE.includes(inst) && mapMAHE[courseName]) {
      return mapMAHE[courseName];
    }

    if (SMU.includes(inst) && mapSMU[courseName]) {
      return mapSMU[courseName];
    }

    return courseName; // no mapping found
  };

  // Apply the country code dropdown to the form
  const applyCountryCode = (formSelector, countryCode = 'in') => {
    const pageType = $(".pageType").text();
    if (countryCode == 'in' && pageType !== "International") {
      window.intlTelInput(document.querySelector(formSelector + " input[name=mobile_number]"), {
        allowExtensions: false,
        autoFormat: false,
        separateDialCode: true,
        formatOnDisplay: false,
        initialCountry: 'in',
        onlyCountries: ["in"],
        utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
      });
    } else {
      countryCode = countryCode != "in" ? countryCode.toLowerCase() : 'ae';
      window.intlTelInput(document.querySelector(formSelector + " input[name=mobile_number]"), {
        allowExtensions: false,
        autoFormat: false,
        separateDialCode: true,
        formatOnDisplay: false,
        initialCountry: countryCode,
        excludeCountries: ['in'],
        preferredCountries: ["ae", "us", "my", "ph"],
        utilsScript: "//cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js"
      });
    }
    mobileNumberValidation(formSelector);
  }

  // Fetch user location and apply country code
  setTimeout(function () {
    const location_url = baseURL + '/wp-json/api/v1/detect-location';
    fetch(location_url, {
      method: "POST"
    })
      .then(response => response.json())
      .then(data => {
        let countryCode = data.country_code ? data.country_code.toLowerCase() : 'in';
        if (window.location.pathname === '/nepal/online-degree-courses-v2' || window.location.pathname === '/nepal/online-mba-smu' || window.location.pathname === '/nepal/online-mca-smu' || window.location.pathname === '/nepal/online-mcom-smu' || window.location.pathname === '/nepal/online-ba-smu' || window.location.pathname === '/nepal/online-bcom-smu'
          || window.location.pathname === '/nepal/online-ma' || window.location.pathname === '/nepal/online-bba-smu' || window.location.pathname === '/nepal/online-mca' || window.location.pathname === '/nepal/online-mcom' || window.location.pathname === '/nepal/online-ma-economics' || window.location.pathname === '/nepal/online-msc-mathematics' || window.location.pathname === '/nepal/online-bcom') {
          let domCountryCode = document.querySelector('.country-code')?.textContent.trim().toLowerCase();
          countryCode = domCountryCode
            ? domCountryCode
            : (data.country_code ? data.country_code.toLowerCase() : 'in');
        }
        const city = data.city ? data.city : '';
        const country = data.country ? data.country : 'India';

        if ($(leadForm + ' input[name=mobile_number]').length) { applyCountryCode(leadForm, countryCode); }
        if ($(enrollForm + ' input[name=mobile_number]').length) { applyCountryCode(enrollForm, countryCode); }
        if ($(programLeadForm + ' input[name=mobile_number]').length) { applyCountryCode(programLeadForm, countryCode); }
        if ($(footerLeadForm + ' input[name=mobile_number]').length) { applyCountryCode(footerLeadForm, countryCode); }
        if ($(downloadForm + ' input[name=mobile_number]').length) { applyCountryCode(downloadForm, countryCode); }
        if ($(enquiryForm + ' input[name=mobile_number]').length) { applyCountryCode(enquiryForm, countryCode); }
        if ($(testimonialForm + ' input[name=mobile_number]').length) { applyCountryCode(testimonialForm, countryCode); }
        $('input[name=leadsquared-mx_Location]').val(city);
        $('input[name=userCountry]').val(country);

        // Geo-location based country bar update
        geoLocationUpdate(countryCode);
      })
      .catch(error => console.error("Error:", error));

  }, 1000);


  const geoLocationUpdate = (country_code) => {
    if ($('.mainsite-footer').length >= 0) {
      let countryCodeip = country_code.toUpperCase();
      let currentURL = window.location.href;
      const linkBtn = document.querySelector(".continue-btn");
      const countryTxt = document.querySelector(".county-code-txt");

      let path = window.location.pathname;
      let afterGlobal = currentURL.split('/global/')[1];

      // CASE 1: User is from India, visiting a /global URL, and bar is not closed
      if (
        countryCodeip === 'IN' &&
        currentURL.includes('/global') &&
        sessionStorage.getItem("countryBarClosed") !== "true"
      ) {
        $('.countryBar').addClass('showCountryBar').removeClass('hideCountryBar');
        $(".home-banner, .header-mob-wrapper, .pageTopSpace, .floating-Widget").addClass("topBar");

        $('.ind-txt').show();
        $('.global-txt').hide();
        $('.country-select').val('IN').trigger('change');
        $('.showCountryBar').attr('style', 'display: block !important');

        if (linkBtn) {
          if (/^\/global(\/)?$/.test(path)) {
            linkBtn.href = "/";
          } else if (path !== '/' && path.trim() !== '' && afterGlobal) {
            linkBtn.href = window.location.origin + "/" + afterGlobal;
          }
        }

        if (countryTxt) {
          countryTxt.textContent = "India";
        }
      }

      // CASE 2: User from India OR global user already inside /global — hide bar
      else if (
        countryCodeip === 'IN' ||
        (countryCodeip !== 'IN' && currentURL.includes('/global'))
      ) {
        $('.countryBar').addClass('hideCountryBar').removeClass('showCountryBar');
        $(".home-banner, .header-mob-wrapper, .pageTopSpace, .floating-Widget").removeClass("topBar");
      }

      // CASE 3: User outside India, bar not closed — show global bar
      else if (
        sessionStorage.getItem("countryBarClosed") !== "true" &&
        countryCodeip !== 'IN'
      ) {
        $('.countryBar').addClass('showCountryBar').removeClass('hideCountryBar');
        $(".home-banner, .header-mob-wrapper, .pageTopSpace, .floating-Widget").addClass("topBar");

        $('.ind-txt').hide();
        $('.global-txt').show();
        $('.country-select').val('GB').trigger('change');
        $('.showCountryBar').attr('style', 'display: block !important');

        if (linkBtn) {
          linkBtn.href = (path !== '/' && path.trim() !== '') ? "/global" + path : "/global";
        }

        if (countryTxt) {
          countryTxt.textContent = "Global";
        }
      }
    }
  }

  // Functionality for sending OTP
  const sendOTP = (formSelector) => {
    const email = $(formSelector + " input[name=email]").val();
    const mobile_number = $(formSelector + " input[name=mobile_number]").val();
    const dialCode = $(formSelector + " .mobileBlock .iti__selected-dial-code").text();
    const otpType = dialCode != "+91" ? "Email" : "Mobile";
    let courseName = $(formSelector + " input[name=course_name]").val();
    if (!courseName) { courseName = $(formSelector + " select[name=course_name]").val(); }
    let institutionName = $(formSelector + " input[name=institution]").val();
    if (!institutionName) { institutionName = $(formSelector + " select[name=institution]").val(); }
    courseName = courseMapping(courseName, institutionName);
    const siteDetails = fetchSiteDetails(courseName);
    const siteName = siteDetails.siteName;
    const formattedNumber = dialCode + '-' + mobile_number;
    const payload = {
      email: email,
      mobileNumber: mobile_number,
      countryCode: dialCode,
      siteName: siteName,
      otpType: otpType
    }
    fetch('/wp-json/api/v1/generate-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': 'a0487082-9247-42dd-80dc-2330501f3c7c'
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        if (data.status === 1) {
          $(formSelector + " .lsq-submit").prop("disabled", true);
          $(formSelector + " .form-details-block").addClass("hidden");
          $(formSelector + " .otp-verification-block").removeClass("hidden");
          enableResendOTP(formSelector);
          dialCode != "+91" ? $(formSelector + ' .otpNumber').text(email) : $(formSelector + ' .otpNumber').text(formattedNumber);
        }
      })
      .catch(error => { $(formSelector + ' #errorMessage').html(error); });
  }

  // Timer count down
  const timerCountdown = () => {
    let timer2 = "0:30";
    let interval = setInterval(function () {
      let timer = timer2.split(':');
      let minutes = parseInt(timer[0], 10);
      let seconds = parseInt(timer[1], 10);
      --seconds;
      minutes = (seconds < 0) ? --minutes : minutes;
      if (minutes < 0) clearInterval(interval);
      seconds = (seconds < 0) ? 30 : seconds;
      seconds = (seconds < 10) ? '0' + seconds : seconds;
      $('.countdown').html(seconds);
      timer2 = minutes + ':' + seconds;
    }, 1000);
    return true;
  }

  // Send OTP
  $(document).on("click", leadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(leadForm);
  });

  $(document).on("click", enrollForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(enrollForm);
  });

  $(document).on("click", programLeadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(programLeadForm);
  });

  $(document).on("click", testimonialForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(testimonialForm);
  });

  $(document).on("click", footerLeadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(footerLeadForm);
  });

  $(document).on("click", downloadForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(downloadForm);
  });

  $(document).on("click", enquiryForm + " #resendOtpBtn", function (e) {
    e.preventDefault();
    sendOTP(enquiryForm);
  });

  const enableResendOTP = (formSelector) => {
    $(formSelector + " .resend-otp").attr("disabled", "disabled");
    timerCountdown();
    setTimeout(function () {
      $(formSelector + " .resend-otp").removeAttr("disabled");
    }, 30000);
  }

  // Functionality for verify OTP
  const verifyOTP = (formSelector, type = 'Mobile') => {
    const digit1 = $(formSelector + " .otp-wrap input[name=otp1]").val();
    const digit2 = $(formSelector + " .otp-wrap input[name=otp2]").val();
    const digit3 = $(formSelector + " .otp-wrap input[name=otp3]").val();
    const digit4 = $(formSelector + " .otp-wrap input[name=otp4]").val();
    const otp = digit1 + digit2 + digit3 + digit4;
    if (otp.length == 4) {
      const mobile_number = $(formSelector + ' input[name="mobile_number"]').val();
      const email = $(formSelector + ' input[name="email"]').val();
      const dialCode = $(formSelector + " .mobileBlock .iti__selected-dial-code").text();
      const type = dialCode != "+91" ? "Email" : "Mobile";
      let courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
      const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
      courseName = courseMapping(courseName, institutionName);
      const siteDetails = fetchSiteDetails(courseName);
      const siteName = siteDetails.siteName;
      let leadID = localStorage.getItem('prospectId');
      const mobileUpdate = localStorage.getItem('mobileUpdate');
      const payload = {
        type: type,
        email: email,
        dial_code: dialCode,
        mobileNumber: mobile_number,
        otp: otp,
        leadID: leadID,
        siteName: siteName,
        mobileUpdate: mobileUpdate
      }
      fetch('/wp-json/api/v1/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': 'a0487082-9247-42dd-80dc-2330501f3c7c'
        },
        body: JSON.stringify(payload),
      })
        .then(response => response.json())
        .then(data => {
          if (data.status == 1) {
            localStorage.setItem('mobileUpdate', "");
            $(formSelector + " .otp-field").addClass("success");
            $(formSelector + " .otp-field").removeClass("error");
            $(formSelector + " .lsq-submit").prop("disabled", false);
            $(formSelector + " .lsq-submit").text("Submit");
          } else {
            $(formSelector + " .otp-field").addClass("error");
            $(formSelector + " .otp-field").removeClass("success");
            $(formSelector + " .lsq-submit").prop("disabled", true);
            $(formSelector + " .lsq-submit").text("Verify");
          }
        })
        .catch(error => {
          alert("An error occurred. Please try again.");
        });
    }
  }

  // Verify OTP 
  let timeout;
  $(document).on("keyup input paste", leadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(leadForm); }, 300);
  });

  $(document).on("keyup input paste", enrollForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(enrollForm); }, 300);
  });

  $(document).on("keyup input paste", programLeadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(programLeadForm); }, 300);
  });

  $(document).on("keyup input paste", testimonialForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(testimonialForm); }, 300);
  });


  $(document).on("keyup input paste", footerLeadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(footerLeadForm); }, 300);
  });

  $(document).on("keyup input paste", downloadForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(downloadForm); }, 300);
  });

  $(document).on("keyup input paste", enquiryForm + " .otp-field input", function () {
    clearTimeout(timeout);
    timeout = setTimeout(() => { verifyOTP(enquiryForm); }, 300);
  });

  // Functionality for lead form submission
  const leadFormSubmission = (formSelector) => {
    $(formSelector).validate({
      rules: {
        name: { required: true },
        email: { required: true, email: true },
        mobile_number: { required: true },
        course_name: { required: true },
        institution: { required: true }
      },
      messages: {
        name: { required: "Please enter your name" },
        email: { required: "Please enter your email", email: "Please enter the valid email" },
        mobile_number: { required: "Please enter your mobile number" },
        course_name: { required: "Please select the course name" },
        institution: { required: "Please select the institution" }
      }
    });
    $(document).on("click", formSelector + " .lead-submit", function (e) {
      e.preventDefault();
      const honeypot = $(formSelector + ' input[name="honeypot"]').val();
      if (honeypot) { return false };
      if ($(formSelector).valid()) {
        $(this).prop('disabled', true).text('Processing...');
        const name = $(formSelector + " input[name=name]").val();
        const email = $(formSelector + " input[name=email]").val();
        const number = $(formSelector + " input[name=mobile_number]").val();
        const dialCode = $(formSelector + " .iti__selected-dial-code").text();
        const mobile_number = dialCode + '-' + number;
        let courseName;
        if (window.location.pathname === '/online-ma-degrees-v2' || window.location.pathname === '/online-mba-operations-muj-smu-mahe' || window.location.pathname === '/online-mba-operations-muj-smu') {
          courseName = $(formSelector + " input[name=course_name]:checked").val()
            ? $(formSelector + " input[name=course_name]:checked").val()
            : $(formSelector + " select[name=course_name]").val();
        } else {
          courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
        }
        const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
        courseName = courseMapping(courseName, institutionName);
        const siteDetails = fetchSiteDetails(courseName);
        const siteName = siteDetails.siteName;
        const app_login_url = siteDetails.app_login_url;
        const formType = dialCode == "+91" ? 'Domestic Application Form' : 'International Application Form';
        let mx_Category = '';
        if (siteName === "MAHE") { mx_Category = dialCode == "+91" ? "Indian" : "Foreign & NRI"; }
        const source = $(formSelector + " input[name=leadsquared-Source]").val();
        const utmCampaign = $(formSelector + " input[name=leadsquared-SourceCampaign]").val();
        const utmMedium = $(formSelector + " input[name=leadsquared-SourceMedium]").val();
        const utmContent = $(formSelector + " input[name=leadsquared-SourceContent]").val();
        const utmKeyword = $(formSelector + " input[name=leadsquared-mx_UTM_Keyword]").val();
        const utmAdset = $(formSelector + " input[name=leadsquared-mx_Marketing_Ad_Set]").val();
        const Adset_id = $(formSelector + " input[name=leadsquared-Adset_id]").val();
        const utmMatchType = $(formSelector + " input[name='leadsquared-mx_UTM_Matchtype']").val();
        const utmPlacement = $(formSelector + " input[name='leadsquared-mx_UTM_Placement']").val();
        const utmPosition = $(formSelector + " input[name='leadsquared-mx_UTM_Position']").val();
        const device = $(formSelector + " input[name=leadsquared-mx_Device]").val();
        const website = $(formSelector + " input[name=leadsquared-Website]").val();
        const location = $(formSelector + " input[name=leadsquared-mx_Location]").val();
        const ip_address = $(formSelector + " input[name=leadsquared-mx_Website_IP_Address]").val();
        const mx_mobile = $(formSelector + " input[name=leadsquared-mx_mobile]").val();
        const agentMedium = $(formSelector + " input[name='leadsquared-mx_Lead_Medium']").val();
        const gclid = $(formSelector + " input[name='leadsquared-mx_gclid']").val();
        const workExperience = $(formSelector + " select[name=leadsquared-mx_Student_Experience]").val();
        const token = $(formSelector + " #sub-token").val();
        const referer_url = $(formSelector + " input[name=referer_url]").val();
        const LeadFormName = $(formSelector + " input[name=LeadFormName]").val();
        const userCountry = $(formSelector + " input[name=userCountry]").val();
        $.ajax({
          url: ajaxURL,
          type: 'POST',
          dataType: 'json',
          data: {
            action: 'lead_form_submit',
            email: email,
            first_name: name,
            dialCode: dialCode,
            mobile_number: mobile_number,
            number: number,
            utm_source: source,
            utm_campaign: utmCampaign,
            utm_medium: utmMedium,
            utm_content: utmContent,
            utm_keyword: utmKeyword,
            utm_adset: utmAdset,
            Adset_id: Adset_id,
            utmMatchType: utmMatchType,
            utmPlacement: utmPlacement,
            utmPosition: utmPosition,
            device: device,
            website: website,
            location: location,
            ip_address: ip_address,
            course_name: courseName,
            site_name: siteName,
            mx_Category: mx_Category,
            formType: formType,
            agentMedium: agentMedium,
            gclid: gclid,
            workExperience: workExperience,
            token: token,
            referer_url: referer_url,
            LeadFormName: LeadFormName,
            userCountry: userCountry,
            institutionName: institutionName,
            mx_mobile: mx_mobile
          },
          success: function (response) {
            const dataPayload = {
              email: email,
              LeadFormName: LeadFormName,
              Course: courseName,
              University: siteName
            }
            customDataLayerPush(dataPayload);
            $(formSelector + ' .lead-submit').prop('disabled', false).text('Submit');
            if (response.status === 1) {
              if (formSelector === downloadForm) {
                downloadSubmission(formSelector);
              } else {
                successDisplay(formSelector, response);
                $(formSelector)[0] && $(formSelector)[0].reset();
              }
            } else {
              errorDisplay(formSelector, response);
            }
          },
          error: function () {
            $(formSelector + ' .lead-submit').prop('disabled', false).text('Submit');
            errorDisplay(formSelector, { message: 'Something went wrong. Please try again.' });
          }
        });
      }
    });
  }

  // Lead Form Submissions
  if ($(leadForm).length) { leadFormSubmission(leadForm); }
  if ($(enrollForm).length) { leadFormSubmission(enrollForm); }
  if ($(programLeadForm).length) { leadFormSubmission(programLeadForm); }
  if ($(footerLeadForm).length) { leadFormSubmission(footerLeadForm); }
  if ($(downloadForm).length) { leadFormSubmission(downloadForm); }
  if ($(enquiryForm).length) { leadFormSubmission(enquiryForm); }

  // LSQ Submission stub — login redirect removed
  const LSQSubmission = (formSelector, e) => {
    // No-op: third-party CRM/login redirect has been removed.
    return;
    let fetchLoginURL = $("#lsq-login-url").text();
    let formSubmitted = localStorage.getItem('formSubmitted');
    if (!fetchLoginURL) { fetchLoginURL = localStorage.getItem('loginURL'); }
    if (formSelector === downloadForm) {
      $(formSelector + " .lsq-submit").prop('disabled', true).text('Downloading...');
    }
    if (fetchLoginURL) {
      localStorage.setItem('loginURL', "");
      if (formSelector === enquiryForm) {
        const fileURL = $(".download-url").text();
        enquirySubmission(formSelector, fetchLoginURL, fileURL);
      } else {
        window.location.href = fetchLoginURL;
      }
    } else if (formSubmitted === "Yes") {
      let leadID = localStorage.getItem('leadID');
      const name = $(formSelector + " input[name=name]").val();
      const email = $(formSelector + " input[name=email]").val();
      const number = $(formSelector + " input[name=mobile_number]").val();
      const dialCode = $(formSelector + " .iti__selected-dial-code").text();
      const mobileNumber = dialCode + '-' + number;
      let courseName;
      if (window.location.pathname === '/online-ma-degrees-v2' || window.location.pathname === '/online-mba-operations-muj-smu-mahe' || window.location.pathname === '/online-mba-operations-muj-smu') {
        courseName = $(formSelector + " input[name=course_name]:checked").val()
          ? $(formSelector + " input[name=course_name]:checked").val()
          : $(formSelector + " select[name=course_name]").val();
      } else {
        courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
      }
      const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
      courseName = courseMapping(courseName, institutionName);
      const siteDetails = fetchSiteDetails(courseName);
      const siteName = siteDetails.siteName;
      const mobileUpdate = localStorage.getItem('mobileUpdate');
      $.ajax({
        type: 'POST',
        url: '/wp-admin/admin-ajax.php',
        dataType: 'json',
        data: {
          action: 'lsq_submit_data',
          email: email,
          site_name: siteName,
          mobile_number: mobileNumber,
          ProspectID: leadID,
          mobileUpdate: mobileUpdate,
          name: name,
          courseName: courseName
        },
        success: function (response) {
          localStorage.setItem('formSubmitted', "");
          localStorage.setItem('leadID', "");
          if (formSelector === downloadForm) {
            downloadSubmission(formSelector);
          } else {
            let loginURL = response.login_url;
            if (loginURL) {
              localStorage.setItem('loginURL', loginURL);
              $("#lsq-login-url").text(loginURL);
            } else {
              $(formSelector + " .lsq-submit").prop("disabled", true);
            }
          }
        }
      });
    }
  }

  // LSQ Submission on click of submit button
  $(document).on("click", leadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(leadForm, e); });
  $(document).on("click", enrollForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(enrollForm, e); });
  $(document).on("click", programLeadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(programLeadForm, e); });
  $(document).on("click", footerLeadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(footerLeadForm, e); });
  $(document).on("click", downloadForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(downloadForm, e); });
  $(document).on("click", enquiryForm + " .lsq-submit", function (e) { e.preventDefault(); LSQSubmission(enquiryForm, e); });

  // Override dropdown styling
  $('select').each(function () {
    $(this).select2({
      dropdownParent: $(this).parent(),
      placeholder: $(this).data('placeholder'),
      minimumResultsForSearch: 50,
    });
    $(this).one('select2:open', function (e) {
      $('input.select2-search__field').prop('placeholder', 'Search here...');
    });
    $(this).on('select2:open', function (e) {
      $('.select2-container--open .select2-selection__arrow').addClass("up_arrow");
    });
    $(this).on('select2:close', function (e) {
      $('.select2-selection__arrow').removeClass("up_arrow");
    });
  });

  const isNumeric = (value) => {
    return !isNaN(value) && !isNaN(parseFloat(value));
  }

  // Disable the submit button until all the fields are filled
  const checkFormFields = (formSelector) => {
    const submitButton = $(formSelector + ' .lead-submit');
    const name = $(formSelector + " input[name=name]").val();
    const email = $(formSelector + " input[name=email]").val();
    const dialCode = $(formSelector + " .mobileBlock .iti__selected-dial-code").text();
    const number = $(formSelector + " input[name=mobile_number]").val().trim();
    let courseName;

    if (window.location.pathname === '/online-ma-degrees-v2') {
      courseName = $(formSelector + " input[name=course_name]:checked").val()
        ? $(formSelector + " input[name=course_name]:checked").val()
        : $(formSelector + " select[name=course_name]").val();
    } else {
      courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
    }

    if (window.location.pathname === '/distance-ma' || window.location.pathname === '/online-ma') {
      courseName = $(formSelector + " select[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
    } else if (window.location.pathname === '/online-ma-degrees-v2' || window.location.pathname === '/online-mba-operations-muj-smu-mahe' || window.location.pathname === '/online-mba-operations-muj-smu') {
      courseName = $(formSelector + " input[name=course_name]:checked").val()
        ? $(formSelector + " input[name=course_name]:checked").val()
        : $(formSelector + " select[name=course_name]").val();
    } else {
      courseName = $(formSelector + " input[name=course_name]").val() ? $(formSelector + " input[name=course_name]").val() : $(formSelector + " select[name=course_name]").val();
    }

    const institutionName = $(formSelector + " input[name=institution]").val() ? $(formSelector + " input[name=institution]").val() : $(formSelector + " select[name=institution]").val();
    const termCondition = $(formSelector + " .terms-condition input").prop('checked') == true ? 'Yes' : 'No';

    let mobileNumberValidation = false;
    if (dialCode === "+91") {
      mobileNumberValidation = number.length === 10 ? true : false;
    } else {
      mobileNumberValidation = true;
    }

    // Pulse Animation Code Block
    const formsWithTerms = [
      downloadForm,
      enrollForm,
      leadForm,
      programLeadForm,
      footerLeadForm
    ];

    if (formsWithTerms.includes(formSelector)) {
      const $termsInput = $(formSelector + " .terms-condition input");
      const $termsLabel = $(formSelector + " .terms-condition label").eq(0);

      const isFormValid =
        name &&
        email &&
        validateEmail(email) &&
        number &&
        mobileNumberValidation &&
        isNumeric(number) &&
        courseName &&
        institutionName;

      const isChecked = $termsInput.prop('checked');

      if (isFormValid && !isChecked) {
        $termsInput.addClass('pulse-animate');
        $termsLabel.addClass('warn-blink-text');
      } else {
        $termsInput.removeClass('pulse-animate');
        $termsLabel.removeClass('warn-blink-text');
      }
    }

    if (name && email && validateEmail(email) && number && mobileNumberValidation && isNumeric(number) && courseName && institutionName && termCondition === "Yes") {
      submitButton.prop('disabled', false);
    } else {
      submitButton.prop('disabled', true);
    }
  }

  const formValidation = (formSelector) => {
    $(formSelector + " .institutionName select").prop("disabled", true);
    const submitButton = $(formSelector + ' .lead-submit');
    submitButton.prop('disabled', true);
    const requiredFields = [
      formSelector + " input[name=name]",
      formSelector + " input[name=email]",
      formSelector + " input[name=mobile_number]",
      formSelector + " .courseName select",
      formSelector + " .institutionName select",
      formSelector + " .terms-condition input",
      formSelector + " select.courseName",
    ];
    requiredFields.forEach((selector) => {
      $(selector).on('change input', function () {
        checkFormFields(formSelector);
      });
    });
  }

  const formValidationOmDegrees = (formSelector) => {
    $(formSelector + " .institutionName select").prop("disabled", true);
    const submitButton = $(formSelector + ' .lead-submit');
    submitButton.prop('disabled', true);
    const requiredFields = [
      formSelector + " input[name=name]",
      formSelector + " input[name=email]",
      formSelector + " input[name=mobile_number]",
      formSelector + " .courseName select",
      formSelector + " .institutionName select",
      formSelector + " .terms-condition input",
      formSelector + " select.courseName",
      formSelector + " input.courseName",
    ];
    requiredFields.forEach((selector) => {
      $(selector).on('change input', function () {
        checkFormFields(formSelector);
      });
    });
  }

  const universitySelection = (formSelector) => {
    $(document).on("change", formSelector + " select[name=course_name]", function () {
      const selVal = $(this).val();
      if (selVal) {
        $(formSelector + " .institutionName select").prop("disabled", false);
        const institutionSelector = $(formSelector + " select[name=institution]");
        $(institutionSelector).empty();
        const siteDetails = fetchSiteDetails(selVal);
        const institutionName = siteDetails.universityName;
        const institutionShortName = siteDetails.siteName;
        let MUJSMUCourses = ["MCA", "B.Com", "M.Com"];
        let MUJMAHECourses = ["BBA"];
        let newOptions = [];
        let selectUniversity = 'No';
        if (selVal == "MBA" || selVal == "MCA" || selVal == "B.Com" || selVal == "BBA") {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: 'MUJ', text: 'Manipal University Jaipur' },
            { id: 'MAHE', text: 'Manipal Academy of Higher Education' },
            { id: 'SMU', text: 'Sikkim Manipal University' }
          ];
        } else if (MUJMAHECourses.includes(selVal)) {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: 'MUJ', text: 'Manipal University Jaipur' },
            { id: 'MAHE', text: 'Manipal Academy of Higher Education' }
          ];
        } else if (MUJSMUCourses.includes(selVal)) {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: 'MUJ', text: 'Manipal University Jaipur' },
            { id: 'SMU', text: 'Sikkim Manipal University' }
          ];
        } else {
          newOptions = [
            { id: '', text: 'Select Institution*' },
            { id: institutionShortName, text: institutionName }
          ];
          selectUniversity = 'Yes';
        }
        newOptions.forEach(option => {
          const newOption = new Option(option.text, option.id, false, false);
          $(institutionSelector).append(newOption);
        });
        $(institutionSelector).trigger('change');
        selectUniversity === 'Yes' && $(institutionSelector).val(institutionShortName).trigger('change');
      }
    });
  }

  if (downloadForm.length) { formValidation(downloadForm); }
  if (leadForm.length) { formValidation(leadForm); universitySelection(leadForm); }
  if (enrollForm.length) { formValidation(enrollForm); universitySelection(enrollForm); }
  if (footerLeadForm.length) { formValidation(footerLeadForm); universitySelection(footerLeadForm); }
  if (enquiryForm.length) { formValidation(enquiryForm); universitySelection(enquiryForm); }
  if (window.location.pathname === '/online-ma-degrees-v2' || window.location.pathname === '/online-mba-operations-muj-smu-mahe' || window.location.pathname === '/online-mba-operations-muj-smu') {
    if (programLeadForm.length) { formValidationOmDegrees(programLeadForm); }
  } else {
    if (programLeadForm.length) { formValidation(programLeadForm); }
  }

  const switchScreen = (formSelector) => {
    $(formSelector + " .form-details-block").removeClass("hidden");
    $(formSelector + " .otp-verification-block").addClass("hidden");
  }

  const editForms = [
    leadForm,
    enrollForm,
    programLeadForm,
    footerLeadForm,
    downloadForm,
    enquiryForm,
    testimonialForm
  ];

  editForms.forEach(form => {
    $(document).on("click", `${form} .editLink`, function () {
      switchScreen(form);
    });
  });

  // Find my course popup functionality
  const body = document.body;
  if (body.classList.contains('page-template-home') || body.classList.contains('page-template-home-v2') || body.classList.contains('page-template-program-listing') || body.classList.contains('page-template-program-specializations-listing')) {
    // Function to check if all required fields in the current section are filled
    function validateSection(sectionId) {

      let isValid = true;
      // Iterate through all visible <select> elements inside the section
      $(`#${sectionId} select:visible`).each(function () {
        if (!$(this).val()) {
          isValid = false;
          return false; // Stop checking further if one invalid field is found
        }
      });

      return isValid;

    }
    // Function to toggle buttons based on validation
    function toggleButton(sectionId, buttonId) {
      const isSectionValid = validateSection(sectionId);
      $(`#${buttonId}`).prop("disabled", !isSectionValid);
    }
    // Event listener for changes in dropdown fields
    $(document).on("change", "#courseForm select", function () {
      const parentSection = $(this).closest(".form-section").attr("id");
      // Toggle the button based on the section
      if (parentSection === "section1") {
        toggleButton("section1", "find-course");
      }
    });
    // Initial validation check for each section
    toggleButton("section1", "nextBtn");
    toggleButton("section2", "findCourseBtn");

    $("#institution_field, #duration, #domain").on("select2:selecting", function (e) {
      $(this).select2("close");
    });
  }

  // Start of Personalization Functionality
  $(document).on("click", personalizationForm + " .move-forward", function (e) {
    e.preventDefault();

    const currentBlock = $(this).parents(".formBlock").attr("id");
    const nextBlock = $(this).parents(".formBlock").next(".formBlock").attr("id");

    // Education step
    if (currentBlock === "getStarted" || currentBlock === "education") {
      $("#" + currentBlock).addClass("hidden");
      $("#" + nextBlock).removeClass("hidden");
      $(".progress-bar").show();
    }
    if (currentBlock === "getStarted") {
      $(".progress-bar").removeClass("hidden");
    } else if (currentBlock === "education") {
      $(".progress-bar .moving-bar").css("width", "66.66%");
      $(".moving-bar").text('').text('2/3');

    }
    // interested in step
    if (currentBlock === "interestedField") {
      const interestedInFields = document.querySelectorAll("#" + currentBlock + " input[type='checkbox']");
      const interestedFieldChecked = Array.from(interestedInFields).some(interestedInFields => interestedInFields.checked);
      if (!interestedFieldChecked) {
        alert("Please select at least one option.");
      } else {
        $("#" + currentBlock).addClass("hidden");
        $("#" + nextBlock).removeClass("hidden");
        $(".progress-bar .moving-bar").css("width", "100%");
        $(".moving-bar").text('').text('3/3');
      }
    }
    // blog category in step
    if (currentBlock === "blogCategory") {
      const interestedInFields = document.querySelectorAll("#" + currentBlock + " input[type='checkbox']");
      const blogCategoryChecked = Array.from(interestedInFields).some(interestedInFields => interestedInFields.checked);
      if (!blogCategoryChecked) {
        alert("Please select at least one option.");
      } else {
        $("#" + currentBlock).addClass("hidden");
        $("#" + nextBlock).removeClass("hidden");
      }
    }
    $("#prevStep").attr("data-back-step", currentBlock);
    currentBlock === "getStarted" ? $("#prevStep").removeClass("hidden") : currentBlock === "blogCategory" ? $("#prevStep").addClass("hidden") : null;
  });

  // Back button
  $(document).on("click", ".back-btn", function (e) {
    e.preventDefault();
    const currentValue = $(this).attr("data-back-step");

    if (currentValue === "getStarted") {
      $(".progress-bar").hide();
    }
    if (currentValue === "education") {
      $(".moving-bar").text('').text('1/3');
      $(".progress-bar .moving-bar").css("width", "33.33%");
    }
    if (currentValue === "interestedField") {
      $(".moving-bar").text('').text('2/3');
      $(".progress-bar .moving-bar").css("width", "66.66%");
    }
    const prevBlock = $("#" + currentValue + ".formBlock").prev(".formBlock").attr("id");
    $(this).attr("data-back-step", prevBlock);
    prevBlock === undefined ? $(this).addClass("hidden") : null;
    $(personalizationForm + ' .formBlock').each(function () {
      !$(this).hasClass("hidden") ? ($(this).addClass("hidden"), $("#" + currentValue).removeClass("hidden")) : null;
    });
  });

  // Build personalization page url
  $(document).on("click", personalizationForm + " .final-submit", function (e) {
    document.body.style.overflow = "";
    e.preventDefault();
    const interestedInFields = document.querySelectorAll("#blogCategory input[type='checkbox']");
    const blogCategoryChecked = Array.from(interestedInFields).some(interestedInFields => interestedInFields.checked);
    if (!blogCategoryChecked) {
      alert("Please select at least one option.");
    } else {
      $("#blogCategory").addClass("hidden");
      $("#loading-screen").removeClass("hidden");
      $(".progress-bar").addClass("hidden");
      const education = $('input[name="education"]:checked').val();
      const interestedIn = [];
      $('input[name="interested"]:checked').each(function (i) {
        interestedIn[i] = $(this).val();
      });

      let selectedCategories = []
      $('input[name="categories[]"]:checked').each(function (i) {
        selectedCategories[i] = $(this).val();
      });
      // Course cards filter
      let presonalizationData = '';
      presonalizationData = {
        "personalization_mode": "active",
        "education": education,
        "interested_in": interestedIn,
        "blog_categories": selectedCategories
      };
      localStorage.setItem('presonalizationData', JSON.stringify(presonalizationData));
      personalizationFilter('popupformsubmit');
    }
  });

  // Exit personalization filter
  $(document).on("click", " .exit", function (e) {
    localStorage.removeItem("presonalizationData");
    window.location.reload();
  });

  // Edit personalization filter
  $(document).on("click", " .edit", function (e) {
    $("#personalizationForm .formBlock").addClass("hidden");
    $("#personalizationForm #education.formBlock").removeClass("hidden");
    $("#prevStep").removeClass("hidden");
    $("#prevStep").attr("data-back-step", "getStarted");
    //personalizationFilter('dataEdit');
  });
  personalizationFilter();

  const passingUTMParameters = (domainName) => {
    $('a').each(function () {
      const text = $(this).attr("href");
      if (text && text.indexOf(domainName) != -1) {
        const utmParam = localStorage.getItem('utm_parameters');
        $(this).attr("href", $(this).attr("href") + utmParam);
      }
    });
  }

  // Passing utm sources to enrol now url
  const search = window.location.search;
  const searchString = 'utm_source';
  if (search && search.indexOf(searchString) != -1) {
    localStorage.setItem('utm_parameters', search);
    passingUTMParameters("mahe.onlinemanipaladmission.in");
    passingUTMParameters("smu.onlinemanipaladmission.in");
    passingUTMParameters("muj.onlinemanipaladmission.in");
  } else {
    const utmParam = localStorage.getItem('utm_parameters');
    if (utmParam && utmParam.indexOf(searchString) != -1) {
      localStorage.setItem('utm_parameters', utmParam);
      passingUTMParameters("mahe.onlinemanipaladmission.in");
      passingUTMParameters("smu.onlinemanipaladmission.in");
      passingUTMParameters("muj.onlinemanipaladmission.in");
    }
  }

  // Passing hidden values to LSQ form
  let deviceType = 'Desktop';
  deviceType = width < 480 ? "Mobile" : width < 768 ? "Tablet" : "Desktop";
  const sourceLocation = $(".source-location").text();
  const sourceIPAddress = $(".source-ip-address").text();
  const websitePath = window.location.href;
  $("input[name='leadsquared-mx_Location']").val(sourceLocation);
  $("input[name='leadsquared-mx_Device']").val(deviceType);
  $("input[name='leadsquared-mx_Website_IP_Address']").val(sourceIPAddress);
  $("input[name='leadsquared-Website']").val(websitePath);

  const append_referer_url = () => {
    const referer_url = document.referrer || window.location.href; $("<input>", { type: "hidden", name: "referer_url", value: referer_url }).appendTo("form");
  }
  append_referer_url();

  const enquirySubmission = (formSelector, app_login_url, brochure_url) => {
    $(formSelector + " .otp-verification-block").hide();
    $(formSelector + " .form-details-block").hide();
    $(formSelector + " .enquiry-block").show();
    const thankyouMsg = brochure_url ? '<p>Thank you for your interest. Our counsellor will get back to you.</p><div class="btns"><a href="' + app_login_url + '" class="btn primaryBtn">Start Your Application</a><a href="' + brochure_url + '" class="btn primaryBtn">Download Brochure</a></div>' : '<p>Thank you for your interest. Our counsellor will get back to you.</p><div class="btns"><a href="' + app_login_url + '" class="btn primaryBtn">Start Your Application</a></div>';
    $(formSelector + " .enquiry-block").html(thankyouMsg);
  }

  // LP Course Selection Functionality
  const lpCourseSelection = (formSelector) => {
    $(document).on("change", formSelector + " select[name=course_name]", function () {
      var selectedValue = $(this).val().trim();
      const courseDetails = fetchSiteDetails(selectedValue);
      courseDetails.universityName && $(formSelector + ' input[name="institution"]').val(courseDetails.universityName);
      if (courseDetails.universityName) {
        if (courseDetails.universityName == "Manipal Academy of Higher Education") {
          uni_short_name = "MAHE";
        } else if (courseDetails.universityName == "Manipal University Jaipur") {
          uni_short_name = "MUJ";
        } else {
          uni_short_name = "SMU";
        }
        storedUniShortName = uni_short_name;

      } else {
        uni_short_name = storedUniShortName;
      }

      $("#university-url").text(uni_short_name);
      checkFormFields(formSelector);
    });
  }

  const allowedPaths = [
    "/online-bachelors-degrees-courses",
    "/online-bachelors-degree",
    "/online-masters-degrees-courses",
    "/mahe-online-degree-courses-v2",
    "/mahe-online-degree-courses",
    "/muj-online-degree-courses",
    "/smu-online-degree-courses",
    "/online-degree-courses",
    "/online-masters-degrees",
    "/online-bachelors-degree-courses",
    "/international/online-degree-courses",
    "/nepal/online-degree-courses",
    "/international/online-degree-courses-v2",
    "/online-bba-courses",
    "/online-bcom-courses",
    "/online-mba-courses",
    "/online-mca-courses",
    "/online-mcom-courses",
    "/online-ma-courses",
    "/online-msc-courses",
    "/online-mba-degrees-v3",
    "/online-bba-degrees",
    "/online-bba-course",
    "/online-bcom-degrees",
    "/online-mba-degrees",
    "/online-mba-programs",
    "/online-mba-degree",
    "/international/online-mba-degree",
    "/online-mca-degree",
    "/online-bcom-degree",
    "/online-mca-degrees",
    "/online-mcom-degrees",
    "/online-mba-degrees",
    "/online-ma",
    "/online-bcom-degree-muj-smu",
    "/online-mba-operations-muj-smu-mahe",
    "/online-mba-operations-muj-smu",
    "/online-degree-courses-all-manipal-universities",
    "/online-degree-courses-all-manipal-universities-v2",
    "/international/mahe-online-degree-courses",
    "/online-mba-courses/admission-fee-eligibility-details",
    "/online-mca-courses/admission-fee-eligibility-details",
    "/online-bba-courses/admission-fee-eligibility-details",
    "/online-bcom-courses/admission-fee-eligibility-details",
    "/online-ma-courses/admission-fee-eligibility-details",
    "/online-msc-courses/admission-fee-eligibility-details",
    "/online-mcom-courses/admission-fee-eligibility-details",
    "/online-mba-courses/subjects",
    "/online-mca-courses/subjects",
    "/online-bba-courses/subjects",
    "/online-bcom-courses/subjects",
    "/online-ma-courses/subjects",
    "/online-msc-courses/subjects",
    "/online-mcom-courses/subjects",
    "/online-mba-courses/career-guide",
    "/online-mca-courses/career-guide",
    "/online-bba-courses/career-guide",
    "/online-bcom-courses/career-guide",
    "/online-ma-courses/career-guide",
    "/online-msc-courses/career-guide",
    "/online-mcom-courses/career-guide",
    "/online-mba-course",
    "/global/online-mba-courses/admission-fee-eligibility-details",
    "/global/online-mca-courses/admission-fee-eligibility-details",
    "/global/online-bba-courses/admission-fee-eligibility-details",
    "/global/online-bcom-courses/admission-fee-eligibility-details",
    "/global/online-ma-courses/admission-fee-eligibility-details",
    "/global/online-msc-courses/admission-fee-eligibility-details",
    "/global/online-mcom-courses/admission-fee-eligibility-details",
    "/global/online-mba-courses/subjects",
    "/global/online-mca-courses/subjects",
    "/global/online-bba-courses/subjects",
    "/global/online-bcom-courses/subjects",
    "/global/online-ma-courses/subjects",
    "/global/online-msc-courses/subjects",
    "/global/online-mcom-courses/subjects",
    "/nepal/online-degree-courses-v2",
  ];

  if (allowedPaths.includes(pathName)) {
    $(leadForm).length && lpCourseSelection(leadForm);
    $(footerLeadForm).length && lpCourseSelection(footerLeadForm);
    $(programLeadForm).length && lpCourseSelection(programLeadForm);
    $(downloadForm).length && lpCourseSelection(downloadForm);
  }
  // For global pages (download form)
  if (pathName.startsWith("/global/")) {
    $(downloadForm).length && lpCourseSelection(downloadForm);
  }

});

function scrollToDiv() {
  var target = $(".top-action-bar");
  if (target.length) {
    $("html,body").animate(
      {
        scrollTop: target.offset().top - 200,
      },
      1000
    );
    return false;
  }
}

// common function for personalization popup
function personalizationPopup_utilities() {
  setTimeout(function () {
    $("#personalizationForm_popup").addClass("hidden");
    $("#loading-screen").addClass("hidden");
    $("#education").removeClass("hidden");
    $("#overlay").removeClass("show");
    $("body").removeClass("overflow-hidden");
    $("header").removeClass("header-hidden");
  }, 3000);
  scrollToDiv();
}

function personalizationResultUtilities() {
  const headerHeight = $("header").outerHeight();
  const bannerHeight = $(".home-banner").outerHeight();
  $("body").addClass("personalized-result");
  $(".top-action-bar").removeClass("hidden");
  const topActionBar = $(".top-action-bar").outerHeight();
  $(".top-action-bar").css("top", headerHeight);
}

function personalizationHideSections() {
  $(".find-right-course .left, .find-right-course .right, .find-right-course .view-all-btn, .choose-course, .personalization-btn").addClass("hidden");
  $(".demand-specialization").addClass("hidden");
  $(".top-section .view-all-btn").removeClass("hidden");
}

function personalizationFilter(dataPara = '') {
  var parameterEdit = dataPara;
  const presonalizationData = JSON.parse(localStorage.getItem("presonalizationData"));
  $('.submenu .tab-btn').removeClass('active');
  $('.content-area .tab-panel').removeClass('active');
  if (presonalizationData) {

    if (presonalizationData.education == 'High School Graduate') {
      const menuBachelor = document.querySelector('[data-tab="section1-bachelor"]');
      $('#section1-bachelor').addClass('active');
      if (menuBachelor) {
        menuBachelor.classList.toggle("active");
      }
    } else if (presonalizationData.education == 'Bachelor Degree' || presonalizationData.education == 'Master Degree') {
      const menuMaster = document.querySelector('[data-tab="section1-master"]');
      $('#section1-master').addClass('active');
      if (menuMaster) {
        menuMaster.classList.toggle("active");
      }
    }

    const education = presonalizationData.education;
    const interestedIn = presonalizationData.interested_in;
    const blog_categories = presonalizationData.blog_categories;
    var urlpage = window.location.pathname;

    var personalizationCourses = localStorage.getItem("personalizationCourses");
    var personalizationBlogs = localStorage.getItem("personalizationBlogs");

    if (personalizationCourses) {
      var tempPersonalizationCourses = document.createElement('div');
      tempPersonalizationCourses.innerHTML = personalizationCourses;

      var courseCount = tempPersonalizationCourses.querySelectorAll('.line-item').length;

      setTimeout(function () {
        if (courseCount <= 4) {
          $(".top-course-slider .slick-dots").css("display", "none");
        } else {
          $(".top-course-slider .slick-dots").css("display", "block");
        }
      }, 100);
    }

    if (!personalizationCourses) {
      fetchBlogandCourses(education, interestedIn, blog_categories, urlpage);
    } else if (parameterEdit == 'popupformsubmit' && personalizationCourses !== null) {
      fetchBlogandCourses(education, interestedIn, blog_categories, urlpage);
    } else {
      //Courses
      var personalizationCourseCookie = decodeURIComponent(personalizationCourses || '');
      $(".courses-slider").replaceWith(personalizationCourseCookie);
      personalizationResultUtilities();
      if ($(".top-course-slider").length) {
        setTimeout(function () {
          topOnlineCourseSliderInitialize();
        }, 500);
      }

      //Blogs
      var personalizationBlogCookie = decodeURIComponent(personalizationBlogs || '');
      $(".top-read-blog-slider").replaceWith(personalizationBlogCookie);
      personalizationResultUtilities();
      if ($(".top-read-blog-slider").length) {
        setTimeout(function () {
          blogSliderInitialize(true);
        }, 100);
      }
      personalizationHideSections();
      scrollToDiv();
    }
  } else {
    if (body.classList.contains('page-template-home-v2')) {
      const allDegree = document.querySelector('[data-tab="section1-allprogram"]');
      $('#section1-allprogram').addClass('active');
      if (allDegree) {
        allDegree.classList.toggle("active");
      }
    } else {
      const menuMaster = document.querySelector('[data-tab="section1-master"]');
      $('#section1-master').addClass('active');
      if (menuMaster) {
        menuMaster.classList.toggle("active");
      }
    }
  }
}

function fetchBlogandCourses(education, interestedIn, blog_categories, urlpage) {
  $.ajax({
    url: "/wp-admin/admin-ajax.php",
    type: "POST",
    dataType: "html",
    data: {
      action: "personalize_courses",
      education: education,
      interestedIn: interestedIn,
      url: urlpage,
    },
    success: function (response) {
      personalizationPopup_utilities();
      $(".top-online-course .section-title").text("Courses for you");
      $(".universities-section .section-title").text("Get a degree from our 3 esteemed universities");
      if (!response || $.trim(response) === "") {
        $(".top-online-course").css("margin-bottom", "0");
        $(".top-course-slider").html("No result found.");
        $("body").removeClass("overflow-hidden");
        personalizationPopup_utilities();
        personalizationResultUtilities();
        personalizationHideSections();
      } else {
        $(".courses-slider").replaceWith(response);
        localStorage.removeItem("personalizationCourses");
        localStorage.setItem("personalizationCourses", response);
        personalizationResultUtilities();

        //Hide fee in personalisation result course card if URL contains /global
        if (window.location.pathname.includes("/global")) {
          $(".pricing").find("*:not(.shortName)").hide();
        }

        if ($(".top-course-slider").length) {
          setTimeout(function () {
            topOnlineCourseSliderInitialize();
          }, 500);
        }
        personalizationHideSections();
      }
      cardlenght = $('.top-course-slider .line-item').length;
      const resolution = $(window).width()
      if (resolution <= 768) {
        cardshow = 1;
      } else {
        cardshow = 4;
      }
      setTimeout(() => {
        if (cardlenght <= cardshow) {
          $('.top-course-slider .slick-dots').hide();
        }
      }, "1000");
    },
  });

  // blog cards filter
  $.ajax({
    url: "/wp-admin/admin-ajax.php",
    type: "POST",
    dataType: "html",
    data: {
      action: "personalize_blogs",
      categories: blog_categories,
    },
    success: function (response) {
      personalizationPopup_utilities();
      $(".read-blog-section .section-title").text("Resources to ace your career");
      $(".universities-section .section-title").text("Get a degree from our 3 esteemed universities");
      if (!response || $.trim(response) === "No posts found.") {
        $(".top-online-course").css("margin-bottom", "0");
        $(".top-read-blog-slider").html("No result found.");
        $("body").removeClass("overflow-hidden");
        personalizationPopup_utilities();
        personalizationResultUtilities();
        personalizationHideSections();
      } else {
        $(".top-read-blog-slider").replaceWith(response);
        localStorage.removeItem('personalizationBlogs');
        localStorage.setItem('personalizationBlogs', response);
        personalizationResultUtilities();
        if ($(".top-read-blog-slider").length) {
          setTimeout(function () {
            blogSliderInitialize(true);
          }, 100);
        }
        personalizationHideSections();
      }
    },
  });
}

$(document).on("change", "#institution_field", function () {
  var institution = $("#institution_field").val();
  setTimeout(function () {
    if (institution == "12th") {
      $(".al-ml-with").css("display", "block");
      $(".al-ml").css("display", "none");
      $("#domain1").val('').trigger("change");
    } else {
      $(".al-ml-with").css("display", "none");
      $(".al-ml").css("display", "block");
      $("#domain").val('').trigger("change");
    }
  }, 500);
});

// User Revisit Tracking
jQuery(window).on('load', function ($) {

  function userRevisitTracking(prospectId, siteName) {
    const currentTimestamp = Date.now();
    const source = jQuery("input[name=leadsquared-Source]").val() ? jQuery("input[name=leadsquared-Source]").val() : 'Direct Traffic';
    const device = jQuery("input[name=leadsquared-mx_Device]").val();
    const website = jQuery("input[name=leadsquared-Website]").val();
    const location = jQuery("input[name=leadsquared-mx_Location]").val();
    const ip_address = jQuery("input[name=leadsquared-mx_Website_IP_Address]").val();
    jQuery.ajax({
      type: 'POST',
      url: '/wp-admin/admin-ajax.php',
      dataType: 'json',
      data: {
        action: 'revisitTracking',
        utm_source: source,
        device: device,
        website_url: website,
        location: location,
        ip_address: ip_address,
        prospectId: prospectId,
        site_name: siteName
      },
      success: function (res) {
        if (res.status === 1) {
          setCustomCookie("_" + siteName + "_revisitTime", currentTimestamp);
        }
      }
    });
  }

  function time_diff(dt2, dt1) {
    if (dt2 && dt1) {
      var res = Math.abs(dt2 - dt1) / 1000;
      var hours = Math.floor(res / 3600) % 24;
      return hours;
    } else {
      return false;
    }
  }

  setTimeout(function () {
    const MUJProspectId = getCustomCookie("_MUJ_prospectId");
    const MAHEProspectId = getCustomCookie("_MAHE_prospectId");
    const SMUProspectId = getCustomCookie("_SMU_prospectId");
    const MUJRevisitTime = getCustomCookie("_MUJ_revisitTime");
    const MAHERevisitTime = getCustomCookie("_MAHE_revisitTime");
    const SMURevisitTime = getCustomCookie("_SMU_revisitTime");
    const currentTimestamp = Date.now();
    if (MUJProspectId && (!MUJRevisitTime || (time_diff(MUJRevisitTime, currentTimestamp) >= 3))) {
      userRevisitTracking(MUJProspectId, "MUJ");
    }
    if (MAHEProspectId && (!MAHERevisitTime || (time_diff(MAHERevisitTime, currentTimestamp) >= 3))) {
      userRevisitTracking(MAHEProspectId, "MAHE");
    }
    if (SMUProspectId && (!SMURevisitTime || (time_diff(SMURevisitTime, currentTimestamp) >= 3))) {
      userRevisitTracking(SMUProspectId, "SMU");
    }
  }, 5000);

});

// set form name on button click
$(document).on("click", ".btn-position", function () {
  const buttonPosition = $(this).attr('data-position');
  const buttonForm = $(this).attr('data-form');
  setFormName(buttonPosition, buttonForm);
});
const setFormName = (buttonPosition, buttonForm) => {
  $("#" + buttonForm + ' input[name="LeadFormName"]').val(buttonPosition);
}

$(document).on("change", "#course_name_select", function () {

  const course = $(this).val();
  $("#course_name_val").val(course);

  const brochures = {
    "MBA": "/wp-content/uploads/2022/11/MUJ_Domestic_MBA-1.pdf",
    "BBA": "/wp-content/uploads/2022/11/MUJ_Domestic_BBA.pdf",
    "BCA": "/wp-content/uploads/2022/11/MUJ_Domestic_BCA-1-1.pdf",
    "MCA": "/wp-content/uploads / 2022 / 11 / MCA_Domestic_MUJ - 2.pdf",
    "B.Com": "/wp-content/uploads/2022/11/MUJ_Domestic_BCOM.pdf",
    "M.Com": "/wp-content/uploads/2022/11/MUJ_Domestic_MCOM-2.pdf",
    "MA.JMC": "/wp-content/uploads/2022/11/MUJ_Domestic_MAJMC-1.pdf",
    "MA in Economics":
      "/wp-content/uploads/2024/03/MUJ_MA-ECONOMICS_DOMESTIC.pdf",

    "MBA-SMU": "/wp-content/uploads/2024/07/SMU-MBA-Domestic-Brochure.pdf",
    "MCA-SMU": "/wp-content/uploads/2023/09/SMU-MCA-Domestic-Brochure.pdf",
    "BBA-SMU": "/wp-content/uploads/2025/02/SMU-BBA.pdf",
    "BA": "/wp-content/uploads/2023/06/SMU-BA-Domestic-Brochure-1.pdf",
    "MA in English":
      "/wp-content/uploads/2023/06/SMU-MA-English-Domestic-Brochure-1.pdf",
    "MA in Political Science":
      "/wp-content/uploads/2023/06/SMU-MA-Political-Science-Domestic-Brochure-1.pdf",
    "MA in Sociology":
      "/wp-content/uploads/2023/06/SMU-MA-Sociology-Domestic-Brochure-1.pdf",
    "MCOM": "/wp-content/uploads/2023/09/SMU-MCOM-Domestic-Brochure.pdf",
    "BCOM": "/wp-content/uploads/2023/09/SMU-BCOM-Domestic-Brochure.pdf",
    "BBA-SMU": "/wp-content/uploads/2025/02/SMU-BBA.pdf",

    "BBA-MAHE": "/wp-content/uploads/2024/03/MAHE-BBA-Domestic.pdf",
    "B.Com-MAHE": "/wp-content/uploads/2025/07/1.-BCom-Domestic.pdf",
    "Master of Business Administration":
      "/wp-content/uploads/2022/11/MAHE-MBA-Brochure-2023.pdf",
    "MCA-MAHE": "/wp-content/uploads/2024/03/MAHE-Domestic-Brochure-MCA.pdf",
    "MSc Data Science":
      "/wp-content/uploads/2022/11/MAHE-MSC-DS-Brochure-2023.pdf",
    "MSc Business Analytics":
      "/wp-content/uploads/2022/11/MAHE-MSC-BA-Brochure-2023.pdf",
    "PGCP Business Analytics":
      "/wp-content/uploads/2022/11/MAHE-PGCP-BA-Brochure-2023.pdf",
    "PGCP Logistics and Supply Chain":
      "/wp-content/uploads/2022/11/MAHE-Domestic-PGCP-SCM2.pdf",
    "PGCP Data Science":
      "/wp-content/uploads/2024/03/MAHE-Domestic-PGCP-DS.pdf",
    "PGD Entrepreneurship and Innovation":
      "/wp-content/uploads/2024/06/MAHE-Domestic-PGCP-EI.pdf",
    "MSc in Mathematics": "/wp-content/uploads/2025/05/MUJ-MSc-Mathematics.pdf",
  };

  const pdf_url = brochures[course] || "";
  $(".download-url").text(pdf_url);
});


$(document).on("mousedown", ".fancybox__container", function (e) {
  const overlayPopup = document.getElementById("overlay");

  // if click is outside pdfPopup
  if (!$(e.target).closest("#pdfPopup").length) {
    overlayPopup.classList.remove("show");
    $(".header").css("display", "block");
    document.querySelectorAll(".popupoverlay").forEach(p => p.classList.add("hidden"));
  }

});

// ── Testimonial form AJAX submission ─────────────────────────────────────────
(function ($) {
  $(document).on('submit', '#testimonialForm', function (e) {
    e.preventDefault();
    var $form   = $(this);
    var $submit = $form.find('button[type="submit"], input[type="submit"]');
    var $success = $form.find('#successMessage');
    var $error   = $form.find('#errorMessage');

    $submit.prop('disabled', true).text('Submitting…');
    $success.addClass('hidden').html('');
    $error.addClass('hidden').html('');

    var formData = new FormData(this);

    fetch('/submit-testimonial.php', {
      method: 'POST',
      body: formData
    })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        $submit.prop('disabled', false).text('Submit');
        if (res.status === 1) {
          $success.removeClass('hidden').html(res.message).fadeIn('slow');
          $form[0].reset();
          setTimeout(function () { $success.fadeOut('slow'); }, 10000);
        } else {
          $error.removeClass('hidden').html(res.message || 'Something went wrong.').fadeIn('slow');
          setTimeout(function () { $error.fadeOut('slow'); }, 8000);
        }
      })
      .catch(function () {
        $submit.prop('disabled', false).text('Submit');
        $error.removeClass('hidden').html('Network error. Please try again.').fadeIn('slow');
      });
  });
}(jQuery));

const overlayPopup = document.getElementById("overlay");
if (overlayPopup) {
  overlayPopup.addEventListener("click", () => {
    overlayPopup.classList.remove("show");
    $(".header").css("display", "block");
    document.querySelectorAll(".popupoverlay").forEach(p => p.classList.add("hidden"));

    //toggleBodyScroll(false);
  });
}
