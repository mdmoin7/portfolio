(function () {
  var about = document.getElementById("about");
  var whatI = document.getElementById("what-i-do");
  if (about && whatI && about.parentNode === whatI.parentNode) {
    whatI.parentNode.insertBefore(about, whatI);
  }
})();

(function () {
  var roles = ["Corporate Trainer", "Web & Mobile Engineer", "Curriculum Designer"];
  var i = 0;
  var el = document.getElementById("roleRotate");
  if (!el || roles.length < 2) return;
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
  var links = Array.prototype.slice.call(document.querySelectorAll(".navlinks a"));
  var targets = links.map(function (link) { return document.querySelector(link.getAttribute("href")); }).filter(Boolean);
  function setActive() {
    var header = document.querySelector("nav");
    var offset = (header ? header.offsetHeight : 70) + 28;
    var scrollY = window.pageYOffset || document.documentElement.scrollTop;
    var active = targets[0];
    targets.forEach(function (target) { if (target.offsetTop <= scrollY + offset) active = target; });
    links.forEach(function (link) {
      var target = document.querySelector(link.getAttribute("href"));
      link.classList.toggle("active", target === active);
    });
  }
  links.forEach(function (link) {
    link.addEventListener("click", function () {
      links.forEach(function (item) { item.classList.remove("active"); });
      link.classList.add("active");
    });
  });
  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { setActive(); ticking = false; });
  }, { passive: true });
  window.addEventListener("resize", setActive);
  setActive();
})();

