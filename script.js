function toggleTheme() {
  document.body.classList.toggle('dark-mode');
}

function setLang(lang) {
  alert("Langue changée en : " + (lang === 'fr' ? 'Français' : 'Anglais'));
}
