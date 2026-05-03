/* =========================================================
   EIDIT COSMETICS — interactivity
   ========================================================= */
(function () {
  'use strict';

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky header shadow ---------- */
  const header = document.getElementById('header');
  const onScroll = () => {
    if (header) header.classList.toggle('is-scrolled', window.scrollY > 20);
    const back = document.getElementById('backTop');
    if (back) back.classList.toggle('is-visible', window.scrollY > 600);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const hamburger = document.getElementById('hamburger');
  const nav = document.getElementById('primary-nav');
  if (hamburger && nav) {
    const toggle = (open) => {
      const isOpen = open ?? !nav.classList.contains('is-open');
      nav.classList.toggle('is-open', isOpen);
      hamburger.classList.toggle('is-open', isOpen);
      hamburger.setAttribute('aria-expanded', String(isOpen));
      hamburger.setAttribute('aria-label', isOpen ? 'סגור תפריט' : 'פתח תפריט');
      document.body.style.overflow = isOpen ? 'hidden' : '';
    };
    hamburger.addEventListener('click', () => toggle());
    nav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => toggle(false)));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) toggle(false);
    });
  }

  /* ---------- Reveal-on-scroll ---------- */
  const revealEls = document.querySelectorAll('.reveal-up, .reveal-fade, .reveal-line, .eyebrow--reveal, .hero');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('in-view');
          // Re-observe parents with fade children
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('in-view'));
  }

  /* ---------- Stat count-up ---------- */
  const stats = document.querySelectorAll('.stat__num[data-count]');
  if ('IntersectionObserver' in window && !reduced) {
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count.replace(/[^0-9]/g, ''), 10) || 0;
        const dur = 1400;
        const start = performance.now();
        const fmt = (n) => n.toLocaleString('en-US');
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          el.textContent = fmt(Math.round(target * eased));
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        io2.unobserve(el);
      });
    }, { threshold: 0.5 });
    stats.forEach((s) => io2.observe(s));
  }

  /* ---------- 3D card tilt ---------- */
  const card = document.getElementById('hero-card');
  if (card && !reduced && matchMedia('(pointer: fine)').matches) {
    const inner = card.querySelector('.card3d__inner');
    let rect;
    const update = () => { rect = card.getBoundingClientRect(); };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, { passive: true });

    let frame;
    const onMove = (e) => {
      const x = (e.clientX - rect.left) / rect.width - .5;
      const y = (e.clientY - rect.top) / rect.height - .5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 14}deg)`;
      });
    };
    const onLeave = () => {
      cancelAnimationFrame(frame);
      card.style.transform = '';
    };
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', onLeave);

    // gentle idle float
    let t0 = performance.now();
    const idle = (now) => {
      if (!card.matches(':hover')) {
        const t = (now - t0) / 1000;
        const ry = Math.sin(t * 0.6) * 4;
        const rx = Math.cos(t * 0.5) * 3;
        card.style.transform = `rotateY(${ry}deg) rotateX(${rx}deg)`;
      }
      requestAnimationFrame(idle);
    };
    requestAnimationFrame(idle);
  }

  /* ---------- Parallax orbs ---------- */
  if (!reduced && matchMedia('(pointer: fine)').matches) {
    const orbs = document.querySelectorAll('.orb');
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        orbs.forEach((o, i) => {
          const speed = (i + 1) * 0.05;
          o.style.transform = `translateY(${y * speed}px)`;
        });
        ticking = false;
      });
    }, { passive: true });
  }

  /* ---------- Smooth anchor scroll (account for sticky header) ---------- */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const headerH = header ? header.offsetHeight : 0;
      const top = target.getBoundingClientRect().top + window.scrollY - headerH - 8;
      window.scrollTo({ top, behavior: reduced ? 'auto' : 'smooth' });
    });
  });

  /* ---------- Back to top ---------- */
  const back = document.getElementById('backTop');
  if (back) {
    back.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    });
  }

  /* ---------- Contact form (no backend — graceful UX) ---------- */
  const form = document.getElementById('contactForm');
  const status = document.getElementById('form-status');
  if (form && status) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const phone = (data.get('phone') || '').toString().trim();
      if (!name) { status.textContent = 'אנא מלאי שם.'; return; }
      if (!phone || phone.replace(/\D/g, '').length < 7) { status.textContent = 'אנא מלאי מספר טלפון תקין.'; return; }

      const service = (data.get('service') || '').toString();
      const message = (data.get('message') || '').toString().trim();
      const text = `שלום! שמי ${name}.\nשירות מבוקש: ${service}\nטלפון: ${phone}\n${message ? 'הודעה: ' + message : ''}`;
      const url = `https://wa.me/972546407732?text=${encodeURIComponent(text)}`;

      status.textContent = 'תודה! נפתחת שיחת וואטסאפ עם הפרטים שמילאת.';
      window.open(url, '_blank', 'noopener');
      form.reset();
    });
  }
})();
