// LANGUES
const langFrBtn = document.getElementById('btn-fr');
const langEnBtn = document.getElementById('btn-en');

function setLanguage(lang) {
  const elements = document.querySelectorAll('[data-lang-fr]');
  elements.forEach(el => {
    const text = el.getAttribute(lang === 'fr' ? 'data-lang-fr' : 'data-lang-en');
    if (text) el.textContent = text;
  });
  localStorage.setItem('language', lang);
}

langFrBtn.addEventListener('click', () => setLanguage('fr'));
langEnBtn.addEventListener('click', () => setLanguage('en'));

// Initialisation langue au chargement
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'fr';
  setLanguage(savedLang);
});

// MODE JOUR / NUIT
const toggleThemeBtn = document.getElementById('toggle-theme');

function setTheme(theme) {
  if (theme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    toggleThemeBtn.textContent = '☀️';
  } else {
    document.documentElement.removeAttribute('data-theme');
    toggleThemeBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

toggleThemeBtn.addEventListener('click', () => {
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
});

// Initialisation thème au chargement
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
});
