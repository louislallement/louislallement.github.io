// Mode clair/sombre
const toggleBtn = document.getElementById('mode-toggle');

toggleBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  updateToggleIcon();
});

function updateToggleIcon() {
  toggleBtn.textContent = document.body.classList.contains('dark') ? '☀️' : '🌙';
}

updateToggleIcon(); // Init

// Animation tuiles au scroll
const tiles = document.querySelectorAll('[data-anim]');

function checkTilesVisibility() {
  const triggerBottom = window.innerHeight * 0.85;

  tiles.forEach(tile => {
    const tileTop = tile.getBoundingClientRect().top;

    if(tileTop < triggerBottom) {
      tile.classList.add('visible');
    } else {
      tile.classList.remove('visible');
    }
  });
}

window.addEventListener('scroll', checkTilesVisibility);
window.addEventListener('resize', checkTilesVisibility);
window.addEventListener('load', checkTilesVisibility);
