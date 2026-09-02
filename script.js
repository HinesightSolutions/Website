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

document.querySelectorAll('a[href^="tel:"], a[href^="sms:"], a[href^="mailto:"], a[href*="app.ringy.com/book/hinesightsolutions"]').forEach((link) => {
  link.addEventListener("click", () => {
    if (typeof window.gtag !== "function") return;
    let method = "booking";
    if (link.href.startsWith("tel:")) method = "phone";
    if (link.href.startsWith("sms:")) method = "text";
    if (link.href.startsWith("mailto:")) method = "email";
    window.gtag("event", "generate_lead", { lead_source: "website", method, page_location: window.location.href });
  });
});

// Verified 20-license archive sequence. The first 18,000 characters are
// assembled from the verified v3 head plus a small verified tail; the
// remaining chunks are known-good pieces of the same archive.
const LICENSE_PACK_PARTS = [
  "licenses/data/v3/part-01.b64?v=20260902b",
  "licenses/data/v3/first-tail-3000.b64?v=20260902b",
  "licenses/data/license-pack-gz-02.b64?v=20260902b",
  "licenses/data/license-pack-gz-03.b64?v=20260902b",
  "licenses/data/license-pack-gz-04.b64?v=20260902b",
  "licenses/data/license-pack-gz-05.b64?v=20260902b",
  "licenses/data/license-pack-gz-06.b64?v=20260902b",
  "licenses/data/license-pack-gz-07.b64?v=20260902b",
  "licenses/data/live-pack-gz-08.b64?v=20260902b",
  "licenses/data/license-pack-final-09.b64?v=20260902b",
  "licenses/data/license-pack-tail-01.b64?v=20260902b",
  "licenses/data/license-pack-tail-02.b64?v=20260902b",
  "licenses/data/license-pack-tail-03.b64?v=20260902b",
  "licenses/data/license-pack-tail-04.b64?v=20260902b",
  "licenses/data/license-pack-tail-05.b64?v=20260902b",
  "licenses/data/license-pack-tail-06.b64?v=20260902b",
  "licenses/data/license-pack-tail-07.b64?v=20260902b"
];

let licenseFilesPromise = null;

const normalizeLicenseName = (value) => value.toLowerCase().replace(/[^a-z0-9]/g, "");

const bytesFromBase64 = (base64) => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
};

const mimeTypeForBytes = (bytes) => {
  if (bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) return "application/pdf";
  if (bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) return "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) return "image/jpeg";
  return "application/octet-stream";
};

async function loadLicenseFiles() {
  if (licenseFilesPromise) return licenseFilesPromise;

  licenseFilesPromise = (async () => {
    if (typeof DecompressionStream !== "function") {
      throw new Error("This browser does not support the license document viewer.");
    }

    const responses = await Promise.all(LICENSE_PACK_PARTS.map((path) => fetch(path, { cache: "no-store" })));
    responses.forEach((response) => {
      if (!response.ok) throw new Error(`License asset failed to load (${response.status}).`);
    });

    const chunks = await Promise.all(responses.map((response) => response.text()));
    const compressedBytes = bytesFromBase64(chunks.join("").replace(/\s+/g, ""));
    const decompressedStream = new Blob([compressedBytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    const packed = new Uint8Array(await new Response(decompressedStream).arrayBuffer());
    const view = new DataView(packed.buffer, packed.byteOffset, packed.byteLength);
    const decoder = new TextDecoder();

    if (decoder.decode(packed.slice(0, 4)) !== "HSL1") throw new Error("License pack header is invalid.");

    const fileCount = view.getUint16(4, true);
    let offset = 6;
    const files = [];

    for (let index = 0; index < fileCount; index += 1) {
      if (offset + 6 > packed.length) throw new Error("License pack is incomplete.");
      const nameLength = view.getUint16(offset, true);
      const fileLength = view.getUint32(offset + 2, true);
      offset += 6;
      if (offset + nameLength + fileLength > packed.length) throw new Error("License document data is incomplete.");
      const name = decoder.decode(packed.slice(offset, offset + nameLength));
      offset += nameLength;
      const fileBytes = packed.slice(offset, offset + fileLength);
      offset += fileLength;
      const blob = new Blob([fileBytes], { type: mimeTypeForBytes(fileBytes) });
      files.push({ name, normalizedName: normalizeLicenseName(name), url: URL.createObjectURL(blob) });
    }

    if (files.length !== 20) throw new Error(`Expected 20 licenses but found ${files.length}.`);
    return files;
  })();

  return licenseFilesPromise;
}

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
  const viewLink = document.getElementById("license-view-link");
  const downloadLink = document.getElementById("license-download-link");
  const status = document.getElementById("license-preview-status");
  const actionRow = licenseModal.querySelector(".license-preview-actions");
  if (actionRow) actionRow.style.marginTop = "24px";

  const setLinksDisabled = (message) => {
    [viewLink, downloadLink].forEach((link) => {
      if (!link) return;
      link.href = "#";
      link.setAttribute("aria-disabled", "true");
      link.style.pointerEvents = "none";
      link.style.opacity = "0.55";
    });
    if (status) status.textContent = message;
  };

  const setLinksReady = (file, state) => {
    if (viewLink) {
      viewLink.href = file.url;
      viewLink.removeAttribute("aria-disabled");
      viewLink.style.pointerEvents = "";
      viewLink.style.opacity = "";
    }
    if (downloadLink) {
      downloadLink.href = file.url;
      downloadLink.download = file.name || `James-Hines-${state}-Insurance-License.pdf`;
      downloadLink.removeAttribute("aria-disabled");
      downloadLink.style.pointerEvents = "";
      downloadLink.style.opacity = "";
    }
    if (status) status.textContent = "Full state-issued license document ready.";
  };

  const prepareLicenseDocument = async (state) => {
    setLinksDisabled("Preparing license document…");
    try {
      const files = await loadLicenseFiles();
      const stateKey = normalizeLicenseName(state);
      const file = files.find((item) => item.normalizedName.includes(stateKey));
      if (!file) throw new Error(`No license document was found for ${state}.`);
      setLinksReady(file, state);
    } catch (error) {
      console.error(error);
      licenseFilesPromise = null;
      setLinksDisabled("The full license document could not be loaded. Please refresh and try again.");
    }
  };

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
      prepareLicenseDocument(button.dataset.state);

      if (typeof window.gtag === "function") {
        window.gtag("event", "view_license_preview", { state: button.dataset.state, page_location: window.location.href });
      }
    });
  });

  if (viewLink) viewLink.addEventListener("click", () => {
    if (typeof window.gtag === "function") window.gtag("event", "view_full_license", { state: title.textContent, page_location: window.location.href });
  });

  if (downloadLink) downloadLink.addEventListener("click", () => {
    if (typeof window.gtag === "function") window.gtag("event", "download_license", { state: title.textContent, page_location: window.location.href });
  });

  licenseModal.querySelectorAll("[data-license-close]").forEach((element) => element.addEventListener("click", closeLicenseModal));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !licenseModal.hidden) closeLicenseModal();
  });
}
