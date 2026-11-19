/**
 * Hotel Anantashram — Site Behaviour
 * Vanilla JavaScript (ES6+), high performance, full accessibility, zero external dependencies.
 */

(function () {
  'use strict';

  // Mark document as JS-enabled
  document.documentElement.classList.add('js');

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================================
     1. Hero Entrance & Scroll Reveal Animations
     ========================================================================== */
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    // Slight tick to ensure initial paint before trigger
    requestAnimationFrame(() => {
      heroSection.classList.add('is-in');
    });
  }

  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0) {
    if ('IntersectionObserver' in window && !prefersReducedMotion) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
      });

      revealElements.forEach(el => revealObserver.observe(el));
    } else {
      revealElements.forEach(el => el.classList.add('in-view'));
    }
  }

  /* ==========================================================================
     2. Sticky Header Elevation, Scrolled Capsule & Keynote Wordmark
     ========================================================================== */
  const siteHeader = document.getElementById('site-header');
  const mobileCta = document.getElementById('mobile-cta');

  /* Keynote-style Kinetic Chromatic Wordmark Assemble */
  function initWordmarkAssemble() {
    const wordmark = document.getElementById('brand-wordmark');
    if (!wordmark) return;
    const chars = wordmark.querySelectorAll('.wm-char');
    if (!chars.length) return;

    if (prefersReducedMotion) {
      chars.forEach((ch) => {
        ch.style.opacity = '1';
        ch.style.transform = 'none';
        ch.style.filter = 'none';
        ch.style.textShadow = 'none';
      });
      return;
    }

    // Deterministic organic kinetic dispersion vectors for "HOTEL ANANTASHRAM"
    const scatter = [
      { x: -14, y: -18, r: -8, redX: -3.5, blueX: 3.5 }, // H
      { x:  -8, y:  22, r:  6, redX: -2.8, blueX: 3.0 }, // O
      { x:  12, y: -20, r: -7, redX: -3.2, blueX: 2.8 }, // T
      { x:  18, y:  16, r:  5, redX: -2.5, blueX: 2.5 }, // E
      { x: -10, y: -24, r: -6, redX: -3.0, blueX: 3.0 }, // L
      { x: -22, y:  18, r:  9, redX: -3.8, blueX: 3.5 }, // A
      { x: -12, y: -22, r: -7, redX: -3.0, blueX: 3.2 }, // N
      { x:  10, y:  24, r:  8, redX: -2.7, blueX: 2.9 }, // A
      { x: -16, y: -16, r: -5, redX: -3.3, blueX: 3.0 }, // N
      { x:  14, y:  20, r:  7, redX: -2.9, blueX: 3.1 }, // T
      { x: -18, y: -18, r: -8, redX: -3.4, blueX: 3.4 }, // A
      { x:  16, y:  22, r:  6, redX: -3.1, blueX: 2.8 }, // S
      { x: -14, y: -20, r: -7, redX: -3.2, blueX: 3.2 }, // H
      { x:  12, y:  18, r:  5, redX: -2.8, blueX: 2.9 }, // R
      { x: -10, y: -22, r: -6, redX: -3.0, blueX: 3.0 }, // A
      { x:  20, y:  20, r:  8, redX: -3.6, blueX: 3.6 }  // M
    ];

    chars.forEach((ch, idx) => {
      const s = scatter[idx % scatter.length];
      ch.style.opacity = '0';
      ch.style.display = 'inline-block';
      ch.style.transform = `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.r}deg) scale(0.92)`;
      ch.style.filter = 'blur(4px)';
      ch.style.textShadow = `${s.redX}px 0 1px rgba(158, 61, 36, 0.8), ${s.blueX}px 0 1px rgba(79, 94, 129, 0.75)`;
      ch.style.transition = 'none';
    });

    requestAnimationFrame(() => {
      setTimeout(() => {
        chars.forEach((ch, idx) => {
          const delay = 50 + idx * 36;
          const duration = 650;
          setTimeout(() => {
            ch.style.transition = `transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1), ` +
                                  `opacity ${duration - 100}ms ease-out, ` +
                                  `filter ${duration - 150}ms ease-out, ` +
                                  `text-shadow ${duration}ms cubic-bezier(0.16, 1, 0.3, 1)`;
            ch.style.opacity = '1';
            ch.style.transform = 'translate3d(0, 0, 0) rotate(0deg) scale(1)';
            ch.style.filter = 'blur(0px)';
            ch.style.textShadow = '0 0 0 transparent';

            setTimeout(() => {
              ch.style.transform = '';
              ch.style.filter = '';
              ch.style.textShadow = '';
              ch.style.opacity = '';
              ch.style.transition = '';
            }, duration + 60);
          }, delay);
        });
      }, 120);
    });
  }

  function handleScroll() {
    const scrollY = window.scrollY || window.pageYOffset;
    if (siteHeader) {
      siteHeader.classList.toggle('header-compact', scrollY > 24);
      siteHeader.classList.toggle('is-scrolled', scrollY > 40);
    }
    if (mobileCta) {
      if (scrollY > 380) {
        mobileCta.classList.add('show');
        mobileCta.classList.remove('translate-y-full', 'opacity-0');
      } else {
        mobileCta.classList.remove('show');
        mobileCta.classList.add('translate-y-full', 'opacity-0');
      }
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
  initWordmarkAssemble();

  /* ==========================================================================
     3. Navigation Overlay (hamburger menu — centred frosted-glass tile panel)
     ========================================================================== */
  const drawer = document.getElementById('mobile-menu');
  const drawerPanel = document.getElementById('mobile-menu-panel');
  const menuOpenBtn = document.getElementById('mobile-menu-open');
  const menuCloseBtn = document.getElementById('mobile-menu-close');
  const drawerLinks = drawer ? drawer.querySelectorAll('[data-drawer-link]') : [];
  const dismissTargets = drawer ? drawer.querySelectorAll('[data-drawer-dismiss]') : [];
  let lastFocusedElement = null;

  function openDrawer() {
    if (!drawer) return;
    lastFocusedElement = document.activeElement;
    drawer.hidden = false;
    drawer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('drawer-open');
    if (menuOpenBtn) menuOpenBtn.setAttribute('aria-expanded', 'true');

    // Trigger CSS transitions via is-open class on next frame
    requestAnimationFrame(() => {
      drawer.classList.add('is-open');
    });

    if (menuCloseBtn) {
      setTimeout(() => menuCloseBtn.focus(), 120);
    }
  }

  function closeDrawer(restoreFocus = true) {
    if (!drawer || drawer.hidden) return;

    drawer.classList.remove('is-open');
    document.body.classList.remove('drawer-open');
    if (menuOpenBtn) menuOpenBtn.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');

    // Wait for the CSS exit transition to finish before hiding
    setTimeout(() => {
      drawer.hidden = true;
    }, 380);

    if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  if (menuOpenBtn) menuOpenBtn.addEventListener('click', openDrawer);
  if (menuCloseBtn) menuCloseBtn.addEventListener('click', () => closeDrawer(true));
  dismissTargets.forEach(el => el.addEventListener('click', () => closeDrawer(true)));
  drawerLinks.forEach(link => link.addEventListener('click', () => closeDrawer(false)));

  // Close drawer on ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && !drawer.hidden) {
      closeDrawer(true);
    }
  });

  // Keep drawer state synced with desktop viewport threshold (auto-close only when unscrolled)
  const desktopQuery = window.matchMedia('(min-width: 1024px)');
  const handleBreakpointChange = (e) => {
    if (e.matches && drawer && !drawer.hidden) {
      const scrollY = window.scrollY || window.pageYOffset;
      if (scrollY <= 40) {
        closeDrawer(false);
      }
    }
  };
  if (typeof desktopQuery.addEventListener === 'function') {
    desktopQuery.addEventListener('change', handleBreakpointChange);
  } else if (typeof desktopQuery.addListener === 'function') {
    desktopQuery.addListener(handleBreakpointChange);
  }

  /* ==========================================================================
     4. Scroll-Spy for Active Navigation Links
     ========================================================================== */
  const trackedSections = document.querySelectorAll('main section[id]');
  const desktopNavLinks = document.querySelectorAll('nav[aria-label="Primary"] [data-nav-link]');
  const mobileNavLinks = document.querySelectorAll('#mobile-menu [data-drawer-link]');

  function updateActiveNav() {
    if (!trackedSections.length) return;
    const scrollPosition = (window.scrollY || window.pageYOffset) + 120;
    let currentSectionId = '';

    trackedSections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        currentSectionId = section.getAttribute('id');
      }
    });

    const updateLinkGroup = (links) => {
      links.forEach(link => {
        const href = link.getAttribute('href');
        const isMatch = href === '#' + currentSectionId;
        link.classList.toggle('is-active', isMatch);
        if (isMatch) {
          link.setAttribute('aria-current', 'true');
        } else {
          link.removeAttribute('aria-current');
        }
      });
    };

    updateLinkGroup(desktopNavLinks);
    updateLinkGroup(mobileNavLinks);
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  /* ==========================================================================
     5. Curated Culinary Menu: Category Filtering & Live Search
     ========================================================================== */
  const menuTabs = document.querySelectorAll('.menu-tab');
  const menuGrid = document.getElementById('menu-grid');
  const menuItems = document.querySelectorAll('.menu-item');
  const menuSearchInput = document.getElementById('menu-search');
  const menuSearchClear = document.getElementById('menu-search-clear');
  const menuEmptyState = document.getElementById('menu-empty');
  const menuEmptyReset = document.getElementById('menu-empty-reset');

  let activeCategory = 'all';
  let activeSearchQuery = '';

  function applyMenuFilters() {
    let visibleCount = 0;

    menuItems.forEach((item) => {
      const itemCat = item.getAttribute('data-category');
      const itemName = (item.getAttribute('data-name') || '').toLowerCase();
      const itemDesc = (item.querySelector('p')?.textContent || '').toLowerCase();

      const matchesCat = activeCategory === 'all' || itemCat === activeCategory;
      const matchesSearch = !activeSearchQuery || itemName.includes(activeSearchQuery) || itemDesc.includes(activeSearchQuery);

      if (matchesCat && matchesSearch) {
        item.classList.remove('hidden');
        item.style.setProperty('--i', `${visibleCount * 30}ms`);
        item.classList.remove('menu-item-enter');
        void item.offsetWidth; // Trigger reflow for staggered animation
        item.classList.add('menu-item-enter');
        visibleCount++;
      } else {
        item.classList.add('hidden');
      }
    });

    if (menuEmptyState) {
      menuEmptyState.classList.toggle('hidden', visibleCount > 0);
    }
  }

  function setCategory(category) {
    activeCategory = category;

    menuTabs.forEach(tab => {
      const isSelected = tab.getAttribute('data-category') === category;
      tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');

      if (isSelected) {
        tab.className = 'menu-tab inline-flex items-center rounded-full bg-primary px-5 py-2.5 font-label-md text-label-md font-bold uppercase tracking-wider text-on-primary shadow-sm transition-all duration-200';
      } else {
        tab.className = 'menu-tab inline-flex items-center rounded-full bg-surface border border-outline-variant/40 px-5 py-2.5 font-label-md text-label-md font-semibold uppercase tracking-wider text-on-surface-variant hover:border-primary hover:text-primary transition-all duration-200';
      }
    });

    applyMenuFilters();
  }

  menuTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cat = tab.getAttribute('data-category');
      if (cat) setCategory(cat);
    });
  });

  // Keyboard navigation for WAI-ARIA tablist
  const tabRail = document.getElementById('menu-tabs');
  if (tabRail) {
    tabRail.addEventListener('keydown', (e) => {
      if (['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(e.key)) {
        const tabsArr = Array.from(menuTabs);
        const currentIndex = tabsArr.indexOf(document.activeElement);
        if (currentIndex === -1) return;

        e.preventDefault();
        let nextIndex = currentIndex;
        if (e.key === 'ArrowRight') nextIndex = (currentIndex + 1) % tabsArr.length;
        else if (e.key === 'ArrowLeft') nextIndex = (currentIndex - 1 + tabsArr.length) % tabsArr.length;
        else if (e.key === 'Home') nextIndex = 0;
        else if (e.key === 'End') nextIndex = tabsArr.length - 1;

        tabsArr[nextIndex].focus();
        tabsArr[nextIndex].click();
      }
    });
  }

  // Live search handler
  if (menuSearchInput) {
    menuSearchInput.addEventListener('input', (e) => {
      activeSearchQuery = e.target.value.trim().toLowerCase();
      if (menuSearchClear) {
        menuSearchClear.classList.toggle('hidden', activeSearchQuery.length === 0);
        menuSearchClear.classList.toggle('flex', activeSearchQuery.length > 0);
      }
      applyMenuFilters();
    });
  }

  if (menuSearchClear) {
    menuSearchClear.addEventListener('click', () => {
      if (menuSearchInput) {
        menuSearchInput.value = '';
        activeSearchQuery = '';
        menuSearchClear.classList.add('hidden');
        menuSearchClear.classList.remove('flex');
        menuSearchInput.focus();
        applyMenuFilters();
      }
    });
  }

  if (menuEmptyReset) {
    menuEmptyReset.addEventListener('click', () => {
      if (menuSearchInput) {
        menuSearchInput.value = '';
        activeSearchQuery = '';
      }
      if (menuSearchClear) {
        menuSearchClear.classList.add('hidden');
        menuSearchClear.classList.remove('flex');
      }
      setCategory('all');
    });
  }

  // Filter Jump links (e.g. from signature cards)
  document.querySelectorAll('[data-filter-jump]').forEach(jumpBtn => {
    jumpBtn.addEventListener('click', (e) => {
      const targetCategory = jumpBtn.getAttribute('data-filter-jump');
      if (targetCategory) {
        setCategory(targetCategory);
      }
    });
  });

  /* ==========================================================================
     6. Privacy Policy Modal Dialog
     ========================================================================== */
  const privacyModal = document.getElementById('privacy-modal');
  const modalOpenTriggers = document.querySelectorAll('[data-modal-open="privacy-modal"]');
  const modalCloseTriggers = privacyModal ? privacyModal.querySelectorAll('[data-modal-close]') : [];
  let modalTriggerSource = null;

  function openPrivacyModal() {
    if (!privacyModal) return;
    modalTriggerSource = document.activeElement;
    privacyModal.classList.remove('pointer-events-none', 'opacity-0');
    privacyModal.classList.add('is-open');
    document.body.classList.add('modal-open');

    const closeBtn = privacyModal.querySelector('button[data-modal-close]');
    if (closeBtn) closeBtn.focus();
  }

  function closePrivacyModal() {
    if (!privacyModal) return;
    privacyModal.classList.add('pointer-events-none', 'opacity-0');
    privacyModal.classList.remove('is-open');
    document.body.classList.remove('modal-open');

    if (modalTriggerSource && typeof modalTriggerSource.focus === 'function') {
      modalTriggerSource.focus();
    }
  }

  modalOpenTriggers.forEach(btn => btn.addEventListener('click', openPrivacyModal));
  modalCloseTriggers.forEach(btn => btn.addEventListener('click', closePrivacyModal));

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && privacyModal && privacyModal.classList.contains('is-open')) {
      closePrivacyModal();
    }
  });

  /* ==========================================================================
     7. Dynamic Year in Footer
     ========================================================================== */
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     8. Service Worker Registration
     ========================================================================== */
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((registration) => {
        // Successfully registered
      }).catch((err) => {
        console.warn('Service Worker registration skipped:', err);
      });
    });
  }

})();
