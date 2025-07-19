document.addEventListener('DOMContentLoaded', () => {
  // Fade-in au scroll
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => {
    appearOnScroll.observe(fader);
  });

  // Toggle dark mode
  const toggleBtn = document.getElementById('theme-toggle');
  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });

  // Charger thème sauvegardé
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
  }
});
