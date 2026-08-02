/* ==========================================================================
   main.js — core interactivity: loader, nav, typing, filters, form, etc.
   ========================================================================== */
(function () {
  'use strict';

  /* ---------------- Loading Screen ---------------- */
  const loader = document.getElementById('loader');
  const loaderProgress = document.getElementById('loaderProgress');

  function runLoader() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 18;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setTimeout(() => {
          if (loader) loader.classList.add('hidden');
          document.body.style.overflow = '';
        }, 250);
      }
      if (loaderProgress) loaderProgress.style.width = progress + '%';
    }, 140);
  }
  document.body.style.overflow = 'hidden';
  window.addEventListener('load', runLoader);
  // Fallback in case 'load' is delayed
  setTimeout(runLoader, 2500);

  /* ---------------- Footer Year ---------------- */
  const footerYear = document.getElementById('footerYear');
  if (footerYear) footerYear.textContent = new Date().getFullYear();

  /* ---------------- Navbar: scroll blur + active link + hide-on-scroll ---------------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main .section, main .certificates, .hero');
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY || window.pageYOffset;

    // navbar background
    if (navbar) navbar.classList.toggle('scrolled', scrollY > 40);

    // scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    if (scrollProgressBar) scrollProgressBar.style.width = progress + '%';

    // back to top visibility
    if (backToTop) backToTop.classList.toggle('visible', scrollY > 600);

    // active section highlighting
    let currentId = 'home';
    sections.forEach((sec) => {
      const top = sec.offsetTop - 140;
      if (scrollY >= top) currentId = sec.id;
    });
    navLinks.forEach((link) => {
      link.classList.toggle('active', link.dataset.section === currentId);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------------- Mobile Hamburger Menu ---------------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksList = document.getElementById('navLinks');

  if (hamburger && navLinksList) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksList.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinksList.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksList.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------- Smooth Scroll (with navbar offset) ---------------- */
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId.length <= 1) return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 84;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------------- Hero Typing Effect ---------------- */
  const typedTextEl = document.getElementById('typedText');
  const roles = [
    'Frontend Developer',
    'Machine Learning Enthusiast',
    'Problem Solver',
    'CSE Student',
  ];

  if (typedTextEl) {
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;

    function typeLoop() {
      const currentRole = roles[roleIndex];

      if (!deleting) {
        charIndex++;
        typedTextEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === currentRole.length) {
          deleting = true;
          setTimeout(typeLoop, 1500);
          return;
        }
      } else {
        charIndex--;
        typedTextEl.textContent = currentRole.slice(0, charIndex);
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      setTimeout(typeLoop, deleting ? 40 : 85);
    }
    typeLoop();
  }

  /* ---------------- Project Filtering ---------------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      projectCards.forEach((card) => {
        const match = filter === 'all' || card.dataset.category === filter;
        card.classList.toggle('hide', !match);
      });
    });
  });
  const carousel = document.querySelector(".carousel");

// Auto Slide (smooth continuous scrolling)
if (carousel) {
    setInterval(() => {
        if (
            carousel.scrollLeft + carousel.clientWidth >=
            carousel.scrollWidth - 5
        ) {
            carousel.scrollTo({
                left: 0,
                behavior: "smooth"
            });
        } else {
            carousel.scrollBy({
                left: 320,
                behavior: "smooth"
            });
        }
    }, 3000);
}


  /* ---------------- Contact Form Validation ---------------- */
  const contactForm = document.getElementById('contactForm');

  function setError(fieldId, message) {
    const errorEl = document.getElementById(fieldId + 'Error');
    const group = document.getElementById(fieldId).closest('.form-group');
    if (errorEl) errorEl.textContent = message;
    if (group) group.classList.toggle('invalid', Boolean(message));
  }

  function validateField(id) {
    const el = document.getElementById(id);
    const value = el.value.trim();

    if (id === 'name') {
      if (!value) { setError('name', 'Please enter your name.'); return false; }
      if (value.length < 2) { setError('name', 'Name looks too short.'); return false; }
    }
    if (id === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value) { setError('email', 'Please enter your email.'); return false; }
      if (!emailRegex.test(value)) { setError('email', 'Please enter a valid email.'); return false; }
    }
    if (id === 'subject') {
      if (!value) { setError('subject', 'Please add a subject.'); return false; }
    }
    if (id === 'message') {
      if (!value) { setError('message', 'Please write a message.'); return false; }
      if (value.length < 10) { setError('message', 'Message should be at least 10 characters.'); return false; }
    }
    setError(id, '');
    return true;
  }

  if (contactForm) {
    ['name', 'email', 'subject', 'message'].forEach((id) => {
      const el = document.getElementById(id);
      el.addEventListener('blur', () => validateField(id));
      el.addEventListener('input', () => {
        if (el.closest('.form-group').classList.contains('invalid')) validateField(id);
      });
    });

    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const fields = ['name', 'email', 'subject', 'message'];
      const results = fields.map(validateField);
      const allValid = results.every(Boolean);

      const successEl = document.getElementById('formSuccess');

      if (allValid) {
        successEl.textContent = "Thanks! Your message has been sent — I'll get back to you soon.";
        contactForm.reset();
        setTimeout(() => { successEl.textContent = ''; }, 5000);
      } else {
        successEl.textContent = '';
      }
    });
  }

  /* ---------------- Resume Download → Confetti ---------------- */
  ['downloadResumeBtn', 'downloadResumeBtn2'].forEach((id) => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.addEventListener('click', () => {
        if (window.__portfolioAnimations && window.__portfolioAnimations.launchConfetti) {
          window.__portfolioAnimations.launchConfetti();
        }
      });
    }
  });

  /* ---------------- Lazy Loading (future images) ---------------- */
  document.querySelectorAll('img[data-src]').forEach((img) => {
    if ('loading' in HTMLImageElement.prototype) {
      img.src = img.dataset.src;
      img.loading = 'lazy';
    } else if ('IntersectionObserver' in window) {
      const lazyIO = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.src = entry.target.dataset.src;
            lazyIO.unobserve(entry.target);
          }
        });
      });
      lazyIO.observe(img);
    }
  });
})();
