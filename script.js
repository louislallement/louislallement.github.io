// Toggle Dark Mode and save preference in localStorage
const toggleBtn = document.getElementById('mode-toggle');
const body = document.body;

// Check saved mode
const savedMode = localStorage.getItem('darkMode');
if(savedMode === 'enabled'){
  body.classList.add('dark');
  toggleBtn.textContent = '☀️';
} else {
  toggleBtn.textContent = '🌙';
}

toggleBtn.addEventListener('click', () => {
  body.classList.toggle('dark');
  if(body.classList.contains('dark')){
    localStorage.setItem('darkMode', 'enabled');
    toggleBtn.textContent = '☀️';
  } else {
    localStorage.setItem('darkMode', 'disabled');
    toggleBtn.textContent = '🌙';
  }
});
