document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

function setLanguage(lang) {
  // Pour l'instant, juste un message
  alert("Langue changée : " + lang);
}
