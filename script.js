document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('darkModeToggle');
  const body = document.body;

  // Appliquer la préférence si elle existe
  if (localStorage.getItem('darkMode') === 'enabled') {
    body.classList.add('dark-mode');
  } else {
    body.classList.remove('dark-mode');
  }

  toggle.addEventListener('click', () => {
    if (body.classList.contains('dark-mode')) {
      body.classList.remove('dark-mode');
      localStorage.setItem('darkMode', 'disabled');
    } else {
      body.classList.add('dark-mode');
      localStorage.setItem('darkMode', 'enabled');
    }
  });

  // Animation fade-in au scroll avec IntersectionObserver
  const faders = document.querySelectorAll('.fade-in');

  if ('IntersectionObserver' in window) {
    const appearOptions = {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    };

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      });
    }, appearOptions);

    faders.forEach(fader => appearOnScroll.observe(fader));
  } else {
    // Fallback si IntersectionObserver pas supporté
    faders.forEach(fader => fader.classList.add('visible'));
  }
});
