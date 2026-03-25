/* ================================================================
   SAMUEL MONTASPRO — main.js
   Homepage: GSAP + ScrollTrigger + Burger menu + AJAX events loader
   Requires: events-data.js loaded before this script
   ================================================================ */

/* ── GSAP REGISTRATION ───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── CONSTANTS ───────────────────────────────────────────────── */
const WA_BASE = "https://wa.me/393515388278?text=";
const PHONE   = "+39 351 538 8278";
const HOMEPAGE_LIMIT = 3; // show only first 3 events on homepage

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

const pinSVG = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

/* ── BUILD EVENT CARD ─────────────────────────────────────────── */
function buildEventCard(ev) {
  const waHref = WA_BASE + encodeURIComponent(ev.wa_msg);
  const card = document.createElement("article");
  card.className = "event-card";
  card.setAttribute("aria-label", `Evento: ${ev.title} – ${ev.venue}`);

  card.innerHTML = `
    <div class="event-card__media">
      <img src="${ev.image}" alt="Serata ${ev.title}" class="event-card__img" loading="lazy" decoding="async">
      <div class="event-card__overlay"></div>
      <div class="event-card__genre"><span class="tag">${ev.genre}</span></div>
      <div class="event-card__date-badge" aria-label="Data: ${ev.date}">
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
        <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="event-card__action" aria-label="Prenota per ${ev.title}">PRENOTA</a>
        <a href="${waHref}" target="_blank" rel="noopener noreferrer" class="event-card__wa" aria-label="Info su ${ev.title}">${waIconSVG} Info</a>
      </div>
    </div>`;
  return card;
}

/* ── ASYNC EVENTS LOADER ─────────────────────────────────────── */
function fetchEvents(limit) {
  return new Promise((resolve) => {
    const delay = 300 + Math.random() * 400;
    setTimeout(() => {
      const data = (window.EVENTS_DATA || []).slice(0, limit);
      resolve(data);
    }, delay);
  });
}

async function loadEvents() {
  const skeleton = document.getElementById("eventsSkeleton");
  const grid     = document.getElementById("eventsGrid");
  if (!skeleton || !grid) return;

  try {
    const events = await fetchEvents(HOMEPAGE_LIMIT);

    gsap.to(skeleton, {
      opacity: 0,
      duration: 0.25,
      onComplete: () => {
        skeleton.style.display = "none";

        const fragment = document.createDocumentFragment();
        events.forEach(ev => fragment.appendChild(buildEventCard(ev)));
        grid.appendChild(fragment);

        gsap.fromTo(grid.querySelectorAll(".event-card"),
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            duration: 0.65,
            stagger: 0.12,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: { trigger: grid, start: "top 85%", once: true }
          }
        );
      }
    });

  } catch (err) {
    console.error("Errore eventi:", err);
    if (skeleton) skeleton.innerHTML = `
      <p style="color:var(--muted);font-size:.85rem;grid-column:1/-1;text-align:center;padding:2rem;">
        Nessun evento caricato. <a href="tel:${PHONE}" style="color:var(--gold)">Chiamami</a> per info.
      </p>`;
  }
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

if (burger) {
  burger.addEventListener("click", () => menuOpen ? closeMenu() : openMenu());
}

menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    if (link.getAttribute("href").startsWith("#")) closeMenu();
    else closeMenu();
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOpen) closeMenu();
});

/* ── NAVBAR SCROLL ───────────────────────────────────────────── */
const nav = document.getElementById("nav");
if (nav) {
  ScrollTrigger.create({
    start: "80px top",
    onEnter:     () => nav.classList.add("scrolled"),
    onLeaveBack: () => nav.classList.remove("scrolled")
  });
}

/* ── FLOATING WA BUTTON ──────────────────────────────────────── */
const waFloat = document.getElementById("waFloat");
if (waFloat) {
  gsap.set(waFloat, { scale: 0, opacity: 0 });
  ScrollTrigger.create({
    start: "200px top",
    onEnter: () => gsap.to(waFloat, { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }),
    onLeaveBack: () => gsap.to(waFloat, { scale: 0, opacity: 0, duration: 0.25, ease: "power2.in" })
  });
}

