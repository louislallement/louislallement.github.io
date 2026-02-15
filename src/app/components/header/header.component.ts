import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { RouterModule } from '@angular/router';
import { PhotoCategory } from '../../models/photo.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  // On injecte le service pour l'utiliser dans le template
  themeService = inject(ThemeService);

  // On déplace les filtres ici pour les afficher dans le header
  filters: PhotoCategory[] = ['all', 'mariage', 'portrait', 'paysage'];

  // Pour le menu mobile
  isMenuOpen = false;
}