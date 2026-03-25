/* ================================================================
   SAMUEL MONTASPRO — main.js
   GSAP + ScrollTrigger + Burger menu + AJAX events loader
   ================================================================ */

/* ── GSAP REGISTRATION ───────────────────────────────────────── */
gsap.registerPlugin(ScrollTrigger);

/* ── EVENTS DATA (simulated API payload) ─────────────────────── */
const EVENTS_DATA = [
  {
    id: 1,
    title: "Black Saturday",
    venue: "Volt Club",
    city: "Milano",
    date: "2026-04-05",
    time: "23:00 → 05:00",
    genre: "House · Techno",
    image: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=75&auto=format&fit=crop",
    wa_msg: "Ciao Samuel! Vorrei prenotare per *Black Saturday* al Volt Club (5 Aprile)."
  },
  {
    id: 2,
    title: "Golden Night",
    venue: "Sanctuary",
    city: "Milano",
    date: "2026-04-12",
    time: "22:30 → 04:00",
    genre: "Commercial · Pop",
    image: "https://images.unsplash.com/photo-1571266752787-1d16c3b5f63e?w=800&q=75&auto=format&fit=crop",
    wa_msg: "Ciao Samuel! Vorrei prenotare per *Golden Night* al Sanctuary (12 Aprile)."
  },
  {
    id: 3,
    title: "Open Air Sessions",
    venue: "The Garden",
    city: "Milano",
    date: "2026-04-19",
    time: "19:00 → 02:00",
    genre: "Afro · Disco",
    image: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=800&q=75&auto=format&fit=crop",
    wa_msg: "Ciao Samuel! Vorrei prenotare per *Open Air Sessions* al The Garden (19 Aprile)."
  },
  {
    id: 4,
    title: "Midnight Ritual",
    venue: "Artefact",
    city: "Milano",
    date: "2026-04-25",
    time: "00:00 → 06:00",
    genre: "Techno · Industrial",
    image: "https://images.unsplash.com/photo-1598387993441-a364f854cfbd?w=800&q=75&auto=format&fit=crop",
    wa_msg: "Ciao Samuel! Vorrei prenotare per *Midnight Ritual* ad Artefact (25 Aprile)."
  },
  {
    id: 5,
    title: "Soul & Groove",
    venue: "Noir Lounge",
    city: "Como",
    date: "2026-05-02",
    time: "22:00 → 03:30",
    genre: "R&B · Soul",
    image: "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&q=75&auto=format&fit=crop",
    wa_msg: "Ciao Samuel! Vorrei prenotare per *Soul & Groove* al Noir Lounge (2 Maggio)."
  },
  {
    id: 6,
    title: "VIP Exclusive",
    venue: "Palazzo Reale Club",
    city: "Milano",
    date: "2026-05-09",
    time: "23:30 → 05:00",
    genre: "Luxury · Varied",
    image: "https://images.unsplash.com/photo-1642543492475-c1f38a561b0c?w=800&q=75&auto=format&fit=crop",
    wa_msg: "Ciao Samuel! Vorrei prenotare per *VIP Exclusive* al Palazzo Reale Club (9 Maggio)."
  }
];

/* ── HELPERS ─────────────────────────────────────────────────── */
const WA_BASE = "https://wa.me/393331234567?text=";
const PHONE   = "+393331234567";

const MONTH_IT = ["GEN","FEB","MAR","APR","MAG","GIU","LUG","AGO","SET","OTT","NOV","DIC"];

function parseDate(str) {
  const [y, m, d] = str.split("-").map(Number);
  return new Date(y, m - 1, d);
}

function formatDay(dateStr) {
  return parseDate(dateStr).getDate();
}
function formatMonth(dateStr) {
  return MONTH_IT[parseDate(dateStr).getMonth()];
}

/* WhatsApp SVG icon (inline) */
const waIconSVG = `
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.528 5.845L.057 24l6.304-1.654A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.887 0-3.66-.488-5.2-1.344l-.373-.221-3.865 1.014 1.033-3.764-.243-.387A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
  </svg>`;

const clockSVG = `
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>`;

const pinSVG = `
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>`;

