// Thème jour/nuit avec toggle et sauvegarde localStorage
const toggleBtn = document.getElementById('toggle-theme');

function applyTheme(theme) {
  if(theme === 'dark') {
    document.body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  } else {
    document.body.classList.remove('dark');
    toggleBtn.textContent = '🌙';
  }
}

toggleBtn.addEventListener('click', () => {
  const current = localStorage.getItem('theme') || 'light';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// Charger thème au démarrage
applyTheme(localStorage.getItem('theme') || 'light');

// Compteur simple de visites (localStorage)
const visitorCountEl = document.getElementById('visitor-count');
let visits = parseInt(localStorage.getItem('visits') || '0', 10);
visits++;
localStorage.setItem('visits', visits);
visitorCountEl.textContent = `Visites : ${visits}`;
