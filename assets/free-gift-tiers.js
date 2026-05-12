
// const GWP_TIERS = [
//   { min: 49900,  variantId: 51747475685686 },
//   { min: 99900,  variantId: 49468786508086 },
// ];
// const ALL_GWP_IDS = GWP_TIERS.map(t => t.variantId);
// function getActiveTier(subtotal) {
//   return [...GWP_TIERS].reverse().find(t => subtotal >= t.min) || null;
// }
// function setCartLoading(state) {
//   const cartItems = document.getElementById('main-cart-items') || document.getElementById('CartDrawer-CartItems');
//   if (!cartItems) return;
//   cartItems.classList.toggle('cart__items--disabled', state);
// }
// let gwpRunning = false;
// let gwpSource  = false;
// async function checkGWP(event) {
//   if (gwpSource) return;
//   if (gwpRunning) return;
//   gwpRunning = true;
//   try {
//     const cart = await fetch('/cart.js').then(r => r.json());
//     const subtotal = cart.items
//       .filter(i => !ALL_GWP_IDS.includes(i.variant_id))
//       .reduce((sum, i) => sum + i.final_line_price, 0);
//     const activeTier = getActiveTier(subtotal);
//     const activeId   = activeTier?.variantId ?? null;
//     const updates = {};
//     ALL_GWP_IDS.forEach(id => {
//       updates[id] = id === activeId ? 1 : 0;
//     });
//     const needsUpdate = ALL_GWP_IDS.some(id => {
//       const inCart = cart.items.find(i => i.variant_id === id);
//       const currentQty = inCart ? inCart.quantity : 0;
//       return currentQty !== updates[id];
//     });

//     if (!needsUpdate) return;
//     setCartLoading(true);
//     await fetch('/cart/update.js', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify({ updates })
//     });
//     gwpSource = true;
//     publish(PUB_SUB_EVENTS.cartUpdate, { source: 'gwp' });
//     setTimeout(() => { gwpSource = false; }, 1000);
//   } catch(e) {
//     console.error('GWP error:', e);
//   } finally {
//     gwpRunning = false;
//     setCartLoading(false);


//   }
// }
// document.addEventListener('DOMContentLoaded', () => {
//   subscribe(PUB_SUB_EVENTS.cartUpdate, checkGWP);
//   document.addEventListener('cart-drawer:open', checkGWP);
//   const drawerEl = document.querySelector('cart-drawer');
//   if (drawerEl) {
//     const originalOpen = drawerEl.open?.bind(drawerEl);
//     if (typeof originalOpen === 'function') {
//       drawerEl.open = function(...args) {
//         originalOpen(...args);
//         checkGWP();
//       };
//     }
//   }
//   checkGWP();
// });


