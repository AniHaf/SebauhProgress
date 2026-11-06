
/* =========================================================
   SEBAUH PROGRESS
   Complete gallery and image-loading script
   Original image filenames are preserved exactly.
   All photographs are stored in the /images/ folder.
   ========================================================= */

/* 1. EXACT IMAGE FILES */

const photoData = {
  church: [
    { name: 'PecahTanah.jpeg', category: 'ceremony', label: 'Groundbreaking & blessing · Photo 1' },
    { name: 'PecahTanah2.jpeg', category: 'ceremony', label: 'Groundbreaking & blessing · Photo 2' },
    { name: 'PecahTanah3.jpeg', category: 'ceremony', label: 'Groundbreaking & blessing · Photo 3' },
    { name: 'PecahTanah4.jpeg', category: 'ceremony', label: 'Groundbreaking & blessing · Photo 4' },
    { name: 'PecahTanah5.jpeg', category: 'ceremony', label: 'Groundbreaking & blessing · Photo 5' },
    { name: 'PecahTanah6.jpeg', category: 'ceremony', label: 'Groundbreaking & blessing · Photo 6' },

    { name: 'Church.jpeg', category: 'ceremony', label: 'Church ceremony · Photo 1' },
    { name: 'Church2.jpeg', category: 'ceremony', label: 'Church ceremony · Photo 2' },
    { name: 'Church3.jpeg', category: 'ceremony', label: 'Church ceremony · Photo 3' },
    { name: 'Church4.jpeg', category: 'ceremony', label: 'Church ceremony · Photo 4' },
    { name: 'Church5.jpeg', category: 'ceremony', label: 'Church ceremony · Photo 5' },
    { name: 'Church6.jpeg', category: 'ceremony', label: 'Church ceremony · Photo 6' },

    { name: 'ChurchProgress.png', category: 'progress', label: 'Construction progress · Photo 1 · 29 Sep 2026' },
    { name: 'ChurchProgress2.png', category: 'progress', label: 'Construction progress · Photo 2 · 29 Sep 2026' },
    { name: 'ChurchProgress3.png', category: 'progress', label: 'Construction progress · Photo 3 · 29 Sep 2026' },
    { name: 'ChurchProgress4.png', category: 'progress', label: 'Construction progress · Photo 4 · 29 Sep 2026' }
  ],

  mosque: [
    { name: 'Masjid.jpg', category: 'visit', label: 'Site visit · Photo 1 · 3 Mar 2026' },
    { name: 'Masjid2.jpg', category: 'visit', label: 'Site visit · Photo 2 · 3 Mar 2026' },
    { name: 'Masjid3.jpg', category: 'visit', label: 'Site visit · Photo 3 · 3 Mar 2026' },

    { name: 'MasjidProgress.png', category: 'progress', label: 'Construction progress · Photo 1 · 4 Nov 2026' },
    { name: 'MasjidProgress2.png', category: 'progress', label: 'Construction progress · Photo 2 · 4 Nov 2026' },
    { name: 'MasjidProgress3.png', category: 'progress', label: 'Construction progress · Photo 3 · 4 Nov 2026' }
  ],

  mrp: [
    { name: 'MRP.jpg', category: 'mrp', label: 'Community presentation · Photo 1 · 26 Jun 2026' },
    { name: 'MRP2.jpg', category: 'mrp', label: 'Community presentation · Photo 2 · 26 Jun 2026' },
    { name: 'MRP3.jpg', category: 'mrp', label: 'Community presentation · Photo 3 · 26 Jun 2026' },
    { name: 'MRP4.jpg', category: 'mrp', label: 'Community presentation · Photo 4 · 26 Jun 2026' }
  ]
};


/* 2. IMAGE PATH */

function getImagePath(filename) {
  return 'images/' + filename;
}


/* 3. IMAGE LOADER */

function loadImage(img, filename, onMissing) {
  const imagePath = getImagePath(filename);

  img.onerror = function () {
    img.onerror = null;

    if (typeof onMissing === 'function') {
      onMissing(imagePath);
    }
  };

  img.src = imagePath;
}


/* 4. GALLERY LIGHTBOX VARIABLES */

let activePhotos = [];
let activeIndex = 0;


/* 5. OPEN PHOTO */

function openPhoto(group, index) {
  const selectedPhoto = photoData[group][index];

  if (!selectedPhoto || selectedPhoto.missing) {
    return;
  }

  activePhotos = photoData[group].filter(photo => !photo.missing);

  activeIndex = activePhotos.findIndex(
    photo => photo.name === selectedPhoto.name
  );

  if (activeIndex < 0) {
    return;
  }

  const box = document.getElementById('lightbox');

  box.classList.add('open');
  box.setAttribute('aria-hidden', 'false');

  document.body.style.overflow = 'hidden';

  showPhoto();
}


/* 6. DISPLAY SELECTED PHOTO */

function showPhoto() {
  const photo = activePhotos[activeIndex];

  if (!photo) {
    return;
  }

  const img = document.getElementById('lbImg');

  document.getElementById('lbTitle').textContent = photo.label;

  document.getElementById('lbCount').textContent =
    `${activeIndex + 1} / ${activePhotos.length}`;

  loadImage(img, photo.name, function () {
    img.alt = 'Unable to load image: ' + photo.name;
  });

  img.alt = photo.label;
}


/* 7. PREVIOUS / NEXT PHOTO */

