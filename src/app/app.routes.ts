import { Routes } from '@angular/router';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { JournalistComponent } from './pages/journalist/journalist.component';

export const routes: Routes = [
  { path: '', component: GalleryComponent },
  { path: 'gallery', component: GalleryComponent },
  { path: 'gallery/:category', component: GalleryComponent },
  { path: 'journaliste', component: JournalistComponent },
  { path: 'a-propos', component: AboutComponent },
  { path: 'contact', component: ContactComponent },
  // Redirection pour les chemins inconnus
  { path: '**', redirectTo: '', pathMatch: 'full' }
];