/* ═══════════════════════════════════════════
   script.js — Nadine Bellombre Portfolio
   Interactions : curseur, nav, scroll, bio,
                  galerie, formulaire, langue
═══════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initNav();
  initScrollAnim();
  initBio();
  initGallery();
  initForm();
  initLang();
});

/* ─── CURSOR ─────────────────────────────── */
function initCursor() {
  const dot = document.getElementById('cur-dot');
  const ring = document.getElementById('cur-ring');

  document.addEventListener('mousemove', e => {
    dot.style.left = e.clientX + 'px';
    dot.style.top = e.clientY + 'px';
    setTimeout(() => {
      ring.style.left = e.clientX + 'px';
      ring.style.top = e.clientY + 'px';
    }, 55);
  });

  document.querySelectorAll('a, button, .gm-item, .album-card, .tl-card, .info-block, .gf-btn, .tag')
    .forEach(el => {
      el.addEventListener('mouseenter', () => ring.classList.add('hov'));
      el.addEventListener('mouseleave', () => ring.classList.remove('hov'));
    });
}

/* ─── NAV ────────────────────────────────── */
function initNav() {
  const nav = document.getElementById('navbar');
  const btn = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');

  // Shrink on scroll
  window.addEventListener('scroll', () => {
    nav.classList.toggle('shrunk', window.scrollY > 60);
  }, { passive: true });

  // Hamburger toggle
  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // Close on link click (mobile)
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

/* ─── SCROLL ANIMATIONS ─────────────────── */
function initScrollAnim() {
  const items = document.querySelectorAll('[data-aos]');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('vis');
        }, i * 110);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  items.forEach(el => observer.observe(el));
}

/* ─── BIO TOGGLE ─────────────────────────── */
function initBio() {
  const btn = document.getElementById('bioBtn');
  const body = document.getElementById('bioBody');
  if (!btn || !body) return;
  
  let open = false;

  btn.addEventListener('click', () => {
    open = !open;
    body.classList.toggle('open', open);
    btn.classList.toggle('open', open);

    const lang = document.documentElement.lang || 'fr';
    const key = open ? (lang === 'en' ? 'enLess' : 'frLess') : (lang === 'en' ? 'enMore' : 'frMore');
    btn.querySelector('span').textContent = btn.dataset[key];
  });
}

/* ─── GALLERY FILTERS ───────────────────── */
function initGallery() {
  const btns = document.querySelectorAll('.gf-btn');
  const items = document.querySelectorAll('.gm-item');
  if (btns.length === 0) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const cat = btn.dataset.cat;
      items.forEach(item => {
        const show = cat === 'all' || item.dataset.cat === cat;
        item.classList.toggle('hidden', !show);
      });
    });
  });
}

/* ─── FORM ───────────────────────────────── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    clearErrors();

    let valid = true;

    const name = document.getElementById('fname');
    if (!name.value.trim()) { showErr('fnameErr', name); valid = false; }

    const email = document.getElementById('femail');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())) { showErr('femailErr', email); valid = false; }

    const msg = document.getElementById('fmsg');
    if (!msg.value.trim()) { showErr('fmsgErr', msg); valid = false; }

    if (valid) sendForm();
  });
}

function showErr(errId, field) {
  document.getElementById(errId).classList.add('show');
  field.classList.add('err');
}

function clearErrors() {
  document.querySelectorAll('.ferr').forEach(e => e.classList.remove('show'));
  document.querySelectorAll('.form-field input, .form-field textarea')
    .forEach(f => f.classList.remove('err'));
}

function sendForm() {
  const btn = document.getElementById('submitBtn');
  const ok = document.getElementById('formOk');

  btn.disabled = true;
  btn.querySelector('.submit-label').textContent = '…';

  setTimeout(() => {
    btn.style.display = 'none';
    ok.classList.add('show');
    setTimeout(() => {
      document.getElementById('contactForm').reset();
      btn.style.display = 'flex';
      btn.disabled = false;
      const lang = document.documentElement.lang || 'fr';
      btn.querySelector('.submit-label').textContent = lang === 'en' ? 'Send' : 'Envoyer';
      ok.classList.remove('show');
    }, 4000);
  }, 1400);
}

/* ─── LANGUAGE FR / EN ───────────────────── */
function initLang() {
  const btn = document.getElementById('langBtn');
  let lang = 'fr';

  btn.addEventListener('click', () => {
    lang = lang === 'fr' ? 'en' : 'fr';
    btn.textContent = lang === 'en' ? 'FR' : 'EN';
    document.documentElement.lang = lang;
    translateAll(lang);
  });
}

function translateAll(lang) {
  // Elements with data-fr / data-en
  document.querySelectorAll('[data-fr]').forEach(el => {
    const txt = lang === 'en' ? el.dataset.en : el.dataset.fr;
    if (!txt) return;

    if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
      el.placeholder = txt;
    } else if (el.tagName === 'OPTION') {
      el.textContent = txt;
    } else {
      el.textContent = txt;
    }
  });

  // Bio button special case
  const bioBtn = document.getElementById('bioBtn');
  const bioBody = document.getElementById('bioBody');
  if (bioBtn && bioBody) {
    const bioOpen = bioBody.classList.contains('open');
    const key = bioOpen ? (lang === 'en' ? 'enLess' : 'frLess') : (lang === 'en' ? 'enMore' : 'frMore');
    bioBtn.querySelector('span').textContent = bioBtn.dataset[key];
  }

  // Submit button
  const submitLabel = document.querySelector('.submit-label');
  if (submitLabel) {
    submitLabel.textContent = lang === 'en' ? 'Send' : 'Envoyer';
  }
}