(function () {
  var b = document.getElementById("navToggle");
  var n = document.getElementById("navlinks");
  if (!b || !n) return;
  b.addEventListener("click", function () {
    var open = !n.classList.contains("open");
    n.classList.toggle("open", open);
    b.setAttribute("aria-expanded", String(open));
    if (open) {
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

  var API_URL = window.PORTFOLIO_CONTACT_API || "https://portfolio-contact-api.vercel.app/api/contact";
  var FALLBACK_EMAIL = "mohammad.nicoll@gmail.com";
  var previousFocus = null;

  var style = document.createElement("style");
  style.textContent = `
    .contact-modal{position:fixed;inset:0;z-index:1000;display:none;align-items:center;justify-content:center;padding:20px;background:rgba(12,25,45,.58);backdrop-filter:blur(4px)}
    .contact-modal.open{display:flex}
    .contact-dialog{position:relative;width:min(680px,100%);max-height:min(90vh,760px);overflow:auto;background:#fff;border:1px solid #e3e8f1;border-radius:16px;box-shadow:0 28px 80px -35px rgba(20,35,63,.65);padding:28px}
    .contact-dialog-header{display:flex;align-items:flex-start;justify-content:space-between;gap:20px;margin-bottom:22px}
    .contact-dialog-title{margin:0;color:#142033;font-size:25px;line-height:1.25;font-weight:800}
    .contact-dialog-subtitle{margin:6px 0 0;color:#59677d;font-size:13px;line-height:1.55}
    .contact-close{border:0;background:transparent;color:#59677d;font-size:25px;line-height:1;cursor:pointer;padding:4px 6px;border-radius:7px}
    .contact-close:hover,.contact-close:focus-visible{background:#f1f4f8;color:#142033}
    .contact-grid{display:grid;grid-template-columns:1fr 1fr;gap:15px}
    .contact-field{display:flex;flex-direction:column;gap:6px}
    .contact-field.full{grid-column:1/-1}
    .contact-field label{font-size:12px;font-weight:700;color:#142033}
    .contact-field input,.contact-field textarea{width:100%;padding:11px 12px;border:1px solid #d8e0eb;border-radius:8px;background:#fbfcfe;color:#142033;font:inherit;font-size:14px;outline:none;transition:border-color .15s,box-shadow .15s}
    .contact-field textarea{min-height:140px;resize:vertical}
    .contact-field input:focus,.contact-field textarea:focus{border-color:#4267a8;box-shadow:0 0 0 3px rgba(66,103,168,.1)}
    .contact-field input[aria-invalid="true"],.contact-field textarea[aria-invalid="true"]{border-color:#b42318}
    .contact-error{min-height:17px;color:#b42318;font-size:11px;line-height:1.4}
    .contact-actions{display:flex;align-items:center;gap:10px;margin-top:8px;flex-wrap:wrap}
    .contact-status{flex:1;min-width:220px;font-size:13px;color:#59677d}
    .contact-status.success{color:#18794e}.contact-status.error{color:#b42318}
    .contact-fallback{display:none;margin-top:16px;padding:14px;border:1px solid #ead7b0;border-radius:10px;background:#fffaf0;color:#5d4a25;font-size:13px;line-height:1.55}
    .contact-fallback.show{display:block}
    .contact-fallback a{font-weight:700;color:#1d4ed8}
    .contact-hp{position:absolute;left:-10000px;width:1px;height:1px;overflow:hidden}
    body.contact-modal-open{overflow:hidden}
    @media(max-width:700px){.contact-modal{padding:12px}.contact-dialog{padding:22px;border-radius:13px}.contact-grid{grid-template-columns:1fr}.contact-field.full{grid-column:auto}.contact-status{min-width:100%}}
  `;
  document.head.appendChild(style);

  var modal = document.createElement("div");
  modal.className = "contact-modal";
  modal.setAttribute("role", "presentation");
  modal.innerHTML = `
    <div class="contact-dialog" role="dialog" aria-modal="true" aria-labelledby="contactDialogTitle" aria-describedby="contactDialogDescription">
      <div class="contact-dialog-header">
        <div>
          <h2 class="contact-dialog-title" id="contactDialogTitle">Let's work together</h2>
          <p class="contact-dialog-subtitle" id="contactDialogDescription">Tell me a little about your requirement, training need, or consulting engagement.</p>
        </div>
        <button class="contact-close" id="contactClose" type="button" aria-label="Close contact form">×</button>
      </div>
      <form id="portfolioContactForm" novalidate>
        <div class="contact-grid">
          <div class="contact-field">
            <label for="contactName">Name <span aria-hidden="true">*</span></label>
            <input id="contactName" name="name" autocomplete="name" maxlength="100" required aria-required="true" aria-describedby="contactNameError" />
            <span class="contact-error" id="contactNameError" role="alert"></span>
          </div>
          <div class="contact-field">
            <label for="contactEmail">Email <span aria-hidden="true">*</span></label>
            <input id="contactEmail" name="email" type="email" inputmode="email" autocomplete="email" maxlength="254" required aria-required="true" aria-describedby="contactEmailError" />
            <span class="contact-error" id="contactEmailError" role="alert"></span>
          </div>
          <div class="contact-field full">
            <label for="contactSubject">Subject <span aria-hidden="true">*</span></label>
            <input id="contactSubject" name="subject" autocomplete="off" maxlength="160" required aria-required="true" aria-describedby="contactSubjectError" />
            <span class="contact-error" id="contactSubjectError" role="alert"></span>
          </div>
          <div class="contact-field full">
            <label for="contactMessage">Message <span aria-hidden="true">*</span></label>
            <textarea id="contactMessage" name="message" minlength="10" maxlength="5000" required aria-required="true" aria-describedby="contactMessageError"></textarea>
            <span class="contact-error" id="contactMessageError" role="alert"></span>
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
        <div class="contact-fallback" id="contactFallback" role="alert">
          The online email service is temporarily unavailable. Your message has <strong>not</strong> been sent yet. You can still send it directly using your email application:
          <a id="contactFallbackLink" href="mailto:mohammad.nicoll@gmail.com">Open email</a>.
        </div>
      </form>
    </div>
  `;
  document.body.appendChild(modal);

  var form = document.getElementById("portfolioContactForm");
  var submit = document.getElementById("contactSubmit");
  var cancel = document.getElementById("contactCancel");
  var close = document.getElementById("contactClose");
  var status = document.getElementById("contactStatus");
  var fallback = document.getElementById("contactFallback");
  var fallbackLink = document.getElementById("contactFallbackLink");
  var dialog = modal.querySelector(".contact-dialog");
  var fields = {
    name: document.getElementById("contactName"),
    email: document.getElementById("contactEmail"),
    subject: document.getElementById("contactSubject"),
    message: document.getElementById("contactMessage"),
  };
  var errors = {
    name: document.getElementById("contactNameError"),
    email: document.getElementById("contactEmailError"),
    subject: document.getElementById("contactSubjectError"),
    message: document.getElementById("contactMessageError"),
  };

  function setError(field, message) {
    fields[field].setAttribute("aria-invalid", message ? "true" : "false");
    errors[field].textContent = message || "";
  }

  function validateField(field) {
    var value = fields[field].value.trim();
    var message = "";
    if (!value) message = "This field is required.";
    else if (field === "name" && (value.length < 2 || !/[A-Za-zÀ-ÿ]/.test(value))) message = "Enter your name.";
    else if (field === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) message = "Enter a valid email address.";
    else if (field === "subject" && value.length < 3) message = "Enter a short subject.";
    else if (field === "message" && value.length < 10) message = "Message should be at least 10 characters.";
    else if (field === "message" && value.length > 5000) message = "Message is too long.";
    setError(field, message);
    return !message;
  }

  Object.keys(fields).forEach(function (field) {
    fields[field].addEventListener("blur", function () { validateField(field); });
    fields[field].addEventListener("input", function () {
      if (fields[field].getAttribute("aria-invalid") === "true") validateField(field);
      if (status.classList.contains("error")) {
        status.textContent = "";
        status.className = "contact-status";
      }
      fallback.classList.remove("show");
    });
  });

  function makeMailto(payload) {
    var body = ["Name: " + payload.name, "Email: " + payload.email, "", payload.message].join("\n");
    return "mailto:" + FALLBACK_EMAIL + "?subject=" + encodeURIComponent(payload.subject) + "&body=" + encodeURIComponent(body);
  }

  function showFallback(payload, reason) {
    fallbackLink.href = makeMailto(payload);
    fallback.classList.add("show");
    status.textContent = reason || "Online sending is unavailable.";
    status.className = "contact-status error";
  }

  function openForm(event) {
    if (event) event.preventDefault();
    previousFocus = document.activeElement;
    modal.classList.add("open");
    document.body.classList.add("contact-modal-open");
    footerCta.setAttribute("aria-expanded", "true");
    setTimeout(function () { fields.name.focus(); }, 0);
  }

  function closeForm() {
    modal.classList.remove("open");
    document.body.classList.remove("contact-modal-open");
    footerCta.setAttribute("aria-expanded", "false");
    if (previousFocus && typeof previousFocus.focus === "function") previousFocus.focus();
  }

  function trapFocus(event) {
    if (!modal.classList.contains("open") || event.key !== "Tab") return;
    var focusable = Array.prototype.slice.call(dialog.querySelectorAll("button:not([disabled]), input:not([disabled]), textarea:not([disabled]), a[href]"));
    if (!focusable.length) return;
    var first = focusable[0];
    var last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  }

  footerCta.setAttribute("aria-haspopup", "dialog");
  footerCta.setAttribute("aria-expanded", "false");
  footerCta.addEventListener("click", openForm);
  cancel.addEventListener("click", closeForm);
  close.addEventListener("click", closeForm);
  modal.addEventListener("click", function (event) { if (event.target === modal) closeForm(); });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && modal.classList.contains("open")) closeForm();
    trapFocus(event);
  });

  form.addEventListener("submit", async function (event) {
    event.preventDefault();
    status.textContent = "";
    status.className = "contact-status";
    fallback.classList.remove("show");

    var valid = Object.keys(fields).map(validateField).every(Boolean);
    if (!valid) {
      var firstInvalid = Object.keys(fields).map(function (key) { return fields[key]; }).find(function (field) { return field.getAttribute("aria-invalid") === "true"; });
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    var data = new FormData(form);
    var payload = {
      name: String(data.get("name") || "").trim(),
      email: String(data.get("email") || "").trim(),
      subject: String(data.get("subject") || "").trim(),
      message: String(data.get("message") || "").trim(),
      company: String(data.get("company") || "").trim(),
      requestId: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : String(Date.now()) + "-" + Math.random(),
    };

    if (payload.company) return;
    submit.disabled = true;
    cancel.disabled = true;
    close.disabled = true;
    submit.textContent = "Sending…";
    status.textContent = "Sending your message…";

    var timedOut = false;
    var controller = window.AbortController ? new AbortController() : null;
    var timeout = window.setTimeout(function () {
      timedOut = true;
      if (controller) controller.abort();
    }, 10000);

    try {
      var response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: controller ? controller.signal : undefined,
      });
      var result = await response.json().catch(function () { return {}; });
      if (!response.ok) throw new Error(result.error || "Unable to send your message");
      form.reset();
      Object.keys(fields).forEach(function (field) { setError(field, ""); });
      status.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
      status.className = "contact-status success";
    } catch (error) {
      var reason = timedOut || (error && error.name === "AbortError")
        ? "The email service did not respond in time."
        : "The online email service is temporarily unavailable.";
      showFallback(payload, reason);
    } finally {
      window.clearTimeout(timeout);
      submit.disabled = false;
      cancel.disabled = false;
      close.disabled = false;
      submit.textContent = "Send message";
    }
  });
})();
