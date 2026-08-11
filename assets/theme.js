/**
 * Michimimos theme — F3 scaffold
 * Brand loader dismiss (≤1.2s). Full nav/cart in F4.
 */
(function () {
  'use strict';

  var LOADER_MAX_MS = 1200;
  var LOADER_MIN_MS = 400;

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

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', dismissLoader, { once: true });
  } else {
    dismissLoader();
  }
})();
