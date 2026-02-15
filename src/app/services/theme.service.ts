import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { effect, inject, Injectable, PLATFORM_ID, signal } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private document = inject(DOCUMENT);
  private isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

  theme = signal<Theme>('light');

  constructor() {
    if (this.isBrowser) {
      const savedTheme = localStorage.getItem('theme') as Theme;
      const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches;
      this.theme.set(savedTheme || (prefersDark ? 'dark' : 'light'));
    }

    effect(() => {
      const currentTheme = this.theme();
      if (currentTheme === 'dark') {
        this.document.body.classList.add('dark');
      } else {
        this.document.body.classList.remove('dark');
      }
      if (this.isBrowser) {
        localStorage.setItem('theme', currentTheme);
      }
    });
  }

  toggleTheme() {
    this.theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }
}
