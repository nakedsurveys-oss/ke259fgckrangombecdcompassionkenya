/* =========================================================
   RANG'OMBE CDC – PRODUCTION JAVASCRIPT
   Version: 1.0.0
   Mode: Production
========================================================= */

"use strict";

/* =========================================================
   HELPERS
========================================================= */
const qs = (s, o = document) => o.querySelector(s);
const qsa = (s, o = document) => [...o.querySelectorAll(s)];
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* =========================================================
   APPLICATION CORE
========================================================= */
const App = (() => {

    /* -----------------------------------------
       INIT
    ------------------------------------------ */
    const init = () => {
        initLoader();
        initSlider();
        initCounters();
        initDropdowns();
        initRevealAnimations();
        initSmoothScroll();
    };

    /* -----------------------------------------
       PAGE LOADER
    ------------------------------------------ */
    const initLoader = () => {
        const loader = qs("#loader");
        if (!loader) return;

        window.addEventListener("load", () => {
            loader.classList.add("opacity-0");
            loader.style.pointerEvents = "none";

            setTimeout(() => loader.remove(), 500);
        });
    };

    /* -----------------------------------------
       HOME IMAGE SLIDER
    ------------------------------------------ */
    const initSlider = () => {
        const track = qs(".slides");
        if (!track || track.children.length < 2) return;

        let index = 0;
        const slides = track.children;
        const total = slides.length;
        const delay = 3500;

        const move = () => {
            index = (index + 1) % total;
            track.style.transform = translateX(-${index * 100}%);
        };

        let timer = setInterval(move, delay);

        track.addEventListener("mouseenter", () => clearInterval(timer), { passive: true });
        track.addEventListener("mouseleave", () => timer = setInterval(move, delay), { passive: true });
    };

    /* -----------------------------------------
       IMPACT COUNTERS
    ------------------------------------------ */
    const initCounters = () => {
        const counters = qsa(".counter");
        if (!counters.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el = entry.target;
                const target = Number(el.dataset.target);
                const duration = 900;
                const start = performance.now();

                const tick = now => {
                    const progress = Math.min((now - start) / duration, 1);
                    el.textContent = Math.floor(progress * target);
                    if (progress < 1) requestAnimationFrame(tick);
                };

                requestAnimationFrame(tick);
                observer.unobserve(el);
            });
        }, { threshold: 0.6 });

        counters.forEach(c => observer.observe(c));
    };

    /* -----------------------------------------
       NAVBAR DROPDOWNS
    ------------------------------------------ */
    const initDropdowns = () => {
        const dropdowns = qsa(".dropdown");
        if (!dropdowns.length) return;

        dropdowns.forEach(drop => {
            const trigger = drop.querySelector("summary, a");
            const menu = qs(".dropdown-content", drop);
            if (!trigger || !menu) return;

            trigger.addEventListener("click", e => {
                e.preventDefault();

                dropdowns.forEach(d => {
                    if (d !== drop) qs(".dropdown-content", d)?.classList.remove("open");
                });

                menu.classList.toggle("open");
            });
        });

        document.addEventListener("click", e => {
            if (!e.target.closest(".dropdown")) {
                qsa(".dropdown-content").forEach(m => m.classList.remove("open"));
            }
        });
    };

    /* -----------------------------------------
       SCROLL REVEAL ANIMATIONS
    ------------------------------------------ */
    const initRevealAnimations = () => {
        if (prefersReducedMotion) return;

        const items = qsa("[data-reveal]");
        if (!items.length) return;

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add("revealed");
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.15 });

        items.forEach(el => observer.observe(el));
    };

    /* -----------------------------------------
       SMOOTH ANCHOR SCROLL
    ------------------------------------------ */
    const initSmoothScroll = () => {
        qsa("a[href^='#']").forEach(link => {
            link.addEventListener("click", e => {
                const target = qs(link.getAttribute("href"));
                if (!target) return;

                e.preventDefault();
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? "auto" : "smooth",
                    block: "start"
                });
            });
        });
    };

    return { init };
})();

/* =========================================================
   BOOTSTRAP
========================================================= */
document.addEventListener("DOMContentLoaded", App.init);

/* =========================================================
   SAFETY NET (PRODUCTION)
========================================================= */
window.addEventListener("error", e => {
    console.warn("[CDC Error]", e.message);
});

window.addEventListener("unhandledrejection", e => {
    console.warn("[CDC Promise]", e.reason);
});