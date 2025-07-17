// Toggle mode clair / sombre
document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;

  // Créer un bouton toggle en haut à droite
  const toggleBtn = document.createElement("button");
  toggleBtn.textContent = "🌙";
  toggleBtn.style.position = "fixed";
  toggleBtn.style.top = "20px";
  toggleBtn.style.right = "20px";
  toggleBtn.style.padding = "10px 16px";
  toggleBtn.style.fontSize = "1.4rem";
  toggleBtn.style.border = "none";
  toggleBtn.style.borderRadius = "12px";
  toggleBtn.style.cursor = "pointer";
  toggleBtn.style.background = "var(--blue-light)";
  toggleBtn.style.color = "white";
  toggleBtn.style.zIndex = "9999";
  document.body.appendChild(toggleBtn);

  toggleBtn.addEventListener("click", () => {
    if (body.classList.contains("dark")) {
      body.classList.remove("dark");
      toggleBtn.textContent = "🌙";
      localStorage.setItem("theme", "light");
    } else {
      body.classList.add("dark");
      toggleBtn.textContent = "☀️";
      localStorage.setItem("theme", "dark");
    }
  });

  // Charger le thème sauvegardé
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }
});
