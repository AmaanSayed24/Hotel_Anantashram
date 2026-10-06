/* ============================================================================
   Hotel Anantashram - site behaviour (no dependencies, ES5-compatible)
   ============================================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------------- 3D perspective scroll reveal ---------------- */
  var revealElements = document.querySelectorAll('.reveal-3d');
  if ('IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active-in');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealElements.forEach(function (el) { revealObserver.observe(el); });
  } else {
    revealElements.forEach(function (el) { el.classList.add('active-in'); });
  }

  /* ---------------- 3D tilt + hover lift on cards ---------------- */
  if (!prefersReducedMotion && canHover) {
    document.querySelectorAll('.tilt-card').forEach(function (card) {
      card.addEventListener('mousemove', function (event) {
        var rect = card.getBoundingClientRect();
        var rotateY = ((event.clientX - rect.left - rect.width / 2) / (rect.width / 2)) * 5;
        var rotateX = ((event.clientY - rect.top - rect.height / 2) / (rect.height / 2)) * -5;
        card.style.transform = 'perspective(800px) translateY(-4px) rotateX(' + rotateX +
          'deg) rotateY(' + rotateY + 'deg) scale3d(1.02, 1.02, 1.02)';
      });
      card.addEventListener('mouseleave', function () { card.style.transform = ''; });
    });
  }

  /* ---------------- Sticky header elevation on scroll ---------------- */
  var header = document.getElementById('site-header');
  var syncHeader = function () {
    if (!header) return;
    var scrolled = window.scrollY > 12;
    header.classList.toggle('shadow-md', scrolled);
    header.classList.toggle('shadow-sm', !scrolled);
  };
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  /* ---------------- Mobile navigation drawer ---------------- */
  var drawer = document.getElementById('mobile-menu');
  var drawerPanel = document.getElementById('mobile-menu-panel');
  var drawerBackdrop = drawer ? drawer.querySelector('.drawer-backdrop') : null;
  var menuOpenBtn = document.getElementById('mobile-menu-open');
  var menuCloseBtn = document.getElementById('mobile-menu-close');
  /* Must stay in sync with the 
av breakpoint (1200px) in tailwind.config.js. */
  var desktopQuery = window.matchMedia('(min-width: 1200px)');
  var lastFocused = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.hidden = false;
    document.body.classList.add('drawer-open');
    if (menuOpenBtn) menuOpenBtn.setAttribute('aria-expanded', 'true');
    window.requestAnimationFrame(function () {
      if (drawerBackdrop) drawerBackdrop.classList.remove('opacity-0');
      if (drawerPanel) drawerPanel.classList.remove('translate-x-full');
    });
    if (menuCloseBtn) menuCloseBtn.focus();
  }

  function closeDrawer(restoreFocus) {
    if (!drawer || drawer.hidden) return;
    if (drawerBackdrop) drawerBackdrop.classList.add('opacity-0');
    if (drawerPanel) drawerPanel.classList.add('translate-x-full');
    document.body.classList.remove('drawer-open');
    if (menuOpenBtn) menuOpenBtn.setAttribute('aria-expanded', 'false');
    window.setTimeout(function () { drawer.hidden = true; }, 380);
    if (restoreFocus !== false && lastFocused && lastFocused.focus) lastFocused.focus();
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', function () { closeDrawer(true); });
  if (drawerBackdrop) drawerBackdrop.addEventListener('click', function () { closeDrawer(true); });
  document.querySelectorAll('[data-drawer-link]').forEach(function (link) {
    link.addEventListener('click', function () { closeDrawer(false); });
  });
  if (drawer) {
    drawer.addEventListener('keydown', function (event) {
      if (event.key !== 'Tab') return;
      var focusables = drawer.querySelectorAll('a[href], button:not([disabled])');
      if (!focusables.length) return;
      var first = focusables[0];
      var last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
  }
  var syncDrawerViewport = function (event) { if (event.matches) closeDrawer(false); };
  if (typeof desktopQuery.addEventListener === 'function') desktopQuery.addEventListener('change', syncDrawerViewport);
  else if (typeof desktopQuery.addListener === 'function') desktopQuery.addListener(syncDrawerViewport);

  document.addEventListener('keydown', function (event) {
    if (event.key !== 'Escape') return;
    if (drawer && !drawer.hidden) closeDrawer(true);
    else if (typeof window.closeAnantashramModal === 'function') window.closeAnantashramModal();
  });
})();

/* ============================================================================
 2) Privacy dialog, Menu Explorer tabs, dietary/spice badges, scroll spy
 ============================================================================ */

(function () {
  'use strict';

  var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Privacy policy dialog ---------------- */
  var modalShell = document.getElementById('privacy-modal');
  var modalTrigger = null;

  function closeModal() {
    if (!modalShell || modalShell.style.display === 'none') return;
    modalShell.classList.add('opacity-0');
    var card = modalShell.querySelector('.modal-card');
    if (card) card.classList.add('opacity-0', 'scale-95');
    document.body.classList.remove('modal-open');
    window.setTimeout(function () { modalShell.style.display = 'none'; }, 300);
    if (modalTrigger && modalTrigger.focus) modalTrigger.focus();
  }
  window.closeAnantashramModal = closeModal;

  document.querySelectorAll('[data-modal-open]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var shell = document.getElementById(btn.getAttribute('data-modal-open'));
      if (!shell) return;
      modalTrigger = btn;
      shell.style.display = 'grid';
      document.body.classList.add('modal-open');
      window.requestAnimationFrame(function () {
        shell.classList.remove('opacity-0');
        var card = shell.querySelector('.modal-card');
        if (card) card.classList.remove('opacity-0', 'scale-95');
      });
      var closeBtn = shell.querySelector('[data-modal-close]');
      if (closeBtn) closeBtn.focus();
    });
  });
  document.querySelectorAll('[data-modal-close]').forEach(function (el) {
    el.addEventListener('click', closeModal);
  });

  /* ---------------- Footer copyright year ---------------- */
  var yearEl = document.getElementById('current-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------------- Menu Explorer: tab rail + animated swap ---------------- */
  var tabRail = document.getElementById('menu-tabs');
  var railWrap = document.getElementById('menu-tabs-rail');

  function updateTabRail() {
    if (!tabRail || !railWrap) return;
    var maxScroll = tabRail.scrollWidth - tabRail.clientWidth;
    railWrap.classList.toggle('can-scroll-start', tabRail.scrollLeft > 4);
    railWrap.classList.toggle('can-scroll-end', tabRail.scrollLeft < maxScroll - 4);
  }

  function filterCategory(category) {
    var tabs = document.querySelectorAll('.menu-tab');
    tabs.forEach(function (tab) {
      var isActive = tab.id === 'tab-' + category;
      tab.classList.toggle('bg-primary', isActive);
      tab.classList.toggle('text-on-primary', isActive);
      tab.classList.toggle('shadow-sm', isActive);
      tab.classList.toggle('scale-102', isActive);
      tab.classList.toggle('bg-surface-container-high', !isActive);
      tab.classList.toggle('text-on-surface-variant', !isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    var visibleIndex = 0;
    document.querySelectorAll('.menu-item').forEach(function (item) {
      var matches = item.classList.contains('category-' + category);
      item.classList.toggle('hidden', !matches);
      item.classList.remove('menu-swap');
      if (matches) {
        item.style.animationDelay = (visibleIndex * 45) + 'ms';
        void item.offsetWidth; /* restart the animation on every tab change */
        item.classList.add('menu-swap');
        visibleIndex += 1;
      } else {
        item.style.animationDelay = '';
      }
    });

    var activeTab = document.getElementById('tab-' + category);
    if (activeTab && typeof activeTab.scrollIntoView === 'function') {
      activeTab.scrollIntoView({
        behavior: prefersReducedMotion ? 'auto' : 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
    window.setTimeout(updateTabRail, 320);
  }
  window.filterCategory = filterCategory;

  /* Event delegation for menu tabs (replaces inline onclick) */
  if (tabRail) {
    tabRail.addEventListener('click', function (event) {
      var tab = event.target.closest('.menu-tab');
      if (tab && tab.hasAttribute('data-category')) {
        filterCategory(tab.getAttribute('data-category'));
      }
    });
    tabRail.addEventListener('scroll', updateTabRail, { passive: true });
    tabRail.addEventListener('keydown', function (event) {
      var handled = ['ArrowRight', 'ArrowLeft', 'Home', 'End'].indexOf(event.key) !== -1;
      if (!handled) return;
      var tabs = Array.prototype.slice.call(tabRail.querySelectorAll('.menu-tab'));
      var currentIndex = tabs.indexOf(document.activeElement);
      if (currentIndex === -1) return;
      event.preventDefault();
      var nextIndex = currentIndex;
      if (event.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') nextIndex = 0;
      else nextIndex = tabs.length - 1;
      tabs[nextIndex].focus();
      tabs[nextIndex].click();
    });
    window.addEventListener('resize', updateTabRail);
    updateTabRail();
  }
  /* ---------------- Dietary &amp; spice metadata for every dish ---------------- */
  /* ['veg' | 'nonveg', 0 = none, 1 = mild, 2 = medium, 3 = hot] */
  var DISH_META = {
    'King Fish Thali': ['nonveg', 2],
    'Special Fish Thali': ['nonveg', 2],
    'Chonak Thali': ['nonveg', 1],
    'Prawns Thali': ['nonveg', 2],
    'Pure Veg Thali': ['veg', 1],
    'Prawn Curry Bowl': ['nonveg', 2],
    'Squids Golden Fry': ['nonveg', 1],
    'Squids Butter Garlic': ['nonveg', 1],
    'Prawns Butter Garlic': ['nonveg', 1],
    'Kingfish Rawa Fry': ['nonveg', 2],
    'Lepo Fry (Sole Fish)': ['nonveg', 1],
    'Prawns Golden / Tempura': ['nonveg', 1],
    'Mutton Biryani': ['nonveg', 2],
    'Prawn Biryani': ['nonveg', 2],
    'Anantashram Special Handi Dum': ['nonveg', 1],
    'Chicken Ala Punjab Biryani': ['nonveg', 2],
    'Prawns 65 Biryani': ['nonveg', 3],
    'Vegetable Biryani': ['veg', 1],
    'Chicken Xacutti': ['nonveg', 3],
    'Mutton Xacutti': ['nonveg', 3],
    'Butter Chicken': ['nonveg', 1],
    'Chicken Kolhapuri': ['nonveg', 3],
    'Paneer Tikka Masala': ['veg', 2],
    'Lotus Stem Chilli': ['veg', 2],
    'Dal Tadka': ['veg', 1],
    'Chicken Lollipop': ['nonveg', 2],
    'Butter Garlic Naan': ['veg', 0],
    'Cheese Garlic Naan': ['veg', 0],
    'Authentic Sol Kadi': ['veg', 0],
    'Goan Bebinca': ['veg', 0],
    'Goan Serradura': ['veg', 0]
  };

  var SPICE_LABELS = { 1: 'Mild', 2: 'Medium', 3: 'Fiery hot' };
  var SPICE_COLORS = { 1: 'text-tertiary', 2: 'text-primary', 3: 'text-error' };

  function buildDietMark(diet) {
    var mark = document.createElement('span');
    mark.className = 'diet-mark ' + (diet === 'veg' ? 'diet-veg' : 'diet-nonveg');
    var label = diet === 'veg' ? 'Pure vegetarian dish' : 'Contains seafood, poultry or meat';
    mark.title = label;
    mark.setAttribute('role', 'img');
    mark.setAttribute('aria-label', label);
    mark.appendChild(document.createElement('span'));
    return mark;
  }

  function buildSpiceLevel(spice) {
    var wrap = document.createElement('span');
    wrap.className = 'spice-level ' + (SPICE_COLORS[spice] || 'text-tertiary');
    wrap.title = 'Spice level: ' + (SPICE_LABELS[spice] || 'Mild');
    wrap.setAttribute('aria-label', wrap.title);
    for (var i = 0; i < spice; i += 1) {
      var icon = document.createElement('span');
      icon.className = 'material-symbols-outlined';
      icon.setAttribute('data-weight', 'fill');
      icon.setAttribute('aria-hidden', 'true');
      icon.textContent = 'local_fire_department';
      wrap.appendChild(icon);
    }
    return wrap;
  }

  document.querySelectorAll('.menu-item').forEach(function (item) {
    var nameEl = item.querySelector('h4');
    if (!nameEl) return;
    var meta = DISH_META[nameEl.textContent.trim()] || ['nonveg', 0];
    var parent = nameEl.parentElement;
    if (!parent) return;

    /* Drop the legacy unlabelled dot marker where it still exists */
    parent.querySelectorAll('span.w-3.h-3').forEach(function (dot) { dot.remove(); });
    item.querySelectorAll('span.w-3.h-3').forEach(function (dot) { dot.remove(); });

    var mark = buildDietMark(meta[0]);
    var isNameRow = parent.classList.contains('items-center') && !parent.classList.contains('justify-between');

    if (isNameRow) {
      parent.insertBefore(mark, parent.firstChild);
      if (meta[1] > 0) parent.appendChild(buildSpiceLevel(meta[1]));
    } else {
      var wrapper = document.createElement('div');
      wrapper.className = 'flex items-center gap-2 min-w-0';
      parent.insertBefore(wrapper, nameEl);
      wrapper.appendChild(mark);
      wrapper.appendChild(nameEl);
      if (meta[1] > 0) wrapper.appendChild(buildSpiceLevel(meta[1]));
    }
  });

  /* ---------------- Active section highlight (scroll spy) ---------------- */
  var navLinks = document.querySelectorAll('[data-nav-link]');
  var drawerLinks = document.querySelectorAll('[data-drawer-link]');
  var sections = Array.prototype.slice.call(document.querySelectorAll('main section[id]'));

  function setActiveSection(id) {
    navLinks.forEach(function (link) {
      link.classList.toggle('is-active', link.getAttribute('href') === '#' + id);
    });
    drawerLinks.forEach(function (link) {
      if (link.getAttribute('href') === '#' + id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });
  }

  if (sections.length && 'IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (section) { spy.observe(section); });
  }

  /* ---------------- Service Worker registration ---------------- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js')
        .then(function (registration) {
          console.log('Service Worker registered:', registration.scope);
        })
        .catch(function (error) {
          console.warn('Service Worker registration failed:', error);
        });
    });
  }
})();

