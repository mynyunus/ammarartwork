(function () {
  var siteHeader = document.getElementById("siteHeader");
  var backToTop = document.getElementById("backToTop");
  var yearNode = document.getElementById("year");
  var heroVideo = document.getElementById("heroVideo");
  var heroVideoSource = document.getElementById("heroVideoSource");
  var mobileViewportQuery = window.matchMedia("(max-width: 62rem)");
  var isCoarsePointer = window.matchMedia("(hover: none) and (pointer: coarse)").matches;
  var isSmallViewport = window.matchMedia("(max-width: 62rem)").matches;
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches || isCoarsePointer || isSmallViewport;

  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }

  function updateHeaderCompactState() {
    if (!siteHeader) {
      return;
    }

    siteHeader.classList.toggle("is-scrolled", window.scrollY > 18);
  }

  updateHeaderCompactState();
  window.addEventListener("scroll", updateHeaderCompactState, { passive: true });

  function updateHeroVideoSource() {
    if (!heroVideo || !heroVideoSource) {
      return;
    }

    var desktopSrc = heroVideo.dataset.desktopSrc;
    var mobileSrc = heroVideo.dataset.mobileSrc;
    var targetSrc = mobileViewportQuery.matches ? mobileSrc : desktopSrc;

    if (!targetSrc || heroVideoSource.getAttribute("src") === targetSrc) {
      return;
    }

    heroVideoSource.setAttribute("src", targetSrc);
    heroVideo.load();

    var playAttempt = heroVideo.play();
    if (playAttempt && typeof playAttempt.catch === "function") {
      playAttempt.catch(function () {
        return;
      });
    }
  }

  updateHeroVideoSource();
  if (typeof mobileViewportQuery.addEventListener === "function") {
    mobileViewportQuery.addEventListener("change", updateHeroVideoSource);
  } else if (typeof mobileViewportQuery.addListener === "function") {
    mobileViewportQuery.addListener(updateHeroVideoSource);
  }

  var floatingNavLinks = document.querySelectorAll(".floating-nav a[href^=\"#\"]");

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

      if (anchor.closest(".floating-nav")) {
        floatingNavLinks.forEach(function (link) {
          link.classList.remove("is-active");
        });
        anchor.classList.add("is-active");
      }
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
