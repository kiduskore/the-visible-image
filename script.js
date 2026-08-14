'use strict';

/* ════════════════════════════════════════════
   3-WAY TRANSLATION & READING MODE HANDLER
════════════════════════════════════════════ */
const pageTitles = {
  en: "The Word — The Visible Image of the Invisible God",
  simple: "Jesus is God's Visible Image — Made Simple",
  am: "ቃሉ — የማይታየው እግዚአብሔር የሚታይ አምሳያ"
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
  if (!['en', 'simple', 'am'].includes(lang)) lang = 'en';
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
  
  if (pageTitles[lang]) {
    document.title = pageTitles[lang];
  }

  document.querySelectorAll('[data-en],[data-simple],[data-am]').forEach(el => {
    const t = el.getAttribute(`data-${lang}`);
    if (t !== null && el.children.length === 0) el.textContent = t;
  });

  ['en', 'simple', 'am'].forEach(l => {
    const btn = document.getElementById(`lb-${l}`);
    if (btn) {
      btn.classList.toggle('active', l === lang);
      btn.setAttribute('aria-pressed', l === lang);
    }
  });
}

/* ════════════════════════════════════════════
   LIGHT / DARK THEME HANDLER
════════════════════════════════════════════ */
let currentTheme = localStorage.getItem('theme') || 'dark';

function setTheme(theme) {
  if (!['dark', 'light'].includes(theme)) theme = 'dark';
  currentTheme = theme;
  localStorage.setItem('theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    toggleBtn.setAttribute('aria-label', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    toggleBtn.setAttribute('title', theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  }
}

function toggleTheme() {
  setTheme(currentTheme === 'dark' ? 'light' : 'dark');
}

document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
  setTheme(currentTheme);
});

/* ════════════════════════════════════════════
   HIGH-PERFORMANCE GLASS CURSOR
════════════════════════════════════════════ */
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');

if (!isTouchDevice && cursorDot && cursorRing) {
  let mx = -200, my = -200;
  let rx = -200, ry = -200;
  let cursorActive = false;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursorDot.style.transform = `translate3d(${mx}px, ${my}px, 0)`;
    if (!cursorActive) {
      cursorActive = true;
      requestAnimationFrame(animateRing);
    }
  }, { passive: true });

  function animateRing() {
    rx += (mx - rx) * 0.22;
    ry += (my - ry) * 0.22;
    cursorRing.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    if (Math.abs(mx - rx) > 0.1 || Math.abs(my - ry) > 0.1) {
      requestAnimationFrame(animateRing);
    } else {
      cursorActive = false;
    }
  }

  // Hover states delegation
  const hoverSelectors = 'a, button, .glass-btn, .glass-card, .glass-pill, .glass-link, .theme-toggle-pill, .mob-theme-btn, .pillar-card, .verse-explorer-card, .vf-btn, .vec-col, .ks-card, .prophecy-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(hoverSelectors)) {
      cursorRing.classList.add('hover');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest(hoverSelectors)) {
      cursorRing.classList.remove('hover');
    }
  }, { passive: true });
}

/* ════════════════════════════════════════════
   LIGHTWEIGHT STAR CANVAS BACKGROUND
════════════════════════════════════════════ */
const starCanvas = document.getElementById('star-canvas');
const sCtx = starCanvas?.getContext('2d');

