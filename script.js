// Script pour faire apparaître les sections au scroll avec animation
document.addEventListener('DOMContentLoaded', function () {
  const sections = document.querySelectorAll('section');

  function checkSections() {
    const triggerBottom = window.innerHeight * 0.85;

    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;

      if (sectionTop < triggerBottom) {
        section.classList.remove('hidden');
      } else {
        section.classList.add('hidden');
      }
    });
  }

  // Initialement, cache toutes les sections
  sections.forEach(section => section.classList.add('hidden'));

  window.addEventListener('scroll', checkSections);
  window.addEventListener('resize', checkSections);

  // Vérifie au chargement aussi
  checkSections();
});
