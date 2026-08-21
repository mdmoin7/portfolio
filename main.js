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