if (starCanvas && sCtx && !isTouchDevice) {
  let starW = (starCanvas.width = window.innerWidth);
  let starH = (starCanvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    starW = starCanvas.width = window.innerWidth;
    starH = starCanvas.height = window.innerHeight;
  }, { passive: true });

  const starCount = 85;
  const stars = Array.from({ length: starCount }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() < 0.15 ? 1.2 : 0.6,
    phase: Math.random() * Math.PI * 2,
    speed: 0.005 + Math.random() * 0.01,
    base: 0.2 + Math.random() * 0.6,
  }));

  let isPageVisible = true;
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    if (isPageVisible) requestAnimationFrame(drawStars);
  });

  function drawStars() {
    if (!isPageVisible) return;
    sCtx.clearRect(0, 0, starW, starH);
    for (let i = 0; i < starCount; i++) {
      const s = stars[i];
      s.phase += s.speed;
      const a = s.base * (0.5 + 0.5 * Math.sin(s.phase));
      const px = s.x * starW;
      const py = s.y * starH;
      sCtx.beginPath();
      sCtx.arc(px, py, s.r, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255,255,255,${a})`;
      sCtx.fill();
    }
    requestAnimationFrame(drawStars);
  }
  requestAnimationFrame(drawStars);
}

/* ════════════════════════════════════════════
   INTERACTIVE ON-DEMAND WATER RIPPLE CANVAS
════════════════════════════════════════════ */
const eternitySection = document.getElementById('proverbs8-full');
const rippleCanvas = document.getElementById('ripple-canvas');
const rCtx = rippleCanvas?.getContext('2d');
const ripples = [];
let rippleAnimating = false;

if (rippleCanvas && rCtx && eternitySection) {
  function resizeRipple() {
    rippleCanvas.width = eternitySection.offsetWidth;
    rippleCanvas.height = eternitySection.offsetHeight;
  }
  resizeRipple();
  window.addEventListener('resize', resizeRipple, { passive: true });

  function addRipple(x, y) {
    ripples.push({ x, y, r: 0, alpha: 0.6, maxR: 160, speed: 3 });
    if (!rippleAnimating) {
      rippleAnimating = true;
      requestAnimationFrame(drawRipples);
    }
  }

  eternitySection.addEventListener('pointerdown', (e) => {
    const rect = eternitySection.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top);
  }, { passive: true });

  function drawRipples() {
    rCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;
      rp.alpha -= 0.012;
      if (rp.alpha <= 0 || rp.r > rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }
      rCtx.beginPath();
      rCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      rCtx.strokeStyle = `rgba(232,190,101,${rp.alpha * 0.5})`;
      rCtx.lineWidth = 1.5;
      rCtx.stroke();
    }
    if (ripples.length > 0) {
      requestAnimationFrame(drawRipples);
    } else {
      rippleAnimating = false;
    }
  }
}

/* ════════════════════════════════════════════
   SCENE TRACKING (INTERSECTION OBSERVER)
════════════════════════════════════════════ */
const header = document.getElementById('site-header');
const scenes = document.querySelectorAll('.scene');
const navLinks = document.querySelectorAll('.main-nav a');

const sceneObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.25) {
      const scene = entry.target.id;
      document.body.setAttribute('data-scene', scene);
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${scene}`);
      });
    }
  });
}, { threshold: 0.25 });

scenes.forEach(s => sceneObs.observe(s));

/* ════════════════════════════════════════════
   THROTTLED PARALLAX BACKGROUNDS
════════════════════════════════════════════ */
let parallaxTicking = false;
const parallaxBgs = document.querySelectorAll('.parallax-bg');

function updateParallax() {
  if (isTouchDevice) return;
  const winH = window.innerHeight;
  parallaxBgs.forEach(bg => {
    const section = bg.closest('.scene');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > winH) return;
    const speed = parseFloat(bg.dataset.speed || 0.15);
    const offset = rect.top * speed;
    bg.style.transform = `translate3d(0, ${offset}px, 0)`;
  });
  parallaxTicking = false;
}

window.addEventListener('scroll', () => {
  if (!parallaxTicking) {
    parallaxTicking = true;
    requestAnimationFrame(updateParallax);
  }
}, { passive: true });

/* ════════════════════════════════════════════
   SCROLL REVEAL (INTERSECTION OBSERVER)
════════════════════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      revObs.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ════════════════════════════════════════════
   HERO TITLE STAGGER
════════════════════════════════════════════ */
document.querySelectorAll('.ht-line').forEach((line, i) => {
  line.style.cssText = `
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.8s cubic-bezier(0.2, 1, 0.3, 1) ${0.15 + i * 0.2}s,
                transform 0.8s cubic-bezier(0.2, 1, 0.3, 1) ${0.15 + i * 0.2}s;
  `;
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'none';
  }, 100);
});

/* ════════════════════════════════════════════
   MOBILE NAV TOGGLE
════════════════════════════════════════════ */
const ham = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');

ham?.addEventListener('click', () => {
  const open = mobNav?.classList.toggle('open');
  ham.classList.toggle('open', open);
});

mobNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobNav?.classList.remove('open');
    ham?.classList.remove('open');
  });
});

/* ════════════════════════════════════════════
   SMOOTH SCROLLING FOR ALL ANCHORS
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const offset = 74;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
