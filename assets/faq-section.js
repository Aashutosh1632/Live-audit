
  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".faq-question").forEach(function (btn) {
      btn.addEventListener("click", function () {
        let answer = this.nextElementSibling;
        let isActive = answer.style.display === "block";

        document.querySelectorAll(".faq-answer").forEach(function (a) {
          a.style.display = "none";
        });

        if (!isActive) {
          answer.style.display = "block";
        }
      });
    });

    document.querySelectorAll(".faq-category a").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        let targetId = this.getAttribute("href").substring(1);
        let targetElement = document.getElementById(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 50,
            behavior: "smooth"
          });
        }
      });
    });
  });

