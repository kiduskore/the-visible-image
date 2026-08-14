'use strict';

/* ════════════════════════════════════════════
   BILINGUAL
════════════════════════════════════════════ */
let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
  document.querySelectorAll('[data-en],[data-am]').forEach(el => {
    const t = el.getAttribute(`data-${lang}`);
    if (t !== null && el.children.length === 0) el.textContent = t;
  });
  ['en','am'].forEach(l => {
    const btn = document.getElementById(`lb-${l}`);
    if (btn) { btn.classList.toggle('active', l === lang); btn.setAttribute('aria-pressed', l === lang); }
  });
}
document.addEventListener('DOMContentLoaded', () => setLang(currentLang));

/* ════════════════════════════════════════════
   CUSTOM CURSOR + LIGHT TRAIL (canvas)
════════════════════════════════════════════ */
const cursorDot  = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const cursorCanvas = document.getElementById('cursor-canvas');
const cCtx = cursorCanvas.getContext('2d');

let mx = -200, my = -200;
let rx = -200, ry = -200;

function resizeCursor() {
  cursorCanvas.width  = window.innerWidth;
  cursorCanvas.height = window.innerHeight;
}
resizeCursor();
window.addEventListener('resize', resizeCursor);

// Trail particles
const trail = [];
const TRAIL_MAX = 40;

document.addEventListener('mousemove', (e) => {
  mx = e.clientX; my = e.clientY;

  // Dot snaps instantly
  if (cursorDot) {
    cursorDot.style.left = mx + 'px';
    cursorDot.style.top  = my + 'px';
  }

  // Push trail particle
  trail.push({
    x: mx, y: my,
    r: 2 + Math.random() * 3,
    alpha: 0.7 + Math.random() * 0.3,
    vx: (Math.random() - 0.5) * 1.5,
    vy: (Math.random() - 0.5) * 1.5 - 0.5,
    color: Math.random() > 0.5 ? [212,168,67] : [255,240,180],
    life: 1,
    decay: 0.02 + Math.random() * 0.03,
  });
  if (trail.length > TRAIL_MAX) trail.shift();
});

