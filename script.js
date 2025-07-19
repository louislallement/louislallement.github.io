document.addEventListener('DOMContentLoaded', () => {
  // --- Dark Mode toggle ---
  const body = document.body;
  const themeToggleBtn = document.getElementById('theme-toggle');

  // Load theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    body.classList.toggle('
