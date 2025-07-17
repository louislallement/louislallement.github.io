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

document.addEventListener('DOMContentLoaded', () => {
  const savedTheme = localStorage.getItem('theme');
  if(savedTheme) {
    applyTheme(savedTheme);
  } else {
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    applyTheme(prefersDark ? 'dark' : 'light');
  }
});

toggleBtn.addEventListener('click', () => {
  const current = document.body.classList.contains('dark') ? 'dark' : 'light';
  const next = current === 'light' ? 'dark' : 'light';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

// Simple compteur visite localStorage
const visitorCountEl = document.getElementById('visitor-count');
let visits = parseInt(localStorage.getItem('visits') || '0', 10);
visits++;
localStorage.setItem('visits', visits);
visitorCountEl.textContent = `Visites : ${visits}`;
