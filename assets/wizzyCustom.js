try {
    
setTimeout(() => {
    const oldEl = document.querySelector('.snize-sticky-searchbox.snize-custom-widget-opener.bottom-right.snize-new-design');
    if(oldEl){
    const newEl = oldEl.cloneNode(true);
    oldEl.parentNode.replaceChild(newEl, oldEl);
    newEl.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo(0,0);

    document.querySelector('#Search-In-Modal').click();   

    });

    }
}, 2000);

window.onWizzyScriptLoaded = function() {
    function observeQuickAddModals() {
  const modals = document.querySelectorAll('.quick-add-modal');

  modals.forEach(modal => {
    if (modal.__observerAttached) return;
    modal.__observerAttached = true;

    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'open') {
          const isOpen = modal.hasAttribute('open');
          const wizzyWrapper = document.querySelector('.wizzy-search-wrapper');

          if (wizzyWrapper) {
            wizzyWrapper.style.zIndex = isOpen ? '200' : '';
          }
        }
      }
    });

    observer.observe(modal, {
      attributes: true,
      attributeFilter: ['open'],
    });
  });
}

observeQuickAddModals();

const bodyObserver = new MutationObserver(() => {
  observeQuickAddModals();
});

bodyObserver.observe(document.body, { childList: true, subtree: true });
    window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.AFTER_WIZZY_API_RESPONDED,
        function(data) {
            if(data.api === 'search')
            {
                let searchBar = document.querySelector('#Search-In-Modal');
                if(searchBar)
                {
                        searchBar.value = '';
                }
            }
            return data;
        });
    window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.AFTER_PRODUCTS_TRANSFORMED,
        function(products) {
            
            // try {
                products?.forEach((product) => {
                    if (product.name.toLowerCase().includes("custom")) {
                    product.isCustom = true;
                    }
                    let categories = product.categories;
                    categories?.forEach((category) => {
                        if(category?.name === "Bestselling Products")
                        {
                            product.best_seller = true;
                        }
                        if(category?.id === 'mega-sale')
                        {
                            product.mega_sale = true;
                        }
                    })
                    product.attributes?.forEach((attr) => {

                        if (attr.id === "product_handle") {
                            product.handle = attr.values[0].value[0];
                        }
                        else if(attr.id === "product_tags")
                        {
                            let values = attr?.values[0].value[0];
                            const tags = values.split(",").map(tag => tag.trim());
                            for (let i = 0; i < tags.length; i++) {
                                if(tags[i] === 'Brand')
                                {
                                    product.isBrand = true;
                                }
                                else if(tags[i] === 'onDiscount')
                                {
                                    product.onDiscount = true;
                                }
                            }
                        }
                        else if (attr.id === "product_badge_judgeme") {
                            const divElement = document.createElement("div");
                            divElement.innerHTML = attr.values[0].value[0];

                            const jdgmPrevBadge = divElement.querySelector(".jdgm-prev-badge");

                            if (jdgmPrevBadge) {
                                const numberOfReviews = parseInt(
                                    jdgmPrevBadge.getAttribute("data-number-of-reviews"),
                                    10
                                );

                                const averageRating = parseFloat(
                                    jdgmPrevBadge.getAttribute("data-average-rating")
                                );

                                product.reviewAvailable = numberOfReviews > 0;
                                product.numberOfReviews = numberOfReviews;
                                product.avgRatings = parseFloat(averageRating.toFixed(1));

                                product.reviewData = attr.values[0].value[0]; 
                            }
                        }
                        else if(attr.id === "product_minimum_quantity_required_custom") {
                            const minimumOrderValue = attr.values[0].value[0];
                            if (minimumOrderValue > 0) {product.minimumOrderValue = minimumOrderValue}
                        }
                        
                        if (attr.name === "product_type") {
                            const hasFreebie = attr.values?.some((valObj) =>
                            valObj.value?.includes("kwikcart-freebie")
                            );

                            if (hasFreebie) {
                            product.isFreebie = true;
                            }
                        }


                });
                });
          
            return products;
        });
    window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.BEFORE_FILTERS_EXECUTED,
        function(data) {

        if (data.group === "defaultMenu") {
        const categoryHandle = data?.filters?.categories?.[0];

        if (categoryHandle) {
            data.filters.sort = [
            {
                field: `product_${categoryHandle}_sortOrder:float`,
                order: "asc"
            }
            ];
        }
        }

        return data;
        });
    window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.BEFORE_SEARCH_EXECUTED,
        function(data) {
            const product_data = document.querySelector('.product-media-modal.media-modal');

            if(product_data){
                product_data.style.display = "none";
            }
            const detailsEl = document.querySelector('details-modal > details');
            if (detailsEl) {
                setTimeout(() => {
            detailsEl.setAttribute('open', 'true');
                }, 500);

            }
            document.body.classList.remove('overflow-hidden');
        return data;
        });
    window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.BEFORE_INIT,
        function(data) {
                data.search.configs.pagination.appendInExistingList = !0
        
        data.filters.configs.keepOpenedInMobileAfterApply = !0;
        return data;
    });  

        window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.BEFORE_LAZY_INIT,
        function(data) {
         data.search.configs.pagination.appendInExistingList = !0
       
        data.filters.configs.keepOpenedInMobileAfterApply = !0;
        return data;
    });  
    
            window.wizzyConfig.events.registerEvent(
        window.wizzyConfig.events.allowedEvents.VIEW_RENDERED,
        function(data) {

            let selectedFilters = document.querySelectorAll('.wizzy-selected-filters .wizzy-selected-facet-list li');
            if(selectedFilters && selectedFilters.length > 0)
            {
                let sortWrapper = document.querySelector('.wizzy-search-sort-wrapper');
                if(sortWrapper)
                {
                    sortWrapper.style.left = '110px';
                }
            }
            document.querySelectorAll(".wishlist-engine").forEach(function(i) {
            });
        const sortByCloseBtn = document.querySelector(".wizzy-common-select-options span.mobile-facets__close");
        if(sortByCloseBtn) {
          sortByCloseBtn.addEventListener("click", () => {
            const sortByOptions = document.querySelectorAll(".wizzy-common-select-container .wizzy-common-select-options")
            const body = document.body;
            const html = document.querySelector("html");
            if(body && html && sortByOptions &&
              body.classList.contains("wizzy-overlay-opened") && body.classList.contains("wizzy-common-select-body-overlay") && 
              html.classList.contains("wizzy-overlay-opened") && html.classList.contains("wizzy-common-select-body-overlay")){
              body.classList.remove("wizzy-overlay-opened");
              body.classList.remove("wizzy-common-select-body-overlay");
              html.classList.remove("wizzy-overlay-opened");
              html.classList.remove("wizzy-common-select-body-overlay");
              sortByOptions.forEach((option) => {
                option.style.display = 'none';
              })
              
            }
          })
        }

    const list = document.querySelector(".wizzy-search-results-list");
    if (!list) return;

    if (list.querySelector(".wizzy-full-width-heading")) return;

    const items = Array.from(list.children);

    const inStock = [];
    const outOfStock = [];

    items.forEach(el => {
        if (el.classList.contains("isOutofStock")) {
        outOfStock.push(el);
        } else {
        inStock.push(el);
        }
    });

    if (!outOfStock.length) return;

    const heading = document.createElement("div");
    heading.className = "wizzy-full-width-heading";
    heading.innerHTML = "<h2>Below are out of stock products</h2>";

    // detect layout mode
    const display = window.getComputedStyle(list).display;

    list.innerHTML = "";

    inStock.forEach(el => list.appendChild(el));
    list.appendChild(heading);
    outOfStock.forEach(el => list.appendChild(el));

    // layout-specific adjustments
    if (display === "grid") {
        list.style.gridAutoFlow = "row";
    } else if (display === "flex") {
        heading.style.flexBasis = "100%";
        heading.style.width = "100%";
    }


        return data;
        });  
        
        

 const targetNode = document.querySelector(".wizzy-body-end-wrapper");

function updateBodyClass() {
    const autocompleteElement = targetNode?.querySelector(".wizzy-autocomplete-wrapper");
    const isOpen = autocompleteElement && window.getComputedStyle(autocompleteElement).display === "flex";

    if (isOpen) {
        document.body.classList.add("wizzy-autocomplete-open");
        document.documentElement.classList.add("wizzy-autocomplete-open");
        // lockScroll();
    } else {
        document.body.classList.remove("wizzy-autocomplete-open");
        document.documentElement.classList.remove("wizzy-autocomplete-open");
        // unlockScroll();
    }
}

const config = {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["style"]
};

const callback = function (mutationsList, observer2) {
    for (const mutation of mutationsList) {
        updateBodyClass();
        break;
    }
};

const observer = new MutationObserver(callback);

if (targetNode) {
    observer.observe(targetNode, config);
    updateBodyClass();
}


}

} catch (error) {
 console.log(error)   
}