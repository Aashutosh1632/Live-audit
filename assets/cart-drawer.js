class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
  }

  setHeaderCartIconAccessibility() {
    const cartLink = document.querySelector('#cart-icon-bubble');
    if (!cartLink) return;

    cartLink.setAttribute('role', 'button');
    cartLink.setAttribute('aria-haspopup', 'dialog');
    cartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.open(cartLink);
    });
    cartLink.addEventListener('keydown', (event) => {
      if (event.code.toUpperCase() === 'SPACE') {
        event.preventDefault();
        this.open(cartLink);
      }
    });
  }

  open(triggeredBy) {
    if (triggeredBy) this.setActiveElement(triggeredBy);
    const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
    // here the animation doesn't seem to always get triggered. A timeout seem to help
    setTimeout(() => {
      this.classList.add('animate', 'active');
    });

    this.addEventListener(
      'transitionend',
      () => {
        const containerToTrapFocusOn = this.classList.contains('is-empty')
          ? this.querySelector('.drawer__inner-empty')
          : document.getElementById('CartDrawer');
        const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
        trapFocus(containerToTrapFocusOn, focusElement);
      },
      { once: true }
    );

    document.body.classList.add('overflow-hidden');
  }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);

document.addEventListener('click', async function (e) {
  const minusBtn = e.target.closest('.custom-quantity-input-btn-minus');
  const plusBtn = e.target.closest('.custom-quantity-input-btn-plus');

  if (!minusBtn && !plusBtn) return;

  const form = e.target.closest('form');
  const variantId = parseInt(form?.querySelector('input[name="id"]')?.value, 10);
  const quantityInput = form?.querySelector('.custom-quantity-input');

  if (!variantId || !quantityInput) return;

  const min = parseInt(quantityInput.dataset.min || 1, 10);
  const max = parseInt(quantityInput.dataset.max || 99, 10);

  const container = form.closest('.quantity-add-to-cart-btns');
   const checkoutButton = document.querySelector('button[name="checkout"]');
  if (checkoutButton) {
    checkoutButton.disabled = true;
  }

  try {
    const cart = await fetch('/cart.js').then(res => res.json());
    const cartItem = cart.items.find(item => item.id === variantId);
    const currentQty = cartItem?.quantity || 0;
    const line = cartItem ? cart.items.indexOf(cartItem) + 1 : null;

    let newQty = currentQty;

    if (minusBtn) {
      newQty = Math.max(currentQty - 1, min);
    } else if (plusBtn) {
      newQty = Math.min(currentQty + 1, max);
    }
    quantityInput.value = newQty;
      
    if(newQty === 0){
      e.target.closest('.quantity-add-to-cart-btns').classList.remove('added-item');
      quantityInput.value = 1;
    }else{
      setTimeout( function(){
        const cartDrawerItem = document.querySelector(`[data-cart-item-variant-id="${variantId}"]`);
        if (cartDrawerItem) {
          const cartQuantityInput = cartDrawerItem.querySelector('input[name="updates[]"], .cart-item__quantity-input');
          if (cartQuantityInput) {
            cartQuantityInput.value = newQty;
          }
          const cartQuantityDisplay = cartDrawerItem.querySelector('.cart-item__quantity-text');
          if (cartQuantityDisplay) {
            cartQuantityDisplay.textContent = newQty;
          }
        }
      const drawerEl = document.querySelector('cart-drawer');
        if (drawerEl && typeof drawerEl.open === 'function') {
          drawerEl.open();
        } else {
          document.documentElement.classList.add('overflow-hidden');
          document.body.classList.add('cart-drawer-open');
          const fallbackDrawer = document.querySelector('#CartDrawer');
          fallbackDrawer?.classList.add('animate', 'active');
        }
      }, 800);
    }
    if (cartItem && line) {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ line, quantity: newQty }),
      });
    } else {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ id: variantId, quantity: newQty }),
      });
    }
    if(newQty === 0){
     const sectionRes = await fetch('/?sections=cart-drawer,cart-icon-bubble');
    const sections = await sectionRes.json();
    const cartDrawer = document.querySelector('cart-drawer');

    if (cartDrawer?.renderContents) {
      cartDrawer.renderContents({
        sections: {
          'cart-drawer': sections['cart-drawer'],
          'cart-icon-bubble': sections['cart-icon-bubble'],
        },
      });
    }
    }
  } catch (err) {
    console.error('Cart update failed:', err);
  } finally {
    if (checkoutButton) {
      checkoutButton.disabled = false;
    }
  }
});