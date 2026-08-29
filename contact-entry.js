(function () {
  // Public Turnstile site key. The secret remains server-side in Vercel.
  window.PORTFOLIO_TURNSTILE_SITE_KEY = "0x4AAAAAAEg2aQvvyDorRSXR";

  function init() {
    var nav = document.getElementById("navlinks");
    var footerCta = document.querySelector(".footer-cta-link");
    if (!nav || !footerCta) return;

    if (!document.getElementById("navContactLink")) {
      var link = document.createElement("a");
      link.id = "navContactLink";
      link.href = "#contact";
      link.textContent = "Contact";
      link.setAttribute("aria-label", "Go to contact section");
      link.className = "nav-contact-link";
      link.addEventListener("click", function () {
        if (window.history && window.history.replaceState) {
          window.history.replaceState(null, "", "#contact");
        }
      });
      nav.appendChild(link);
    }

    // Use the intentional whitespace below Key Focus Areas for a compact
    // conversion CTA without duplicating the hero's technology messaging.
    var focusCard = document.querySelector(".hero-right .focus-card");
    if (focusCard && !document.getElementById("heroContactCta")) {
      var cta = document.createElement("div");
      cta.id = "heroContactCta";
      cta.className = "hero-contact-cta";
      cta.innerHTML = '<a class="btn btn-primary" href="#contact" id="heroWorkLink" aria-label="Start a conversation with Mohammad Moin">Let\'s Work Together <span aria-hidden="true">→</span></a><a class="btn btn-outline" href="assets/Mohammad Moin-Consultant.pdf" target="_blank" rel="noopener">View Consultant Profile</a>';

      var style = document.createElement("style");
      style.textContent = `
        .hero-contact-cta{display:flex;justify-content:flex-end;align-items:center;gap:10px;margin-top:14px}
        .hero-contact-cta .btn{white-space:nowrap}
        .hero-contact-cta .btn-primary{box-shadow:0 8px 18px -12px rgba(29,78,216,.7)}
        .hero-contact-cta .btn:focus-visible{outline:3px solid rgba(29,78,216,.22);outline-offset:3px}
        @media(max-width:900px){.hero-contact-cta{justify-content:flex-start}}
        @media(max-width:600px){.hero-contact-cta{flex-direction:column;align-items:stretch}.hero-contact-cta .btn{text-align:center}}
      `;
      document.head.appendChild(style);
      focusCard.insertAdjacentElement("afterend", cta);

      document.getElementById("heroWorkLink").addEventListener("click", function (event) {
        event.preventDefault();
        footerCta.click();
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
