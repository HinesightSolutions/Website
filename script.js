const menuButton = document.querySelector(".mobile-menu-button");
const navLinks = document.querySelector(".nav-links");

if (menuButton && navLinks) {
  menuButton.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const revealEls = document.querySelectorAll(".reveal");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.13 }
);

revealEls.forEach((el) => observer.observe(el));

// Record high-intent contact actions in Google Analytics when available.
document.querySelectorAll('a[href^="tel:"], a[href^="mailto:"], a[href*="app.ringy.com/book/hinesightsolutions"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag !== "function") return;

    let method = "booking";
    if (link.href.startsWith("tel:")) method = "phone";
    if (link.href.startsWith("mailto:")) method = "email";

    window.gtag("event", "generate_lead", {
      lead_source: "website",
      method,
      page_location: window.location.href
    });
  });
});
