import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // Utiliser la détection de changement sans Zone.js (Angular 20+)
    provideZonelessChangeDetection(),
    provideRouter(routes), provideHttpClient(),
    
  ]
};