
/* footer toogle */
 if ($(window).width() < 767){
       $('footer .footer-block__heading').each(function(){
          $(this).click(function(){
              $(this).siblings('.footer-block__details-content').slideToggle()
          })
       })
      }

$(window).scroll(function() {
  if ($(window).scrollTop() > 8) { 
    $('.utillity-bar-main').addClass('open');
  } else {
    $('.utillity-bar-main').removeClass('open');
  }
});

$(document).on('click', '.new-navv-a.header__icon.header__icon--cart.link.focus-inset.site-header-cart--button', function(event) {
    event.preventDefault();
    $('.drawer').addClass('active');
});

const details = document.getElementById("Details-menu-drawer-container");
const chatbot = document.getElementById("react-chatbot-container");
details.addEventListener("toggle", () => {
  if (details.open) {
    chatbot.style.display = "none";
  } else {
    chatbot.style.display = "block";
  }
});


(function () {
  function setupScrollSyncForShopBy(containerSelector) {
    const container = document.querySelector(containerSelector);
    if (!container) return;

    // Find the "Shop By" details block inside this container
    const shopByDetail = Array.from(container.querySelectorAll('details')).find(detail => {
      const summary = detail.querySelector('summary span.left-menu-link');
      return summary && summary.textContent.trim() === 'Shop By';
    });
    if (!shopByDetail) return;

    const scrollContainer = shopByDetail.querySelector(".third-lvl-hamburger");
    const leftMenuItems = shopByDetail.querySelectorAll(".collection-summary");
    const rightSections = Array.from(scrollContainer?.querySelectorAll(".third-lvl-group") || []);

    if (!scrollContainer || !rightSections.length || !leftMenuItems.length) return;

    const sectionMap = {};
    leftMenuItems.forEach(item => {
      const id = item.getAttribute("data-scroll-target");
      if (id) sectionMap[id] = item;
    });

    let activeId = "";

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const currentId = entry.target.getAttribute("id");
            if (currentId !== activeId && sectionMap[currentId]) {
              activeId = currentId;

              leftMenuItems.forEach(el => el.classList.remove("active-summary"));
              sectionMap[currentId].classList.add("active-summary");
            }
          }
        });
      },
      {
        root: scrollContainer,
        threshold: 0.6,
      }
    );

    rightSections.forEach(section => observer.observe(section));

    leftMenuItems.forEach(item => {
      item.addEventListener("click", () => {
        const id = item.getAttribute("data-scroll-target");
        const targetSection = shopByDetail.querySelector(`#${id}`);
        if (targetSection) {
          scrollContainer.scrollTo({
            top: targetSection.offsetTop - scrollContainer.offsetTop,
            behavior: "smooth"
          });
        }
      });
    });
  }

  function waitAndInit() {
    setupScrollSyncForShopBy("#HeaderDrawerMenu");
    setupScrollSyncForShopBy("#StickyMobileMenu");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", waitAndInit);
  } else {
    waitAndInit();
  }
})();



