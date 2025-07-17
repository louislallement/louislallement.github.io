// Dark mode toggle
const themeBtn = document.getElementById('toggle-theme');
themeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  themeBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Language toggle (simple switch between FR and EN)
const langBtn = document.getElementById('toggle-lang');
const flagIcon = document.getElementById('flag-icon');

langBtn.addEventListener('click', () => {
  const currentLang = document.documentElement.lang;
  if (currentLang === 'fr') {
    document.documentElement.lang = 'en';
    flagIcon.src = 'assets/gb-flag.png';
    flagIcon.alt = 'English';
    // Ici tu peux ajouter une fonction pour changer le contenu en anglais
    alert('Language switch to English - please reload to see changes.');
  } else {
    document.documentElement.lang = 'fr';
    flagIcon.src = 'assets/fr-flag.png';
    flagIcon.alt = 'Français';
    alert('Changement de langue vers le français - veuillez recharger pour voir les modifications.');
  }
});
