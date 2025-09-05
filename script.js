// ==============================
// script.js – Stacy Kohnen Website
// ==============================

// ---- CONFIG ----
const WHATSAPP_NUMBER = "+32479530471"; // vervang met echt nummer

// ---- YEAR ----
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---- NAV TOGGLE ----
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
navToggle?.addEventListener("click", () => {
  navLinks.style.display = getComputedStyle(navLinks).display === "none" ? "flex" : "none";
});
document.querySelectorAll('a[href^="#"]').forEach(a =>
  a.addEventListener("click", () => {
    if (window.innerWidth < 780) navLinks.style.display = "none";
  })
);

// ---- ICONS ----
window.addEventListener("load", () => {
  if (window.lucide) lucide.createIcons();
});

// ---- HERO TYPED EFFECT ----
if (document.getElementById("typed")) {
  new Typed("#typed", {
    strings: ["Live-Gesang, der Ihren Moment unvergesslich macht."],
    typeSpeed: 50,
    backSpeed: 0,
    loop: false,
    showCursor: false,
  });
}

// ==============================
// FULLCALENDAR INIT
// ==============================
document.addEventListener('DOMContentLoaded', function() {
  const calendarEl = document.getElementById('calendarEl');
  if(!calendarEl) return;

  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    selectable: true,
    height: "auto",
    dateClick: function(info) {
      // zet datum in hidden field
      document.getElementById("dateField").value = info.dateStr;
      // open overlay
      document.getElementById("bookingOverlay").classList.remove("hidden");
      document.body.style.overflow = "hidden";
    }
  });
  calendar.render();
});

// ==============================
// OVERLAY LOGIC
// ==============================
const overlay = document.getElementById("bookingOverlay");
const closeOverlayBtn = document.getElementById("closeOverlay");

closeOverlayBtn?.addEventListener("click", () => {
  overlay.classList.add("hidden");
  document.body.style.overflow = "";
});

