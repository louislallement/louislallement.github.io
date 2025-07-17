// Dark/Light theme toggle
const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

function setTheme(theme) {
  if (theme === 'dark') {
    body.classList.add('dark-theme');
    toggleThemeBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark-theme');
    toggleThemeBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

// Initial load theme
const savedTheme = localStorage.getItem('theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
setTheme(savedTheme);

toggleThemeBtn.addEventListener('click', () => {
  const newTheme = body.classList.contains('dark-theme') ? 'light' : 'dark';
  setTheme(newTheme);
});

// Language switcher
const frFlag = document.getElementById('fr-flag');
const enFlag = document.getElementById('en-flag');

const translations = {
  fr: {
    bonjourTitle: 'Bonjour',
    bonjourText: 'Actuellement à Paris et alentours',
    portfolioVideoTitle: 'Portfolio Vidéo',
    portfolioEcritTitle: 'Portfolio Écrit',
    photographieTitle: 'Photographie',
    instagramText: 'Suivez-moi sur',
    instagramLinkText: 'Instagram',
    contactTitle: 'Contact',
    labelNom: 'Nom :',
    labelPrenom: 'Prénom :',
    labelEmail: 'Email :',
    labelMessage: 'Message :',
    submitBtn: 'Envoyer',
  },
  en: {
    bonjourTitle: 'Hello',
    bonjourText: 'Currently in Paris and surroundings',
    portfolioVideoTitle: 'Video Portfolio',
    portfolioEcritTitle: 'Written Portfolio',
    photographieTitle: 'Photography',
    instagramText: 'Follow me on',
    instagramLinkText: 'Instagram',
    contactTitle: 'Contact',
    labelNom: 'Last name:',
    labelPrenom: 'First name:',
    labelEmail: 'Email:',
    labelMessage: 'Message:',
    submitBtn: 'Send',
  },
};

function setLanguage(lang) {
  document.getElementById('bonjour-title').textContent = translations[lang].bonjourTitle;
  document.getElementById('bonjour-text').textContent = translations[lang].bonjourText;
  document.getElementById('portfolio-video-title').textContent = translations[lang].portfolioVideoTitle;
  document.getElementById('portfolio-ecrit-title').textContent = translations[lang].portfolioEcritTitle;
  document.getElementById('photographie-title').textContent = translations[lang].photographieTitle;
  document.querySelector('.instagram-text').firstChild.textContent = translations[lang].instagramText + ' ';
  const instaLink = document.querySelector('.instagram-text a');
  instaLink.textContent = translations[lang].instagramLinkText;
  document.getElementById('contact-title').textContent = translations[lang].contactTitle;
  document.getElementById('label-nom').textContent = translations[lang].labelNom;
  document.getElementById('label-prenom').textContent = translations[lang].labelPrenom;
  document.getElementById('label-email').textContent = translations[lang].labelEmail;
  document.getElementById('label-message').textContent = translations[lang].labelMessage;
  document.getElementById('submit-btn').textContent = translations[lang].submitBtn;

  if (lang === 'fr') {
    frFlag.classList.add('active');
    enFlag.classList.remove('active');
  } else {
    frFlag.classList.remove('active');
    enFlag.classList.add('active');
  }
  localStorage.setItem('language', lang);
}

frFlag.addEventListener('click', () => setLanguage('fr'));
enFlag.addEventListener('click', () => setLanguage('en'));

// Load saved language or default to French
const savedLang = localStorage.getItem('language') || 'fr';
setLanguage(savedLang);

// Visitor counter (simulate with localStorage for demo)
const visitorCountEl = document.getElementById('visitor-count');

async function fetchVisitorCount() {
  // Here you'd call your real visitor count API or service
  // For demo, we simulate with localStorage (not shared globally)
  let count = localStorage.getItem('visitorCount');
  if (!count) count = 0;
  count++;
  localStorage.setItem('visitorCount', count);
  visitorCountEl.textContent = `Visites : ${count}`;
}

fetchVisitorCount();

// Animation on tuiles: reduce max movement on hover
document.querySelectorAll('.tuile').forEach(tuile => {
  tuile.addEventListener('mousemove', e => {
    const rect = tuile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = (x - centerX) / centerX * 4; // max 4px movement instead of 8px
    const deltaY = (y - centerY) / centerY * 4;

    tuile.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
  });

  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = '';
  });
});
