// Mode jour/nuit
const toggleThemeBtn = document.getElementById('toggle-theme');
const htmlRoot = document.getElementById('html-root');
const iconMoon = "🌙";
const iconSun = "☀️";

// Langues
const langFrBtn = document.getElementById('lang-fr');
const langEnBtn = document.getElementById('lang-en');
let currentLang = 'fr';

// Texte FR / EN
const translations = {
  fr: {
    bonjourTitle: "Bonjour",
    bonjourText: "Actuellement à Paris et alentours",
    portfolioVideoTitle: "Portfolio Vidéo",
    portfolioEcritTitle: "Portfolio Écrit",
    photographieTitle: "Photographie",
    instagramText: "Suivez-moi sur Instagram",
    contactTitle: "Contact",
    contactPrenom: "Prénom :",
    contactNom: "Nom :",
    contactEmail: "Email :",
    contactMessage: "Message :",
    contactSend: "Envoyer",
  },
  en: {
    bonjourTitle: "Hello",
    bonjourText: "Currently in Paris and surroundings",
    portfolioVideoTitle: "Video Portfolio",
    portfolioEcritTitle: "Written Portfolio",
    photographieTitle: "Photography",
    instagramText: "Follow me on Instagram",
    contactTitle: "Contact",
    contactPrenom: "First Name:",
    contactNom: "Last Name:",
    contactEmail: "Email:",
    contactMessage: "Message:",
    contactSend: "Send",
  }
};

// Mise à jour du texte selon langue
function updateLanguage(lang) {
  currentLang = lang;
  // Boutons sélection
  langFrBtn.classList.toggle('selected', lang === 'fr');
  langEnBtn.classList.toggle('selected', lang === 'en');

  // Update textes
  document.querySelector('.tuile-bonjour h2').textContent = translations[lang].bonjourTitle;
  document.querySelector('.tuile-bonjour p').textContent = translations[lang].bonjourText;

  document.querySelector('#portfolio-video h2').textContent = translations[lang].portfolioVideoTitle;
  document.querySelector('#portfolio-ecrit h2').textContent = translations[lang].portfolioEcritTitle;
  document.querySelector('#photographie h2').textContent = translations[lang].photographieTitle;
  document.querySelector('.instagram-link').textContent = translations[lang].instagramText;

  document.querySelector('.tuile-contact h2').textContent = translations[lang].contactTitle;
  document.querySelector('label[for="prenom"]').textContent = translations[lang].contactPrenom;
  document.querySelector('label[for="nom"]').textContent = translations[lang].contactNom;
  document.querySelector('label[for="email"]').textContent = translations[lang].contactEmail;
  document.querySelector('label[for="message"]').textContent = translations[lang].contactMessage;
  document.querySelector('.tuile-contact button').textContent = translations[lang].contactSend;
}

// Initialiser la langue au chargement
updateLanguage('fr');

// Event listeners langue
langFrBtn.addEventListener('click', () => updateLanguage('fr'));
langEnBtn.addEventListener('click', () => updateLanguage('en'));

// Gestion du mode jour / nuit
function setTheme(dark) {
  if (dark) {
    htmlRoot.classList.add('dark');
    toggleThemeBtn.textContent = iconSun;
  } else {
    htmlRoot.classList.remove('dark');
    toggleThemeBtn.textContent = iconMoon;
  }
  localStorage.setItem('theme', dark ? 'dark' : 'light');
}

// Charger le thème stocké ou par défaut
const storedTheme = localStorage.getItem('theme');
if (storedTheme === 'dark') {
  setTheme(true);
} else {
  setTheme(false);
}

// Toggle bouton
toggleThemeBtn.addEventListener('click', () => {
  const darkActive = htmlRoot.classList.contains('dark');
  setTheme(!darkActive);
});

// Empêcher scroll horizontal sur mobile
document.body.style.overflowX = 'hidden';

// Simulation compteur visites (peut être remplacé par API)
const visitorCountEl = document.getElementById('visitor-count');
let visitorCount = localStorage.getItem('visitorCount') || 0;
visitorCount++;
localStorage.setItem('visitorCount', visitorCount);
visitorCountEl.textContent = `Visites : ${visitorCount}`;

// Animation hover légère sur tuiles (desktop)
const tuiles = document.querySelectorAll('.tuile, .tuile-bonjour, .tuile-contact');
tuiles.forEach(tuile => {
  tuile.addEventListener('mouseenter', () => {
    tuile.style.transform = 'translateY(-5px)';
    tuile.style.boxShadow = '0 14px 28px rgba(0,0,0,0.3)';
  });
  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = '';
    tuile.style.boxShadow = '';
  });
});
