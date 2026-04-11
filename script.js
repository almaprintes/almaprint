/* ================================================================
   ALMAPRINT — script.js
   JS mínimo, legible y sin dependencias externas.
================================================================ */

(function () {
  'use strict';

  /* ---------------------------------------------------------------
     UTILS
  --------------------------------------------------------------- */
  function qs(sel, root) {
    return (root || document).querySelector(sel);
  }

  function qsa(sel, root) {
    return Array.from((root || document).querySelectorAll(sel));
  }

  /* ---------------------------------------------------------------
     AÑO EN FOOTER
  --------------------------------------------------------------- */
  var yearEl = qs('#footer-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* ---------------------------------------------------------------
     HEADER: fondo al hacer scroll
  --------------------------------------------------------------- */
  var header = qs('#site-header');

  function tickHeader() {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 32);
  }

  window.addEventListener('scroll', tickHeader, { passive: true });
  tickHeader();

  /* ---------------------------------------------------------------
     MENÚ MÓVIL
  --------------------------------------------------------------- */
  var toggle = qs('#nav-toggle');
  var mobileMenu = qs('#mobile-menu');
  var menuOpen = false;

  function openMenu() {
    if (!toggle || !mobileMenu) return;

    menuOpen = true;
    toggle.classList.add('is-open');
    toggle.setAttribute('aria-expanded', 'true');
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    if (!toggle || !mobileMenu) return;

    menuOpen = false;
    toggle.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', function (e) {
      e.stopPropagation();
      if (menuOpen) {
        closeMenu();
      } else {
        openMenu();
      }
    });

    qsa('a', mobileMenu).forEach(function (link) {
      link.addEventListener('click', function () {
        closeMenu();
      });
    });

    document.addEventListener('click', function (e) {
      if (!menuOpen) return;

      var clickedInsideMenu = mobileMenu.contains(e.target);
      var clickedToggle = toggle.contains(e.target);

      if (!clickedInsideMenu && !clickedToggle) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------------
     SCROLL SUAVE: anclas internas
     Resta la altura del header para no quedar tapado.
  --------------------------------------------------------------- */
  qsa('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (!href || href === '#') return;

      var target = qs(href);
      if (!target) return;

      e.preventDefault();

      var headerH = header ? header.offsetHeight : 0;
      var top = target.getBoundingClientRect().top + window.scrollY - headerH;

      window.scrollTo({
        top: top,
        behavior: 'smooth'
      });
    });
  });

  /* ---------------------------------------------------------------
     REVEAL AL SCROLL
  --------------------------------------------------------------- */
  var revealEls = qsa('[data-reveal]');

  if (revealEls.length > 0) {
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              io.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -32px 0px'
        }
      );

      revealEls.forEach(function (el) {
        io.observe(el);
      });
    } else {
      revealEls.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  /* ---------------------------------------------------------------
     ACTIVE NAV LINK
  --------------------------------------------------------------- */
  var navLinks = qsa('.main-nav a[href^="#"]');

  var sectionMap = navLinks
    .map(function (link) {
      var id = link.getAttribute('href').slice(1);
      var section = qs('#' + id);
      return { link: link, section: section };
    })
    .filter(function (item) {
      return item.section !== null;
    });

  function updateNav() {
    if (!sectionMap.length) return;

    var scrollPos = window.scrollY + (header ? header.offsetHeight : 0) + 80;
    var current = null;

    sectionMap.forEach(function (item) {
      if (item.section.offsetTop <= scrollPos) {
        current = item;
      }
    });

    navLinks.forEach(function (link) {
      link.removeAttribute('aria-current');
    });

    if (current) {
      current.link.setAttribute('aria-current', 'page');
    }
  }

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();

  /* ---------------------------------------------------------------
     SCROLL CUE: ocultar al bajar
  --------------------------------------------------------------- */
  var scrollCue = qs('.scroll-cue');

  if (scrollCue) {
    function hideScrollCue() {
      if (window.scrollY > 60) {
        scrollCue.style.opacity = '0';
        scrollCue.style.pointerEvents = 'none';
        window.removeEventListener('scroll', hideScrollCue);
      }
    }

    window.addEventListener('scroll', hideScrollCue, { passive: true });
  }

  /* ---------------------------------------------------------------
     FAQ: cerrar otras cuando se abre una
  --------------------------------------------------------------- */
  var faqItems = qsa('.faq-item');

  faqItems.forEach(function (item) {
    item.addEventListener('toggle', function () {
      if (!item.open) return;

      faqItems.forEach(function (other) {
        if (other !== item && other.open) {
          other.open = false;
        }
      });
    });
  });

  /* ---------------------------------------------------------------
     HOVER PARALLAX SUTIL EN CTA CHANNELS
     Solo en puntero fino, no táctil.
  --------------------------------------------------------------- */
  if (window.matchMedia('(pointer: fine)').matches) {
    qsa('.channel-btn').forEach(function (card) {
      card.addEventListener('mousemove', function (e) {
        var rect = card.getBoundingClientRect();
        var x = (e.clientX - rect.left) / rect.width - 0.5;
        var y = (e.clientY - rect.top) / rect.height - 0.5;

        card.style.transform =
          'translateX(4px) perspective(600px) rotateX(' +
          (-y * 4).toFixed(2) +
          'deg) rotateY(' +
          (x * 4).toFixed(2) +
          'deg)';
      });

      card.addEventListener('mouseleave', function () {
        card.style.transform = '';
      });
    });
  }
})();
