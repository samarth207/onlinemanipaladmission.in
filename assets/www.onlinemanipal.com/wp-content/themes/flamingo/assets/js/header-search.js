jQuery(function ($) {

  const $input = $('#header-search');
  const $coursesList = $('#popularCourses');
  const $institutionsList = $('#institutions');
  const $specialisationsWrap = $('#Specialisations');
  const $coursesTag = $('#coursesTag');
  const $resourcesList = $('#resources');
  // const $faqList = $('#faq');

  let jsonData = null;
  let fetchedUri = null;

  // ----------------------------
  // Utility Functions
  // ----------------------------

  function debounce(fn, delay) {
    let timer = null;
    return function () {
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(() => fn.apply(this, args), delay);
    };
  }

  function escapeHtml(text) {
    return $('<div>').text(text).html();
  }

  function createCourseItem(item) {
    // Ensure item has score property for debugging, but use original data for rendering
    const scoreText = item.score ? ` (Score: ${item.score})` : ''; 
    return `
      <a href="${item.link || '#'}">
        <li>${escapeHtml(item.name || '')} (${escapeHtml(item.university || '')})</li>
      </a>
    `;
  }

  function createInstituteItem(item) {
    return `
      <a href="${item.link || '#'}">
        <li>${escapeHtml(item.name || '')}</li>
      </a>
    `;
  }

  function createFAQItem(item) {
    return `
      <a href="#" class="question">${escapeHtml(item.name || '')}</a>
    `;
  }

  // function createSpecialisationItem(item) {
  //   return `
  //     <div class="specialisation-item">
  //       <a href="${item.link || '#'}">
  //         <div class="specialisation-course">
  //           <p class="specialization-title">${item.name}</p>
  //         </div>
  //       </a>
  //     </div>
  //   `;
  // }

  // Slick helpers
  function initSlick() {
    if (!$specialisationsWrap.hasClass('slick-initialized')) {
      $specialisationsWrap.slick({
        slidesToShow: 5.5,
        slidesToScroll: 1,
        dots: false,
        arrows: false,
        infinite: false,
        autoplay: false,
        variableWidth: true,
        touchThreshold: 10,
        responsive: [
          { breakpoint: 1025, settings: { slidesToShow: 4 } },
          { breakpoint: 900, settings: { slidesToShow: 2.5 } },
          { breakpoint: 640, settings: { slidesToShow: 1.8, centerMode: false } }
        ],
      });
    }
  }

  function destroySlick() {
    if ($specialisationsWrap.hasClass('slick-initialized')) {
      $specialisationsWrap.slick('unslick');
    }
  }

  // ----------------------------
  // Fetch Search Data
  // ----------------------------

  function fetchData() {
    if (jsonData) return $.Deferred().resolve(jsonData);

    const jsonUrl = `/wp-content/themes/flamingo/assets/js/search-data.json`;

    return $.getJSON(jsonUrl)
      .done(data => {
        jsonData = {
          courseData: data.courseData || [],
          institutions: data.institutions || [],
          // specialisations: data.specialisations || [],
          resources: data.resources || [],
        };
      })
      .fail(() => {
        jsonData = { courseData: [], institutions: [], specialisations: [], resources: [] };
      });
  }

  // ----------------------------
  // Filtering & Scoring Logic
  // ----------------------------

  const FIELD_MAP = {
    course: [
      'name',
      'keyword',
      'university',
      'course_short_name',
      'university_short_heading',
      'info',
      'program_benefits',
      'ranking_details',
      'electives_available',
      'program_curriculum',
      'job_roles',
      'industries',
      'certificate_details',
      'eligibility',
      'faculty_details',
      'testimonial_details',
      'faq_details', 
      'custom_keywords',
      'program_entity',
      'secondary_title',
      'general_keywords'
    ],
    // specialisation: [
    //   'name',
    //   'keyword',
    //   'university',
    //   'course_short_name',
    //   'university_short_heading',
    //   'info',
    //   'program_benefits',
    //   'ranking_details',
    //   'electives_available',
    //   'program_curriculum',
    //   'job_roles',
    //   'industries',
    //   'certificate_details',
    //   'eligibility',
    //   'faculty_details',
    //   'testimonial_details',
    //   'faq_details', 
    //   'custom_keywords'
    // ],
    institution: [
      'name',
      'keyword',
      'courses',
      'custom_keywords'
    ]
  };

  /**
   * Deeply checks if a search term is contained within a data value (string, array, or object).
   */
  const contains = (data, search) => {
    if (!data) return false;

    if (typeof data === 'string') {
      return data.toLowerCase().includes(search);
    }

    if (Array.isArray(data)) {
      return data.some(v => contains(v, search));
    }

    if (typeof data === 'object') {
      return Object.values(data).some(v => contains(v, search));
    }

    return false;
  };

  /**
   * Calculates a relevance score for a search item.
   * Higher score indicates better match.
   */
  function getMatchScore(item, query, fields) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return 0;

    const tokens = q.split(/\s+/).filter(Boolean);
    let score = 0;

    fields.forEach(field => {
      const value = item[field];
      if (!value) return;

      const text = Array.isArray(value)
        ? value.join(' ').toLowerCase()
        : String(value).toLowerCase();

      // --- High-Priority Scoring Checks ---

      // 1. Primary Field Match (for Specific Searches - e.g., "online mba marketing")
      // Check if the query is an *exact* or *very close* match to the name/short name.
      if ((field === 'name' || field === 'course_short_name')) {
        if (text === q) {
          // Exact match on course name
          score += 5000; 
        } else if (text.includes(q) && q.length > 5) { 
          // Very strong match for specific, longer queries
          score += 2500;
        }
      }
      
      // 2. Main Program Boost (for General Searches - e.g., "online mba")
      // If the item is a main program ('yes') AND the query is contained in the name/short name.
      if (field === 'program_entity' && text === 'yes') {
        if (
            !(item.name || '').toLowerCase().includes(q) && // Query NOT in the full name
            (
                (item.keyword || '').toLowerCase().includes(q) || // Query IS in short name
                (item.course_short_name || '').toLowerCase().includes(q) || // OR Query IS in keywords
                (item.university_short_heading || '').toLowerCase().includes(q) || // OR Query IS in university_short_heading
                (item.general_keywords || '').toLowerCase().includes(q) // OR Query IS in general_keywords
            )
        ) {
            score += 3200; // Major boost for a relevant main program
        }
      }

      // 3. Full Phrase Match (found anywhere - e.g., in keyword, info, etc.)
      if (text.includes(q)) {
        score += 500;
      }

      // 4. Token match scoring: Check if each word in the query is present
      tokens.forEach(token => {
        if (text.includes(token)) {
          score += 10;
        }
      });
    });

    // 5. Overall token match count (Important for multi-word queries)
    const matchingTokensCount = tokens.filter(token =>
      fields.some(field => contains(item[field], token))
    ).length;

    // Higher number of token matches (total score per token: 200 + 10 = 210)
    score += matchingTokensCount * 200;

    return score;
  }
  
  /**
   * Filters data based on full phrase match OR token-OR match using the FIELD_MAP.
   * This is used as the initial broad filter before scoring.
   */
  function filterData(list, q, type) {
    q = (q || '').trim().toLowerCase();
    if (!q) return list;

    const tokens = q.split(/\s+/).filter(Boolean);
    const allowedFields = FIELD_MAP[type] || [];

    return list.filter(item => {
      const searchableFields = allowedFields.map(f => item[f]);

      // FULL PHRASE MATCH
      if (searchableFields.some(field => contains(field, q))) {
        return true;
      }

      // TOKEN OR MATCH (At least one token is present in some field)
      return tokens.some(token =>
        searchableFields.some(field => contains(field, token))
      );
    });
  }

  // ----------------------------
  // Render Output
  // ----------------------------

  function renderResults(courses, institutions, resources) {

    // Courses
    if (!courses.length) {
      $coursesList.html('<li>No results found</li>');
    } else {
      $coursesList.html(courses.map(createCourseItem).join(''));
    }

    // Institutions
    if (!institutions.length) {
      $institutionsList.html('<li>No results found</li>');
    } else {
      $institutionsList.html(institutions.map(createInstituteItem).join(''));
    }

    // Resources binding (Assuming createListItem is available/used for resources)
    /* if (!resources.length) {
      $resourcesList.html('<li>No results found</li>');
    } else {
      $resourcesList.html(resources.map(createListItem).join(''));
    } */

    // Specialisations
    // destroySlick();
    // if (!specialisations.length) {
    //   $specialisationsWrap.html("<div class='specialisation-item'>No specializations found</div>");
    // } else {
    //   $specialisationsWrap.html(
    //     specialisations.map(createSpecialisationItem).join('')
    //   );
    //   initSlick();
    // }
  }

  // ----------------------------
  // Main Search Handler
  // ----------------------------

  function runSearch(query) {
    const q = (query || '').trim();
    const lowerQ = q.toLowerCase();

    fetchData().then(() => {

      // Broad filter using the new logic
      let courses = filterData(jsonData.courseData, q, 'course');
      let institutions = filterData(jsonData.institutions, q, 'institution');
      // let specialisations = filterData(jsonData.specialisations, q, 'specialisation');

      // Apply Scoring and Sorting for non-empty queries
      if (q) {
        // Score and sort courses
        courses = courses
          .map(item => ({
            ...item,
            score: getMatchScore(item, lowerQ, FIELD_MAP.course)
          }))
          .filter(item => item.score > 0) // Only keep items with a positive score
          .sort((a, b) => b.score - a.score);

        // Score and sort institutions
        institutions = institutions
          .map(item => ({
            ...item,
            score: getMatchScore(item, lowerQ, FIELD_MAP.institution)
          }))
          .filter(item => item.score > 0)
          .sort((a, b) => b.score - a.score);

        // Score and sort specialisations
        // specialisations = specialisations
        //   .map(item => ({
        //     ...item,
        //     score: getMatchScore(item, lowerQ, FIELD_MAP.specialisation)
        //   }))
        //   .filter(item => item.score > 0)
        //   .sort((a, b) => b.score - a.score);
      } else {
        courses.sort((a, b) => (b.pageviews_30 || 0) - (a.pageviews_30 || 0));
        // specialisations.sort((a, b) => (b.pageviews_30 || 0) - (a.pageviews_30 || 0));
        // Institutions and Specializations remain unsorted or use default array order
      }


      // Step 3: Existing Region Filter (applied after scoring/sorting)
      const internationalPaths = ['/global', '/ae', '/np', '/af', '/us-ca', '/saarc-ewc', '/zambia', '/sl', '/nepal', '/international'];
      const isGlobalPage = window.location.pathname.includes('/global');
      const filterByRegion = (list) => {
        return list.filter(item => {
          const link = (item.link || '').toLowerCase();
          const isInternationalLink = internationalPaths.some(path =>
            link.includes(path)
          );
          if (isGlobalPage) {
            // ONLY /global links
            return link.includes('/global');
          } else {
            // ONLY domestic links (exclude ALL international)
            return !isInternationalLink;
          }
        });
      };

      courses = filterByRegion(courses);
      institutions = filterByRegion(institutions);
      // specialisations = filterByRegion(specialisations);


      // Slicing (Limiting results for display)
      if (!q) {
        // Empty query: show top popular
        courses = courses.slice(0, 3);
        institutions = institutions.slice(0, 3);
        // specialisations = specialisations.slice(0, 4);
        $coursesTag.show();
      } else {
        // Query present: show a larger number of search results
        courses = courses.slice(0, 5); 
        institutions = institutions.slice(0, 5); 
        // specialisations = specialisations.slice(0, 5); 
        $coursesTag.hide();
      }

      // Render result
      renderResults(
        courses,
        institutions,
        // specialisations,
        [] // resources
      );
    });
  }

  const debouncedSearch = debounce(function () {
    runSearch($input.val());
  }, 220);

  $input.on('input', debouncedSearch);

  // ----------------------------
  // Close/reset handlers
  // ----------------------------

  $('.filter-close-btn').on('click', function () {
    $input.val('');
    runSearch('');
    $('.search-filter').addClass('hidden');
    setTimeout(function () {
      $('body').css('overflow', 'auto');
      $('.overflow-hidden').css('overflow', 'auto');
    }, 200);
  });
  $('.hamburger, .back-button').on('click', function () {
    $input.val('');
    runSearch('');
  });


  // ----------------------------
  // Initial Load
  // ----------------------------
  const searchClick = document.querySelectorAll('.search-menu, .header-search');
  searchClick.forEach(element => {
    element.addEventListener('click', function() {
      fetchData().then(() => runSearch(''));
    });
  });

  // ----------------------------
  // Horizontal wheel scroll
  // ----------------------------

  const wrapper = document.querySelector('.specialisation-wrapper');
  if (wrapper) {
    wrapper.addEventListener(
      'wheel',
      function (event) {
        event.preventDefault();
        wrapper.scrollBy({ left: event.deltaY * 2, behavior: 'smooth' });
      },
      { passive: false }
    );
  }

});