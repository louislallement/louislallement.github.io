document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("mode-toggle");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const body = document.body;

  if (prefersDark) {
    body.classList.add("dark");
  }

  toggle.addEventListener("click", () => {
    body.classList.toggle("dark");
  });

  // Animation on scroll
  const faders = document.querySelectorAll('.fade-in');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("appear");
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1
  });

  faders.forEach(el => observer.observe(el));
});
