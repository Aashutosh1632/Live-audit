document.addEventListener("DOMContentLoaded", function() {
    const button = document.querySelector(".moreless-button");
    const afterMore = document.querySelector(".after-more");
    button.addEventListener("click", function(event) {
      event.preventDefault(); 
      if (afterMore.classList.contains("show")) {
        afterMore.style.maxHeight = afterMore.scrollHeight + 'px';
        afterMore.style.opacity = '1'; 
        setTimeout(() => {
          afterMore.classList.remove("show");
          afterMore.style.maxHeight = '0'; 
          afterMore.style.opacity = '0'; 
          afterMore.style.visibility = 'hidden';
        }, 10); 
        button.textContent = "Read more";
      } else {
        afterMore.classList.add("show");
        afterMore.style.maxHeight = afterMore.scrollHeight + 'px'; 
        afterMore.style.opacity = '1'; 
        afterMore.style.visibility = 'visible';
        button.textContent = "Read less";
      }
    });
  });
