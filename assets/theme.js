/**
 * Michimimos theme — F4 layout shell
 * Loader (≤1.2s), mobile nav, cart drawer.
 */
(function () {
  'use strict';

  var LOADER_MAX_MS = 1200;
  var LOADER_MIN_MS = 400;
  var FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  /* —— Brand loader —— */
  function dismissLoader() {
    var loader = document.querySelector('[data-brand-loader]');
    if (!loader) return;

    var reduceMotion =
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    var delay = reduceMotion ? 80 : LOADER_MIN_MS;
    var maxWait = reduceMotion ? 120 : LOADER_MAX_MS;
    var started = Date.now();

    function hide() {
      var elapsed = Date.now() - started;
      var remaining = Math.max(0, delay - elapsed);
      window.setTimeout(function () {
        loader.classList.add('is-done');
        window.setTimeout(function () {
          loader.setAttribute('hidden', '');
          loader.setAttribute('aria-hidden', 'true');
        }, reduceMotion ? 80 : 600);
      }, remaining);
    }

    if (document.readyState === 'complete') {
      hide();
    } else {
      window.addEventListener('load', hide, { once: true });
      window.setTimeout(hide, maxWait);
    }
  }

  /* —— Mobile nav —— */
  function initNav() {
    var header = document.querySelector('[data-site-header]');
    if (!header) return;

    var toggle = header.querySelector('[data-nav-toggle]');
    var panel = header.querySelector('[data-nav-panel]');
    var backdrop = header.querySelector('[data-nav-backdrop]');
    if (!toggle || !panel) return;

    var openLabel = toggle.getAttribute('data-label-open') || toggle.getAttribute('aria-label') || '';
    var closeLabel = toggle.getAttribute('data-label-close') || '';

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    function setOpen(open) {
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      header.classList.toggle('is-nav-open', open);
      if (backdrop) {
        backdrop.hidden = !open;
      }
      document.body.classList.toggle('has-nav-open', open);
      if (openLabel || closeLabel) {
        toggle.setAttribute('aria-label', open ? closeLabel || openLabel : openLabel);
      }
      if (open) {
        var first = panel.querySelector(FOCUSABLE);
        if (first) first.focus();
      } else {
        toggle.focus();
      }
    }

    toggle.addEventListener('click', function () {
      setOpen(!isOpen());
    });

    if (backdrop) {
      backdrop.addEventListener('click', function () {
        setOpen(false);
      });
    }

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        setOpen(false);
      }
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isOpen()) setOpen(false);
      });
    });
  }

  /* —— Cart drawer (native dialog) —— */
  function initCartDrawer() {
    var drawer = document.querySelector('[data-cart-drawer]');
    var toggles = document.querySelectorAll('[data-cart-toggle]');
    if (!drawer || !toggles.length) return;

    function setExpanded(open) {
      toggles.forEach(function (btn) {
        btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      });
    }

    function openDrawer() {
      if (typeof drawer.showModal === 'function') {
        drawer.showModal();
      } else {
        drawer.setAttribute('open', '');
      }
      setExpanded(true);
      var closeBtn = drawer.querySelector('[data-cart-close]');
      if (closeBtn) closeBtn.focus();
    }

    function closeDrawer() {
      if (typeof drawer.close === 'function') {
        drawer.close();
      } else {
        drawer.removeAttribute('open');
      }
      setExpanded(false);
    }

    toggles.forEach(function (btn) {
      btn.addEventListener('click', function () {
        if (drawer.open) {
          closeDrawer();
          btn.focus();
        } else {
          openDrawer();
        }
      });
    });

    drawer.querySelectorAll('[data-cart-close]').forEach(function (el) {
      el.addEventListener('click', function (event) {
        if (el.tagName === 'A' && el.getAttribute('href') && el.getAttribute('href') !== '#') {
          /* allow navigation; still close for consistency */
        }
        closeDrawer();
        if (toggles[0]) toggles[0].focus();
        if (el.tagName === 'BUTTON') {
          event.preventDefault();
        }
      });
    });

    drawer.addEventListener('click', function (event) {
      if (event.target === drawer) {
        closeDrawer();
        if (toggles[0]) toggles[0].focus();
      }
    });

    drawer.addEventListener('close', function () {
      setExpanded(false);
    });
  }

  function boot() {
    dismissLoader();
    initNav();
    initCartDrawer();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
