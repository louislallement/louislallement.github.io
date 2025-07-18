// Theme toggle with localStorage
const toggleThemeBtn = document.getElementById("toggle-theme");
const body = document.body;

function applyTheme(theme) {
  if (theme === "dark") {
    body.classList.add("dark");
    toggleThemeBtn.textContent = "☀️";
  } else {
    body.classList.remove("dark");
    toggleThemeBtn.textContent = "🌙";
  }
}

function getStoredTheme() {
  return localStorage.getItem("theme") || "light";
}

// Initialize theme on page load
applyTheme(getStoredTheme());

// Toggle theme button click
toggleThemeBtn.addEventListener("click", () => {
  const currentTheme = body.classList.contains("dark") ? "dark" : "light";
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  applyTheme(newTheme);
  localStorage.setItem("theme", newTheme);
});

// Language toggle
const langButtons = document.querySelectorAll(".lang-btn");
const texts = {
  fr: {
    bonjourTitle: "Bonjour",
    bonjourDesc: "Actuellement à Paris et alentours",
    portfolioVideo: "Portfolio vidéo",
    portfolioEcrit: "Portfolio écrit",
    photographie: "Photographie",
    followInstagram: "Suivez-moi sur Instagram",
    contact: "Contact",
    nom: "Nom :",
    prenom: "Prénom :",
    email: "Email :",
    message: "Message :",
    envoyer: "Envoyer",
    visiteCount: "Visites :",
  },
  en: {
    bonjourTitle: "Hello",
    bonjourDesc: "Currently in Paris and surroundings",
    portfolioVideo: "Video portfolio",
    portfolioEcrit: "Written portfolio",
    photographie: "Photography",
    followInstagram: "Follow me on Instagram",
    contact: "Contact",
    nom: "Last name:",
    prenom: "First name:",
    email: "Email:",
    message: "Message:",
    envoyer: "Send",
    visiteCount: "Visits:",
  },
};

function updateLanguage(lang) {
  document.querySelector(".tuile.bonjour h2").textContent = texts[lang].bonjourTitle;
  document.querySelector(".tuile.bonjour p").textContent = texts[lang].bonjourDesc;

  document.querySelector("#portfolio-video h2").textContent = texts[lang].portfolioVideo;
  document.querySelector("#portfolio-ecrit h2").textContent = texts[lang].portfolioEcrit;
  document.querySelector("#photographie h2").textContent = texts[lang].photographie;
  document.querySelector("#photographie .photo-overlay p").textContent = texts[lang].followInstagram;
  document.querySelector(".tuile.contact h2").textContent = texts[lang].contact;

  document.querySelector('label[for="nom"]').textContent = texts[lang].nom;
  document.querySelector('label[for="prenom"]').textContent = texts[lang].prenom;
  document.querySelector('label[for="email"]').textContent = texts[lang].email;
  document.querySelector('label[for="message"]').textContent = texts[lang].message;
  document.querySelector('button[type="submit"]').textContent = texts[lang].envoyer;

  // Visitor count label update
  updateVisitorCountText(lang);
}

// Set default lang
let currentLang = "fr";
updateLanguage(currentLang);

langButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const selectedLang = btn.dataset.lang;
    if (selectedLang !== currentLang) {
      currentLang = selectedLang;
      updateLanguage(currentLang);
    }
  });
});

// Visitor count (simple local storage counter)
const visitorCountEl = document.getElementById("visitor-count");
const visitorCountKey = "visitorCount";

function updateVisitorCountText(lang) {
  const baseText = texts[lang].visiteCount;
  visitorCountEl.textContent = `${baseText} ${localStorage.getItem(visitorCountKey) || 1}`;
}

function incrementVisitorCount() {
  let count = parseInt(localStorage.getItem(visitorCountKey) || "0", 10);
  count++;
  localStorage.setItem(visitorCountKey, count);
  updateVisitorCountText(currentLang);
}

incrementVisitorCount();
