import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    title: 'Louis Lallement — Photographe & Journaliste',
    data: {
      description:
        'Louis Lallement, photographe de mariage fine art et journaliste. Découvrez ma galerie de photographies de mariage, portraits et paysages.',
    },
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'gallery',
    title: 'Galerie | Louis Lallement',
    data: {
      description:
        'Galerie photo de Louis Lallement : mariages, portraits et paysages. Photographie fine art en lumière naturelle.',
    },
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'gallery/:category',
    title: 'Galerie | Louis Lallement',
    data: {
      description:
        'Galerie photo de Louis Lallement : mariages, portraits et paysages. Photographie fine art en lumière naturelle.',
    },
    loadComponent: () =>
      import('./pages/gallery/gallery.component').then((m) => m.GalleryComponent),
  },
  {
    path: 'journaliste',
    title: 'Journaliste | Louis Lallement',
    data: {
      description:
        'Louis Lallement journaliste : reels Instagram et articles de presse. Reportages et créations vidéo.',
    },
    loadComponent: () =>
      import('./pages/journalist/journalist.component').then((m) => m.JournalistComponent),
  },
  {
    path: 'a-propos',
    title: 'À Propos | Louis Lallement',
    data: {
      description:
        'Découvrez le parcours de Louis Lallement, photographe de mariage fine art et journaliste basé en France.',
    },
    loadComponent: () =>
      import('./components/about/about.component').then((m) => m.AboutComponent),
  },
  {
    path: 'contact',
    title: 'Contact | Louis Lallement',
    data: {
      description:
        'Contactez Louis Lallement pour votre projet photo : mariage, portrait, événement. Devis gratuit et personnalisé.',
    },
    loadComponent: () =>
      import('./components/contact/contact.component').then((m) => m.ContactComponent),
  },
  {
    path: 'admin',
    title: 'Administration | Louis Lallement',
    data: {
      description: "Interface d'administration du site Louis Lallement.",
    },
    loadComponent: () =>
      import('./pages/admin/admin.component').then((m) => m.AdminComponent),
  },
  {
    path: '**',
    title: 'Page introuvable | Louis Lallement',
    data: {
      description: 'La page que vous recherchez est introuvable sur le site de Louis Lallement.',
    },
    loadComponent: () =>
      import('./pages/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];
