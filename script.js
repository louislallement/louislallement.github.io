// Mode jour/nuit toggle
const toggleThemeBtn = document.getElementById('toggle-theme');
const bodyEl = document.body;

function applyTheme(theme) {
  if (theme === 'dark') {
    bodyEl.classList.add('dark');
    toggleThemeBtn.textContent = '☀️';
  } else {
    bodyEl.classList.remove('dark');
    toggleThemeBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

toggleThemeBtn.addEventListener('click', () => {
  const isDark = bodyEl.classList.contains('dark');
  applyTheme(isDark ? 'light' : 'dark');
});

// Charger thème au démarrage
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  applyTheme(savedTheme);
} else {
  // Par défaut, mode clair
  applyTheme('light');
}

// Traduction FR/EN
const langButtons = document.querySelectorAll('.lang-btn');
const frElems = document.querySelectorAll('.fr');
const enElems = document.querySelectorAll('.en');

function applyLanguage(lang) {
  if (lang === 'en') {
    frElems.forEach(el => (el.style.display = 'none'));
    enElems.forEach(el => (el.style.display = 'block'));
  } else {
    frElems.forEach(el => (el.style.display = 'block'));
    enElems.forEach(el => (el.style.display = 'none'));
  }
  localStorage.setItem('lang', lang);
}

langButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const selectedLang = btn.getAttribute('data-lang');
    applyLanguage(selectedLang);
  });
});

// Charger langue au démarrage
const savedLang = localStorage.getItem('lang');
if (savedLang) {
  applyLanguage(savedLang);
} else {
  applyLanguage('fr'); // français par défaut
}

// Animation légère au hover/touch sur les tuiles
const tuiles = document.querySelectorAll('.tuile');

tuiles.forEach(tuile => {
  tuile.addEventListener('mouseenter', () => {
    tuile.style.transform = 'translateY(-8px)';
    tuile.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
  });
  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = '';
    tuile.style.boxShadow = '';
  });

  // Pour mobile : un petit effet au toucher
  tuile.addEventListener('touchstart', () => {
    tuile.style.transform = 'translateY(-8px)';
    tuile.style.boxShadow = '0 10px 25px rgba(0,0,0,0.3)';
  });
  tuile.addEventListener('touchend', () => {
    tuile.style.transform = '';
    tuile.style.boxShadow = '';
  });
});

// Compteur de visites simple (stocké localement)
const visitorCountEl = document.getElementById('visitor-count');
let visits = localStorage.getItem('visits') || 0;
visits++;
localStorage.setItem('visits', visits);
visitorCountEl.textContent = `Visites : ${visits}`;
