document.addEventListener('DOMContentLoaded', () => {
  // --- Dark Mode toggle ---
  const body = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Charger thème depuis localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.toggle('dark', savedTheme === 'dark');
    themeToggleBtn.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    themeToggleBtn.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });

  // --- Language switch ---
  const btnFR = document.getElementById('btn-fr');
  const btnEN = document.getElementById('btn-en');

  const translations = {
    fr: {
      bonjour: '📍 Actuellement à Paris et alentours',
      portfolioVideo: 'Portfolio Vidéo',
      voirPlusVideo: 'Voir plus de sujets vidéo',
      portfolioEcrit: 'Portfolio Écrit',
      lireArticle: "Lire l’article",
      voirPlusArticles: 'Voir plus d’articles',
      portfolioPhoto: 'Photographie',
      jeterOeilPhotos: 'Jeter un œil à mes photos',
      contact: 'Contact',
      emailPlaceholder: 'Votre email',
      messagePlaceholder: 'Votre message',
      envoyer: 'Envoyer',
      headerSubtitle: 'journaliste | photographe',
    },
    en: {
      bonjour: '📍 Currently in Paris and surroundings',
      portfolioVideo: 'Video Portfolio',
      voirPlusVideo: 'See more video subjects',
      portfolioEcrit: 'Written Portfolio',
      lireArticle: 'Read the article',
      voirPlusArticles: 'See more articles',
      portfolioPhoto: 'Photography',
      jeterOeilPhotos: 'Take a look at my photos',
      contact: 'Contact',
      emailPlaceholder: 'Your email',
      messagePlaceholder: 'Your message',
      envoyer: 'Send',
      headerSubtitle: 'journalist | photographer',
    },
  };

  function switchLanguage(lang) {
    const t = translations[lang];
    document.querySelector('#bonjour h3').textContent = t.bonjour;
    document.querySelector('#portfolio-video h3').textContent = t.portfolioVideo;
    document.querySelector('#portfolio-video .cta-link').textContent = t.voirPlusVideo;
    document.querySelector('#portfolio-ecrit h3').textContent = t.portfolioEcrit;
    document.querySelector('#portfolio-ecrit .article-preview a').textContent = t.lireArticle;
    document.querySelector('#portfolio-ecrit .cta-link').textContent = t.voirPlusArticles;
    document.querySelector('#portfolio-photo h3').textContent = t.portfolioPhoto;
    document.querySelector('#portfolio-photo .cta-link').textContent = t.jeterOeilPhotos;
    document.querySelector('#contact h3').textContent = t.contact;
    document.querySelector('#contact input[type=email]').placeholder = t.emailPlaceholder;
    document.querySelector('#contact textarea').placeholder = t.messagePlaceholder;
    document.querySelector('#contact button[type=submit]').textContent = t.envoyer;
    document.querySelector('header h2').textContent = t.headerSubtitle;
  }

  btnFR.addEventListener('click', () => switchLanguage('fr'));
  btnEN.addEventListener('click', () => switchLanguage('en'));

  switchLanguage('fr');

  // --- Fade-in animations au scroll ---
  const faders = document.querySelectorAll('main .tile, header, footer');

  const appearOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px',
  };

  const appearOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('appear');
      observer.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach((el) => {
    el.classList.add('fade');
    appearOnScroll.observe(el);
  });

  // --- Galerie filtrable photos ---
  const filterButtons = document.querySelectorAll('#photo-filters .filter-btn');
  const photos = document.querySelectorAll('.photo-gallery img');

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      // Mise à jour bouton actif et aria-pressed
      filterButtons.forEach((b) => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      const filter = btn.dataset.filter;

      photos.forEach((photo) => {
        if (filter === 'all' || photo.dataset.category === filter) {
          photo.classList.remove('hide');
        } else {
          photo.classList.add('hide');
        }
      });
    });
  });

  // --- Form contact simple (alert temporaire) ---
  const form = document.getElementById('contact-form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Merci pour votre message, je vous recontacte bientôt !');
    form.reset();
  });
});
