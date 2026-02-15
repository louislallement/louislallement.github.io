# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Site portfolio personnel pour Louis Lallement, photographe et journaliste. Application Angular 20 avec SSR (Server-Side Rendering), hébergée sur GitHub Pages. Le contenu est en français.

## Commands

- `ng serve` : serveur de développement sur http://localhost:4200 (mode static, sans SSR)
- `ng build` : build de production avec SSR (output dans `dist/louislallement-github-io/`)
- `ng test` : tests unitaires via Karma/Jasmine
- `ng build --configuration development` : build de développement
- `node dist/louislallement-github-io/server/server.mjs` : lancer le serveur SSR après un build production

## Architecture

### Routing (`src/app/app.routes.ts`)

- `/` et `/gallery` : galerie photo (composant `GalleryComponent`)
- `/gallery/:category` : galerie filtrée par catégorie (mariage, portrait, paysage)
- `/journaliste` : page journalisme avec reels Instagram et articles de presse
- `/a-propos` : page à propos
- `/contact` : formulaire de contact

### Structure du code

Le code source est dans `src/app/` et s'organise en :

- `pages/` : composants routés (gallery, journalist)
- `components/` : composants réutilisables (header, footer, about, contact, lightbox)
- `services/` : logique métier et accès aux données
- `models/` : interfaces TypeScript

### Services clés

- **GoogleDriveService** : récupère les photos depuis l'API Google Drive (les images sont stockées dans des dossiers Drive par catégorie)
- **PhotoService** : transforme les fichiers Google Drive en objets `Photo`, gère les URLs de prévisualisation (w800 pour la galerie, w1600 pour le lightbox)
- **JournalistService** : charge les données journalisme depuis des fichiers JSON statiques (`src/assets/data/`)
- **OpenGraphService** : extrait les métadonnées Open Graph pour les aperçus d'articles de presse
- **EmailService** : gestion du formulaire de contact (envoi simulé, prévu pour EmailJS)
- **ThemeService** : gestion du thème clair/sombre via signal Angular, persisté dans localStorage

### Configuration

- SSR en production avec prerendering (`RenderMode.Prerender`), mode static en développement
- Zoneless change detection (`provideZonelessChangeDetection()`)
- Styles en SCSS
- Path alias : `@app/*` pointe vers `src/app/*`
- Prettier configuré dans `package.json` (100 chars, single quotes, parser angular pour HTML)
- TypeScript strict activé

## Coding Conventions

- Standalone components uniquement (ne PAS mettre `standalone: true` dans les decorators, c'est le défaut)
- Utiliser les signals pour la gestion d'état local
- `input()` et `output()` au lieu des decorators `@Input`/`@Output`
- `computed()` pour les valeurs dérivées
- `inject()` au lieu de l'injection par constructeur
- `ChangeDetectionStrategy.OnPush` dans les `@Component`
- Control flow natif (`@if`, `@for`, `@switch`) au lieu de `*ngIf`, `*ngFor`, `*ngSwitch`
- `NgOptimizedImage` pour les images statiques
- Host bindings dans l'objet `host` du decorator (pas `@HostBinding`/`@HostListener`)
- `class` bindings au lieu de `ngClass`, `style` bindings au lieu de `ngStyle`
- Reactive forms plutôt que template-driven
- Éviter `any`, utiliser `unknown` si le type est incertain
- Services avec `providedIn: 'root'`
