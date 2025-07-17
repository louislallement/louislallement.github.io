// Toggle mode jour/nuit
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;

  // Création d'un bouton toggle en haut à droite
  const toggleBtn = document.createElement('button');
  toggleBtn.textContent = '🌙 / ☀️';
  toggleBtn.setAttribute('aria-label', 'Basculer mode jour/nuit');
  toggleBtn.style.position = 'fixed';
  toggleBtn.style.top = '15px';
  toggleBtn.style.right = '15px';
  toggleBtn.style.padding = '8px 12px';
  toggleBtn.style.borderRadius = '8px';
  toggleBtn.style.border = 'none';
  toggleBtn.style.cursor = 'pointer';
  toggleBtn.style.backgroundColor = '#4a90e2';
  toggleBtn.style.color = '#fff';
  toggleBtn.style.fontSize = '1.1rem';
  toggleBtn.style.zIndex = '1000';
  toggleBtn.style.boxShadow = '0 3px 10px rgba(74,144,226,0.5)';

  document.body.appendChild(toggleBtn);

  // Charger la préférence stockée en localStorage
  if(localStorage.getItem('theme') === 'night') {
    body.classList.add('night');
  }

  // Basculer thème
  toggleBtn.addEventListener('click', () => {
    body.classList.toggle('night');

    if(body.classList.contains('night')) {
      localStorage.setItem('theme', 'night');
    } else {
      localStorage.setItem('theme', 'day');
    }
  });
});
