// Small interactions for navigation, section reveals, and the back-to-top control.
const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');
const navigationLinks = [...document.querySelectorAll('.site-nav a')];
const topButton = document.querySelector('.to-top');
const projectFlipCard = document.querySelector('.project-proof');

function toggleProjectFlip() {
  const isFlipped = projectFlipCard.classList.toggle('is-flipped');
  projectFlipCard.setAttribute('aria-pressed', String(isFlipped));
  projectFlipCard.setAttribute('aria-label', isFlipped ? 'Acceptance Letter. Activate to return to the Fraud Detection project preview.' : 'Fraud Detection project preview. Activate to view the Acceptance Letter.');
}

projectFlipCard.addEventListener('click', (event) => {
  const supportsHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  // Use hover on a mouse/trackpad; use tap on touchscreens and click from assistive technology.
  if (!supportsHover || event.detail === 0) toggleProjectFlip();
});
projectFlipCard.addEventListener('pointerenter', (event) => {
  if (event.pointerType === 'mouse') {
    projectFlipCard.setAttribute('aria-pressed', 'true');
    projectFlipCard.setAttribute('aria-label', 'Acceptance Letter. Move the cursor away to return to the Fraud Detection project preview.');
  }
});
projectFlipCard.addEventListener('pointerleave', (event) => {
  if (event.pointerType === 'mouse' && !projectFlipCard.matches(':focus')) {
    projectFlipCard.setAttribute('aria-pressed', 'false');
    projectFlipCard.setAttribute('aria-label', 'Fraud Detection project preview. Hover to view the Acceptance Letter.');
  }
});
projectFlipCard.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    toggleProjectFlip();
  }
});

function closeMenu() {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open navigation');
  navigation.classList.remove('open');
}

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open navigation' : 'Close navigation');
  navigation.classList.toggle('open', !isOpen);
});

navigationLinks.forEach((link) => link.addEventListener('click', closeMenu));
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') closeMenu();
});

// Reveal content as it enters the screen. Keep it visible on older browsers.
const revealItems = document.querySelectorAll('.reveal, .slide-left, .slide-right, .pop-reveal');
['.timeline-item', '.cert-card', '.skill-group', '.project-card'].forEach((selector) => {
  document.querySelectorAll(selector).forEach((item, index) => {
    item.style.setProperty('--reveal-delay', `${index * 110}ms`);
  });
});
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}

// Mark the navigation link for the section currently in view.
const sections = navigationLinks
  .map((link) => document.querySelector(link.getAttribute('href')))
  .filter(Boolean);
if ('IntersectionObserver' in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navigationLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-25% 0px -60% 0px' });
  sections.forEach((section) => sectionObserver.observe(section));
}

window.addEventListener('scroll', () => {
  topButton.classList.toggle('visible', window.scrollY > 480);
}, { passive: true });
topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelector('#year').textContent = new Date().getFullYear();
