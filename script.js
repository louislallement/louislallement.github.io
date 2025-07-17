// Mode jour/nuit
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    themeToggle.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    themeToggle.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

// Initialisation
const savedTheme = localStorage.getItem('theme') || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
setTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(newTheme);
});

// Langues (simple bascule FR/EN)
const langFlags = document.querySelectorAll('.lang-flag');
langFlags.forEach(flag => {
  flag.addEventListener('click', () => {
    langFlags.forEach(f => f.classList.remove('selected'));
    flag.classList.add('selected');
    const lang = flag.id;
    // Ici tu pourras ajouter la logique pour changer le texte en fonction de la langue
    // Pour l'instant on affiche juste une alerte
    alert(lang === 'fr' ? 'Version française activée' : 'English version activated');
  });
});

// Effet léger sur tuiles au survol
const tuiles = document.querySelectorAll('.tuile');
tuiles.forEach(tuile => {
  tuile.addEventListener('mousemove', e => {
    const rect = tuile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 5; // angle plus faible
    const rotateY = ((x - centerX) / centerX) * 5;

    tuile.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = 'translateY(0)';
  });
});
