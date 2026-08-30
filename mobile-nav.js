(function () {
  "use strict";

  function initMobileNavigation() {
    var toggle = document.getElementById("navToggle");
    var nav = document.getElementById("navlinks");
    if (!toggle || !nav) return;

    var close = function () {
      nav.classList.remove("open");
      nav.removeAttribute("style");
      toggle.setAttribute("aria-expanded", "false");
    };

    var open = function () {
      nav.classList.add("open");
      nav.style.display = "flex";
      nav.style.position = "absolute";
      nav.style.left = "12px";
      nav.style.right = "12px";
      nav.style.top = "70px";
      nav.style.zIndex = "100";
      nav.style.flexDirection = "column";
      nav.style.alignItems = "stretch";
      nav.style.justifyContent = "flex-start";
      nav.style.gap = "0";
      nav.style.padding = "10px";
      nav.style.background = "#fff";
      nav.style.border = "1px solid #e3e8f1";
      nav.style.borderRadius = "12px";
      nav.style.boxShadow = "0 20px 45px -25px rgba(20,35,63,.45)";
      toggle.setAttribute("aria-expanded", "true");
    };

    toggle.setAttribute("type", "button");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "navlinks");

    toggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      if (nav.classList.contains("open")) close();
      else open();
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", close);
    });

    document.addEventListener("click", function (event) {
      if (!nav.classList.contains("open")) return;
      if (event.target === toggle || toggle.contains(event.target) || nav.contains(event.target)) return;
      close();
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") close();
    });

    window.addEventListener("resize", function () {
      if (window.innerWidth > 900) close();
    }, { passive: true });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMobileNavigation);
  } else {
    initMobileNavigation();
  }
})();
