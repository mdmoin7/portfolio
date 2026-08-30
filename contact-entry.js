(function () {
  // Public Turnstile site key. The secret remains server-side in Vercel.
  window.PORTFOLIO_TURNSTILE_SITE_KEY = "0x4AAAAAAEg2aQvvyDorRSXR";

  function init() {
    var footerCta = document.querySelector(".footer-cta-link");
    if (!footerCta) return;

    // Contact remains the primary homepage section. The dedicated QR/card
    // experience is exposed separately as "Connect" in the main navigation.

    // Place the conversion actions directly beneath Key Focus Areas.
    var focusCard = document.querySelector(".hero-right .focus-card");
    if (focusCard && !document.getElementById("heroContactCta")) {
      var cta = document.createElement("div");
      cta.id = "heroContactCta";
      cta.className = "hero-contact-cta";
      cta.innerHTML = '<a class="btn btn-primary" href="#contact" id="heroWorkLink" aria-label="Start a conversation with Mohammad Moin">Let\'s Work Together <span aria-hidden="true">→</span></a><a class="btn btn-outline" href="assets/Mohammad Moin-Consultant.pdf" target="_blank" rel="noopener">View Consultant Profile</a>';

      var style = document.createElement("style");
      style.textContent = `
        .hero-contact-cta{display:flex;justify-content:flex-end;align-items:center;gap:12px;margin:16px 0 0;width:100%}
        .hero-contact-cta .btn{white-space:nowrap;min-height:42px}
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
