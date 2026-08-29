(function () {
  var about = document.getElementById("about");
  var whatI = document.getElementById("what-i-do");
  if (about && whatI && about.parentNode === whatI.parentNode) {
    whatI.parentNode.insertBefore(about, whatI);
  }
})();

(function () {
  var roles = [
    "Corporate Trainer",
    "Web & Mobile Engineer",
    "Curriculum Designer",
  ];

  var i = 0;
  var el = document.getElementById("roleRotate");
  if (!el || roles.length < 2) return;

  var reduceMotion =
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion) return;

  window.setInterval(function () {
    el.classList.add("fading");

    window.setTimeout(function () {
      i = (i + 1) % roles.length;
      el.textContent = roles[i];
      el.classList.remove("fading");
    }, 350);
  }, 2600);
})();

(function () {
  var links = Array.prototype.slice.call(
    document.querySelectorAll(".navlinks a"),
  );
  var targets = links
    .map(function (link) {
      return document.querySelector(link.getAttribute("href"));
    })
    .filter(Boolean);

  function setActive() {
    var header = document.querySelector("nav");
    var offset = (header ? header.offsetHeight : 70) + 28;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var active = targets[0];

    targets.forEach(function (target) {
      if (target.offsetTop <= scrollY + offset) {
        active = target;
      }
    });

    links.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      link.classList.toggle("active", target === active);
    });
  }

  links.forEach(function (link) {
    link.addEventListener("click", function () {
      links.forEach(function (item) {
        item.classList.remove("active");
      });
      link.classList.add("active");
    });
  });

  var ticking = false;
  window.addEventListener(
    "scroll",
    function () {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () {
        setActive();
        ticking = false;
      });
    },
    { passive: true },
  );

  window.addEventListener("resize", setActive);
  setActive();
})();

(function () {
  var b = document.getElementById("navToggle");
  var n = document.getElementById("navlinks");
  if (!b || !n) return;
  b.addEventListener("click", function () {
    n.classList.toggle("open");
    if (n.classList.contains("open")) {
      n.style.display = "flex";
      n.style.position = "absolute";
      n.style.left = "14px";
      n.style.right = "14px";
      n.style.top = "62px";
      n.style.flexDirection = "column";
      n.style.alignItems = "stretch";
      n.style.padding = "15px";
      n.style.background = "#fff";
      n.style.border = "1px solid #e3e8f1";
      n.style.borderRadius = "10px";
      n.style.boxShadow = "0 20px 40px -28px rgba(20,35,63,.5)";
    } else {
      n.style.display = "";
    }
  });
})();

(function () {
  var footerCta = document.querySelector(".footer-cta-link");
  var footer = document.getElementById("contact");
  if (!footerCta || !footer) return;

  // The static site is hosted on GitHub Pages. The Resend API key must remain
  // server-side, so the form posts to a separately deployed serverless API.
  var API_URL = window.PORTFOLIO_CONTACT_API || "https://portfolio-contact-api.vercel.app/api/contact";

  var style = document.createElement("style");
  style.textContent = `
    .contact-panel{margin-top:28px;padding:24px;border:1px solid #e3e8f1;border-radius:14px;background:#fff;display:none;box-shadow:0 18px 50px -35px rgba(20,35,63,.45)}
    .contact-panel.open{display:block}
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .contact-field{display:flex;flex-direction:column;gap:6px}
    .contact-field.full{grid-column:1/-1}
    .contact-field label{font-size:12px;font-weight:700;color:#142033}
    .contact-field input,.contact-field textarea{width:100%;padding:11px 12px;border:1px solid #d8e0eb;border-radius:8px;background:#fbfcfe;color:#142033;font:inherit;font-size:14px;outline:none}
    .contact-field input:focus,.contact-field textarea:focus{border-color:#4267a8;box-shadow:0 0 0 3px rgba(66,103,168,.1)}
    .contact-field textarea{min-height:130px;resize:vertical}
    .contact-actions{display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap}
    .contact-status{font-size:13px;color:#59677d;min-height:20px}
    .contact-status.success{color:#18794e}.contact-status.error{color:#b42318}
    .contact-hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
    @media(max-width:700px){.contact-grid{grid-template-columns:1fr}.contact-field.full{grid-column:auto}}
  `;
  document.head.appendChild(style);

  var panel = document.createElement("div");
  panel.className = "contact-panel";
  panel.innerHTML = `
    <form id="portfolioContactForm" novalidate>
      <div class="contact-grid">
        <div class="contact-field">
          <label for="contactName">Name</label>
          <input id="contactName" name="name" autocomplete="name" maxlength="100" required />
        </div>
        <div class="contact-field">
          <label for="contactEmail">Email</label>
          <input id="contactEmail" name="email" type="email" autocomplete="email" maxlength="254" required />
        </div>
        <div class="contact-field full">
          <label for="contactSubject">Subject</label>
          <input id="contactSubject" name="subject" maxlength="160" required />
        </div>
        <div class="contact-field full">
          <label for="contactMessage">Message</label>
          <textarea id="contactMessage" name="message" minlength="10" maxlength="5000" required></textarea>
        </div>
        <div class="contact-hp" aria-hidden="true">
          <label for="contactCompany">Company</label>
          <input id="contactCompany" name="company" tabindex="-1" autocomplete="off" />
        </div>
      </div>
      <div class="contact-actions">
        <button class="btn btn-primary" type="submit" id="contactSubmit">Send message</button>
        <button class="btn btn-outline" type="button" id="contactCancel">Cancel</button>
        <span class="contact-status" id="contactStatus" role="status" aria-live="polite"></span>
      </div>
    </form>
  `;

  footerCta.parentNode.insertBefore(panel, footerCta.nextSibling);

  var form = document.getElementById("portfolioContactForm");
  var submit = document.getElementById("contactSubmit");
  var cancel = document.getElementById("contactCancel");
  var status = document.getElementById("contactStatus");

  function openForm(event) {
    if (event) event.preventDefault();
    panel.classList.add("open");
    footerCta.setAttribute("aria-expanded", "true");
    document.getElementById("contactName").focus();
  }

  function closeForm() {
    panel.classList.remove("open");
    footerCta.setAttribute("aria-expanded", "false");
  }

  footerCta.setAttribute("aria-expanded", "false");
  footerCta.addEventListener("click", openForm);
  cancel.addEventListener("click", closeForm);

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    status.textContent = "";
    status.className = "contact-status";

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    submit.disabled = true;
    submit.textContent = "Sending…";

    var data = new FormData(form);
    var payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
      company: String(data.get("company") || "").trim(),
      requestId: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()) + "-" + Math.random(),
    };

    try {
      var response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      var result = await response.json().catch(function () { return {}; });

      if (!response.ok) {
        throw new Error(result.error || "Unable to send your message");
      }

      form.reset();
      status.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
      status.className = "contact-status success";
    } catch (error) {
      status.textContent = error.message || "Unable to send your message right now.";
      status.className = "contact-status error";
    } finally {
      submit.disabled = false;
      submit.textContent = "Send message";
    }
  });
})();
