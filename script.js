document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Appliquer la préférence stockée (si existe)
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  // Gestion du clic sur le bouton toggle
  toggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    } else {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    }
  });

  // Optionnel : animation fade-in au scroll (si tu l'as déjà)
  const faders = document.querySelectorAll(".fade-in");

  if ('IntersectionObserver' in window) {
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
  } else {
    // Fallback si IntersectionObserver pas dispo
    faders.forEach(el => el.classList.add("visible"));
  }
});
