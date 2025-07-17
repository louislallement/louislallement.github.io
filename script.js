document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const flag = document.getElementById("flag");

  // Gérer thème clair/sombre
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  // Gérer changement de langue FR/EN
  langToggle.addEventListener("click", () => {
    const isFrench = flag.src.includes("fr.png");
    flag.src = isFrench ? "gb.png" : "fr.png";
    flag.alt = isFrench ? "English" : "Français";

    document.querySelector("h2").textContent = isFrench
      ? "Journalist | Photographer"
      : "Journaliste | Photographe";

    document.querySelector(".intro p").textContent = isFrench
      ? "Currently in Paris and nearby"
      : "Actuellement à Paris et alentours";

    document.querySelector("#portfolio-video h3").textContent = isFrench
      ? "Video Portfolio"
      : "Portfolio Vidéo";

    document.querySelector("#portfolio-ecrit h3").textContent = isFrench
      ? "Written Portfolio"
      : "Portfolio Écrit";

    document.querySelector("#photographie h3").textContent = isFrench
      ? "Photography"
      : "Photographie";

    document.querySelector("#photographie .insta-link").textContent = isFrench
      ? "Follow me on Instagram"
      : "Suivez-moi sur Instagram";
  });

  // Compteur de visites basique (localStorage)
  const visitCounter = document.getElementById("visit-counter");
  let visits = parseInt(localStorage.getItem("visits") || "0", 10) + 1;
  localStorage.setItem("visits", visits);
  visitCounter.textContent = visits;
});
