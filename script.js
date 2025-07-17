// Mode sombre
const toggleBtn = document.getElementById('toggle-darkmode');
toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
});

// Changement de langue (basique)
const langBtn = document.getElementById('toggle-lang');
langBtn.addEventListener('click', () => {
  const lang = document.documentElement.lang;
  document.documentElement.lang = lang === 'fr' ? 'en' : 'fr';
  location.reload(); // ou gérer dynamiquement plus tard
});
