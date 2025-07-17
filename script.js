// 🌗 Changement de thème clair/sombre
document.getElementById("toggle-theme").addEventListener("click", () => {
  document.body.classList.toggle("dark");
});

// 📊 Compteur global avec countapi.xyz
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
