const menuToggle = document.getElementById("menuToggle");
const mainNav = document.getElementById("mainNav");

menuToggle?.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

mainNav?.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });
});

// Image gallery
const galleryImages = Array.from(
  document.querySelectorAll("main img")
);

let currentImageIndex = 0;

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxCaption = document.getElementById("lightboxCaption");
const lightboxCounter = document.getElementById("lightboxCounter");

function showGalleryImage(index) {
  if (!galleryImages.length) return;

  currentImageIndex =
    (index + galleryImages.length) % galleryImages.length;

  const image = galleryImages[currentImageIndex];

  lightboxImage.src = image.currentSrc || image.src;
  lightboxImage.alt = image.alt || "Project photograph";

  lightboxCaption.textContent =
    image.alt || "Project photograph";

  lightboxCounter.textContent =
    `${currentImageIndex + 1} / ${galleryImages.length}`;
}

function openLightbox(image) {
  const index = galleryImages.indexOf(image);

  showGalleryImage(index < 0 ? 0 : index);

  lightbox.classList.add("show");
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox?.classList.remove("show");
  document.body.style.overflow = "";
}

function nextImage() {
  showGalleryImage(currentImageIndex + 1);
}

function previousImage() {
  showGalleryImage(currentImageIndex - 1);
}

// Make every project photograph clickable
galleryImages.forEach(image => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");

  image.setAttribute(
    "aria-label",
    (image.alt || "Project photograph") + " — click to enlarge"
  );

  image.addEventListener("click", () => {
    openLightbox(image);
  });

  image.addEventListener("keydown", event => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(image);
    }
  });
});

// Image viewer buttons
document.getElementById("lightboxClose")
  ?.addEventListener("click", closeLightbox);

document.getElementById("lightboxNext")
  ?.addEventListener("click", nextImage);

document.getElementById("lightboxPrev")
  ?.addEventListener("click", previousImage);

// Close viewer when clicking outside the image
lightbox?.addEventListener("click", event => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

// Presentation mode
document.getElementById("presentationToggle")
  ?.addEventListener("click", async () => {

    const button =
      document.getElementById("presentationToggle");

    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen?.();

        document.body.classList.add("presentation-mode");

        if (button) {
          button.textContent = "Exit presentation view ⤢";
        }
      } else {
        await document.exitFullscreen?.();
      }
    } catch (error) {
      document.body.classList.toggle("presentation-mode");
    }
  });

// Update presentation button when fullscreen changes
document.addEventListener("fullscreenchange", () => {
  const active = !!document.fullscreenElement;

  document.body.classList.toggle("presentation-mode", active);

  const button =
    document.getElementById("presentationToggle");

  if (button) {
    button.textContent = active
      ? "Exit presentation view ⤢"
      : "Presentation view ⛶";
  }
});

// Keyboard navigation inside photo viewer
document.addEventListener("keydown", event => {
  if (!lightbox?.classList.contains("show")) return;

  if (event.key === "Escape") closeLightbox();
  if (event.key === "ArrowRight") nextImage();
  if (event.key === "ArrowLeft") previousImage();
});