/* ── HERO ENTRANCE ───────────────────────────────────────────── */
function animateHero() {
  const words = document.querySelectorAll(".hero__word");
  gsap.timeline({ defaults: { ease: "power4.out" } })
    .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 0.9, delay: 0.15 })
    .to(words, { opacity: 1, y: 0, duration: 0.85, stagger: 0.09 }, "-=0.55")
    .to(".hero__cta", { opacity: 1, y: 0, duration: 0.65 }, "-=0.3")
    .to(".hero__scroll", { opacity: 1, duration: 0.5 }, "-=0.15");
}

/* ── SCROLL ANIMATIONS ───────────────────────────────────────── */
function setupScrollAnimations() {
  const staggerTargets = [
    { sel: ".label",              y: 20 },
    { sel: ".section-title",      y: 30 },
    { sel: ".about__text",        y: 25 },
    { sel: ".about__stats",       y: 20 },
    { sel: ".about__content .btn",y: 20 },
    { sel: ".contact__sub",       y: 25 },
    { sel: ".contact__cards",     y: 25 },
    { sel: ".section-header",     y: 25 },
  ];

  staggerTargets.forEach(({ sel, y }) => {
    gsap.utils.toArray(sel).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y },
        { opacity: 1, y: 0, duration: 0.75, ease: "power3.out", clearProps: "transform",
          scrollTrigger: { trigger: el, start: "top 90%", once: true } }
      );
    });
  });

  // About image reveal
  gsap.fromTo(".about__img-wrap",
    { opacity: 0, clipPath: "inset(100% 0 0 0)" },
    { opacity: 1, clipPath: "inset(0% 0 0 0)", duration: 1.0, ease: "power4.out",
      clearProps: "clipPath",
      scrollTrigger: { trigger: ".about__visual", start: "top 82%", once: true } }
  );

  // Badge pop
  gsap.fromTo(".about__badge",
    { opacity: 0, scale: 0.4 },
    { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.9)",
      scrollTrigger: { trigger: ".about__visual", start: "top 70%", once: true } }
  );

  // Venue items
  gsap.fromTo(".venue-item",
    { opacity: 0, x: -16 },
    { opacity: 1, x: 0, duration: 0.55, stagger: 0.07, ease: "power3.out", clearProps: "transform",
      scrollTrigger: { trigger: ".venues__list", start: "top 82%", once: true } }
  );

  // Contact
  gsap.fromTo(".contact__inner > *",
    { opacity: 0, y: 35 },
    { opacity: 1, y: 0, duration: 0.75, stagger: 0.11, ease: "power3.out", clearProps: "transform",
      scrollTrigger: { trigger: ".contact__inner", start: "top 82%", once: true } }
  );

  // Parallax hero image
  gsap.to(".hero__img", {
    yPercent: 14, ease: "none",
    scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: 1.5 }
  });

  // Parallax contact bg
  gsap.to(".contact__bg-img", {
    yPercent: 10, ease: "none",
    scrollTrigger: { trigger: ".contact", start: "top bottom", end: "bottom top", scrub: 2 }
  });
}

/* ── STAT COUNTERS ───────────────────────────────────────────── */
function setupCounters() {
  document.querySelectorAll("[data-count]").forEach(el => {
    const target = parseFloat(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: "top 87%",
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { textContent: 0 },
          { textContent: target, duration: 1.6, ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function() { el.textContent = Math.round(this.targets()[0].textContent); }
          }
        );
      }
    });
  });
}

/* ── VENUE HOVER ─────────────────────────────────────────────── */
function setupVenueHover() {
  document.querySelectorAll(".venue-item").forEach(item => {
    const name = item.querySelector(".venue-item__name");
    item.addEventListener("mouseenter", () => gsap.to(name, { x: 10, duration: 0.28, ease: "power2.out" }));
    item.addEventListener("mouseleave", () => gsap.to(name, { x: 0,  duration: 0.28, ease: "power2.out" }));
  });
}

/* ── SMOOTH ANCHOR SCROLL ────────────────────────────────────── */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
      const id = this.getAttribute("href");
      if (id === "#") return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const navH = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"));
      window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navH, behavior: "smooth" });
    });
  });
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduced) {
    animateHero();
    setupScrollAnimations();
    setupCounters();
    setupVenueHover();
  } else {
    document.querySelectorAll(".hero__word,.hero__eyebrow,.hero__cta,.hero__scroll").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  setupSmoothScroll();
  loadEvents();
});