/* ── BUILD EVENT CARD ─────────────────────────────────────────── */
function buildEventCard(ev) {
  const waHref = WA_BASE + encodeURIComponent(ev.wa_msg);
  const card = document.createElement("article");
  card.className = "event-card fade-up";
  card.setAttribute("aria-label", `Evento: ${ev.title} – ${ev.venue}`);

  card.innerHTML = `
    <div class="event-card__media">
      <img
        src="${ev.image}"
        alt="Locandina ${ev.title}"
        class="event-card__img"
        loading="lazy"
        decoding="async"
      >
      <div class="event-card__overlay"></div>
      <div class="event-card__genre">
        <span class="tag">${ev.genre}</span>
      </div>
      <div class="event-card__date-badge" aria-label="Data: ${ev.date}">
        <span class="day">${formatDay(ev.date)}</span>
        <span class="month">${formatMonth(ev.date)}</span>
      </div>
    </div>
    <div class="event-card__body">
      <p class="event-card__venue">${ev.venue} — ${ev.city}</p>
      <h3 class="event-card__title">${ev.title}</h3>
      <div class="event-card__meta">
        <span class="event-card__meta-item">
          ${clockSVG} ${ev.time}
        </span>
        <span class="event-card__meta-item">
          ${pinSVG} ${ev.city}
        </span>
      </div>
      <div class="event-card__footer">
        <a
          href="${waHref}"
          target="_blank"
          rel="noopener noreferrer"
          class="event-card__action"
          aria-label="Prenota posto per ${ev.title} su WhatsApp"
        >
          PRENOTA
        </a>
        <a
          href="${waHref}"
          target="_blank"
          rel="noopener noreferrer"
          class="event-card__wa"
          aria-label="Contatta su WhatsApp per ${ev.title}"
        >
          ${waIconSVG} Info
        </a>
      </div>
    </div>
  `;
  return card;
}

/* ── ASYNC EVENTS LOADER (simulated AJAX) ─────────────────────── */
function fetchEvents() {
  return new Promise((resolve) => {
    // Simulate network latency (200–700ms)
    const delay = 200 + Math.random() * 500;
    setTimeout(() => resolve(EVENTS_DATA), delay);
  });
}

async function loadEvents() {
  const skeleton = document.getElementById("eventsSkeleton");
  const grid     = document.getElementById("eventsGrid");

  try {
    const events = await fetchEvents();

    // Hide skeleton with fade
    gsap.to(skeleton, {
      opacity: 0,
      duration: 0.3,
      onComplete: () => {
        skeleton.style.display = "none";

        // Render cards
        const fragment = document.createDocumentFragment();
        events.forEach(ev => fragment.appendChild(buildEventCard(ev)));
        grid.appendChild(fragment);

        // Animate cards in with stagger
        gsap.fromTo(
          grid.querySelectorAll(".event-card"),
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
            clearProps: "transform",
            scrollTrigger: {
              trigger: grid,
              start: "top 85%",
              once: true
            }
          }
        );
      }
    });

  } catch (err) {
    console.error("Errore nel caricamento degli eventi:", err);
    skeleton.innerHTML = `
      <p style="color:var(--muted);font-size:.85rem;grid-column:1/-1;text-align:center;padding:2rem 0;">
        Impossibile caricare gli eventi. <a href="tel:${PHONE}" style="color:var(--gold)">Chiamami</a> per informazioni.
      </p>`;
  }
}

/* ── BURGER / MENU OVERLAY ───────────────────────────────────── */
const burger      = document.getElementById("burger");
const menuOverlay = document.getElementById("menuOverlay");
const menuLinks   = menuOverlay.querySelectorAll("[data-menu-link]");
const menuFooter  = menuOverlay.querySelector(".menu-overlay__footer");
const menuBg      = menuOverlay.querySelector(".menu-overlay__bg");

let menuOpen = false;

const menuTl = gsap.timeline({ paused: true, defaults: { ease: "power4.inOut" } })
  .to(menuBg, {
    scaleY: 1,
    duration: 0.65
  })
  .to(menuLinks, {
    y: 0,
    opacity: 1,
    stagger: 0.08,
    duration: 0.5,
    ease: "power3.out"
  }, "-=0.3")
  .to(menuFooter, {
    y: 0,
    opacity: 1,
    duration: 0.4,
    ease: "power3.out"
  }, "-=0.2");

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
  menuTl.reverse().then(() => {
    menuOverlay.classList.remove("is-open");
  });
}

burger.addEventListener("click", () => {
  menuOpen ? closeMenu() : openMenu();
});

// Close on link click (smooth scroll handled by CSS)
menuLinks.forEach(link => {
  link.addEventListener("click", () => {
    closeMenu();
  });
});

// Close on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuOpen) closeMenu();
});

/* ── NAVBAR SCROLL BEHAVIOR ──────────────────────────────────── */
const nav = document.getElementById("nav");

ScrollTrigger.create({
  start: "80px top",
  onEnter:  () => nav.classList.add("scrolled"),
  onLeaveBack: () => nav.classList.remove("scrolled")
});

