// -------- Mode sombre / jour --------
const toggleDarkMode = document.getElementById("toggle-dark");
const html = document.documentElement;

function setDarkMode(enabled) {
  if (enabled) {
    html.classList.add("dark");
    localStorage.setItem("theme", "dark");
  } else {
    html.classList.remove("dark");
    localStorage.setItem("theme", "light");
  }
}

// Appliquer le thème au chargement
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "dark") {
  setDarkMode(true);
} else {
  setDarkMode(false);
}

toggleDarkMode.addEventListener("click", () => {
  html.classList.toggle("dark");
  const isDark = html.classList.contains("dark");
  localStorage.setItem("theme", isDark ? "dark" : "light");
});

// -------- Switch langue FR / EN --------
const langFR = document.getElementById("lang-fr");
const langEN = document.getElementById("lang-en");

function setLanguage(lang) {
  document.querySelectorAll("[data-lang-fr], [data-lang-en]").forEach(el => {
    if (lang === "fr") {
      el.textContent = el.getAttribute("data-lang-fr");
    } else {
      el.textContent = el.getAttribute("data-lang-en");
    }
  });
  localStorage.setItem("lang", lang);
}

// Appliquer la langue au chargement
const savedLang = localStorage.getItem("lang") || "fr";
setLanguage(savedLang);

langFR.addEventListener("click", () => setLanguage("fr"));
langEN.addEventListener("click", () => setLanguage("en"));
