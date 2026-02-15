import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Louis Lallement — Photographe & Journaliste',
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'gallery',
    title: 'Galerie | Louis Lallement',
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'gallery/:category',
    title: 'Galerie | Louis Lallement',
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'journaliste',
    title: 'Journaliste | Louis Lallement',
    loadComponent: () =>
      import('./pages/journalist/journalist.component').then((m) => m.JournalistComponent),
  },
  {
    path: 'a-propos',
    title: 'À Propos | Louis Lallement',
    loadComponent: () =>
      import('./components/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    title: 'Contact | Louis Lallement',
    loadComponent: () =>
      import('./components/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: '**',
    title: 'Page introuvable | Louis Lallement',
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
