// ==============================
// script.js – Stacy Kohnen Website
// ==============================

// ---- CONFIG ----
const WHATSAPP_NUMBER = "31600000000"; // vervang met echt nummer

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
