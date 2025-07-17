/* RESET */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* VARIABLES */
:root {
  --primary: #007acc;
  --bg-color: #ffffff;
  --text-color: #000000;
  --tile-bg: #f2f2f2;
  --footer-bg: #e0e0e0;
}

body.dark {
  --bg-color: #0f172a;
  --text-color: #f1f5f9;
  --tile-bg: #1e293b;
  --footer-bg: #1c1c1c;
}

/* BASE */
body {
  font-family: 'Segoe UI', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  transition: background 0.3s, color 0.3s;
  padding: 1rem;
}

/* HEADER */
header {
  text-align: center;
  margin-bottom: 2rem;
}

header h1 {
  font-size: 3rem;
}

header p {
  font-size: 1.2rem;
}

header button {
  margin-top: 0.5rem;
  font-size: 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
}

/* TUILES */
.tuiles-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  justify-content: space-between;
}

.tuile {
  background-color: var(--tile-bg);
  border-radius: 2rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: background 0.3s, transform 0.2s;
  flex: 1 1 calc(33.333% - 1rem);
  min-width: 280px;
}

.tuile:hover {
  transform: translateY(-5px);
}

/* VIDÉOS */
.videos-container iframe {
  width: 100%;
  height: 400px;
  margin-bottom: 1rem;
  border-radius: 1rem;
}

/* FORMULAIRE */
form {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

form input,
form textarea {
  padding: 0.75rem;
  border-radius: 1rem;
  border: 1px solid #ccc;
  background: #fff;
  font-size: 1rem;
}

form button {
  align-self: start;
  padding: 0.6rem 1.2rem;
  border-radius: 2rem;
  background-color: var(--primary);
  color: #fff;
  border: none;
  cursor: pointer;
  font-weight: bold;
}

/* FOOTER */
footer {
  margin-top: 2rem;
  background: var(--footer-bg);
  border-radius: 2rem;
  padding: 1rem;
  text-align: center;
  font-size: 0.9rem;
}

#social-links img {
  width: 24px;
  height: 24px;
  margin: 0 0.5rem;
  vertical-align: middle;
}
