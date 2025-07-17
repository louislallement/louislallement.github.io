// Mode clair/sombre
const toggle = document.getElementById("mode-toggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

// Langue
document.getElementById("lang-fr").addEventListener("click", () => {
  alert("Passage au français (simulation)");
});

document.getElementById("lang-en").addEventListener("click", () => {
  alert("Switch to English (simulation)");
});
