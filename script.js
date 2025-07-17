// Dark/Light mode toggle
const toggleThemeBtn = document.getElementById('toggle-theme');
const body = document.body;

function setTheme(theme) {
  if(theme === 'dark') {
    body.classList.add('dark');
    toggleThemeBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    toggleThemeBtn.textContent = '🌙';
  }
  localStorage.setItem('theme', theme);
}

// Initial load theme
const savedTheme = localStorage.getItem('theme') || 'light';
setTheme(savedTheme);

toggleThemeBtn.addEventListener('click', () => {
  if(body.classList.contains('dark')) {
    setTheme('light');
  } else {
    setTheme('dark');
  }
});

// Language toggle
const langFrBtn = document.getElementById('lang-fr');
const langEnBtn = document.getElementById('lang-en');

const translations = {
  fr: {
    bonjourTitle: 'Bonjour',
    bonjourText: 'Actuellement à Paris et alentours',
    portfolioVideoTitle: 'Portfolio Vidéo',
    portfolioEcritTitle: 'Portfolio Écrit',
    photographieTitle: 'Photographie',
    photographieText: 'Suivez-moi sur Instagram',
    contactTitle: 'Contact',
    formNom: 'Nom :',
    formPrenom: 'Prénom :',
    formEmail: 'Email :',
    formMessage: 'Message :',
    formSubmit: 'Envoyer',
  },
  en: {
    bonjourTitle: 'Hello',
    bonjourText: 'Currently in Paris and surroundings',
    portfolioVideoTitle: 'Video Portfolio',
    portfolioEcritTitle: 'Written Portfolio',
    photographieTitle: 'Photography',
    photographieText: 'Follow me on Instagram',
    contactTitle: 'Contact',
    formNom: 'Last name:',
    formPrenom: 'First name:',
    formEmail: 'Email:',
    formMessage: 'Message:',
    formSubmit: 'Send',
  }
};

function setLanguage(lang) {
  document.querySelector('.tuile-bonjour h2').textContent = translations[lang].bonjourTitle;
  document.querySelector('.tuile-bonjour p').textContent = translations[lang].bonjourText;
  document.querySelector('#portfolio-video h2').textContent = translations[lang].portfolioVideoTitle;
  document.querySelector('#portfolio-ecrit h2').textContent = translations[lang].portfolioEcritTitle;
  document.querySelector('.tuile-photographie h2').textContent = translations[lang].photographieTitle;
  document.querySelector('.insta-overlay p').textContent = translations[lang].photographieText;
  document.querySelector('.tuile-contact h2').textContent = translations[lang].contactTitle;

  // Form labels and button
  document.querySelector('label[for="nom"]').textContent = translations[lang].formNom;
  document.querySelector('label[for="prenom"]').textContent = translations[lang].formPrenom;
  document.querySelector('label[for="email"]').textContent = translations[lang].formEmail;
  document.querySelector('label[for="message"]').textContent = translations[lang].formMessage;
  document.querySelector('button[type="submit"]').textContent = translations[lang].formSubmit;

  // Language button styles
  if(lang === 'fr') {
    langFrBtn.classList.add('selected');
    langEnBtn.classList.remove('selected');
  } else {
    langFrBtn.classList.remove('selected');
    langEnBtn.classList.add('selected');
  }

  localStorage.setItem('lang', lang);
}

langFrBtn.addEventListener('click', () => setLanguage('fr'));
langEnBtn.addEventListener('click', () => setLanguage('en'));

const savedLang = localStorage.getItem('lang') || 'fr';
setLanguage(savedLang);

// Visitor count from localStorage
const visitorCountEl = document.getElementById('visitor-count');
let count = parseInt(localStorage.getItem('visitorCount') || '0', 10);

function fetchVisitorCount() {
  count++;
  localStorage.setItem('visitorCount', count);
  visitorCountEl.textContent = `Visites : ${count}`;
}

fetchVisitorCount();

// Animation on tuiles: reduced movement on hover
document.querySelectorAll('.tuile').forEach(tuile => {
  tuile.addEventListener('mousemove', e => {
    const rect = tuile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * 5; // reduced angle
    const rotateY = ((x - centerX) / centerX) * 5;

    tuile.style.transform = `rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = 'translateY(0)';
  });
});
