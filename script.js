document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const langToggle = document.getElementById("lang-toggle");
  const flag = document.getElementById("flag");

  // Theme
  themeToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark");
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
  });

  // Language
  langToggle.addEventListener("click", () => {
    const isFr = flag.src.includes("fr.png");
    flag.src = isFr ? "gb.png" : "fr.png";
    flag.alt = isFr ? "English" : "Français";
    // Change text if needed (simple example)
    document.querySelector("h2").textContent = isFr ? "Journalist | Photographer" : "Journaliste | Photographe";
    document.querySelector(".intro p").textContent = isFr
      ? "Currently in Paris and nearby"
      : "Actuellement à Paris et alentours";
    document.querySelector("#photo .insta-link").textContent = isFr
      ? "Follow me on Instagram"
      : "Suivez-moi sur Instagram";
    document.querySelector("#written h3").textContent = isFr ? "Written Portfolio" : "Portfolio Écrit";
    document.querySelector("#video h3").textContent = isFr ? "Video Portfolio" : "Portfolio Vidéo";
    document.querySelector("#photo h3").textContent = isFr ? "Photography" : "Photographie";
  });

  // Visits (demo)
  const visitEl = document.getElementById("visit-counter");
  let visits = parseInt(localStorage.getItem("visits") || "0", 10) + 1;
  localStorage.setItem("visits", visits);
  visitEl.textContent = visits;
});
