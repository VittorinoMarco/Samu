/* ================================================================
   SAMUEL MONTASPRO — eventi.js
   Full events page: filter, render, animations
   Requires: gsap, ScrollTrigger, events-data.js
   ================================================================ */

gsap.registerPlugin(ScrollTrigger);

/* ── CONSTANTS ───────────────────────────────────────────────── */
const WA_BASE  = "https://wa.me/393515388278?text=";
const MONTH_IT = ["GEN","FEB","MAR","APR","MAG","GIU","LUG","AGO","SET","OTT","NOV","DIC"];

/* ── HELPERS ─────────────────────────────────────────────────── */
function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}
function formatDay(s)   { return parseDate(s).getDate(); }
function formatMonth(s) { return MONTH_IT[parseDate(s).getMonth()]; }

/* ── SVG ICONS ───────────────────────────────────────────────── */
const waIconSVG = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 24l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.66-.488-5.2-1.344l-.373-.221-3.865 1.014 1.033-3.764-.243-.387A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>`;
const clockSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;
const pinSVG   = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

/* ── BUILD EVENT CARD ─────────────────────────────────────────── */
function buildEventCard(ev) {
  const waHref = WA_BASE + encodeURIComponent(ev.wa_msg);
  const card = document.createElement("article");
  card.className = "event-card";
  card.dataset.venue = ev.venue;
  card.setAttribute("aria-label", `Evento: ${ev.title} – ${ev.venue}`);

  card.innerHTML = `
    <div class="event-card__media">
      <img src="${ev.image}" alt="Serata ${ev.title}" class="event-card__img" loading="lazy" decoding="async">
      <div class="event-card__overlay"></div>
      <div class="event-card__genre"><span class="tag">${ev.genre}</span></div>
      <div class="event-card__date-badge" aria-label="Data evento: ${ev.date}">
        <span class="day">${formatDay(ev.date)}</span>
        <span class="month">${formatMonth(ev.date)}</span>
      </div>
    </div>
    <div class="event-card__body">
      <p class="event-card__venue">${ev.venue} — ${ev.city}</p>
      <h3 class="event-card__title">${ev.title}</h3>
      <div class="event-card__meta">
        <span class="event-card__meta-item">${clockSVG} ${ev.time}</span>
        <span class="event-card__meta-item">${pinSVG} ${ev.city}</span>
      </div>
      <div class="event-card__footer">
        <a href="${waHref}" target="_blank" rel="noopener noreferrer"
           class="event-card__action" aria-label="Prenota per ${ev.title}">PRENOTA</a>
        <a href="${waHref}" target="_blank" rel="noopener noreferrer"
           class="event-card__wa" aria-label="Info WhatsApp per ${ev.title}">${waIconSVG} Info</a>
      </div>
    </div>`;
  return card;
}

/* ── ASYNC EVENTS LOADER ─────────────────────────────────────── */
function fetchAllEvents() {
  return new Promise(resolve => {
    setTimeout(() => resolve(window.EVENTS_DATA || []), 300 + Math.random() * 350);
  });
}

async function loadAllEvents() {
  const skeleton = document.getElementById("eventsSkeleton");
  const grid     = document.getElementById("allEventsGrid");
  if (!skeleton || !grid) return;

  try {
    const events = await fetchAllEvents();

    gsap.to(skeleton, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        skeleton.style.display = "none";

        const fragment = document.createDocumentFragment();
        events.forEach(ev => fragment.appendChild(buildEventCard(ev)));
        grid.appendChild(fragment);

        // Initial animation
        gsap.fromTo(grid.querySelectorAll(".event-card"),
          { opacity: 0, y: 36 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: "power3.out",
            clearProps: "transform" }
        );

        // Setup filter after cards are in the DOM
        setupFilter();
      }
    });

  } catch (err) {
    console.error("Errore nel caricamento eventi:", err);
    if (skeleton) skeleton.innerHTML = `
      <p class="all-events__empty">
        Impossibile caricare gli eventi.<br>
        <a href="tel:+39 351 538 8278" style="color:var(--gold)">Chiamami</a> per informazioni.
      </p>`;
  }
}

/* ── FILTER LOGIC ────────────────────────────────────────────── */
function setupFilter() {
  const tabs  = document.querySelectorAll(".filter-tab");
  const grid  = document.getElementById("allEventsGrid");
  if (!tabs.length || !grid) return;

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      // Filter cards with GSAP
      const allCards = grid.querySelectorAll(".event-card");
      const toShow   = [];
      const toHide   = [];

      allCards.forEach(card => {
        const matches = filter === "all" || card.dataset.venue === filter;
        if (matches) toShow.push(card);
        else toHide.push(card);
      });

      // Animate out hidden
      if (toHide.length) {
        gsap.to(toHide, {
          opacity: 0, scale: 0.95, duration: 0.22, ease: "power2.in",
          onComplete: () => { toHide.forEach(c => c.classList.add("hidden")); }
        });
      }

      // Animate in visible
      toShow.forEach(c => c.classList.remove("hidden"));
      gsap.fromTo(toShow,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, ease: "power3.out",
          clearProps: "transform,opacity" }
      );

      // Show "no events" message if all hidden
      const emptyMsg = grid.querySelector(".all-events__empty");
      if (toShow.length === 0) {
        if (!emptyMsg) {
          const msg = document.createElement("p");
          msg.className = "all-events__empty";
          msg.textContent = "Nessun evento in programma per questo locale al momento.";
          grid.appendChild(msg);
        }
      } else if (emptyMsg) {
        emptyMsg.remove();
      }
    });
  });
}

/* ── BURGER / MENU OVERLAY ───────────────────────────────────── */
const burger      = document.getElementById("burger");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks   = menuOverlay ? menuOverlay.querySelectorAll("[data-menu-link]") : [];
const menuFooter  = menuOverlay ? menuOverlay.querySelector(".menu-overlay__footer") : null;
const menuBg      = menuOverlay ? menuOverlay.querySelector(".menu-overlay__bg") : null;

let menuOpen = false;

const menuTl = gsap.timeline({ paused: true })
  .to(menuBg, { scaleY: 1, duration: 0.6, ease: "power4.inOut" })
  .to(menuLinks, { y: 0, opacity: 1, stagger: 0.07, duration: 0.45, ease: "power3.out" }, "-=0.25")
  .to(menuFooter, { y: 0, opacity: 1, duration: 0.35, ease: "power3.out" }, "-=0.15");

function openMenu() {
  menuOpen = true;
  menuOverlay.classList.add("is-open");
  burger.classList.add("active");
  burger.setAttribute("aria-expanded", "true");
  document.body.classList.add("menu-open");
  menuTl.play();
}
function closeMenu() {
  menuOpen = false;
  burger.classList.remove("active");
  burger.setAttribute("aria-expanded", "false");
  document.body.classList.remove("menu-open");
  menuTl.reverse().then(() => menuOverlay.classList.remove("is-open"));
}

if (burger) burger.addEventListener("click", () => menuOpen ? closeMenu() : openMenu());
menuLinks.forEach(link => link.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape" && menuOpen) closeMenu(); });

/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
const nav = document.getElementById("nav");
if (nav) {
  ScrollTrigger.create({
    start: "60px top",
    onEnter:     () => nav.classList.add("scrolled"),
    onLeaveBack: () => nav.classList.remove("scrolled")
  });
  // Nav is always scrolled on this page (no full-height hero)
  nav.classList.add("scrolled");
}

/* ── FLOATING WA BUTTON ──────────────────────────────────────── */
const waFloat = document.getElementById("waFloat");
if (waFloat) {
  gsap.set(waFloat, { scale: 0, opacity: 0 });
  // On the events page, show it after a short delay (no hero scroll needed)
  gsap.to(waFloat, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)", delay: 1.2 });
}

/* ── PAGE HERO ANIMATIONS ────────────────────────────────────── */
function animatePageHero() {
  const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
  tl
    .from("#heroLabel",  { opacity: 0, y: 16, duration: 0.6, delay: 0.1 })
    .from("#heroTitle",  { opacity: 0, y: 30, duration: 0.7 }, "-=0.3")
    .from("#heroSub",    { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────────── */
function setupScrollAnimations() {
  gsap.fromTo(".filter-tabs",
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
      scrollTrigger: { trigger: ".filter-tabs", start: "top 90%", once: true } }
  );

  // Contact section
  gsap.fromTo(".contact__inner > *",
    { opacity: 0, y: 30 },
    { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: "power3.out", clearProps: "transform",
      scrollTrigger: { trigger: ".contact__inner", start: "top 82%", once: true } }
  );

  // Parallax contact bg
  gsap.to(".contact__bg-img", {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: 2 }
  });
}

/* ── PAGE FADE IN ────────────────────────────────────────────── */
function pageEnter() {
  gsap.from("body", { opacity: 0, duration: 0.5, ease: "power2.out" });
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced) {
    pageEnter();
    animatePageHero();
    setupScrollAnimations();
  }

  loadAllEvents();
});
