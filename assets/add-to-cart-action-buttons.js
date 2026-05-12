document.addEventListener("DOMContentLoaded", function () {
   if (window.innerWidth < 767) return; 
    const productCards = document.querySelectorAll(".custom-pdp");
    productCards.forEach((card) => {
        const quickAdd = card.querySelector(".quick-add");
      const gridItem = card.closest(".grid__item"); 
        card.addEventListener("mouseenter", function () {
            if (quickAdd) {
                const defaultHeight = card.scrollHeight; 
                const quickAddHeight = quickAdd.scrollHeight; 
                const newHeight = defaultHeight + quickAddHeight - 150;
                card.style.height = `${newHeight}px`; 
                card.dataset.animationState = "open";
              if (card.dataset.animationState === "open" && gridItem) {
                    gridItem.style.zIndex = "2"; 
                }
            }
        });
        card.addEventListener("mouseleave", function () {
            card.style.height = "auto"; 
            card.dataset.animationState = "closed";
           gridItem.style.zIndex = "";
        });
    });
});