// Animation fade-in au scroll (garde ce que tu as déjà)
document.addEventListener("DOMContentLoaded", () => {
  const faders = document.querySelectorAll(".fade-in");

  if (!("IntersectionObserver" in window)) {
    faders.forEach(el => el.classList.add("visible"));
    return;
  }

  const appearOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px"
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(el => {
    appearOnScroll.observe(el);
  });
});

// Dark mode toggle
window.addEventListener('load', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Appliquer la préférence au chargement
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
  }

  toggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');

    if (body.classList.contains('dark-mode')) {
      localStorage.setItem('darkMode', 'enabled');
    } else {
      localStorage.removeItem('darkMode');
    }
  });
});
