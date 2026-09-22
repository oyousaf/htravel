const STAGGER_MS = 120;

function initReveal() {
  const groups = document.querySelectorAll<HTMLElement>("[data-animate-group]");
  groups.forEach((group) => {
    const items = group.querySelectorAll<HTMLElement>(":scope > [data-animate]");
    items.forEach((item, i) => {
      item.style.setProperty("--reveal-delay", `${i * STAGGER_MS}ms`);
    });
  });

  const targets = document.querySelectorAll<HTMLElement>("[data-animate]");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
  );

  targets.forEach((el) => observer.observe(el));
}

document.addEventListener("DOMContentLoaded", initReveal);
document.addEventListener("astro:page-load", initReveal);
