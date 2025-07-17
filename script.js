// Dark/Light mode toggle avec changement d'icône
const toggleBtn = document.getElementById("toggle-theme");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Initialiser l'icône thème
document.addEventListener("DOMContentLoaded", () => {
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Compteur de visites global via countapi.xyz
document.addEventListener("DOMContentLoaded", () => {
  const countEl = document.getElementById("visitor-count");
  const lastVisit = localStorage.getItem("lastVisit");
  const now = new Date().toDateString();

  if (lastVisit !== now) {
    fetch('https://api.countapi.xyz/update/louis-lallement/visites/?amount=1')
      .then(res => res.json())
      .then(data => {
        countEl.textContent = `Visites : ${data.value}`;
        localStorage.setItem("lastVisit", now);
      });
  } else {
    fetch('https://api.countapi.xyz/get/louis-lallement/visites/')
      .then(res => res.json())
      .then(data => {
        countEl.textContent = `Visites : ${data.value}`;
      });
  }
});

// Switch langue FR/EN
const langToggleBtn = document.getElementById("lang-toggle");
langToggleBtn.addEventListener("click", () => {
  const isFR = langToggleBtn.textContent === "🇫🇷";
  if(isFR) {
    // Passer à anglais
    document.querySelectorAll(".lang.fr").forEach(el => el.style.display = "none");
    document.querySelectorAll(".lang.en").forEach(el => el.style.display = "inline");
    langToggleBtn.textContent = "🇬🇧";
  } else {
    // Passer à français
    document.querySelectorAll(".lang.en").forEach(el => el.style.display = "none");
    document.querySelectorAll(".lang.fr").forEach(el => el.style.display = "inline");
    langToggleBtn.textContent = "🇫🇷";
  }
});
