'use strict';

/* ════════════════════════════════════════════
   BILINGUAL TRANSLATION HANDLER
════════════════════════════════════════════ */
const pageTitles = {
  en: "The Word — The Visible Image of the Invisible God",
  am: "ቃሉ — የማይታየው እግዚአብሔር የሚታይ አምሳያ"
};

let currentLang = localStorage.getItem('lang') || 'en';

function setLang(lang) {
  currentLang = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.setAttribute('data-lang', lang);
  document.documentElement.setAttribute('lang', lang === 'am' ? 'am' : 'en');
  
  if (pageTitles[lang]) {
    document.title = pageTitles[lang];
  }

  document.querySelectorAll('[data-en],[data-am]').forEach(el => {
    const t = el.getAttribute(`data-${lang}`);
    if (t !== null && el.children.length === 0) el.textContent = t;
  });

  ['en', 'am'].forEach(l => {
    const btn = document.getElementById(`lb-${l}`);
    if (btn) {
      btn.classList.toggle('active', l === lang);
      btn.setAttribute('aria-pressed', l === lang);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => setLang(currentLang));

/* ════════════════════════════════════════════
   CUSTOM GLASS CURSOR & LIGHT TRAIL
════════════════════════════════════════════ */
const isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;
const cursorDot = document.getElementById('cursor-dot');
const cursorRing = document.getElementById('cursor-ring');
const cursorCanvas = document.getElementById('cursor-canvas');
const cCtx = cursorCanvas?.getContext('2d');

let mx = -200, my = -200;
let rx = -200, ry = -200;

if (!isTouchDevice && cursorCanvas && cCtx) {
  function resizeCursor() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
  }
  resizeCursor();
  window.addEventListener('resize', resizeCursor);

  const trail = [];
  const TRAIL_MAX = 35;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;

    if (cursorDot) {
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    }

    trail.push({
      x: mx,
      y: my,
      r: 1.5 + Math.random() * 2.5,
      alpha: 0.6 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2 - 0.3,
      color: Math.random() > 0.4 ? [229, 190, 101] : [255, 245, 210],
      life: 1,
      decay: 0.02 + Math.random() * 0.03,
    });
    if (trail.length > TRAIL_MAX) trail.shift();
  });

  function animateCursor() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    
    if (cursorRing) {
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top = ry + 'px';
    }

    cCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      if (p.life <= 0) {
        trail.splice(i, 1);
        continue;
      }
      const [r, g, b] = p.color;
      const grad = cCtx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3.5);
      grad.addColorStop(0, `rgba(${r},${g},${b},${p.alpha * p.life})`);
      grad.addColorStop(1, 'transparent');
      cCtx.beginPath();
      cCtx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
      cCtx.fillStyle = grad;
      cCtx.fill();
    }
    requestAnimationFrame(animateCursor);
  }
  animateCursor();

  // Delegation for smooth dynamic hover state
  const hoverSelectors = 'a, button, .glass-btn, .glass-card, .glass-pill, .glass-link, .pillar-card, .eternity-card, .insight-item, .summary-card';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest && e.target.closest(hoverSelectors)) {
      cursorRing?.classList.add('hover');
    }
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest && e.target.closest(hoverSelectors)) {
      cursorRing?.classList.remove('hover');
    }
  });

  document.addEventListener('click', (e) => {
    for (let i = 0; i < 14; i++) {
      const angle = (i / 14) * Math.PI * 2;
      const speed = 1.8 + Math.random() * 3.2;
      trail.push({
        x: e.clientX,
        y: e.clientY,
        r: 2 + Math.random() * 3.5,
        alpha: 0.9,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: [229, 190, 101],
        life: 1,
        decay: 0.025 + Math.random() * 0.035,
      });
    }
  });
}

/* ════════════════════════════════════════════
   STAR CANVAS BACKGROUND
════════════════════════════════════════════ */
const starCanvas = document.getElementById('star-canvas');
const sCtx = starCanvas?.getContext('2d');

