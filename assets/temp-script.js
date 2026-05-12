window.addEventListener("load", function () {
  function bindWishlistMoveHandlers() {
    document.querySelectorAll(".wishlist-move-cart").forEach(function (el) {
      if (el.dataset.wmcBound) return;
      el.dataset.wmcBound = "1";
      el.addEventListener("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(async function () {
          await card_atc();
        }, 2000);
      });
    });
    var moveAll = document.querySelector("#move_to_cart_all");
    if (moveAll && !moveAll.dataset.wmcBound) {
      moveAll.dataset.wmcBound = "1";
      moveAll.addEventListener("click", async function (e) {
        e.preventDefault();
        e.stopPropagation();
        setTimeout(async function () {
          await card_atc();
        }, 2000);
      });
    }
  }
  setTimeout(bindWishlistMoveHandlers, 1000);
  setTimeout(bindWishlistMoveHandlers, 2000);
});