function movePhoto(step) {
  if (!activePhotos.length) {
    return;
  }

  activeIndex =
    (activeIndex + step + activePhotos.length) % activePhotos.length;

  showPhoto();
}


/* 8. CLOSE LIGHTBOX */

function closePhoto() {
  const box = document.getElementById('lightbox');

  if (!box) {
    return;
  }

  box.classList.remove('open');
  box.setAttribute('aria-hidden', 'true');

  document.body.style.overflow = '';
}


/* 9. BUILD PROJECT GALLERIES */

for (const group of Object.keys(photoData)) {
  const gallery = document.getElementById(`gallery-${group}`);

  if (!gallery) {
    console.error(`Gallery container not found: gallery-${group}`);
    continue;
  }

  photoData[group].forEach((photo, index) => {
    const button = document.createElement('button');

    button.className = 'photo';
    button.type = 'button';
    button.dataset.category = photo.category;
    button.setAttribute('aria-label', `View ${photo.label}`);

    const figure = document.createElement('figure');

    const img = document.createElement('img');

    img.loading = 'lazy';
    img.alt = photo.label;

    loadImage(img, photo.name, function (imagePath) {
      photo.missing = true;

      const missing = document.createElement('div');

      missing.className = 'missing';
      missing.textContent = `Image not found: ${photo.name}`;

      missing.title = `Expected image path: ${imagePath}`;

      img.replaceWith(missing);

      console.error('Image failed to load:', imagePath);
    });

    const caption = document.createElement('figcaption');

    caption.textContent = photo.label;

    figure.append(img, caption);
    button.append(figure);

    button.addEventListener('click', function () {
      openPhoto(group, index);
    });

    gallery.append(button);
  });
}


/* 10. GALLERY FILTERS */

document.querySelectorAll('.filters').forEach(bar => {
  bar.addEventListener('click', event => {
    const button = event.target.closest('button[data-filter]');

    if (!button) {
      return;
    }

    bar.querySelectorAll('button').forEach(item => {
      item.classList.toggle('active', item === button);
    });

    const group = bar.dataset.gallery;

    document.querySelectorAll(`#gallery-${group} .photo`).forEach(photo => {
      photo.hidden =
        button.dataset.filter !== 'all' &&
        photo.dataset.category !== button.dataset.filter;
    });
  });
});


/* 11. LIGHTBOX BUTTONS */

const closeButton = document.getElementById('lbClose');
const previousButton = document.getElementById('lbPrev');
const nextButton = document.getElementById('lbNext');
const lightbox = document.getElementById('lightbox');

if (closeButton) {
  closeButton.addEventListener('click', closePhoto);
}

if (previousButton) {
  previousButton.addEventListener('click', () => movePhoto(-1));
}

if (nextButton) {
  nextButton.addEventListener('click', () => movePhoto(1));
}

if (lightbox) {
  lightbox.addEventListener('click', event => {
    if (event.target.id === 'lightbox') {
      closePhoto();
    }
  });
}


/* 12. KEYBOARD NAVIGATION */

document.addEventListener('keydown', event => {
  if (event.key === 'Escape') {
    closePhoto();
  }

  if (lightbox && lightbox.classList.contains('open')) {
    if (event.key === 'ArrowLeft') {
      movePhoto(-1);
    }

    if (event.key === 'ArrowRight') {
      movePhoto(1);
    }
  }
});


/* 13. PRESENTATION MODE */

const presentButton = document.getElementById('present');

if (presentButton) {
  presentButton.addEventListener('click', () => {
    document.body.classList.toggle('presentation');

    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.();
    }
  });
}


/* 14. MOBILE NAVIGATION */

const menuButton = document.getElementById('menu');
const mainNav = document.querySelector('.main-nav');

if (menuButton && mainNav) {
  menuButton.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  document.querySelectorAll('.main-nav a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
    });
  });
}


/* 15. HERO IMAGE */

const hero = document.getElementById('heroImage');

if (hero) {
  const heroImage = new Image();

  heroImage.onload = function () {
    hero.style.backgroundImage = `url("${getImagePath('ChurchProgress.png')}")`;
  };

  loadImage(heroImage, 'ChurchProgress.png', function () {
    const fallback = new Image();

    fallback.onload = function () {
      hero.style.backgroundImage =
        `url("${getImagePath('MasjidProgress.png')}")`;
    };

    loadImage(fallback, 'MasjidProgress.png', function () {
      console.error('Hero and fallback images could not be loaded.');
    });
  });
}


/* 16. OVERVIEW PROJECT THUMBNAILS */

const previewImages = [
  ['church', 'ChurchProgress.png'],
  ['mosque', 'MasjidProgress.png'],
  ['mrp', 'MRP.jpg']
];

previewImages.forEach(([group, filename]) => {
  const element = document.querySelector(`[data-preview="${group}"]`);

  if (!element) {
    return;
  }

  const image = new Image();

  image.onload = function () {
    element.style.backgroundImage =
      `url("${getImagePath(filename)}")`;
  };

  loadImage(image, filename, function (imagePath) {
    console.error('Preview image failed to load:', imagePath);
  });
});


/* 17. IMAGE PATH CHECK — CONSOLE */

console.info('Sebauh Progress gallery initialised.');

console.info(
  'Total configured project images:',
  Object.values(photoData).reduce((total, photos) => total + photos.length, 0)
);
