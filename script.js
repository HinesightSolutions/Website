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

const mobileActionBar = document.querySelector(".mobile-action-bar");
if (mobileActionBar && !mobileActionBar.querySelector('a[href^="sms:"]')) {
  const bookingLink = mobileActionBar.querySelector('a[href*="app.ringy.com/book/hinesightsolutions"]');
  const textLink = document.createElement("a");
  textLink.href = "sms:4233314251";
  textLink.textContent = "Text";
  mobileActionBar.insertBefore(textLink, bookingLink);
}

// Record high-intent contact actions in Google Analytics when available.
document.querySelectorAll('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"], a[href*="app.ringy.com/book/hinesightsolutions"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag !== "function") return;

    let method = "booking";
    if (link.href.startsWith("tel:")) method = "phone";
    if (link.href.startsWith("sms:")) method = "text";
    if (link.href.startsWith("mailto:")) method = "email";

    window.gtag("event", "generate_lead", {
      lead_source: "website",
      method,
      page_location: window.location.href
    });
  });
});


const licenseButtons = document.querySelectorAll(".state-license-button");
const licenseModal = document.getElementById("license-modal");
let licenseTrigger = null;

if (licenseButtons.length && licenseModal) {
  const title = document.getElementById("license-modal-title");
  const type = document.getElementById("license-modal-type");
  const authority = document.getElementById("license-modal-authority");
  const issued = document.getElementById("license-modal-issued");
  const expiration = document.getElementById("license-modal-expiration");
  const closeButton = licenseModal.querySelector(".license-modal-close");

  const closeLicenseModal = () => {
    licenseModal.hidden = true;
    document.body.classList.remove("modal-open");
    if (licenseTrigger) licenseTrigger.focus();
  };

  licenseButtons.forEach((button) => {
    button.addEventListener("click", () => {
      licenseTrigger = button;
      title.textContent = button.dataset.state;
      type.textContent = button.dataset.licenseType;
      authority.textContent = button.dataset.authority;
      issued.textContent = button.dataset.issued;
      expiration.textContent = button.dataset.expiration;
      licenseModal.hidden = false;
      document.body.classList.add("modal-open");
      closeButton.focus();

      if (typeof window.gtag === "function") {
        window.gtag("event", "view_license_preview", {
          state: button.dataset.state,
          page_location: window.location.href
        });
      }
    });
  });

  licenseModal.querySelectorAll("[data-license-close]").forEach((element) => {
    element.addEventListener("click", closeLicenseModal);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !licenseModal.hidden) closeLicenseModal();
  });
}