if (starCanvas && sCtx) {
  function resizeStars() {
    starCanvas.width = window.innerWidth;
    starCanvas.height = window.innerHeight;
  }
  resizeStars();
  window.addEventListener('resize', resizeStars);

  const stars = Array.from({ length: 260 }, () => ({
    x: Math.random(),
    y: Math.random(),
    r: Math.random() < 0.06 ? 1.6 : Math.random() < 0.25 ? 1.0 : 0.5,
    phase: Math.random() * Math.PI * 2,
    speed: 0.003 + Math.random() * 0.007,
    base: 0.15 + Math.random() * 0.65,
  }));

  let starOffX = 0, starOffY = 0;
  if (!isTouchDevice) {
    document.addEventListener('mousemove', (e) => {
      starOffX = (e.clientX / window.innerWidth - 0.5) * 14;
      starOffY = (e.clientY / window.innerHeight - 0.5) * 14;
    });
  }

  function drawStars() {
    sCtx.clearRect(0, 0, starCanvas.width, starCanvas.height);
    stars.forEach(s => {
      s.phase += s.speed;
      const a = s.base * (0.4 + 0.6 * Math.abs(Math.sin(s.phase)));
      const px = (s.x * starCanvas.width + starOffX + starCanvas.width) % starCanvas.width;
      const py = (s.y * starCanvas.height + starOffY + starCanvas.height) % starCanvas.height;
      sCtx.beginPath();
      sCtx.arc(px, py, s.r, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255,255,255,${a})`;
      sCtx.fill();
    });
    requestAnimationFrame(drawStars);
  }
  drawStars();
}

/* ════════════════════════════════════════════
   WATER RIPPLE CANVAS (TOUCH & CLICK SUPPORT)
════════════════════════════════════════════ */
const eternitySection = document.getElementById('eternity');
const rippleCanvas = document.getElementById('ripple-canvas');
const rCtx = rippleCanvas?.getContext('2d');
const ripples = [];

if (rippleCanvas && rCtx && eternitySection) {
  function resizeRipple() {
    rippleCanvas.width = eternitySection.offsetWidth;
    rippleCanvas.height = eternitySection.offsetHeight;
  }
  resizeRipple();
  window.addEventListener('resize', resizeRipple);

  function addRipple(x, y) {
    ripples.push({ x, y, r: 0, alpha: 0.65, maxR: 190, speed: 2.8 });
  }

  eternitySection.addEventListener('pointerdown', (e) => {
    const rect = eternitySection.getBoundingClientRect();
    addRipple(e.clientX - rect.left, e.clientY - rect.top);
  });

  let autoRippleT = 0;
  function drawRipples(now) {
    rCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);

    if (now - autoRippleT > 3200) {
      addRipple(
        120 + Math.random() * (rippleCanvas.width - 240),
        rippleCanvas.height * 0.5 + (Math.random() - 0.5) * 120
      );
      autoRippleT = now;
    }

    for (let i = ripples.length - 1; i >= 0; i--) {
      const rp = ripples[i];
      rp.r += rp.speed;
      rp.alpha -= 0.007;
      if (rp.alpha <= 0 || rp.r > rp.maxR) {
        ripples.splice(i, 1);
        continue;
      }
      rCtx.beginPath();
      rCtx.arc(rp.x, rp.y, rp.r, 0, Math.PI * 2);
      rCtx.strokeStyle = `rgba(229,190,101,${rp.alpha * 0.45})`;
      rCtx.lineWidth = 1.5;
      rCtx.stroke();

      rCtx.beginPath();
      rCtx.arc(rp.x, rp.y, rp.r * 0.65, 0, Math.PI * 2);
      rCtx.strokeStyle = `rgba(255,255,255,${rp.alpha * 0.2})`;
      rCtx.lineWidth = 1;
      rCtx.stroke();
    }
    requestAnimationFrame(drawRipples);
  }
  requestAnimationFrame(drawRipples);
}

/* ════════════════════════════════════════════
   FLOATING CELESTIAL PARTICLES & LEAF DRIFT
════════════════════════════════════════════ */
const leafLayer = document.getElementById('leaf-layer');
const leafColors = ['rgba(229,190,101,0.6)', 'rgba(255,245,210,0.5)', 'rgba(120,180,255,0.4)', 'rgba(210,170,90,0.5)'];

function createLeaf() {
  if (!leafLayer) return;
  const leaf = document.createElement('div');
  const size = 6 + Math.random() * 8;
  const duration = 12 + Math.random() * 12;
  const startX = Math.random() * window.innerWidth;
  const driftX = (Math.random() - 0.5) * 220;
  
  leaf.style.cssText = `
    position: absolute;
    left: ${startX}px;
    top: -20px;
    width: ${size}px;
    height: ${size * 0.7}px;
    background: ${leafColors[Math.floor(Math.random() * leafColors.length)]};
    border-radius: 50% 0 50% 0;
    box-shadow: 0 0 10px rgba(229,190,101,0.3);
    opacity: 0;
    animation: leafFall ${duration}s linear infinite;
    --lx: ${driftX}px;
    pointer-events: none;
  `;
  leafLayer.appendChild(leaf);
  setTimeout(() => leaf.remove(), duration * 1000);
}

setInterval(createLeaf, 2200);

/* ════════════════════════════════════════════
   HEADER SCROLL & ACTIVE SCENE TRACKING
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
  header?.classList.toggle('solid', window.scrollY > 50);
}, { passive: true });

/* ════════════════════════════════════════════
   SMOOTH PARALLAX BACKGROUNDS
════════════════════════════════════════════ */
function applyParallax() {
  if (isTouchDevice) return;
  document.querySelectorAll('.parallax-bg').forEach(bg => {
    const section = bg.closest('.scene');
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const speed = parseFloat(bg.dataset.speed || 0.2);
    if (rect.bottom < 0 || rect.top > window.innerHeight) return;
    const offset = rect.top * speed;
    bg.style.transform = `translateY(${offset}px)`;
  });
}
window.addEventListener('scroll', applyParallax, { passive: true });
applyParallax();

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
}, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

/* ════════════════════════════════════════════
   HERO TITLE STAGGER
════════════════════════════════════════════ */
document.querySelectorAll('.ht-line').forEach((line, i) => {
  line.style.cssText = `
    opacity: 0;
    transform: translateY(40px);
    transition: opacity 1s cubic-bezier(0.2, 1, 0.3, 1) ${0.2 + i * 0.25}s,
                transform 1s cubic-bezier(0.2, 1, 0.3, 1) ${0.2 + i * 0.25}s;
  `;
  setTimeout(() => {
    line.style.opacity = '1';
    line.style.transform = 'none';
  }, 150);
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
