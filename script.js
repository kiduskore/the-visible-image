'use strict';

/* ─────────────────────────────
   1. HERO IMAGE LOAD + ZOOM
───────────────────────────── */
const heroImg = document.getElementById('hero-img');
if (heroImg) {
  if (heroImg.complete) {
    heroImg.classList.add('loaded');
  } else {
    heroImg.addEventListener('load', () => heroImg.classList.add('loaded'));
  }
}

/* ─────────────────────────────
   2. HERO TITLE LINE STAGGER
───────────────────────────── */
const heroLines = document.querySelectorAll('.hero-title-line');
heroLines.forEach((line, i) => {
  setTimeout(() => line.classList.add('in'), 300 + i * 200);
});

/* ─────────────────────────────
   3. SCROLL CUE FADE IN
───────────────────────────── */
const scrollCue = document.querySelector('.hero-scroll-cue');
if (scrollCue) {
  setTimeout(() => scrollCue.classList.add('show'), 1600);
}

/* ─────────────────────────────
   4. NAV OPAQUE ON SCROLL
───────────────────────────── */
const nav = document.getElementById('site-nav');
function handleNavScroll() {
  if (nav) nav.classList.toggle('opaque', window.scrollY > 80);
}
window.addEventListener('scroll', handleNavScroll, { passive: true });

/* ─────────────────────────────
   5. INTERSECTION OBSERVER — REVEAL
───────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      observer.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => observer.observe(el));

/* ─────────────────────────────
   6. SMOOTH SCROLL NAV LINKS
───────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY - 62;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ─────────────────────────────
   7. HERO PARALLAX (subtle)
───────────────────────────── */
const heroBg = document.querySelector('.hero-image-wrap');
function onScroll() {
  if (!heroBg) return;
  const y = window.scrollY;
  heroBg.style.transform = `translateY(${y * 0.35}px)`;
}
window.addEventListener('scroll', onScroll, { passive: true });
