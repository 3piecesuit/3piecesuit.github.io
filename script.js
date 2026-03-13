/* ════════════════════════════════════════════════════════════
   3PieceSuit.github.io — script.js
   Handles: Nav, FAQ, Reveal, Form, Back-to-top, Year, Filter
   ════════════════════════════════════════════════════════════ */
(function () {
  "use strict";

  /* ── CONFIG (obfuscated endpoint) ─────────────────────── */
  const _ep = atob(
    "aHR0cHM6Ly9mb3Jtc3ByZWUuaW8vZi94cmV5cHdyaw=="
  ).replace("xreypwrk", "xreypwbk");

  /* ── YEAR ──────────────────────────────────────────────── */
  const yr = document.getElementById("yr");
  if (yr) yr.textContent = new Date().getFullYear();

  /* ── SCROLL: HEADER SHADOW & BACK-TO-TOP ──────────────── */
  const header = document.getElementById("header");
  const btt = document.getElementById("btt");

  function onScroll() {
    const y = window.scrollY;
    if (header) header.classList.toggle("scrolled", y > 60);
    if (btt) btt.classList.toggle("visible", y > 400);
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  if (btt) {
    btt.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ── HAMBURGER NAV ─────────────────────────────────────── */
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      const isOpen = navMenu.classList.toggle("open");
      hamburger.classList.toggle("open", isOpen);
      hamburger.setAttribute("aria-expanded", isOpen);
      document.body.style.overflow = isOpen ? "hidden" : "";
    });

    // Close on link click
    navMenu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        navMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      });
    });

    // Close on outside click
    document.addEventListener("click", function (e) {
      if (!header.contains(e.target)) {
        navMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
    });
  }

  /* ── INTERSECTION OBSERVER — REVEAL ───────────────────── */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el, i) {
      el.style.transitionDelay = (i % 4) * 0.1 + "s";
      io.observe(el);
    });
  } else {
    // Fallback: show all
    revealEls.forEach(function (el) {
      el.classList.add("in-view");
    });
  }

  /* ── FAQ ACCORDION ─────────────────────────────────────── */
  document.querySelectorAll(".faq-q").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const answerId = btn.getAttribute("aria-controls");
      const answer = document.getElementById(answerId);

      // Close all
      document.querySelectorAll(".faq-q").forEach(function (b) {
        b.setAttribute("aria-expanded", "false");
        const id = b.getAttribute("aria-controls");
        const a = document.getElementById(id);
        if (a) a.hidden = true;
      });

      // Open clicked (if was closed)
      if (!expanded && answer) {
        btn.setAttribute("aria-expanded", "true");
        answer.hidden = false;
        answer.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  });

  /* ── PRODUCT FILTER ────────────────────────────────────── */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const prodCards = document.querySelectorAll(".prod-card[data-category]");

  if (filterBtns.length && prodCards.length) {
    filterBtns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filterBtns.forEach(function (b) { b.classList.remove("active"); });
        btn.classList.add("active");
        const cat = btn.getAttribute("data-filter");
        prodCards.forEach(function (card) {
          const show = cat === "all" || card.dataset.category === cat;
          card.style.display = show ? "" : "none";
          if (show) {
            setTimeout(function () { card.classList.add("in-view"); }, 50);
          }
        });
      });
    });
  }

  /* ── ORDER / CONTACT FORM SUBMISSION ───────────────────── */
  const orderForm = document.getElementById("orderForm");

  if (orderForm) {
    // Pre-fill product from URL param
    const urlParams = new URLSearchParams(window.location.search);
    const product = urlParams.get("product");
    const prodSelect = document.getElementById("product");
    if (product && prodSelect) {
      const opt = prodSelect.querySelector('option[value="' + product + '"]');
      if (opt) opt.selected = true;
    }

    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const btn = orderForm.querySelector(".form-submit");
      const msg = document.getElementById("formMsg");

      // Simple validation
      const required = orderForm.querySelectorAll("[required]");
      let valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) {
          valid = false;
          field.style.borderColor = "#c0392b";
          field.addEventListener("input", function () {
            field.style.borderColor = "";
          }, { once: true });
        }
      });
      if (!valid) {
        showMsg(msg, "error", "Please fill in all required fields.");
        return;
      }

      // Email validation
      const emailField = orderForm.querySelector('input[type="email"]');
      if (emailField && emailField.value) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!re.test(emailField.value)) {
          showMsg(msg, "error", "Please enter a valid email address.");
          emailField.style.borderColor = "#c0392b";
          return;
        }
      }

      // Disable button
      btn.disabled = true;
      btn.textContent = "Sending…";

      // Collect form data
      const data = new FormData(orderForm);

      // Hidden anti-spam
      data.set("_subject", "New Order — 3PieceSuit");
      data.set("_captcha", "false");
      data.set("_template", "table");

      // Submit to hidden endpoint
      fetch(_ep, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      })
        .then(function (res) {
          if (res.ok) {
            showMsg(msg, "success", "✅ Your order has been sent! We will contact you soon.");
            orderForm.reset();
          } else {
            return res.json().then(function (d) {
              throw new Error(d.error || "Submission failed");
            });
          }
        })
        .catch(function (err) {
          console.warn("Form error:", err.message);
          showMsg(msg, "error", "Something went wrong. Please try again or contact us directly.");
        })
        .finally(function () {
          btn.disabled = false;
          btn.textContent = "Send Order Request";
        });
    });
  }

  function showMsg(el, type, text) {
    if (!el) return;
    el.className = "form-msg " + type;
    el.textContent = text;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
    if (type === "success") {
      setTimeout(function () {
        el.style.display = "none";
      }, 8000);
    }
  }

  /* ── ACTIVE NAV LINK ───────────────────────────────────── */
  const path = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(function (a) {
    const href = a.getAttribute("href");
    if (href && href.split("?")[0] === path) {
      a.classList.add("active");
      a.setAttribute("aria-current", "page");
    } else {
      a.classList.remove("active");
    }
  });

  /* ── LAZY LOADING POLYFILL (older browsers) ────────────── */
  if ("loading" in HTMLImageElement.prototype === false) {
    const lazyImgs = document.querySelectorAll('img[loading="lazy"]');
    if ("IntersectionObserver" in window) {
      const imgObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            const img = e.target;
            img.src = img.dataset.src || img.src;
            imgObs.unobserve(img);
          }
        });
      });
      lazyImgs.forEach(function (img) { imgObs.observe(img); });
    }
  }

  /* ── KEYBOARD TRAP FOR MOBILE MENU ────────────────────── */
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") {
      if (navMenu && navMenu.classList.contains("open")) {
        navMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
        hamburger.focus();
      }
    }
  });

  /* ── PERFORMANCE: mark as loaded ──────────────────────── */
  window.addEventListener("load", function () {
    document.documentElement.classList.add("loaded");
  });
})();
