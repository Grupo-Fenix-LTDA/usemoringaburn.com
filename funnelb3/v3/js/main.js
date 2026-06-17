/* ==========================================================================
   Moringa Burn — main.js
   Mobile menu, smooth scroll polish, navbar shadow on scroll.
   FAQ uses native <details>/<summary> — no JS needed.
   ========================================================================== */

(function () {
  'use strict';

  /* ---------- Mobile hamburger menu ---------- */
  var hamburger = document.getElementById('hamburger');
  var navLinks  = document.getElementById('navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function () {
      var isOpen = navLinks.classList.toggle('is-open');
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    // Close menu when a nav link is clicked (mobile)
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('is-open');
        hamburger.classList.remove('is-open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------- Navbar state on scroll ---------- */
  var navbar = document.getElementById('navbar');

  function handleScroll() {
    var currentScroll = window.pageYOffset;
    if (navbar) {
      // Add .is-scrolled past 80px so the nav becomes more opaque over light sections
      if (currentScroll > 80) {
        navbar.classList.add('is-scrolled');
      } else {
        navbar.classList.remove('is-scrolled');
      }
    }
  }

  // Throttle scroll handler with requestAnimationFrame
  var ticking = false;
  window.addEventListener('scroll', function () {
    if (!ticking) {
      window.requestAnimationFrame(function () {
        handleScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });

  handleScroll();

  /* ---------- Smooth scroll polish for older browsers ---------- */
  // Modern browsers handle this via CSS scroll-behavior. This is a fallback
  // that also accounts for the sticky header height.
  var headerOffset = 70;
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var hash = this.getAttribute('href');
      if (hash === '#' || hash.length < 2) return;
      var target = document.querySelector(hash);
      if (!target) return;

      // Only intercept if smooth scroll is not natively handled cleanly
      // (we offset by header height regardless)
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* Reveal-on-scroll removed:
     The page is content-heavy and the hover/transition styles in CSS
     already give a polished feel. Initial-load opacity:0 caused sections
     to disappear in static contexts (screenshots, no-JS, slow connections). */

})();