// ==============================
// BOOKING FORM → WHATSAPP
// ==============================
const bookingForm = document.getElementById("bookingForm");
bookingForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const f = new FormData(bookingForm);

  const text = `Neue Anfrage – Stacy Kohnen
Datum: ${f.get("date")}
Paket: ${f.get("package")}
Name: ${f.get("name")}
E-Mail: ${f.get("email")}
Ort: ${f.get("location")}
Nachricht: ${f.get("message") || "-"}`;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
});
// Prefill pakket & scroll naar contact/kalender
document.querySelectorAll('.book-btn').forEach(btn=>{
  btn.addEventListener('click', ()=>{
    const pkg = btn.dataset.package || 'Paket 1';
    const select = document.querySelector('#bookingForm select[name="package"]');
    if (select) select.value = pkg;

    // open kalender of overlay direct? Hier: scroll naar kalender
    const cal = document.querySelector('#calendar');
    if (cal) cal.scrollIntoView({behavior:'smooth', block:'start'});
  });
});
// ===== Gallery parallax (subtiel, performant) =====
(function(){
  const items = document.querySelectorAll('#gallery .masonry-item img');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function onScroll(){
    if (!ticking){
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  function applyParallax(){
    const vh = window.innerHeight;
    items.forEach(img=>{
      const rect = img.getBoundingClientRect();
      // progress -1 (boven) tot 1 (onder)
      const p = ((rect.top + rect.height/2) - vh/2) / (vh/2);
      // beweeg max ~10px (heel subtiel)
      const translate = Math.max(-1, Math.min(1, p)) * 10;
      img.style.transform = `translateY(${translate}px)`; // zoom uit hover blijft werken
    });
    ticking = false;
  }

  applyParallax();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', applyParallax);
})();
// ===== Gallery parallax (Warum + Gallery) =====
(function(){
  const items = document.querySelectorAll('#gallery .masonry-item img');
  if (!items.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  let ticking = false;

  function onScroll(){
    if (!ticking){
      window.requestAnimationFrame(applyParallax);
      ticking = true;
    }
  }

  function applyParallax(){
    const vh = window.innerHeight;
    items.forEach(img=>{
      const rect = img.getBoundingClientRect();
      // progress -1 (boven) tot 1 (onder)
      const p = ((rect.top + rect.height/2) - vh/2) / (vh/2);
      const translate = Math.max(-1, Math.min(1, p)) * 10; // max 10px
      img.style.transform = `translateY(${translate}px)`;
    });
    ticking = false;
  }

  applyParallax();
  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', applyParallax);
})();
// ===== Grid Masonry autosize (maakt kolom 1 en 3 gelijkmatig) =====
(function(){
  const grid = document.getElementById('galleryGrid');
  if(!grid) return;

  const allItems = [...grid.querySelectorAll('.g-item')];
  const images   = [...grid.querySelectorAll('.g-item img')];

  function resizeItem(item){
    const rowHeight = parseInt(getComputedStyle(grid).getPropertyValue('grid-auto-rows'),10);
    const rowGap    = parseInt(getComputedStyle(grid).getPropertyValue('gap'),10);
    const content   = item.querySelector('img');
    if(!content) return;
    const h = content.getBoundingClientRect().height;
    const span = Math.ceil((h + rowGap) / (rowHeight + rowGap));
    item.style.gridRowEnd = `span ${span}`;
  }

  function resizeAll(){ allItems.forEach(resizeItem); }

  // wanneer afbeeldingen laden
  let loaded = 0;
  images.forEach(img=>{
    if (img.complete) { loaded++; if (loaded===images.length) resizeAll(); }
    else img.addEventListener('load', ()=>{ loaded++; if (loaded===images.length) resizeAll(); });
  });

  // bij resize voor zekerheid
  window.addEventListener('resize', resizeAll);
})();

// ===== Gallery micro-parallax (heel subtiel & performant) =====
(function(){
  const imgs = document.querySelectorAll('#gallery .g-item img');
  if (!imgs.length || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking = false;

  function apply(){
    const vh = innerHeight;
    imgs.forEach(img=>{
      const r = img.getBoundingClientRect();
      const p = ((r.top + r.height/2) - vh/2) / (vh/2);     // -1..1
      const t = Math.max(-1, Math.min(1, p)) * 8;          // max 8px
      img.style.transform = `translateY(${t}px)`;          // combineert netjes met hover-zoom
    });
    ticking = false;
  }
  function onScroll(){
    if (!ticking){ requestAnimationFrame(apply); ticking = true; }
  }
  apply();
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', apply);
})();
// === Fallback voor scroll-animaties (als CSS view-timeline niet bestaat) ===
(function(){
  const supportsViewTimeline = CSS && CSS.supports && CSS.supports('animation-timeline: view()');
  if (supportsViewTimeline) return;

  const items = document.querySelectorAll('.cine-item');
  if (!items.length) return;
  const imgs = document.querySelectorAll('.cine-item img');

  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if (e.isIntersecting) e.target.classList.add('is-in');
    });
  }, { threshold: 0.2 });

  items.forEach(el=> io.observe(el));

  // Parallax light
  let ticking = false;
  function apply(){
    const vh = innerHeight;
    imgs.forEach(img=>{
      const r = img.getBoundingClientRect();
      const p = ((r.top + r.height/2) - vh/2) / (vh/2); // -1..1
      const t = Math.max(-1, Math.min(1, p)) * 8;       // ±8px
      img.style.transform = `translateY(${t}px)`;
    });
    ticking = false;
  }
  function onScroll(){ if (!ticking){ requestAnimationFrame(apply); ticking = true; } }

  // reveal styles (match CSS keyframes end state)
  const style = document.createElement('style');
  style.textContent = `
    .cine-item{opacity:0; transform:translateY(24px) scale(.985); filter:blur(6px); transition:opacity .5s ease, transform .5s ease, filter .5s ease}
    .cine-item.is-in{opacity:1; transform:translateY(0) scale(1); filter:blur(0)}
  `;
  document.head.appendChild(style);

  apply();
  addEventListener('scroll', onScroll, {passive:true});
  addEventListener('resize', apply);
})();
// Transparent header boven de hero
const nav = document.querySelector('.nav');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});
// ===== Language Switcher =====
(function(){
  const btn   = document.getElementById('langBtn');
  const menu  = document.getElementById('langMenu');
  const label = document.getElementById('langLabel');
  const flag  = document.getElementById('langFlag');
  if(!btn || !menu) return;

  // Bepaal huidige taal via pad
  const path = location.pathname.replace(/\/+$/,'/');
  let current = 'de';
  if (path.startsWith('/nl/')) current = 'nl';
  else if (path.startsWith('/fr/')) current = 'fr';
  else if (path.startsWith('/en/')) current = 'en';

  const flags = {
    de: 'https://flagcdn.com/w20/de.png',
    nl: 'https://flagcdn.com/w20/nl.png',
    fr: 'https://flagcdn.com/w20/fr.png',
    en: 'https://flagcdn.com/w20/gb.png'
  };

  function updateButton(lang){
    label.textContent = lang.toUpperCase();
    flag.src = flags[lang];
    flag.alt = ({
      de:'Deutsch', nl:'Nederlands', fr:'Français', en:'English'
    })[lang] || 'Language';
  }
  updateButton(current);

  // Open/close
  function openMenu(){ menu.classList.add('open'); btn.setAttribute('aria-expanded','true'); }
  function closeMenu(){ menu.classList.remove('open'); btn.setAttribute('aria-expanded','false'); }
  btn.addEventListener('click', (e)=>{
    e.stopPropagation();
    menu.classList.contains('open') ? closeMenu() : openMenu();
  });
  document.addEventListener('click', closeMenu);
  document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closeMenu(); });

  // Klik op opties → slimme redirect (behoud subpad indien aanwezig)
  menu.querySelectorAll('a[data-lang]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      e.preventDefault();
      const lang = a.dataset.lang;
      // Basisstrategie: root voor DE, subfolder voor andere talen
      const origin = location.origin;
      const isDe   = lang === 'de';
      const target = isDe ? `${origin}/` : `${origin}/${lang}/`;
      // Als je later subpagina’s per taal hebt, kun je hier mapping toevoegen
      location.href = target;
    });
  });

  // Init icons (lucide)
  if (window.lucide) lucide.createIcons();
})();
