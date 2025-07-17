// Mode jour/nuit
const toggleThemeBtn = document.getElementById('toggle-theme');
toggleThemeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  updateThemeIcon();
});

function updateThemeIcon() {
  if (document.body.classList.contains('dark-mode')) {
    toggleThemeBtn.textContent = '☀️';
  } else {
    toggleThemeBtn.textContent = '🌙';
  }
}
updateThemeIcon();

// Changement langue FR / EN
const btnFR = document.getElementById('toggle-lang-fr');
const btnEN = document.getElementById('toggle-lang-en');
const translatableElements = document.querySelectorAll('[data-fr]');

function setLanguage(lang) {
  translatableElements.forEach(el => {
    el.textContent = el.getAttribute(`data-${lang}`);
  });
}

btnFR.addEventListener('click', () => setLanguage('fr'));
btnEN.addEventListener('click', () => setLanguage('en'));

// Initialise en français par défaut
setLanguage('fr');

// Effets hover légers sur tuiles
const tuiles = document.querySelectorAll('.tuile');
tuiles.forEach(tuile => {
  tuile.addEventListener('mousemove', e => {
    const rect = tuile.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const midX = rect.width / 2;
    const midY = rect.height / 2;
    const maxTranslate = 6; // px max déplacement (réduit)

    const moveX = ((x - midX) / midX) * maxTranslate;
    const moveY = ((y - midY) / midY) * maxTranslate;

    tuile.style.transform = `translate(${moveX}px, ${moveY}px)`;
  });

  tuile.addEventListener('mouseleave', () => {
    tuile.style.transform = 'translate(0, 0)';
  });
});

// Simulateur compteur visite (tu pourras connecter un vrai API)
const visitorCountEl = document.getElementById('visitor-count');

let visitorCount = localStorage.getItem('visitorCount');
if (!visitorCount) {
  visitorCount = 42; // valeur de départ fictive
}
visitorCountEl.textContent = `Visites : ${visitorCount}`;

// Exemple : incrémenter compteur à chaque chargement (localStorage)
visitorCount++;
localStorage.setItem('visitorCount', visitorCount);
visitorCountEl.textContent = `Visites : ${visitorCount}`;
