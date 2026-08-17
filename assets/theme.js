/**
 * Michimimos theme — F4 shell + F6 PDP/colección
 * Loader, mobile nav, cart drawer, product form, sticky ATC, FAQ.
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
        var openProductos = header.querySelector('[data-productos-nav].is-open');
        if (openProductos) return;
        setOpen(false);
      }
    });

    panel.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        if (isOpen()) setOpen(false);
      });
    });
  }

  /* —— Cart drawer helpers —— */
  var cartDrawerApi = {
    open: function () {},
    close: function () {}
  };

  function updateCartCount(count) {
    document.querySelectorAll('[data-cart-count]').forEach(function (el) {
      el.textContent = String(count);
    });
  }

  function refreshCartCount() {
    return fetch('/cart.js', {
      headers: { Accept: 'application/json' }
    })
      .then(function (res) {
        if (!res.ok) throw new Error('cart');
        return res.json();
      })
      .then(function (cart) {
        updateCartCount(cart.item_count || 0);
        return cart;
      });
  }

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

    cartDrawerApi.open = openDrawer;
    cartDrawerApi.close = closeDrawer;

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

  /* —— Money (lean Shopify-style) —— */
  function formatMoney(cents, format) {
    if (typeof cents === 'string') cents = cents.replace('.', '');
    var value = (Number(cents) / 100).toFixed(2);
    var fmt = format || '${{amount}}';
    if (fmt.indexOf('{{amount_no_decimals}}') !== -1) {
      return fmt.replace('{{amount_no_decimals}}', String(Math.round(Number(cents) / 100)));
    }
    var withSep = value.replace('.', ',');
    return fmt
      .replace('{{amount_with_comma_separator}}', withSep)
      .replace('{{amount}}', value);
  }

  /* —— FAQ accordion —— */
  function initFaq() {
    document.querySelectorAll('[data-faq-accordion]').forEach(function (root) {
      root.querySelectorAll('[data-faq-trigger]').forEach(function (btn) {
        btn.addEventListener('click', function () {
          var expanded = btn.getAttribute('aria-expanded') === 'true';
          var panelId = btn.getAttribute('aria-controls');
          var panel = panelId ? document.getElementById(panelId) : null;
          btn.setAttribute('aria-expanded', expanded ? 'false' : 'true');
          if (panel) {
            if (expanded) {
              panel.setAttribute('hidden', '');
            } else {
              panel.removeAttribute('hidden');
            }
          }
        });
      });
    });
  }

  /* —— Product page —— */
  function initProductPage() {
    var root = document.querySelector('[data-product-page]');
    if (!root) return;

    var form = root.querySelector('[data-product-form]');
    var jsonEl = root.querySelector('[data-product-json]');
    if (!form || !jsonEl) return;

    var product;
    try {
      product = JSON.parse(jsonEl.textContent);
    } catch (err) {
      return;
    }

    var moneyFormat =
      root.getAttribute('data-money-format') ||
      (window.theme && window.theme.moneyFormat) ||
      '${{amount}}';

    var variantInput = form.querySelector('[data-product-variant-id]');
    var priceCurrent = root.querySelector('[data-current-price]');
    var priceCompare = root.querySelector('[data-compare-price]');
    var availability = root.querySelector('[data-product-availability]');
    var addBtn = form.querySelector('[data-add-to-cart]');
    var addText = form.querySelector('[data-add-to-cart-text]');
    var statusEl = form.querySelector('[data-atc-status]');
    var featuredImg = root.querySelector('[data-featured-image]');
    var sticky = root.querySelector('[data-sticky-atc]');
    var stickyBtn = root.querySelector('[data-sticky-atc-button]');
    var stickyText = root.querySelector('[data-sticky-atc-text]');
    var stickyPrice = root.querySelector('[data-sticky-price]');

    var labels = {
      add: (addText && addText.textContent.trim()) || 'Agregar al carrito',
      sold: 'Agotado',
      available: (availability && availability.textContent.trim()) || 'Disponible',
      adding: 'Agregando…',
      added: 'Listo, lo sumamos al carrito',
      error: 'No pudimos agregarlo. Intenta de nuevo.'
    };

    if (statusEl) {
      labels.adding = statusEl.getAttribute('data-label-adding') || labels.adding;
      labels.added = statusEl.getAttribute('data-label-added') || labels.added;
      labels.error = statusEl.getAttribute('data-label-error') || labels.error;
    }

    function getSelectedOptions() {
      var options = [];
      var optionCount = product.options ? product.options.length : 0;
      var i;
      for (i = 0; i < optionCount; i += 1) {
        var radio = form.querySelector(
          'input[data-option-index="' + i + '"]:checked'
        );
        var select = form.querySelector(
          'select[data-option-index="' + i + '"]'
        );
        if (radio) {
          options.push(radio.value);
        } else if (select) {
          options.push(select.value);
        }
      }
      return options;
    }

    function findVariant(options) {
      if (!product.variants) return null;
      return (
        product.variants.find(function (variant) {
          return options.every(function (opt, index) {
            return variant['option' + (index + 1)] === opt;
          });
        }) || null
      );
    }

    function setFeaturedFromUrl(url, srcset, alt) {
      if (!featuredImg || !url) return;
      featuredImg.setAttribute('src', url);
      if (srcset) featuredImg.setAttribute('srcset', srcset);
      if (alt) featuredImg.setAttribute('alt', alt);
    }

    function setThumbActive(mediaId) {
      root.querySelectorAll('[data-thumb]').forEach(function (thumb) {
        var active = String(thumb.getAttribute('data-media-id')) === String(mediaId);
        thumb.classList.toggle('is-active', active);
        thumb.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    function updateVariant(variant) {
      if (!variant) return;

      if (variantInput) variantInput.value = variant.id;

      if (priceCurrent) {
        priceCurrent.textContent = formatMoney(variant.price, moneyFormat);
      }
      if (stickyPrice) {
        stickyPrice.textContent = formatMoney(variant.price, moneyFormat);
      }
      if (priceCompare) {
        if (variant.compare_at_price && variant.compare_at_price > variant.price) {
          priceCompare.textContent = formatMoney(variant.compare_at_price, moneyFormat);
          priceCompare.hidden = false;
        } else {
          priceCompare.textContent = '';
          priceCompare.hidden = true;
        }
      }

      var available = !!variant.available;
      if (availability) {
        availability.textContent = available ? labels.available : labels.sold;
        if (available) {
          availability.removeAttribute('data-unavailable');
        } else {
          availability.setAttribute('data-unavailable', '');
        }
      }
      if (addBtn) addBtn.disabled = !available;
      if (stickyBtn) stickyBtn.disabled = !available;
      if (addText) addText.textContent = available ? labels.add : labels.sold;
      if (stickyText) stickyText.textContent = available ? labels.add : labels.sold;

      if (variant.featured_media && variant.featured_media.id) {
        var mediaId = variant.featured_media.id;
        var thumb = root.querySelector('[data-thumb][data-media-id="' + mediaId + '"]');
        if (thumb) {
          setFeaturedFromUrl(
            thumb.getAttribute('data-media-url'),
            thumb.getAttribute('data-media-srcset'),
            thumb.getAttribute('data-media-alt')
          );
          setThumbActive(mediaId);
        }
      }
    }

    function onOptionChange() {
      var variant = findVariant(getSelectedOptions());
      if (variant) updateVariant(variant);
    }

    form.querySelectorAll('[data-option-index]').forEach(function (el) {
      el.addEventListener('change', onOptionChange);
    });

    root.querySelectorAll('[data-thumb]').forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        setFeaturedFromUrl(
          thumb.getAttribute('data-media-url'),
          thumb.getAttribute('data-media-srcset'),
          thumb.getAttribute('data-media-alt')
        );
        setThumbActive(thumb.getAttribute('data-media-id'));
      });
    });

    function setStatus(message, isError) {
      if (!statusEl) return;
      if (!message) {
        statusEl.hidden = true;
        statusEl.textContent = '';
        return;
      }
      statusEl.hidden = false;
      statusEl.textContent = message;
      statusEl.classList.toggle('is-error', !!isError);
    }

    function addToCart() {
      if (!variantInput || addBtn.disabled) return Promise.resolve();

      var qtyInput = form.querySelector('[data-product-quantity]');
      var quantity = qtyInput ? Math.max(1, parseInt(qtyInput.value, 10) || 1) : 1;
      var id = Number(variantInput.value);

      if (addText) addText.textContent = labels.adding;
      if (stickyText) stickyText.textContent = labels.adding;
      if (addBtn) addBtn.disabled = true;
      if (stickyBtn) stickyBtn.disabled = true;
      setStatus('');

      return fetch(window.Shopify && window.Shopify.routes && window.Shopify.routes.root
        ? window.Shopify.routes.root + 'cart/add.js'
        : '/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          items: [{ id: id, quantity: quantity }]
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('add');
          return res.json();
        })
        .then(function () {
          return refreshCartCount();
        })
        .then(function () {
          setStatus(labels.added, false);
          if (addText) addText.textContent = labels.add;
          if (stickyText) stickyText.textContent = labels.add;
          if (addBtn) addBtn.disabled = false;
          if (stickyBtn) stickyBtn.disabled = false;
          cartDrawerApi.open();
        })
        .catch(function () {
          setStatus(labels.error, true);
          if (addText) addText.textContent = labels.add;
          if (stickyText) stickyText.textContent = labels.add;
          if (addBtn) addBtn.disabled = false;
          if (stickyBtn) stickyBtn.disabled = false;
        });
    }

    form.addEventListener('submit', function (event) {
      event.preventDefault();
      addToCart();
    });

    if (stickyBtn) {
      stickyBtn.addEventListener('click', function () {
        addToCart();
      });
    }

    /* Sticky ATC: show when main form leaves viewport (mobile CSS gates visibility) */
    if (sticky && 'IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              sticky.setAttribute('hidden', '');
              document.body.classList.remove('has-sticky-atc');
            } else {
              sticky.removeAttribute('hidden');
              document.body.classList.add('has-sticky-atc');
            }
          });
        },
        { root: null, threshold: 0, rootMargin: '0px' }
      );
      observer.observe(form);
    }
  }

  /* —— Productos cluster (desktop panel + mobile accordion) —— */
  function initProductosNav() {
    var groups = document.querySelectorAll('[data-productos-nav]');
    if (!groups.length) return;

    var finePointer =
      window.matchMedia &&
      window.matchMedia('(hover: hover) and (pointer: fine)').matches;

    groups.forEach(function (group) {
      var toggle = group.querySelector('[data-productos-toggle]');
      var panel = group.querySelector('[data-productos-panel]');
      group.classList.add('is-enhanced');

      function isOpen() {
        return group.classList.contains('is-open');
      }

      function setOpen(open) {
        group.classList.toggle('is-open', open);
        if (toggle) {
          toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        }
        if (panel) {
          panel.setAttribute('aria-hidden', open ? 'false' : 'true');
        }
      }

      if (toggle) {
        toggle.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopPropagation();
          setOpen(!isOpen());
        });
      }

      if (finePointer) {
        group.addEventListener('mouseenter', function () {
          setOpen(true);
        });
        group.addEventListener('mouseleave', function () {
          setOpen(false);
        });
      }

      document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && isOpen()) {
          setOpen(false);
          if (toggle) toggle.focus();
        }
      });

      document.addEventListener('click', function (event) {
        if (!group.contains(event.target)) {
          setOpen(false);
        }
      });
    });
  }

  function boot() {
    dismissLoader();
    initNav();
    initProductosNav();
    initCartDrawer();
    initFaq();
    initProductPage();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot, { once: true });
  } else {
    boot();
  }
})();
