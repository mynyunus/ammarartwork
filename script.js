(function () {
  var menuToggle = document.getElementById("menuToggle");
  var mobileMenu = document.getElementById("mobileMenu");
  var menuBackdrop = document.getElementById("menuBackdrop");
  var backToTop = document.getElementById("backToTop");
  var yearNode = document.getElementById("year");
  var isCoarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var isSmallViewport = window.matchMedia("(max-width: 62rem)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || isCoarsePointer || isSmallViewport;

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  function setMenuState(isOpen) {
    if (!menuToggle || !mobileMenu || !menuBackdrop) {
      return;
    }

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    mobileMenu.setAttribute("aria-hidden", String(!isOpen));
    mobileMenu.classList.toggle("is-open", isOpen);
    menuBackdrop.classList.toggle("is-open", isOpen);
    document.body.style.overflow = isOpen ? "hidden" : "";
  }

  if (menuToggle && mobileMenu && menuBackdrop) {
    menuToggle.addEventListener("click", function () {
      var isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      setMenuState(!isExpanded);
    });

    menuBackdrop.addEventListener("click", function () {
      setMenuState(false);
    });

    mobileMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenuState(false);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenuState(false);
      }
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (event) {
      var href = anchor.getAttribute("href");
      if (!href || href.length <= 1) {
        return;
      }

      var target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      target.scrollIntoView({
        behavior: reduceMotion ? "auto" : "smooth",
        block: "start"
      });
    });
  });

  var revealTargets = document.querySelectorAll(".reveal");
  if (reduceMotion) {
    revealTargets.forEach(function (node) {
      node.classList.add("is-visible");
    });
  } else if ("IntersectionObserver" in window) {
    var revealObserver = new IntersectionObserver(
      function (entries, observer) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.16,
        rootMargin: "0px 0px -8% 0px"
      }
    );

    revealTargets.forEach(function (node) {
      revealObserver.observe(node);
    });
  } else {
    revealTargets.forEach(function (node) {
      node.classList.add("is-visible");
    });
  }

  if (backToTop) {
    var handleBackToTopVisibility = function () {
      backToTop.classList.toggle("visible", window.scrollY > 420);
    };

    handleBackToTopVisibility();
    window.addEventListener("scroll", handleBackToTopVisibility, { passive: true });

    backToTop.addEventListener("click", function () {
      window.scrollTo({
        top: 0,
        behavior: reduceMotion ? "auto" : "smooth"
      });
    });
  }

  var embedContainer = document.getElementById("instagramEmbedContainer");
  var fallbackContainer = document.getElementById("instagramFallback");
  var instagramScript = document.getElementById("instagram-embed-script");

  function showInstagramFallback() {
    if (!embedContainer || !fallbackContainer) {
      return;
    }

    embedContainer.hidden = true;
    fallbackContainer.hidden = false;
  }

  if (instagramScript) {
    instagramScript.addEventListener("error", showInstagramFallback);
  }

  window.addEventListener("load", function () {
    window.setTimeout(function () {
      if (!embedContainer || !fallbackContainer) {
        return;
      }

      if (window.instgrm && window.instgrm.Embeds && typeof window.instgrm.Embeds.process === "function") {
        window.instgrm.Embeds.process();
      }

      window.setTimeout(function () {
        var hasIframe = !!embedContainer.querySelector("iframe");
        var renderedClass = !!embedContainer.querySelector(".instagram-media-rendered");

        if (!hasIframe && !renderedClass) {
          showInstagramFallback();
        }
      }, 2200);
    }, 1200);
  });
})();
