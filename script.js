// Gestion thème jour/nuit et stockage local
const toggleThemeBtn = document.getElementById('toggle-theme');
const themeIcon = document.getElementById('theme-icon');

function setTheme(theme) {
  if (theme === 'dark') {
    document.body.classList.add('dark');
    themeIcon.textContent = '🌙';
  } else {
    document.body.classList.remove('dark');
    themeIcon.textContent = '🌞';
  }
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  const current = localStorage.getItem('theme') || 'light';
  if (current === 'light') {
    setTheme('dark');
  } else {
    setTheme('light');
  }
}

toggleThemeBtn.addEventListener('click', toggleTheme);

// Charger le thème sauvegardé ou par défaut
document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  setTheme(savedTheme);
  // Langue
  const btnFr = document.getElementById('btn-fr');
  const btnEn = document.getElementById('btn-en');

  function setLanguage(lang) {
    const elements = document.querySelectorAll('[data-fr]');
    elements.forEach(el => {
      el.textContent = el.getAttribute(`data-${lang}`);
    });
    localStorage.setItem('lang', lang);
    if(lang === 'fr'){
      btnFr.classList.add('active');
      btnEn.classList.remove('active');
    } else {
      btnFr.classList.remove('active');
      btnEn.classList.add('active');
    }
  }

  btnFr.addEventListener('click', () => setLanguage('fr'));
  btnEn.addEventListener('click', () => setLanguage('en'));

  const savedLang = localStorage.getItem('lang') || 'fr';
  setLanguage(savedLang);
});
