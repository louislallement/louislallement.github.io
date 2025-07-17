const toggleBtn = document.getElementById("toggle-theme");
const langToggleBtn = document.getElementById("lang-toggle");
const flagIcon = document.getElementById("flag-icon");

// Mode jour/nuit
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

document.addEventListener("DOMContentLoaded", () => {
  toggleBtn.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Compteur visites global via countapi.xyz
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

// Switch langue avec changement de drapeau
langToggleBtn.addEventListener("click", () => {
  const isFR = langToggleBtn.querySelector("img").src.includes("/fr.png");
  if (isFR) {
    // Passer à anglais
    document.querySelectorAll(".lang.fr").forEach(el => el.style.display = "none");
    document.querySelectorAll(".lang.en").forEach(el => el.style.display = "inline");
    flagIcon.src = "https://flagcdn.com/w20/gb.png";
    flagIcon.alt = "English";
  } else {
    // Passer à français
    document.querySelectorAll(".lang.en").forEach(el => el.style.display = "none");
    document.querySelectorAll(".lang.fr").forEach(el => el.style.display = "inline");
    flagIcon.src = "https://flagcdn.com/w20/fr.png";
    flagIcon.alt = "Français";
  }
});
