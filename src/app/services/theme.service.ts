import { DOCUMENT } from '@angular/common';
import { effect, Inject, Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  theme = signal<Theme>('light');

  constructor(@Inject(DOCUMENT) private document: Document) {
    // Au démarrage, on vérifie si un thème est sauvegardé ou si le système préfère le mode sombre
    const savedTheme = localStorage.getItem('theme') as Theme;
    const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
    this.theme.set(savedTheme || (prefersDark ? 'dark' : 'light'));

    // Cet "effet" s'exécutera à chaque fois que le signal `theme` change.
    effect(() => {
      const currentTheme = this.theme();
      if (currentTheme === 'dark') {
        this.document.body.classList.add('dark');
      } else {
        this.document.body.classList.remove('dark');
      }
      localStorage.setItem('theme', currentTheme);
    });
  }

  toggleTheme() {
    // On met simplement à jour le signal, l'effet s'occupe du reste.
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }
}