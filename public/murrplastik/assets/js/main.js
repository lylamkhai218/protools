// Auto-strip Basic Auth credentials from URL to prevent browser from blocking fetch/XHR requests
if (window.location.href.includes('@')) {
  const cleanUrl = window.location.href.replace(/\/\/[^/]+@/, '//');
  window.location.replace(cleanUrl);
}

/**
 * main.js — Navbar, hamburger menu, scroll animations
 * murrplastikvn.com
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ── Navbar scroll effect ── */
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ── Hamburger / Mobile menu ── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    if (a.id === 'promoPopupLink') return; // Handled separately by popup logic
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = document.getElementById('navbar').offsetHeight + 8;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  /* ── Scroll reveal animations ── */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => observer.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── ScrollSpy: Highlight active nav link ── */
  const navLinks = document.querySelectorAll('.nav-links a');
  const sections = Array.from(navLinks).map(link => {
    const selector = link.getAttribute('href');
    if (selector.startsWith('#') && selector.length > 1) {
      return document.querySelector(selector);
    }
    return null;
  }).filter(Boolean);

  // Cache section top offsets to avoid forced reflows during scroll
  let sectionPositions = [];
  const updateSectionPositions = () => {
    const offset = navbar.offsetHeight + 100;
    sectionPositions = sections.map(section => {
      if (!section) return null;
      return {
        id: '#' + section.getAttribute('id'),
        top: section.offsetTop - offset
      };
    }).filter(Boolean);
  };

  updateSectionPositions();
  window.addEventListener('resize', updateSectionPositions);
  window.addEventListener('load', updateSectionPositions);

  const scrollSpy = () => {
    let current = '';
    const scrollY = window.scrollY;
    for (let i = 0; i < sectionPositions.length; i++) {
      if (scrollY >= sectionPositions[i].top) {
        current = sectionPositions[i].id;
      }
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === current);
    });
  };
  window.addEventListener('scroll', scrollSpy, { passive: true });
  scrollSpy(); // Initial check

  /* ── Handle hash on load (from sub-pages) ── */
  if (window.location.hash) {
    const targetId = window.location.hash;
    const performScroll = () => {
      const target = document.querySelector(targetId);
      if (target) {
        const offset = navbar.offsetHeight + 30;
        window.scrollTo({
          top: target.offsetTop - offset,
          behavior: 'smooth'
        });
      }
    };

    // Attempt 1: DOMContentLoaded
    performScroll();

    // Attempt 2: window.load (all resources ready)
    window.addEventListener('load', () => {
      setTimeout(performScroll, 100);
      setTimeout(performScroll, 500); // Attempt 3: Just in case of delayed rendering
    });
  }

  /* ── Stats counter animation ── */
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        const target = parseInt(el.dataset.count);
        const suffix = el.dataset.suffix || '';
        let count = 0;
        const step = Math.ceil(target / 50);
        const timer = setInterval(() => {
          count = Math.min(count + step, target);
          el.innerHTML = count + '<em>' + suffix + '</em>';
          if (count >= target) clearInterval(timer);
        }, 28);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cObs.observe(el));
  }

  /* ── Hide Preloader ── */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => {
        preloader.classList.add('fade-out');
        setTimeout(() => preloader.remove(), 600);
      }, 500);
    });
  }

  /* ── Promo Banner Popup Logic ── */
  const promoPopup = document.getElementById('promoPopup');
  const promoClose = document.getElementById('promoPopupClose');
  const promoLink = document.getElementById('promoPopupLink');

  if (promoPopup && promoClose && promoLink) {
    let popupTriggered = false;
    let timeDelayTimer = null;

    // Cookie Helper Functions
    const setCookie = (name, value, days) => {
      let expires = "";
      if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
      }
      document.cookie = name + "=" + (value || "") + expires + "; path=/";
    };

    const getCookie = (name) => {
      const nameEQ = name + "=";
      const ca = document.cookie.split(';');
      for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
      }
      return null;
    };

    const showPopup = () => {
      if (popupTriggered) return;
      if (getCookie('promo_popup_dismissed') === 'true') return;

      popupTriggered = true;
      
      // Clean up triggers immediately to prevent multiple activations
      window.removeEventListener('scroll', handleScrollTrigger);
      document.removeEventListener('mouseleave', handleExitIntent);
      clearTimeout(timeDelayTimer);

      promoPopup.classList.add('open');
    };

    const dismissPopup = () => {
      promoPopup.classList.remove('open');
      setCookie('promo_popup_dismissed', 'true', 1); // 1 Day Capping
    };

    // Cache docHeight to avoid forced reflows on scroll
    let docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const updateDocHeight = () => {
      docHeight = document.documentElement.scrollHeight - window.innerHeight;
    };
    window.addEventListener('resize', updateDocHeight);
    window.addEventListener('load', updateDocHeight);

    // Trigger 1: Scroll down 25% of the page
    const handleScrollTrigger = () => {
      if (docHeight <= 0) return;
      const scrollPercent = (window.scrollY / docHeight) * 100;
      if (scrollPercent >= 25) {
        showPopup();
      }
    };

    // Trigger 2: Time-delay (10 seconds)
    timeDelayTimer = setTimeout(showPopup, 10000);

    // Trigger 3: Exit Intent (Cursor goes near top of screen, with 1.5s cooldown and mouseenter check)
    const loadTime = Date.now();
    const handleExitIntent = (e) => {
      if (Date.now() - loadTime < 1500) return; // Cooldown of 1.5 seconds on load
      if (e.clientY < 50) {
        showPopup();
      }
    };

    // Attach Listeners
    window.addEventListener('scroll', handleScrollTrigger, { passive: true });
    
    // Only bind mouseleave after the cursor enters the viewport at least once
    const activateExitIntent = () => {
      document.addEventListener('mouseleave', handleExitIntent);
      document.removeEventListener('mouseenter', activateExitIntent);
    };
    document.addEventListener('mouseenter', activateExitIntent);

    // Close Button & Overlay Background Click
    promoClose.addEventListener('click', dismissPopup);
    promoPopup.addEventListener('click', (e) => {
      if (e.target === promoPopup) {
        dismissPopup();
      }
    });

    // Image Link Click Action
    promoLink.addEventListener('click', (e) => {
      e.preventDefault();
      promoPopup.classList.remove('open');
      setCookie('promo_popup_dismissed', 'true', 1);
      // Scroll to #contact after popup close animation completes
      setTimeout(() => {
        const contactEl = document.getElementById('contact');
        if (contactEl) {
          const offset = document.getElementById('navbar').offsetHeight + 8;
          window.scrollTo({ top: contactEl.offsetTop - offset, behavior: 'smooth' });
        }
      }, 350);
    });
  }

  /* ── Back to Top Button Logic ── */
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    let docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const updateDocHeight = () => {
      docHeight = document.documentElement.scrollHeight - window.innerHeight;
    };
    window.addEventListener('resize', updateDocHeight);
    window.addEventListener('load', updateDocHeight);

    const toggleBackToTop = () => {
      if (docHeight <= 0) return;
      const scrollPercent = (window.scrollY / docHeight) * 100;
      if (scrollPercent >= 50) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  /* ── Custom Branded Cursor (Style 5: Red SVG Arrow + Ambient Red Glow - GPU Accelerated) ── */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let arrowSvg = document.querySelector('.cursor-arrow-svg');
    let glowAura = document.querySelector('.cursor-glow-aura');

    if (!arrowSvg) {
      arrowSvg = document.createElement('div');
      arrowSvg.className = 'cursor-arrow-svg';
      arrowSvg.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M3 3L10.07 19.97L13.58 12.58L20.97 9.07L3 3Z" fill="#C8102E" stroke="#FFFFFF" stroke-width="1.5" stroke-linejoin="round"/>
      </svg>`;
      document.body.appendChild(arrowSvg);
    }
    if (!glowAura) {
      glowAura = document.createElement('div');
      glowAura.className = 'cursor-glow-aura';
      document.body.appendChild(glowAura);
    }

    let mouseX = -100, mouseY = -100;
    let auraX = -100, auraY = -100;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      arrowSvg.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    }, { passive: true });

    const animateAura = () => {
      auraX += (mouseX - auraX) * 0.2;
      auraY += (mouseY - auraY) * 0.2;
      glowAura.style.transform = `translate3d(${auraX - 60}px, ${auraY - 60}px, 0)`;
      requestAnimationFrame(animateAura);
    };
    animateAura();

    // Hover interactive listeners
    const interactiveSelectors = 'a, button, input, textarea, select, .gallery-item, .model-tab-btn, .btn-primary, .btn-control, .card, .product-card, .float-btn, .back-to-top';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('#threejs-container, .viewer-mock, .model-canvas-container')) {
        document.body.classList.add('cursor-3d');
      } else if (e.target.closest(interactiveSelectors)) {
        document.body.classList.add('cursor-hover');
      }
    });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('#threejs-container, .viewer-mock, .model-canvas-container')) {
        document.body.classList.remove('cursor-3d');
      }
      if (e.target.closest(interactiveSelectors)) {
        document.body.classList.remove('cursor-hover');
      }
    });

    // Smooth fade out when mouse leaves window
    document.addEventListener('mouseleave', () => {
      arrowSvg.style.opacity = '0';
      glowAura.style.opacity = '0';
      document.body.classList.remove('cursor-hover', 'cursor-3d', 'cursor-active');
    });

    document.addEventListener('mouseenter', () => {
      arrowSvg.style.opacity = '1';
      glowAura.style.opacity = '1';
    });

    document.addEventListener('mousedown', () => {
      document.body.classList.add('cursor-active');
    });
    document.addEventListener('mouseup', () => {
      document.body.classList.remove('cursor-active');
    });
  }
});