document.addEventListener("DOMContentLoaded", function () {
    const observer = new MutationObserver(() => {
        const widget = document.querySelector('.jdgm-rev-widg');
        const header = widget?.querySelector('.jdgm-rev-widg__header');
        if (!widget || !header) return;
        const selectors = [
            '.jdgm-row-actions',
            '.jdgm-rev-widg__body',
            '.jdgm-rev-widg__paginate-spinner-wrapper'
        ];
        const targets = selectors
            .map(sel => widget.querySelector(sel))
            .filter(Boolean);
        if (targets.length !== selectors.length) return;
        targets.forEach(el => {
            el.classList.add('jdgm-slide-toggle');
            el.classList.remove('active'); 
        });
        header.style.cursor = 'pointer';
        header.addEventListener('click', () => {
            targets.forEach(el => {
                el.classList.toggle('active');
            });
        });
        observer.disconnect();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const checkInterval = setInterval(function () {
    const writeReviewButton = document.querySelector('.jdgm-write-rev-link');
    if (writeReviewButton) {
      const seeAllReviewsLink = document.createElement('a');
      seeAllReviewsLink.href = "#reviews"; 
      seeAllReviewsLink.textContent = "See All Reviews";
      seeAllReviewsLink.className = "see-all-reviews-link";
      seeAllReviewsLink.style.display = "block";
      seeAllReviewsLink.style.marginTop = "10px";
      seeAllReviewsLink.style.color = "#ff9900"; 
      seeAllReviewsLink.style.textDecoration = "none";
      writeReviewButton.parentElement.appendChild(seeAllReviewsLink);

      clearInterval(checkInterval);
    }
  }, 500);
});


 document.addEventListener("DOMContentLoaded", function () {
  const menuDrawer = document.getElementById('Details-menu-drawer-container');
  const cartDrawer = document.querySelector('cart-drawer');
  const chatWidget = document.getElementById('chat-widget');
  const hamburgerMenu = document.querySelector('.hamburger-coll');

  if (!chatWidget) return;

  function toggleChatWidget() {
    const isMenuOpen =
      (menuDrawer &&
        menuDrawer.classList.contains('menu-opening') &&
        menuDrawer.hasAttribute('open')) ||
      (hamburgerMenu &&
        hamburgerMenu.classList.contains('active') &&
        hamburgerMenu.style.display !== 'none');

    const isCartOpen =
      cartDrawer &&
      cartDrawer.classList.contains('active');

    chatWidget.style.display = (isMenuOpen || isCartOpen) ? 'none' : 'block';
  }

  if (menuDrawer) {
    const menuObserver = new MutationObserver(toggleChatWidget);
    menuObserver.observe(menuDrawer, {
      attributes: true,
      attributeFilter: ['class', 'open']
    });
  }

  if (cartDrawer) {
    const cartObserver = new MutationObserver(toggleChatWidget);
    cartObserver.observe(cartDrawer, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  if (hamburgerMenu) {
    const hamburgerObserver = new MutationObserver(toggleChatWidget);
    hamburgerObserver.observe(hamburgerMenu, {
      attributes: true,
      attributeFilter: ['class', 'style']
    });
  }

  toggleChatWidget();
});





/*--- search icon alignment for mobile view ---*/
document.addEventListener("DOMContentLoaded", function() {
  function fixSnizePositionMobile() {
    if(window.innerWidth <= 767) { 
      var el = document.querySelector('.snize-sticky-searchbox.bottom-right');
      if(el) {
        el.style.top = "auto";
        el.style.bottom = "68px";
        el.style.right = "24px";
        el.style.setProperty('top', 'auto', 'important');
        el.style.setProperty('bottom', '68px', 'important');
        el.style.setProperty('right', '24px', 'important');
      }
    }
  }
  fixSnizePositionMobile();
  setInterval(fixSnizePositionMobile, 500);
});


/*--- hide search icon from search page ---*/

(function () {
  const CSS_ID = "hide-snize-btn-css";
  function addHideCSS() {
    if (!document.getElementById(CSS_ID)) {
      const s = document.createElement("style");
      s.id = CSS_ID;
      s.innerHTML = `
        .snize-sticky-searchbox,
        a.snize-sticky-searchbox,
        .snize-sticky-searchbox__icon {
          display: none !important;
          visibility: hidden !important;
        }
      `;
      document.head.appendChild(s);
    }
  }
  function removeHideCSS() {
    const css = document.getElementById(CSS_ID);
    if (css) css.remove();
  }
  function updateVisibility() {
    const isSearch =
      window.location.pathname.includes("/search") ||
      window.location.search.includes("q=");
    if (isSearch) addHideCSS();
    else removeHideCSS();
  }
  let lastUrl = location.href;
  new MutationObserver(() => {
    const currentUrl = location.href;
    if (currentUrl !== lastUrl) {
      lastUrl = currentUrl;
      updateVisibility();
    }
  }).observe(document, { subtree: true, childList: true });
  document.addEventListener("DOMContentLoaded", updateVisibility);
  window.addEventListener("popstate", updateVisibility);

})();


/*--- search button disable while filed empty ---*/
const searchInput = document.querySelector('.search__input');
  const searchButton = document.querySelector('.search__button');
  function toggleSearchButton() {
    if (searchInput.value.trim() === '') {
      searchButton.setAttribute('disabled', 'true');
    } else {
      searchButton.removeAttribute('disabled');
    }
  }
  searchInput.addEventListener('input', toggleSearchButton);
  toggleSearchButton();
















(function () {
  if (!window.location.pathname.includes('/collections/new-arrival')) {
    return;
  }
  function applySortFix() {
    const select = document.querySelector('#SortBy');
    if (!select) return;
    const featuredOption = select.querySelector('option[value="manual"]');
    if (featuredOption) {
      featuredOption.remove();
    }
    const url = new URL(window.location.href);
    const currentSort = url.searchParams.get('sort_by');
    if (!currentSort) {
      url.searchParams.set('sort_by', 'created-descending');
      window.location.replace(url.toString());
      return;
    }
    if (select.value !== 'created-descending' && currentSort === 'created-descending') {
      select.value = 'created-descending';
    }
  }
  document.addEventListener('DOMContentLoaded', applySortFix);
  const observer = new MutationObserver(applySortFix);
  observer.observe(document.body, { childList: true, subtree: true });
})();








document.addEventListener('DOMContentLoaded', function () {
  const videos = document.querySelectorAll('.video-element');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        const video = entry.target;

        if (entry.isIntersecting) {
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      });
    },
    {
      threshold: 0.5
    }
  );
  videos.forEach(video => {
    video.muted = true;
    observer.observe(video);
  });
});



