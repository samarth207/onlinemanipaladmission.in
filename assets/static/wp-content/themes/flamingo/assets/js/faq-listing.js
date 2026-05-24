jQuery(document).ready(function ($) {
  // setTimeout(() => {
  //   $("#faq_sec #Admission div.item").eq(0).find(".accordion-header").click();
  // }, 1500);

  // FAQ Listing start
  if ($(".faq").length > 0) {
    var pathName = window.location.href;
    if (pathName.indexOf("global") > -1) {
      pageType = "International";
    } else {
      pageType = "Domestic";
    }
    if ((!body.classList.contains("page-template-seo-all-courses-page") && !body.classList.contains("page-template-msc-degrees-generic") && !body.classList.contains("page-template-seo-all-courses-page-v2") && !body.classList.contains("page-template-msc-degrees-generic-v2"))&& pageType === "Domestic") {
      var tabs_array = [
        "General",
        "GENERAL",
        "Admission",
        "Academics",
        "Program",
        "PROGRAM",
        "ADMISSION",
        "ACADEMICS",
      ];
      $.each(tabs_array, function (index, value) {
        if ($(".faq #" + value + "  .item").length > 5) {
          $("#" + value + "  .item").hide();
          $("#" + value + "  .item")
            .slice(0, 5)
            .show();
          $("#" + value).append(
            "<div class='show-all-link faq-" +
              value +
              "-show-more faq-show-more'><span>Load More</span></div>"
          );
        }
      });
      $(".tabcontent").on("click", ".faq-show-more", function (e) {
        var tab_id = $(this).parents(".tabcontent").attr("id");
        var faq_count = $("#" + tab_id + " .item").length;
        $("#" + tab_id + " .item")
          .slice(0, faq_count)
          .show();
        $(".faq-" + tab_id + "-show-more").css("display", "none");
        $("#" + tab_id).append(
          "<div class='show-all-link faq-" +
            tab_id +
            "-show-less faq-show-less'><span>Load Less</span></div>"
        );
      });
      
      $(".tabcontent").on("click", ".faq-show-less", function (e) {
        var tab_id = $(this).parents(".tabcontent").attr("id");

        // Get the position of the FAQ section before hiding elements
        var faqSection = $("#" + tab_id);
        var faqTop = faqSection.offset().top;

        $("#" + tab_id + " .item").hide();
        $("#" + tab_id + " .item")
          .slice(0, 5)
          .show();
        $(".faq-" + tab_id + "-show-less").css("display", "none");

        $("#" + tab_id).append(
          "<div class='show-all-link faq-" +
            tab_id +
            "-show-more faq-show-more'><span>Load More</span></div>"
        );
        
        $("html, body").animate(
          {
            scrollTop: faqTop - 100,
          },
          50
        );
      });
    }
  }
});

