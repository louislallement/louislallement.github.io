// Toggle mode jour/nuit avec sauvegarde dans localStorage
const toggleBtn = document.getElementById('mode-toggle');
const body = document.body;

function setMode(dark) {
  if (dark) {
    body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    toggleBtn.textContent = '🌙';
  }
  localStorage.setItem('darkMode', dark ? 'true' : 'false');
}

toggleBtn.addEventListener('click', () => {
  const isDark = body.classList.contains('dark');
  setMode(!isDark);
});

// Au chargement, on applique le mode sauvegardé ou par défaut jour
window.addEventListener('DOMContentLoaded', () => {
  const darkModeStored = localStorage.getItem('darkMode');
  setMode(darkModeStored === 'true');

  // Animation fade-in des tuiles
  const tiles = document.querySelectorAll('.tile[data-anim]');
  tiles.forEach((tile, i) => {
    setTimeout(() => {
      tile.classList.add('visible');
    }, i * 250);
  });
});
