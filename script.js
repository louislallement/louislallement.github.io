const toggle = document.getElementById('theme-toggle');
const body = document.body;
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (prefersDark) body.classList.replace('light', 'dark');

toggle.addEventListener('click', () => {
  body.classList.toggle('dark');
  body.classList.toggle('light');
  toggle.textContent = body.classList.contains('dark') ? '☀️' : '🌙';
});

// Langue toggle (bilingue minimal)
document.getElementById('fr-btn').addEventListener('click', () => {
  alert("Mode français activé (contenu à traduire manuellement).");
});
document.getElementById('en-btn').addEventListener('click', () => {
  alert("English mode activated (content translation pending).");
});
