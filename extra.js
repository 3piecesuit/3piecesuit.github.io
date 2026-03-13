/* ════════════════════════════════════════════════════════════
   3PieceSuit — extra.js
   Customer Review Toasts (every 2 min, stay 5 min)
   Countdown Timer · Live Viewers · Size Tabs · Newsletter
   ════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ══════════════════════════════════════════════════════════
     REVIEW TOAST DATA
     ══════════════════════════════════════════════════════════ */
  var reviews = [
    { name: "Ayesha M.", city: "Lahore", product: "Baby Boy Classic Suit — 1 Year", action: "just ordered", img: "P11img.png", stars: 5, time: "2 minutes ago" },
    { name: "Sana R.", city: "Karachi", product: "Baby Boy Royal Edition — 2 Years", action: "just reviewed ⭐⭐⭐⭐⭐", img: "P12img.png", stars: 5, time: "5 minutes ago" },
    { name: "Fatima N.", city: "Faisalabad", product: "Baby Boy Classic Suit — 1 Year", action: "left a 5-star review", img: "P11img.png", stars: 5, time: "12 minutes ago" },
    { name: "Zara A.", city: "Rawalpindi", product: "Baby Boy Royal Edition — 2 Years", action: "just ordered", img: "P12img.png", stars: 5, time: "15 minutes ago" },
    { name: "Nadia S.", city: "Peshawar", product: "Baby Boy Classic Suit — 1 Year", action: "just ordered", img: "P11img.png", stars: 5, time: "just now" },
    { name: "Mariam T.", city: "Gujranwala", product: "Baby Boy Royal Edition — 2 Years", action: "left a 5-star review", img: "P12img.png", stars: 5, time: "7 minutes ago" },
    { name: "Omar F.", city: "Sialkot", product: "Baby Boy Classic Suit — 1 Year", action: "just ordered", img: "P11img.png", stars: 5, time: "10 minutes ago" },
    { name: "Asma Q.", city: "Hyderabad", product: "Baby Boy Royal Edition — 2 Years", action: "reviewed ⭐⭐⭐⭐⭐", img: "P12img.png", stars: 5, time: "18 minutes ago" },
  ];

  var toastContainer = document.getElementById("toastContainer");
  var reviewIndex = 0;
  var SHOW_INTERVAL_MS  = 2 * 60 * 1000; /* 2 minutes */
  var STAY_DURATION_MS  = 5 * 60 * 1000; /* 5 minutes */
  var HIDE_ANIM_MS      = 500;

  function buildStars(n) {
    var s = "";
    for (var i = 0; i < n; i++) s += "★";
    return s;
  }

  function showToast() {
    if (!toastContainer) return;
    var r = reviews[reviewIndex % reviews.length];
    reviewIndex++;

    var toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-label", "Customer review notification");
    toast.innerHTML =
      '<div class="toast-icon" aria-hidden="true">👔</div>' +
      '<div class="toast-img"><img src="' + r.img + '" alt="' + r.product + '" width="48" height="48" loading="lazy"></div>' +
      '<div class="toast-body">' +
        '<div class="toast-name">' + r.name + ' — ' + r.city + '</div>' +
        '<div class="toast-action">' + r.action + '<br><em style="font-size:.72rem;color:var(--gold3);">' + r.product + '</em></div>' +
        '<div class="toast-stars" aria-label="' + r.stars + ' stars">' + buildStars(r.stars) + '</div>' +
        '<div class="toast-time">' + r.time + '</div>' +
      '</div>' +
      '<button class="toast-close" aria-label="Close notification">×</button>';

    /* Close button */
    toast.querySelector(".toast-close").addEventListener("click", function () {
      hideToast(toast);
    });

    toastContainer.appendChild(toast);

    /* Trigger show animation */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        toast.classList.add("show");
      });
    });

    /* Auto-hide after STAY_DURATION_MS */
    var hideTimer = setTimeout(function () {
      hideToast(toast);
    }, STAY_DURATION_MS);

    toast._hideTimer = hideTimer;
  }

  function hideToast(toast) {
    if (toast._hideTimer) clearTimeout(toast._hideTimer);
    toast.classList.remove("show");
    toast.classList.add("hide");
    setTimeout(function () {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, HIDE_ANIM_MS);
  }

  /* Show first toast after 8 seconds on page load */
  setTimeout(function () {
    showToast();
    /* Then repeat every SHOW_INTERVAL_MS */
    setInterval(showToast, SHOW_INTERVAL_MS);
  }, 8000);

  /* ══════════════════════════════════════════════════════════
     COUNTDOWN TIMER
     ══════════════════════════════════════════════════════════ */
  var cdH = document.getElementById("cdH");
  var cdM = document.getElementById("cdM");
  var cdS = document.getElementById("cdS");

  if (cdH && cdM && cdS) {
    /* Use sessionStorage so timer persists across page navigations this session */
    var endKey = "3ps_offer_end";
    var stored  = sessionStorage.getItem(endKey);
    var endTime;

    if (stored) {
      endTime = parseInt(stored, 10);
    } else {
      endTime = Date.now() + (5 * 60 * 60 * 1000) + (59 * 60 * 1000) + (59 * 1000);
      sessionStorage.setItem(endKey, endTime);
    }

    function pad(n) { return n < 10 ? "0" + n : "" + n; }

    function tickCountdown() {
      var diff = Math.max(0, endTime - Date.now());
      var h = Math.floor(diff / 3600000);
      var m = Math.floor((diff % 3600000) / 60000);
      var s = Math.floor((diff % 60000) / 1000);
      cdH.textContent = pad(h);
      cdM.textContent = pad(m);
      cdS.textContent = pad(s);
      if (diff <= 0) {
        /* Reset timer */
        endTime = Date.now() + (5 * 60 * 60 * 1000);
        sessionStorage.setItem(endKey, endTime);
      }
    }

    tickCountdown();
    setInterval(tickCountdown, 1000);
  }

  /* ══════════════════════════════════════════════════════════
     LIVE VIEWERS COUNT (randomised)
     ══════════════════════════════════════════════════════════ */
  var viewerEl = document.getElementById("viewerCount");
  if (viewerEl) {
    var count = Math.floor(Math.random() * 15) + 18; /* 18–32 */
    viewerEl.textContent = count;

    setInterval(function () {
      var delta = Math.random() < .55 ? 1 : -1;
      count = Math.min(45, Math.max(12, count + delta));
      viewerEl.textContent = count;
    }, 7000);
  }

  /* Stock counter small fluctuation */
  var stockEl = document.getElementById("stockLeft");
  if (stockEl) {
    var stock = parseInt(stockEl.textContent, 10) || 7;
    setTimeout(function () {
      setInterval(function () {
        if (stock > 2 && Math.random() < .15) {
          stock--;
          stockEl.textContent = stock;
        }
      }, 90000); /* every 90s */
    }, 30000);
  }

  /* ══════════════════════════════════════════════════════════
     SIZE GUIDE TABS
     ══════════════════════════════════════════════════════════ */
  var sizeTabs    = document.querySelectorAll(".size-tab");
  var sizePanels  = document.querySelectorAll(".size-content");

  sizeTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      var target = tab.getAttribute("aria-controls");
      sizeTabs.forEach(function (t) {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      sizePanels.forEach(function (p) { p.hidden = true; });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      var panel = document.getElementById(target);
      if (panel) panel.hidden = false;
    });
  });

  /* ══════════════════════════════════════════════════════════
     NEWSLETTER FORM
     ══════════════════════════════════════════════════════════ */
  var nlForm = document.getElementById("nlForm");
  var nlMsg  = document.getElementById("nlMsg");

  if (nlForm) {
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = nlForm.querySelector('input[type="email"]');
      if (!email || !email.value.trim()) return;
      /* Simple success message (no backend needed for newsletter) */
      if (nlMsg) {
        nlMsg.textContent = "✅ Subscribed! You'll receive sale alerts &amp; new arrivals from 3PieceSuit.";
        nlMsg.style.color = "var(--gold2)";
      }
      nlForm.reset();
    });
  }

  /* ══════════════════════════════════════════════════════════
     STICKY ORDER BAR (appears after scrolling past products)
     ══════════════════════════════════════════════════════════ */
  var stickyBar = document.getElementById("stickyBar");
  if (stickyBar) {
    window.addEventListener("scroll", function () {
      var show = window.scrollY > 600;
      stickyBar.classList.toggle("visible", show);
    }, { passive: true });
  }

  /* ══════════════════════════════════════════════════════════
     PRODUCT CARD HOVER: show WhatsApp quick-order
     ══════════════════════════════════════════════════════════ */
  /* Already handled via CSS overlay */

  /* ══════════════════════════════════════════════════════════
     IMAGE LIGHTBOX (simple)
     ══════════════════════════════════════════════════════════ */
  var galleryItems = document.querySelectorAll(".gallery-item");
  if (galleryItems.length) {
    galleryItems.forEach(function (item) {
      item.addEventListener("click", function () {
        var img = item.querySelector("img");
        if (!img) return;
        openLightbox(img.src, img.alt);
      });
      item.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          item.click();
        }
      });
      item.setAttribute("tabindex", "0");
      item.setAttribute("role", "button");
    });
  }

  var lightbox = null;
  function openLightbox(src, alt) {
    if (lightbox) document.body.removeChild(lightbox);
    lightbox = document.createElement("div");
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-label", alt || "Product image");
    lightbox.style.cssText =
      "position:fixed;inset:0;background:rgba(0,0,0,.88);z-index:9999;" +
      "display:flex;align-items:center;justify-content:center;padding:24px;" +
      "cursor:zoom-out;animation:lb-in .25s ease;";
    lightbox.innerHTML =
      '<img src="' + src + '" alt="' + (alt || "") + '" style="max-width:90vw;max-height:88vh;object-fit:contain;border-radius:8px;box-shadow:0 24px 80px rgba(0,0,0,.6);">' +
      '<button style="position:absolute;top:20px;right:24px;background:rgba(255,255,255,.12);border:none;color:#fff;font-size:1.6rem;width:44px;height:44px;border-radius:50%;cursor:pointer;transition:background .2s;" aria-label="Close">×</button>';

    lightbox.querySelector("button").addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    document.body.appendChild(lightbox);
    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    /* Inject keyframe if not present */
    if (!document.getElementById("lb-style")) {
      var s = document.createElement("style");
      s.id = "lb-style";
      s.textContent = "@keyframes lb-in{from{opacity:0;transform:scale(.94)}to{opacity:1;transform:scale(1)}}";
      document.head.appendChild(s);
    }
  }

  function closeLightbox() {
    if (lightbox && lightbox.parentNode) {
      document.body.removeChild(lightbox);
      lightbox = null;
    }
    document.removeEventListener("keydown", onEsc);
    document.body.style.overflow = "";
  }

  function onEsc(e) { if (e.key === "Escape") closeLightbox(); }

  /* ══════════════════════════════════════════════════════════
     TOPBAR PAUSE ON HOVER (accessibility)
     ══════════════════════════════════════════════════════════ */
  var topbarScroll = document.querySelector(".topbar-scroll");
  if (topbarScroll) {
    topbarScroll.addEventListener("mouseenter", function () {
      topbarScroll.style.animationPlayState = "paused";
    });
    topbarScroll.addEventListener("mouseleave", function () {
      topbarScroll.style.animationPlayState = "running";
    });
  }

  /* KW ribbon pause */
  var kwTrack = document.querySelector(".kw-track");
  if (kwTrack) {
    kwTrack.parentElement.addEventListener("mouseenter", function () {
      kwTrack.style.animationPlayState = "paused";
    });
    kwTrack.parentElement.addEventListener("mouseleave", function () {
      kwTrack.style.animationPlayState = "running";
    });
  }

})();
