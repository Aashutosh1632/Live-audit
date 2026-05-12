class CartNotification extends HTMLElement {
  constructor() {
    super();

    this.notification = document.getElementById('cart-notification');
    this.header = document.querySelector('sticky-header');
    this.onBodyClick = this.handleBodyClick.bind(this);

    this.notification.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelectorAll('button[type="button"]').forEach((closeButton) =>
      closeButton.addEventListener('click', this.close.bind(this))
    );
  }

  open() {
    this.notification.classList.add('animate', 'active');

    this.notification.addEventListener(
      'transitionend',
      () => {
        this.notification.focus({ preventScroll: true });
        trapFocus(this.notification);
      },
      { once: true }
    );
    setTimeout(() => {
      this.close();
  }, 2500);
    document.body.addEventListener('click', this.onBodyClick);
  }

  close() {
    this.notification.classList.remove('active');
    document.body.removeEventListener('click', this.onBodyClick);
     document.body.classList.remove('no-scroll');
    removeTrapFocus(this.activeElement);
  }

  renderContents(parsedState) {
    this.cartItemKey = parsedState.key;
    this.getSectionsToRender().forEach((section) => {
      document.getElementById(section.id).innerHTML = this.getSectionInnerHTML(
        parsedState.sections[section.id],
        section.selector
      );
    });

    if (this.header) this.header.reveal();
    this.open();
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-notification-product',
        selector: `[id="cart-notification-product-${this.cartItemKey}"]`,
      },
      {
        id: 'cart-notification-button',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  handleBodyClick(evt) {
    const target = evt.target;
    if (target !== this.notification && !target.closest('cart-notification')) {
      const disclosure = target.closest('details-disclosure, header-menu');
      this.activeElement = disclosure ? disclosure.querySelector('summary') : null;
      this.close();
    }
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-notification', CartNotification);
document.addEventListener('click', async function (e) {
  const minusBtn = e.target.closest('.card-quantity-minus');
  const plusBtn = e.target.closest('.card-quantity-plus');

  if (!minusBtn && !plusBtn) return;

  const form = e.target.closest('form');
  const variantId = parseInt(form?.querySelector('input[name="id"]')?.value, 10);
  const quantityInput = form?.querySelector('.card-quantity-input');

  if (!variantId || !quantityInput) return;

  const min = parseInt(quantityInput.dataset.min || 1, 10);
  const max = parseInt(quantityInput.dataset.max || 99, 10);

  const container = form.closest('.quantity-add-to-cart-btns');
  //const spinner = container?.querySelector('.loading__spinner');
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
  } catch (err) {
    console.error('Cart update failed:', err);
  } finally {
    //spinner?.classList.add('hidden');
    if (checkoutButton) {
      checkoutButton.disabled = false; // Enable the checkout button once done
    }
    await updateCartIconBubble();
    await updateCustomCartCount();
  }
});
document.addEventListener('change', async function (e) {
  const qtyInputWrapper = e.target.closest('.card-quantity-input');
  if (!qtyInputWrapper) return;

  const form = e.target.closest('form');
  const variantId = parseInt(form?.querySelector('input[name="id"]')?.value, 10);
  const quantityInput = form?.querySelector('.card-quantity-input');

  if (!variantId || !quantityInput) return;

  const newQty = parseInt(quantityInput.value, 10) || 1;
  const min = parseInt(quantityInput.dataset.min || 1, 10);
  const max = parseInt(quantityInput.dataset.max || 99, 10);
  const finalQty = Math.min(Math.max(newQty, min), max); // Clamp within range

  const checkoutButton = document.querySelector('button[name="checkout"]');
  if (checkoutButton) checkoutButton.disabled = true;

  try {
    const cart = await fetch('/cart.js').then(res => res.json());
    const cartItem = cart.items.find(item => item.id === variantId);
    const line = cartItem ? cart.items.indexOf(cartItem) + 1 : null;

    if (cartItem && line) {
      await fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ line, quantity: finalQty }),
      });
    } else {
      await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({ id: variantId, quantity: finalQty }),
      });
    }

    if (finalQty === 0) {
      qtyInputWrapper.classList.remove('added-item');
      quantityInput.value = 1;
    }

  } catch (err) {
    console.error('Cart update failed:', err);
  } finally {
    if (checkoutButton) checkoutButton.disabled = false;
    await updateCartIconBubble();
  }
});
async function updateCartIconBubble() {
  try {
    const res = await fetch('/?sections=cart-icon-bubble');
    const data = await res.json();
    const bubble = document.querySelector('[id*="cart-icon-bubble"]');
    if (bubble && data['cart-icon-bubble']) {
      bubble.innerHTML = data['cart-icon-bubble'];
    }
  } catch (err) {
    console.error('Failed to update cart icon bubble:', err);
  }
}
async function updateCustomCartCount() {
  try {
    const cart = await fetch('/cart.js').then(res => res.json());
    const cartCount = cart.item_count;
    const cartTotal = cart.total_price / 100;
    const customBubble = document.querySelector('.footer-cart-count.cart-updt-new');
    if (customBubble) {
      customBubble.textContent = cartCount;
      customBubble.setAttribute('data-header-cart-count', cartCount);
    }
  } catch (err) {
    console.error('Failed to update custom cart bubble:', err);
  }
}
document.addEventListener('DOMContentLoaded', async function () {
  try {
    const cart = await fetch('/cart.js').then(res => res.json());
    cart.items.forEach(item => {
      const variantId = item.id;
      const forms = document.querySelectorAll('form');

      forms.forEach(form => {
        const formVariantId = parseInt(form.querySelector('input[name="id"]')?.value, 10);
        if (formVariantId === variantId) {
          let container = form.closest('.quantity-add-to-cart-btns') ||
                          form.querySelector('.quantity-add-to-cart-btns') ||
                          form.parentElement?.querySelector('.quantity-add-to-cart-btns');
          if (container) container.classList.add('added-item');

          const input = form.querySelector('.card-quantity-input');
          if (input) input.value = item.quantity;
        }
      });
    });
  } catch (err) {
    console.error('Error checking cart items on page load:', err);
  }
});