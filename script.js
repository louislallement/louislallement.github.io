// Basculer le mode clair / sombre

const toggleBtn = document.getElementById('mode-toggle');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  if(document.body.classList.contains('dark')) {
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }
});

// Initialise le bouton au chargement
window.addEventListener('DOMContentLoaded', () => {
  if(document.body.classList.contains('dark')) {
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }
});
