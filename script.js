// Mode sombre / clair
const toggleBtn = document.getElementById("theme-toggle");
toggleBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
  toggleBtn.textContent =
    document.body.classList.contains("dark-mode") ? "☀️" : "🌙";
});

// Bascule langue (placeholder)
document.getElementById("fr-btn").addEventListener("click", () => {
  alert("🇫🇷 Mode français activé !");
});

document.getElementById("en-btn").addEventListener("click", () => {
  alert("🇬🇧 English mode coming soon!");
});
