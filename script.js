const toggleBtn = document.getElementById('mode-toggle');
const body = document.body;

function setMode(dark) {
  if (dark) {
    body.classList.add('dark');
    toggleBtn.textContent = '☀️';
  } else {
    body.classList.remove('dark');
    toggleBtn.textContent = '🌙';
  }
  localStorage.setItem('darkMode', dark ? 'true' : 'false');
}

toggleBtn.addEventListener('click', () => {
  setMode(!body.classList.contains('dark'));
});

window.addEventListener('DOMContentLoaded', () => {
  const saved = localStorage.getItem('darkMode');
  setMode(saved === 'true');
});
