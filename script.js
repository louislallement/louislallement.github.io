const modeToggle = document.getElementById("mode-toggle");
modeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Alterner les icônes soleil/lune
  if (document.body.classList.contains("dark")) {
    modeToggle.src = "assets/sun.svg";
    modeToggle.alt = "Mode Jour";
  } else {
    modeToggle.src = "assets/moon.svg";
    modeToggle.alt = "Mode Nuit";
  }
});
