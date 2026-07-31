/* ==========================================================================
   p1@yer — interaction layer
   GSAP + ScrollTrigger + SplitType.
   Breakpoints handled with gsap.matchMedia (desktop / tablet / mobile).
   Philosophy: opacity + transform, no scrolljacking, restrained parallax,
   respects prefers-reduced-motion.
   ========================================================================== */

gsap.registerPlugin(ScrollTrigger);
ScrollTrigger.config({ ignoreMobileResize: true });

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const finePointer = window.matchMedia("(pointer: fine)").matches;

document.documentElement.classList.remove("no-js");
document.documentElement.classList.add("js");

/* ---------- scroll progress hairline ---------- */
if (!reduced) {
  gsap.to(".progress", {
    scaleX: 1,
    ease: "none",
    scrollTrigger: { start: 0, end: "max", scrub: 0.3 },
  });
}

/* nav gets a hairline once scrolled */
ScrollTrigger.create({
  start: 8,
  end: "max",
  toggleClass: { targets: ".nav", className: "scrolled" },
});

/* ---------- marquee ---------- */
let marqueeTween = null;

function buildMarquee() {
  const inner = document.querySelector(".marquee__inner");
  const group = document.querySelector(".marquee__group");
  if (!inner || !group) return;

  if (marqueeTween) { marqueeTween.kill(); marqueeTween = null; }

  inner.innerHTML = "";
  const probe = group.cloneNode(true);
  inner.appendChild(probe);
  const w = probe.getBoundingClientRect().width;
  inner.innerHTML = "";

  // enough copies to always cover two viewports
  const copies = Math.max(4, Math.ceil((window.innerWidth * 2) / w) + 1);
  for (let i = 0; i < copies; i++) inner.appendChild(group.cloneNode(true));

  if (reduced) return;

  // translate by exactly one group width → seamless loop
  marqueeTween = gsap.fromTo(inner, { x: 0 }, { x: -w, ease: "none", repeat: -1, duration: 55 });
}

/* pause the marquee on hover — bound once, reuses the live tween */
let marqueeBound = false;
function bindMarqueeHover() {
  const inner = document.querySelector(".marquee__inner");
  if (!inner || marqueeBound) return;
  marqueeBound = true;
  inner.addEventListener("mouseenter", () => marqueeTween && marqueeTween.pause());
  inner.addEventListener("mouseleave", () => marqueeTween && marqueeTween.play());
}

let mqTimer;
window.addEventListener("resize", () => {
  clearTimeout(mqTimer);
  mqTimer = setTimeout(buildMarquee, 250);
});

/* ---------- boot (after fonts so measurements are final) ---------- */
document.fonts.ready.then(() => {
  buildMarquee();
  bindMarqueeHover();

  /* split the hero into characters once — name + slogan */
  const charEls = [];
  gsap.utils.toArray("[data-split]").forEach((el) => {
    const s = new SplitType(el, { types: "chars" });
    if (s.chars) charEls.push(...s.chars);
  });

  const showAll = () => {
    gsap.set(".hero__label, .hero__meta, .hero__hint", { opacity: 1, y: 0 });
    gsap.set(charEls, { opacity: 1, y: 0 });
    gsap.set("[data-reveal]", { opacity: 1, y: 0 });
    gsap.set(".loader", { display: "none" });
    ScrollTrigger.refresh();
  };

  if (reduced) { showAll(); return; }

  /* ---- loader ---- */
  const loaderTl = gsap.timeline({ onComplete: () => ScrollTrigger.refresh() });
  loaderTl
    .to(".loader__bar span", { scaleX: 1, duration: 0.9, ease: "power2.inOut" })
    .to(".loader__text", { opacity: 0, y: -10, duration: 0.35, ease: "power2.out" }, "-=0.1")
    .to(".loader", { yPercent: -100, duration: 0.9, ease: "power4.inOut" }, "+=0.05")
    .set(".loader", { display: "none" });

  /* ---- hero: character stagger reveal — opacity 0→1, y 30→0, .8s, power3.out, no bounce ---- */
  const heroTl = gsap.timeline({ delay: 1.05 });
  heroTl
    .fromTo(charEls,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.025 })
    .from(".hero__label", { opacity: 0, y: 14, duration: 0.7, ease: "power3.out" }, "-=0.55")
    .from(".hero__meta",  { opacity: 0, y: 14, duration: 0.7, ease: "power3.out" }, "-=0.45")
    .from(".hero__hint",  { opacity: 0, duration: 0.8, ease: "power2.out" }, "-=0.4")
    .from(".nav__brand, .nav__meta, .nav__links", { y: -18, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=1.0");

  /* ---- scroll reveals (same across breakpoints) ---- */
  gsap.utils.toArray("[data-reveal]").forEach((el) => {
    gsap.fromTo(el,
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 1, ease: "power3.out",
        scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });

  /* ---- per-breakpoint behaviour ---- */
  const mm = gsap.matchMedia();

  mm.add({
    desktop: "(min-width: 992px)",
    tablet:  "(min-width: 640px) and (max-width: 991.98px)",
    mobile:  "(max-width: 639.98px)",
  }, (ctx) => {
    const { desktop, tablet } = ctx.conditions;

    /* restrained parallax — travel ∝ speed (0.2 bg, 0.8 fg), scrub over the section */
    const setupParallax = (factor) => {
      gsap.utils.toArray("[data-parallax]").forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 0.2;
        const range = 14 * speed * factor;
        gsap.fromTo(el,
          { yPercent: -range },
          { yPercent: range, ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top bottom", end: "bottom top", scrub: true,
            } });
      });
    };
    if (desktop) setupParallax(1);
    else if (tablet) setupParallax(0.45);

    /* custom cursor — desktop, fine pointers only */
    let cursorTick = null;
    if (desktop && finePointer && !reduced) {
      document.body.classList.add("has-cursor");
      const cursor = document.querySelector(".cursor");
      let mx = innerWidth / 2, my = innerHeight / 2, x = mx, y = my;

      window.addEventListener("pointermove", (e) => {
        mx = e.clientX; my = e.clientY;
      }, { passive: true });

      cursorTick = () => {
        x += (mx - x) * 0.16;
        y += (my - y) * 0.16;
        gsap.set(cursor, { x, y });
      };
      gsap.ticker.add(cursorTick);

      const interactive = "a, button, [data-cursor], .project";
      document.addEventListener("mouseover", (e) => {
        if (e.target.closest(interactive)) cursor.classList.add("is-hover");
      });
      document.addEventListener("mouseout", (e) => {
        if (e.target.closest(interactive)) cursor.classList.remove("is-hover");
      });
      document.addEventListener("mouseleave", () => gsap.to(cursor, { opacity: 0, duration: 0.2 }));
      document.addEventListener("mouseenter", () => gsap.to(cursor, { opacity: 1, duration: 0.2 }));
    }

    return () => {
      document.body.classList.remove("has-cursor");
      if (cursorTick) gsap.ticker.remove(cursorTick);
    };
  });

  ScrollTrigger.refresh();
});
