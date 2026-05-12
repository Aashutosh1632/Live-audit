function initMenuFooterListeners(){let e=document.querySelectorAll(".menu-item"),t=document.querySelectorAll(".submenu-content"),n=null;e.forEach(a=>{a.addEventListener("click",function(){let a=this.getAttribute("data-menu");n!==this&&(n=this,e.forEach(e=>e.classList.remove("active")),this.classList.add("active"),t.forEach(e=>{e.getAttribute("data-submenu")===a?(e.style.display="flex",setTimeout(()=>{e.classList.add("open")},10)):(e.classList.remove("open"),e.style.display="none")}))})})}document.querySelectorAll(".hambcoll").forEach(function(e){e.addEventListener("click",function(){let e=document.querySelector(".hamburger-coll");e&&(e.style.position="fixed",e.style.display="block",e.classList.add("active"))})}),document.querySelectorAll(".close-hamburger-stk").forEach(function(e){e.addEventListener("click",function(){let e=document.querySelector(".hamburger-coll");e&&(e.style.display="none",e.classList.remove("active"))})}),document.addEventListener("DOMContentLoaded",function(){document.querySelectorAll(".new-navv-src").forEach(function(e){e.addEventListener("click",function(e){e.preventDefault(),e.stopPropagation(),document.querySelectorAll("[data-live-search-input]").forEach(function(e){var t=new Event("keyup");e.dispatchEvent(t)})})}),window.addEventListener("cartcount:update",function(){setTimeout(function(){var e=Number(document.querySelector(".site-header .site-header-cart--count").getAttribute("data-header-cart-count"));console.log(e),e>0?(!1==document.querySelector(".new-sticky-nav .site-header-cart--count").classList.contains("visible")&&document.querySelector(".new-sticky-nav .site-header-cart--count").classList.add("visible"),document.querySelector(".new-sticky-nav .site-header-cart--count").setAttribute("data-header-cart-count",e)):document.querySelector(".new-sticky-nav .site-header-cart--count").classList.remove("visible")},20)})}),document.addEventListener("DOMContentLoaded",function(){let e=document.querySelectorAll(".menu-item"),t=document.querySelectorAll(".submenu-content"),n=null;e.forEach(a=>{a.addEventListener("click",function(){let a=this.getAttribute("data-menu");n!==this&&(n=this,e.forEach(e=>e.classList.remove("active")),this.classList.add("active"),t.forEach(e=>{e.getAttribute("data-submenu")===a?(e.style.display="flex",setTimeout(()=>{e.classList.add("open")},10)):(e.classList.remove("open"),e.style.display="none")}))})})}),fetch("/pages/menu-footer-json").then(e=>e.json()).then(e=>{let t=document.querySelector(".menu-list"),n=document.querySelector(".submenu-list");t.innerHTML=e.items.map((e,t)=>`
      <div class="menu-item${0===t?" active":""}" data-menu="${t+1}">
        ${e.image?`<img class="collection_image coll-img-ftmenu" src="${e.image}" alt="${e.title}" loading="lazy">`:""}
        <span class="menu-item--ttl">${e.title}</span>
      </div>
    `).join(""),n.innerHTML=e.items.map((e,t)=>{let n=e.title.toLowerCase().includes("help");return n?`
          <div class="submenu-content${0===t?" open":""}" data-submenu="${t+1}">
            <h2 class="submenu-menu-item--ttl">${e.title}</h2>
            <div class="custom-help-static">
              <a href="https://dropshipping.deodap.com/"><strong>Become A Dropshipper</strong></a>
              <p>Contact Us</p>
              <a href="mailto:Care@deodap.com"><strong>Care@deodap.com</strong></a>
            </div>
          </div>
        `:e.children&&0!==e.children.length?`
        <div class="submenu-content${0===t?" open":""}" data-submenu="${t+1}">
          <h2 class="submenu-menu-item--ttl">${e.title}</h2>
          ${e.children.map(e=>`
            <a href="${e.url}" class="submenu-item${e.current?" submenu-cuurent":""}" ${e.current?'aria-current="page"':""}>
              ${e.image?`<img class="collection_image" src="${e.image}" alt="${e.title}" loading="lazy">`:""}
              <span class="submenu-item-ttl">${e.title}</span>
            </a>
          `).join("")}
        </div>
      `:""}).join(""),initMenuFooterListeners()});