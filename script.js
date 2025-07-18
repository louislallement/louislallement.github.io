// script.js

document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('toggle-theme');
  const body = document.body;
  const langButtons = document.querySelectorAll('.lang-btn');

  // Mode jour/nuit - état initial depuis localStorage
  const savedTheme = localStorage.getItem('theme') || 'light';
  if (savedTheme === 'dark') {
    body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  } else {
    toggleBtn.textContent = '🌙';
  }

  toggleBtn.addEventListener('click', () => {
    if (body.classList.contains('dark')) {
      body.classList.remove('dark');
      toggleBtn.textContent = '🌙';
      localStorage.setItem('theme', 'light');
    } else {
      body.classList.add('dark');
      toggleBtn.textContent = '☀️';
      localStorage.setItem('theme', 'dark');
    }
  });

  // Gestion du changement de langue (FR/EN)
  // Texte en FR par défaut
  const texts = {
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
      formNomPlaceholder: 'Ton nom',
      formPrenomPlaceholder: 'Ton prénom',
      formEmailPlaceholder: 'Ton adresse mail',
      formMessagePlaceholder: 'Écris ton message ici...',
      formButton: 'Envoyer',
      copyright: '© Louis Lallement 2025',
      visites: 'Visites : '
    },
    en: {
      bonjourTitle: 'Hello',
      bonjourText: 'Currently in Paris and surrounding areas',
      portfolioVideoTitle: 'Video Portfolio',
      portfolioEcritTitle: 'Written Portfolio',
      photographieTitle: 'Photography',
      photographieText: 'Follow me on Instagram',
      contactTitle: 'Contact',
      formNom: 'Last Name:',
      formPrenom: 'First Name:',
      formEmail: 'Email:',
      formMessage: 'Message:',
      formNomPlaceholder: 'Your last name',
      formPrenomPlaceholder: 'Your first name',
      formEmailPlaceholder: 'Your email address',
      formMessagePlaceholder: 'Write your message here...',
      formButton: 'Send',
      copyright: '© Louis Lallement 2025',
      visites: 'Visits: '
    }
  };

  const currentLang = localStorage.getItem('lang') || 'fr';

  function setLanguage(lang) {
    localStorage.setItem('lang', lang);

    const t = texts[lang];

    document.querySelector('#bonjour h2').textContent = t.bonjourTitle;
    document.querySelector('#bonjour p').textContent = t.bonjourText;

    document.querySelector('#portfolio-video h2').textContent = t.portfolioVideoTitle;
    document.querySelector('#portfolio-ecrit h2').textContent = t.portfolioEcritTitle;

    document.querySelector('#photographie h2').textContent = t.photographieTitle;
    document.querySelector('#photographie .photo-overlay span').textContent = t.photographieText;

    document.querySelector('#contact h2').textContent = t.contactTitle;

    document.querySelector('label[for="nom"]').textContent = t.formNom;
    document.querySelector('label[for="prenom"]').textContent = t.formPrenom;
    document.querySelector('label[for="email"]').textContent = t.formEmail;
    document.querySelector('label[for="message"]').textContent = t.formMessage;

    document.querySelector('#nom').placeholder = t.formNomPlaceholder;
    document.querySelector('#prenom').placeholder = t.formPrenomPlaceholder;
    document.querySelector('#email').placeholder = t.formEmailPlaceholder;
    document.querySelector('#message').placeholder = t.formMessagePlaceholder;

    document.querySelector('#contact button[type="submit"]').textContent = t.formButton;

    document.querySelector('#copyright').textContent = t.copyright;

    // Ici, si tu veux afficher compteur visites, il faudra intégrer dans cette fonction aussi
  }

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const chosenLang = btn.getAttribute('data-lang');
      setLanguage(chosenLang);
    });
  });

  setLanguage(currentLang);

  // Optionnel: compteur de visites basique
  let visits = localStorage.getItem('visits') || 0;
  visits++;
  localStorage.setItem('visits', visits);
  document.getElementById('visitor-count').textContent = texts[currentLang].visites + visits;
});
