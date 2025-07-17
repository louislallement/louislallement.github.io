// Mode jour/nuit + changement langue

const toggleThemeBtn = document.getElementById("toggle-theme");
const btnFr = document.getElementById("btn-fr");
const btnEn = document.getElementById("btn-en");

const body = document.body;

function setTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    toggleThemeBtn.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    toggleThemeBtn.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
}

function toggleTheme() {
  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  setTheme(currentTheme === "dark" ? "light" : "dark");
}

toggleThemeBtn.addEventListener("click", toggleTheme);

// Load theme from localStorage or system preference
const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  setTheme(savedTheme);
} else {
  // If no preference, detect system preference
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  setTheme(prefersDark ? "dark" : "light");
}

// Language switcher
function setLanguage(lang) {
  const elements = document.querySelectorAll("[data-lang-fr]");
  elements.forEach((el) => {
    if (lang === "fr") {
      el.textContent = el.getAttribute("data-lang-fr");
    } else {
      el.textContent = el.getAttribute("data-lang-en");
    }
  });
  localStorage.setItem("language", lang);
}

btnFr.addEventListener("click", () => setLanguage("fr"));
btnEn.addEventListener("click", () => setLanguage("en"));

const savedLang = localStorage.getItem("language");
if (savedLang) {
  setLanguage(savedLang);
} else {
  setLanguage("fr");
}

// Visitor count simulation (replace with real backend tracking)
const visitorCountEl = document.getElementById("visitor-count");
let visitorCount = parseInt(localStorage.getItem("visitorCount")) || 0;
visitorCount++;
localStorage.setItem("visitorCount", visitorCount);
visitorCountEl.textContent = `Visites : ${visitorCount}`;
