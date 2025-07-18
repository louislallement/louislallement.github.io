// Mode jour/nuit
const toggleThemeBtn = document.getElementById("toggle-theme");

function applyTheme(theme) {
  if(theme === "dark"){
    document.body.classList.add("dark-mode");
    toggleThemeBtn.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    toggleThemeBtn.textContent = "🌙";
  }
  localStorage.setItem("theme", theme);
}

toggleThemeBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  applyTheme(isDark ? "light" : "dark");
});

// Langues FR/EN
const translations = {
  fr: {
    bonjourTitle: "Bonjour",
    bonjourDesc: "Actuellement à Paris et alentours",
    portfolioVideoTitle: "Portfolio Vidéo",
    portfolioEcritTitle: "Portfolio Écrit",
    photographieTitle: "Photographie",
    photographieText: "Suivez-moi sur Instagram",
    contactTitle: "Contact",
    formNom: "Nom :",
    formPrenom: "Prénom :",
    formEmail: "Email :",
    formMessage: "Message :",
    formSubmit: "Envoyer"
  },
  en: {
    bonjourTitle: "Hello",
    bonjourDesc: "Currently in Paris and surroundings",
    portfolioVideoTitle: "Video Portfolio",
    portfolioEcritTitle: "Written Portfolio",
    photographieTitle: "Photography",
    photographieText: "Follow me on Instagram",
    contactTitle: "Contact",
    formNom: "Last name:",
    formPrenom: "First name:",
    formEmail: "Email:",
    formMessage: "Message:",
    formSubmit: "Send"
  }
};

function setLanguage(lang) {
  document.querySelector("#bonjour h2").textContent = translations[lang].bonjourTitle;
  document.querySelector("#bonjour p").textContent = translations[lang].bonjourDesc;
  document.querySelector("#portfolio-video h2").textContent = translations[lang].portfolioVideoTitle;
  document.querySelector("#portfolio-ecrit h2").textContent = translations[lang].portfolioEcritTitle;
  document.querySelector("#photographie h2")?.remove(); // retirer ancien titre si présent
  // On crée un titre dynamique photographie car ici texte est dans overlay
  const photoSection = document.getElementById("photographie");
  let h2Photo = photoSection.querySelector("h2");
  if(!h2Photo){
    h2Photo = document.createElement("h2");
    photoSection.insertBefore(h2Photo, photoSection.firstChild);
  }
  h2Photo.textContent = translations[lang].photographieTitle;
  document.querySelector("#photographie .photo-overlay span").textContent = translations[lang].photographieText;
  document.querySelector("#contact h2").textContent = translations[lang].contactTitle;
  document.querySelector("label[for=nom]").textContent = translations[lang].formNom;
  document.querySelector("label[for=prenom]").textContent = translations[lang].formPrenom;
  document.querySelector("label[for=email]").textContent = translations[lang].formEmail;
  document.querySelector("label[for=message]").textContent = translations[lang].formMessage;
  document.querySelector("form button[type=submit]").textContent = translations[lang].formSubmit;

  localStorage.setItem("lang", lang);
}

document.querySelectorAll(".lang-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    setLanguage(btn.getAttribute("data-lang"));
  });
});

// Initialisation thème & langue
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  const savedLang = localStorage.getItem("lang") || "fr";
  setLanguage(savedLang);
});

// Photo Instagram cliquable
document.getElementById("photographie").addEventListener("click", () => {
  window.open("https://www.instagram.com/louis.lallement/", "_blank");
});

// Compteur de visites (simple, localStorage)
const visitorCountElem = document.getElementById("visitor-count");
if(visitorCountElem){
  let count = localStorage.getItem("visitorCount") || 0;
  count = parseInt(count) + 1;
  localStorage.setItem("visitorCount", count);
  visitorCountElem.textContent = `Visites : ${count}`;
}
