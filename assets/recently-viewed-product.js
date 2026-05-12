document.addEventListener("DOMContentLoaded", function () {
  function renderpdpViewedProducts() {
    let pdpViewed = JSON.parse(localStorage.getItem("pdp_viewed")) || [];
    pdpViewed = pdpViewed.filter(product => product.id && product.variantId);

    const container = document.querySelector(".pdp-viewed-section");
    const noProductsMessage = document.querySelector(".js-no-products");
    const header = document.querySelector(".js-pdp-viewed-header");

    if (pdpViewed.length === 0) {
      container.innerHTML = '';
      header.style.display = 'none';
      noProductsMessage.style.display = 'block';
    } else {
      header.style.display = 'flex';
      noProductsMessage.style.display = 'none';
      const reversedProducts = pdpViewed.slice().reverse();
      
      const productsHtml = reversedProducts.map((product, index) => {
        const hasCustomTag = product.tag.some(tag =>
          ["Custom Print", "CUSTOM PRINT 2", "Customer print 2"].includes(tag)
        );

        let buttonHtml = "";
        if (hasCustomTag) {
          buttonHtml = `<a href="${product.url}"  data-product-id="${product.id}" data-variant-id="${product.variantId}" class="view-more-btn">View More</a>`;
        } else if (product.inventory > 0) {
          buttonHtml = `<button class="cstm-atc btn" data-product-id="${product.id}" data-variant-id="${product.variantId}">Add to cart</button>`;
        } else {
          buttonHtml = `<button class="sold-out-btn" disabled>Sold Out</button>`;
        }

        return `
          <div class="pdp-viewed-item" data-index="${index}">
            <button class="close-btn-rcc" data-index="${pdpViewed.length - 1 - index}">
              <svg xmlns="https://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M18.3 5.7a1 1 0 00-1.4 0L12 10.6 7.1 5.7a1 1 0 00-1.4 1.4L10.6 12l-4.9 4.9a1 1 0 101.4 1.4l4.9-4.9 4.9 4.9a1 1 0 001.4-1.4L13.4 12l4.9-4.9a1 1 0 000-1.4z"/>
              </svg>
            </button>
            <div class="nw-recent">
              <a class="recent-img-a" href="${product.url}">
                <img src="${product.image}" alt="${product.title}" loading="lazy">
              </a>
              <div class="pdp-views-des">
                <p class="pdp-view-prc-com">
                  <span class="pdp-viewed-price">${product.price}</span>
                  <span class="pdp-viewed-compare-at-price" style="text-decoration: line-through;">${product.compareAtPrice}</span>
                </p>
                <h3 class="pdp-viewed-product-title">${product.title}</h3>
                <!--<div class="cstm-atcbtn">${buttonHtml}</div>-->
              </div>
            </div>
          </div>
        `;
      }).join("");

      container.innerHTML = productsHtml;

      // Initialize Slick Slider
      if ($(container).hasClass('slick-initialized')) {
        $(container).slick('unslick');
      }

      $(container).slick({
        slidesToShow: 5.6,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
        arrows: true,
        prevArrow:"<img class='a-left control-c prev slick-prev' src='https://cdn.shopify.com/s/files/1/0782/3284/6646/files/Left_Arrow_Icon_74b2fb51-9b8d-4b9e-aa75-5177b90a39ca.svg?v=1740209199'>",
        nextArrow:"<img class='a-right control-c next slick-next' src='https://cdn.shopify.com/s/files/1/0782/3284/6646/files/Right_Arrow_Icon_8f43d162-ca5d-4c8d-be74-428a3a147b15.svg?v=1740208710'>",
        responsive: [
          { breakpoint: 1024, settings: { slidesToShow: 5.5 } },
          { breakpoint: 768, settings: { slidesToShow: 2 } },
          { breakpoint: 420, settings: { slidesToShow: 2 } },
          { breakpoint: 340, settings: { slidesToShow: 1.8 } }
        ]
      });

      // Add to Cart Button Click Event
      document.querySelectorAll(".cstm-atc.btn").forEach(button => {
        button.addEventListener("click", async function () {
          const variantId = this.getAttribute("data-variant-id");
          await addToCart(variantId);
        });
      });

      // Remove Product Event
      document.querySelectorAll(".close-btn-rcc").forEach(button => {
        button.addEventListener("click", function () {
          const index = this.getAttribute("data-index");
          removeProduct(index);
        });
      });
    }
  }

  async function addToCart(variantId) {
    try {
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      });

      if (!response.ok) throw new Error('Error adding to cart');

      const cartDrawer = document.querySelector('cart-drawer');
      if (cartDrawer) {
        cartDrawer.classList.add('active');
      }
      await updateCartDrawer();
    } catch (error) {
      console.error("Add to cart failed:", error);
    }
  }

 async function updateCartDrawer() {
  try {
    const response = await fetch('/?section_id=cart-drawer');
    if (!response.ok) throw new Error('Error fetching cart drawer');

    const text = await response.text();
    const html = new DOMParser().parseFromString(text, 'text/html');
    const newCartContent = html.querySelector('cart-drawer');
    const cartDrawer = document.querySelector('cart-drawer');

    if (newCartContent && cartDrawer) {
      cartDrawer.innerHTML = newCartContent.innerHTML;

      // Remove 'is-empty' class if it exists
      if (cartDrawer.classList.contains('is-empty')) {
        cartDrawer.classList.remove('is-empty');
      }
    }
  } catch (error) {
    console.error("Cart drawer update failed:", error);
  }
}

  window.removeProduct = function (index) {
    let pdpViewed = JSON.parse(localStorage.getItem("pdp_viewed")) || [];
    pdpViewed.splice(index, 1);
    localStorage.setItem("pdp_viewed", JSON.stringify(pdpViewed));
    renderpdpViewedProducts();
  };

  window.clearAllProducts = function () {
    localStorage.removeItem("pdp_viewed");
    document.querySelector(".pdp-viewed-section").innerHTML = '';
    document.querySelector(".js-pdp-viewed-header").style.display = "none";
    document.querySelector(".js-no-products").style.display = 'block';
  };

  renderpdpViewedProducts();
});
