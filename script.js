'use strict';

/* ═══════════════════════════════════════
   BILINGUAL CONTENT
═══════════════════════════════════════ */
const translations = {
  en: {
    pageTitle: "The Word Was God — A Heavenly Vision",
    metaDesc: "A bilingual journey into the eternal truth that God made Himself visible through the Son, before all creation.",
  },
  am: {
    pageTitle: "ቃሉ እግዚአብሔር ነበረ — የሰማያዊ ራዕይ",
    metaDesc: "እግዚአብሔር ፍጥረት ሁሉ ከመፈጠሩ በፊት ራሱን በልጁ ግልጽ ያደረገበትን ዘላለማዊ እውነት የሚዳስስ ጉዞ።",
  }
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);

  const html = document.documentElement;
  html.setAttribute('data-lang', lang);
  html.setAttribute('lang', lang === 'am' ? 'am' : 'en');

  // Update all data-en / data-am elements
  document.querySelectorAll('[data-en],[data-am]').forEach(el => {
    const text = el.getAttribute(`data-${lang}`);
    if (text !== null) {
      // If the element contains only text (no children), update text
      if (el.children.length === 0) {
        el.textContent = text;
      }
    }
  });

  // Update page title
  document.title = translations[lang].pageTitle;

  // Update active button states
  document.getElementById('btn-en').classList.toggle('active', lang === 'en');
  document.getElementById('btn-am').classList.toggle('active', lang === 'am');
  document.getElementById('btn-en').setAttribute('aria-pressed', lang === 'en');
  document.getElementById('btn-am').setAttribute('aria-pressed', lang === 'am');

  // Update html lang attribute on title element
  const titleEl = document.querySelector('title');
  if (titleEl) titleEl.textContent = translations[lang].pageTitle;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
  setLang(currentLang);
});

/* ═══════════════════════════════════════
   HERO IMAGE ZOOM
═══════════════════════════════════════ */
const heroBgImg = document.getElementById('hero-bg-img');
if (heroBgImg) {
  if (heroBgImg.complete) heroBgImg.classList.add('loaded');
  else heroBgImg.addEventListener('load', () => heroBgImg.classList.add('loaded'));
}

/* ═══════════════════════════════════════
   PARTICLE CANVAS — Soft golden floating particles
═══════════════════════════════════════ */
(function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  function resize() {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Particle types: golden dust + soft lavender orbs
  const particles = Array.from({ length: 80 }, () => createParticle());

  function createParticle() {
    const isGold = Math.random() > 0.4;
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: isGold ? 1 + Math.random() * 2 : 2 + Math.random() * 4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: -0.15 - Math.random() * 0.3,
      alpha: 0.1 + Math.random() * 0.5,
      phase: Math.random() * Math.PI * 2,
      speed: 0.005 + Math.random() * 0.01,
      isGold,
      drift: (Math.random() - 0.5) * 0.008,
    };
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p, i) => {
      p.phase += p.speed;
      p.x += p.vx + Math.sin(p.phase) * p.drift;
      p.y += p.vy;

      // Reset when off screen
      if (p.y < -10) {
        particles[i] = { ...createParticle(), y: canvas.height + 10 };
        return;
      }
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;

      const alpha = p.alpha * (0.5 + 0.5 * Math.sin(p.phase));

      if (p.isGold) {
        // Golden dust particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(210,165,60,${alpha})`;
        ctx.fill();
      } else {
        // Soft glow orb
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r);
        grad.addColorStop(0, `rgba(220,210,255,${alpha * 0.8})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }
  draw();
})();

/* ═══════════════════════════════════════
   HEADER — scroll behaviour
═══════════════════════════════════════ */
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  siteHeader.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

/* ═══════════════════════════════════════
   MOBILE MENU
═══════════════════════════════════════ */
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileNav = document.getElementById('mobile-nav');

mobileBtn?.addEventListener('click', () => {
  const open = mobileNav.classList.toggle('open');
  mobileBtn.classList.toggle('open', open);
  mobileBtn.setAttribute('aria-expanded', open);
});

// Close on link click
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    mobileNav.classList.remove('open');
    mobileBtn.classList.remove('open');
    mobileBtn.setAttribute('aria-expanded', 'false');
  });
});

/* ═══════════════════════════════════════
   SMOOTH SCROLL
═══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 70;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ═══════════════════════════════════════
   SCROLL REVEAL — IntersectionObserver
═══════════════════════════════════════ */
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* ═══════════════════════════════════════
   HERO TITLE STAGGER
═══════════════════════════════════════ */
document.querySelectorAll('.hero-line').forEach((line, i) => {
  line.style.opacity = '0';
  line.style.transform = 'translateY(40px)';
  line.style.transition = `opacity .9s ease ${0.2 + i * 0.2}s, transform .9s cubic-bezier(.22,1,.36,1) ${0.2 + i * 0.2}s`;
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'none';
  }, 100);
});

/* ═══════════════════════════════════════
   HERO PARALLAX
═══════════════════════════════════════ */
const heroBg = document.querySelector('.hero-bg');
window.addEventListener('scroll', () => {
  if (!heroBg) return;
  const y = window.scrollY;
  if (y < window.innerHeight) {
    heroBg.style.transform = `translateY(${y * 0.3}px)`;
  }
}, { passive: true });