// Ring lags behind (lerp)
function animateCursor() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  if (cursorRing) {
    cursorRing.style.left = rx + 'px';
    cursorRing.style.top  = ry + 'px';
  }

  // Draw trail
  cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
  for (let i = trail.length - 1; i >= 0; i--) {
    const p = trail[i];
    p.x += p.vx; p.y += p.vy;
    p.life -= p.decay;
    if (p.life <= 0) { trail.splice(i, 1); continue; }
    const [r,g,b] = p.color;
    const grad = cCtx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.r * 3);
    grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha * p.life})`);
    grad.addColorStop(1, 'transparent');
    cCtx.beginPath();
    cCtx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
    cCtx.fillStyle = grad;
    cCtx.fill();
  }
  requestAnimationFrame(animateCursor);
}
animateCursor();

// Ring hover effect on interactive elements
document.querySelectorAll('a, button, .pillar, .wq, .glass-card').forEach(el => {
  el.addEventListener('mouseenter', () => cursorRing?.classList.add('hover'));
  el.addEventListener('mouseleave', () => cursorRing?.classList.remove('hover'));
});

// Cursor click burst
document.addEventListener('click', (e) => {
  for (let i = 0; i < 12; i++) {
    const angle = (i / 12) * Math.PI * 2;
    const speed = 1.5 + Math.random() * 3;
    trail.push({
      x: e.clientX, y: e.clientY,
      r: 2 + Math.random() * 4,
      alpha: 0.9,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      color: [212,168,67],
      life: 1,
      decay: 0.03 + Math.random() * 0.04,
    });
  }
});

/* ════════════════════════════════════════════
   STAR CANVAS (cosmos section)
════════════════════════════════════════════ */
const starCanvas = document.getElementById('star-canvas');
const sCtx = starCanvas.getContext('2d');

function resizeStars() { starCanvas.width = window.innerWidth; starCanvas.height = window.innerHeight; }
resizeStars();
window.addEventListener('resize', resizeStars);

const stars = Array.from({ length: 300 }, () => ({
  x: Math.random(), y: Math.random(),
  r: Math.random() < 0.05 ? 1.8 : Math.random() < 0.25 ? 1.1 : 0.5,
  phase: Math.random() * Math.PI * 2,
  speed: 0.004 + Math.random() * 0.008,
  base: 0.15 + Math.random() * 0.6,
}));

// Parallax shift
let starOffX = 0, starOffY = 0;
document.addEventListener('mousemove', (e) => {
  starOffX = (e.clientX / window.innerWidth  - 0.5) * 12;
  starOffY = (e.clientY / window.innerHeight - 0.5) * 12;
});

function drawStars() {
  sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
  stars.forEach(s => {
    s.phase += s.speed;
    const a = s.base * (0.4 + 0.6 * Math.abs(Math.sin(s.phase)));
    const px = (s.x * starCanvas.width  + starOffX + starCanvas.width)  % starCanvas.width;
    const py = (s.y * starCanvas.height + starOffY + starCanvas.height) % starCanvas.height;
    sCtx.beginPath();
    sCtx.arc(px, py, s.r, 0, Math.PI * 2);
    sCtx.fillStyle = `rgba(255,255,255,${a})`;
    sCtx.fill();
  });
  requestAnimationFrame(drawStars);
}
drawStars();

/* ════════════════════════════════════════════
   WATER RIPPLE CANVAS
════════════════════════════════════════════ */
const waterSection = document.getElementById('water');
const rippleCanvas = document.getElementById('ripple-canvas');
const rCtx = rippleCanvas?.getContext('2d');
const ripples = [];

function resizeRipple() {
  if (!rippleCanvas || !waterSection) return;
  rippleCanvas.width  = waterSection.offsetWidth;
  rippleCanvas.height = waterSection.offsetHeight;
}
resizeRipple();
window.addEventListener('resize', resizeRipple);

function addRipple(x, y) {
  ripples.push({ x, y, r: 0, alpha: 0.6, maxR: 180, speed: 3 });
}

waterSection?.addEventListener('click', (e) => {
  const rect = waterSection.getBoundingClientRect();
  addRipple(e.clientX - rect.left, e.clientY - rect.top);
});

// Auto ripples
let autoRippleT = 0;
function drawRipples(now) {
  if (!rCtx) return;
  rCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);

  // Occasional auto ripple
  if (now - autoRippleT > 2800) {
    addRipple(
      100 + Math.random() * (rippleCanvas.width - 200),
      rippleCanvas.height * 0.5 + (Math.random() - 0.5) * 100
    );
    autoRippleT = now;
  }

  for (let i = ripples.length - 1; i >= 0; i--) {
    const rp = ripples[i];
    rp.r += rp.speed;
    rp.alpha -= 0.008;
    if (rp.alpha <= 0 || rp.r > rp.maxR) { ripples.splice(i, 1); continue; }
    rCtx.beginPath();
    rCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
    rCtx.strokeStyle = `rgba(212,168,67,${rp.alpha * 0.5})`;
    rCtx.lineWidth = 1.5;
    rCtx.stroke();

    rCtx.beginPath();
    rCtx.arc(rp.x, rp.y, rp.r * 0.6, 0, Math.PI * 2);
    rCtx.strokeStyle = `rgba(255,255,255,${rp.alpha * 0.2})`;
    rCtx.lineWidth = 1;
    rCtx.stroke();
  }
  requestAnimationFrame(drawRipples);
}
requestAnimationFrame(drawRipples);

/* ════════════════════════════════════════════
   FLOATING LEAVES
════════════════════════════════════════════ */
const leafLayer = document.getElementById('leaf-layer');
const leafColors = ['#4a7a2a','#6aaa3a','#8aba50','#a0c060','#c8a040','#d4883a'];

function createLeaf() {
  if (!leafLayer) return;
  const leaf = document.createElement('div');
  leaf.className = 'leaf';
  const size = 8 + Math.random() * 14;
  const duration = 8 + Math.random() * 14;
  const startX = Math.random() * window.innerWidth;
  const driftX = (Math.random() - 0.5) * 200;
  leaf.style.cssText = `
    left:${startX}px; top:-20px;
    width:${size}px; height:${size * 0.65}px;
    background:${leafColors[Math.floor(Math.random()*leafColors.length)]};
    opacity:0;
    --lx:${driftX}px;
    animation-duration:${duration}s;
    animation-delay:${Math.random() * 5}s;
    transform-origin:center;
    border-radius: ${Math.random() > 0.5 ? '50% 0 50% 0' : '0 50% 0 50%'};
  `;
  leafLayer.appendChild(leaf);
  setTimeout(() => leaf.remove(), (duration + 5) * 1000);
}

// Spawn leaves every 1.5s when in nature/forest section
setInterval(createLeaf, 1500);

/* ════════════════════════════════════════════
   HEADER SCROLL + SCENE DETECTION
════════════════════════════════════════════ */
const header = document.getElementById('site-header');
const scenes = document.querySelectorAll('.scene');
const navLinks = document.querySelectorAll('.main-nav a');

const sceneObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
      const scene = entry.target.id;
      document.body.setAttribute('data-scene', scene);
      navLinks.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === `#${scene}`);
      });
    }
  });
}, { threshold: 0.3 });

scenes.forEach(s => sceneObs.observe(s));

window.addEventListener('scroll', () => {
  header.classList.toggle('solid', window.scrollY > 60);
}, { passive:true });

/* ════════════════════════════════════════════
   PARALLAX BG (scroll-based)
════════════════════════════════════════════ */
function applyParallax() {
  document.querySelectorAll('.parallax-bg').forEach(bg => {
    const section = bg.closest('.scene');
    const rect = section.getBoundingClientRect();
    const speed = parseFloat(bg.dataset.speed || 0.2);
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = rect.top * speed;
    bg.style.transform = `translateY(${offset}px)`;
  });
}
window.addEventListener('scroll', applyParallax, { passive:true });
applyParallax();

/* ════════════════════════════════════════════
   SCROLL REVEAL
════════════════════════════════════════════ */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, { threshold:0.1, rootMargin:'0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ════════════════════════════════════════════
   HERO TITLE STAGGER
════════════════════════════════════════════ */
document.querySelectorAll('.ht-line').forEach((line, i) => {
  line.style.cssText = `opacity:0;transform:translateY(50px);transition:opacity 1s ease ${.3+i*.25}s,transform 1s cubic-bezier(.22,1,.36,1) ${.3+i*.25}s`;
  setTimeout(() => { line.style.opacity='1'; line.style.transform='none'; }, 200);
});

/* ════════════════════════════════════════════
   MOBILE MENU
════════════════════════════════════════════ */
const ham = document.getElementById('ham');
const mobNav = document.getElementById('mob-nav');
ham?.addEventListener('click', () => {
  const open = mobNav.classList.toggle('open');
  ham.classList.toggle('open', open);
});
mobNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => { mobNav.classList.remove('open'); ham.classList.remove('open'); });
});

/* ════════════════════════════════════════════
   SMOOTH SCROLL
════════════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - 68, behavior:'smooth' });
  });
});
