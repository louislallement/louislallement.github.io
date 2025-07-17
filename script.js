// Gestion du mode clair/sombre
const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark');
    toggleThemeBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    toggleThemeBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

// Chargement du thème sauvegardé
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

toggleThemeBtn.addEventListener('click', () => {
  const newTheme = body.classList.contains('dark') ? 'light' : 'dark';
  setTheme(newTheme);
});

// Gestion du changement de langue FR/EN
const langFrBtn = document.getElementById('lang-fr');
const langEnBtn = document.getElementById('lang-en');
const elementsToTranslate = document.querySelectorAll('[data-fr]');

function setLanguage(lang) {
  elementsToTranslate.forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
  if (lang === 'fr') {
    langFrBtn.classList.add('active');
    langEnBtn.classList.remove('active');
  } else {
    langEnBtn.classList.add('active');
    langFrBtn.classList.remove('active');
  }
  localStorage.setItem('language', lang);
}

// Chargement de la langue sauvegardée ou par défaut français
const savedLang = localStorage.getItem('language') || 'fr';
setLanguage(savedLang);

langFrBtn.addEventListener('click', () => setLanguage('fr'));
langEnBtn.addEventListener('click', () => setLanguage('en'));

// Effet de translation sur les tuiles au hover (plus accentué)
const tuiles = document.querySelectorAll('.tuile');
tuiles.forEach(tuile => {
  tuile.addEventListener('mousemove', e => {
    const rect = tuile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const rotateX = ((y - midY) / midY) * 8; // accentué
    const rotateY = ((x - midX) / midX) * 8;
    tuile.style.transform = `perspective(500px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.07)`;
    tuile.style.boxShadow = `0 20px 40px rgba(0, 0, 0, 0.25)`;
  });
  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = '';
    tuile.style.boxShadow = '';
  });
});

// Gestion compteur visite (exemple simplifié)
// Ce compteur doit être lié à un vrai backend ou service (Matomo, Google Analytics, etc.)
// Ici, on simule avec localStorage juste pour démonstration, mais ça compte localement (pas global)
const visitorCountEl = document.getElementById('visitor-count');
let visits = localStorage.getItem('visits') || 0;
visits = Number(visits) + 1;
localStorage.setItem('visits', visits);
visitorCountEl.textContent = `Visites : ${visits}`;
