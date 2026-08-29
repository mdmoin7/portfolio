(function () {
  // Public Turnstile site key. The secret remains server-side in Vercel.
  window.PORTFOLIO_TURNSTILE_SITE_KEY = "0x4AAAAAAEg2aQvvyDorRSXR";

  function init() {
    var nav = document.getElementById("navlinks");
    var footerCta = document.querySelector(".footer-cta-link");
    if (!nav || !footerCta || document.getElementById("navContactLink")) return;

    var link = document.createElement("a");
    link.id = "navContactLink";
    link.href = "#contact";
    link.textContent = "Contact";
    link.setAttribute("aria-label", "Go to contact section");
    link.className = "nav-contact-link";

    var style = document.createElement("style");
    style.textContent = `
      .nav-contact-link{font-weight:800}
      .nav-contact-link:focus-visible{outline:3px solid rgba(29,78,216,.22);outline-offset:3px;border-radius:5px}
    `;
    document.head.appendChild(style);

    // Keep the top-level Contact action as a conventional in-page navigation
    // target. The full contact form remains available from the contact section
    // and its existing CTA, including the mailto fallback.
    link.addEventListener("click", function () {
      if (window.history && window.history.replaceState) {
        window.history.replaceState(null, "", "#contact");
      }
    });

    nav.appendChild(link);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