/* ── HERO ENTRANCE ANIMATION ─────────────────────────────────── */
function animateHero() {
  const words = document.querySelectorAll(".hero__word");

  const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
  tl
    .to(".hero__eyebrow", { opacity: 1, y: 0, duration: 1, delay: 0.1 })
    .to(words, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      stagger: 0.1
    }, "-=0.6")
    .to(".hero__cta", {
      opacity: 1,
      y: 0,
      duration: 0.7
    }, "-=0.3")
    .to(".hero__scroll", {
      opacity: 1,
      duration: 0.6
    }, "-=0.2");
}

/* ── SCROLL-TRIGGERED ANIMATIONS ────────────────────────────── */
function setupScrollAnimations() {

  // Generic fade-up for labeled elements
  const fadeTargets = [
    ".label",
    ".section-title",
    ".about__text",
    ".about__stats",
    ".about__content .btn",
    ".contact__sub",
    ".contact__cards",
    ".venues__list",
    ".section-header"
  ];

  fadeTargets.forEach(sel => {
    gsap.utils.toArray(sel).forEach(el => {
      gsap.fromTo(el,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            once: true
          }
        }
      );
    });
  });

  // About image reveal
  gsap.fromTo(".about__img-wrap",
    { opacity: 0, scale: 1.04, clipPath: "inset(100% 0 0 0)" },
    {
      opacity: 1,
      scale: 1,
      clipPath: "inset(0% 0 0 0)",
      duration: 1.1,
      ease: "power4.out",
      clearProps: "clipPath,transform",
      scrollTrigger: {
        trigger: ".about__visual",
        start: "top 80%",
        once: true
      }
    }
  );

  // About badge pop
  gsap.fromTo(".about__badge",
    { opacity: 0, scale: 0.5 },
    {
      opacity: 1,
      scale: 1,
      duration: 0.7,
      ease: "back.out(1.7)",
      scrollTrigger: {
        trigger: ".about__visual",
        start: "top 70%",
        once: true
      }
    }
  );

  // Venue items stagger
  gsap.fromTo(".venue-item",
    { opacity: 0, x: -20 },
    {
      opacity: 1,
      x: 0,
      duration: 0.6,
      stagger: 0.08,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: ".venues__list",
        start: "top 80%",
        once: true
      }
    }
  );

  // Contact section
  gsap.fromTo(".contact__inner > *",
    { opacity: 0, y: 40 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.12,
      ease: "power3.out",
      clearProps: "transform",
      scrollTrigger: {
        trigger: ".contact__inner",
        start: "top 80%",
        once: true
      }
    }
  );

  // Parallax on hero image
  gsap.to(".hero__img", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero",
      start: "top top",
      end: "bottom top",
      scrub: 1.5
    }
  });

  // Parallax on contact background
  gsap.to(".contact__bg-img", {
    yPercent: 12,
    ease: "none",
    scrollTrigger: {
      trigger: ".contact",
      start: "top bottom",
      end: "bottom top",
      scrub: 2
    }
  });
}

/* ── STAT COUNTERS ───────────────────────────────────────────── */
function setupCounters() {
  const counters = document.querySelectorAll(".stat__num[data-count]");

  counters.forEach(el => {
    const target = parseFloat(el.dataset.count);
    ScrollTrigger.create({
      trigger: el,
      start: "top 85%",
      once: true,
      onEnter: () => {
        gsap.fromTo(el,
          { textContent: 0 },
          {
            textContent: target,
            duration: 1.8,
            ease: "power2.out",
            snap: { textContent: 1 },
            onUpdate: function () {
              el.textContent = Math.round(this.targets()[0].textContent);
            }
          }
        );
      }
    });
  });
}

/* ── VENUE ITEM HOVER LINE ───────────────────────────────────── */
function setupVenueHover() {
  document.querySelectorAll(".venue-item").forEach(item => {
    const name = item.querySelector(".venue-item__name");
    item.addEventListener("mouseenter", () => {
      gsap.to(name, { x: 8, duration: 0.3, ease: "power2.out" });
    });
    item.addEventListener("mouseleave", () => {
      gsap.to(name, { x: 0, duration: 0.3, ease: "power2.out" });
    });
  });
}

/* ── SMOOTH ANCHOR SCROLL (override default for offset) ─────── */
function setupSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--nav-h"));
      const top  = target.getBoundingClientRect().top + window.scrollY - navH;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });
}

/* ── INIT ────────────────────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {

  // Respect reduced motion
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!prefersReducedMotion) {
    animateHero();
    setupScrollAnimations();
    setupCounters();
    setupVenueHover();
  } else {
    // Still make elements visible
    document.querySelectorAll(".hero__word, .hero__eyebrow, .hero__cta, .hero__scroll").forEach(el => {
      el.style.opacity = "1";
      el.style.transform = "none";
    });
  }

  setupSmoothScroll();
  loadEvents();
});
