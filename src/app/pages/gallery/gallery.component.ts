import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Photo, PhotoCategory } from '../../models/photo.model';
import { Observable } from 'rxjs';

import { PhotoService } from '../../services/photo.service';
import { LightboxComponent } from '@app/components/lightbox/lightbox.component';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, LightboxComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
})
export class GalleryComponent implements OnInit {
    private photoService = inject(PhotoService);
  private route = inject(ActivatedRoute);

  
  photos$!: Observable<Photo[]>;
  filters: PhotoCategory[] = ['all', 'mariage', 'portrait', 'paysage'];
  activeFilter: PhotoCategory = 'all';
  selectedPhotoUrl: string | null = null;
  selectedPhoto: Photo | null = null;


  ngOnInit(): void {
    // On écoute les changements dans l'URL (ex: /gallery/mariage)
    this.route.paramMap.subscribe((params) => {
      this.activeFilter = (params.get('category') as PhotoCategory) || 'all';
      this.photos$ = this.photoService.getPhotos(this.activeFilter);
    });
  }

  openLightbox(photo: Photo): void {
    // Essayer d'abord l'URL haute qualité, puis fallback vers l'URL de la galerie
    this.selectedPhotoUrl = photo.lightboxSrc;
    this.selectedPhoto = photo; // Stocker la photo pour le fallback
  }

  closeLightbox(): void {
    this.selectedPhotoUrl = null;
  }

  onImageError(event: any): void {
    console.error('Erreur de chargement de l\'image:', event.target.src);
    console.error('Image alt:', event.target.alt);
    
    // Tester l'URL pour diagnostiquer le problème
    this.testGoogleDriveUrl(event.target.src);
    
    // Afficher une image de remplacement avec un message d'erreur
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
    event.target.alt = 'Image non disponible - Vérifiez les permissions Google Drive';
    
    // Ajouter une classe CSS pour styliser l'image d'erreur
    event.target.classList.add('image-error');
  }

  onImageLoad(event: any): void {
    console.log('Image chargée avec succès:', event.target.src);
  }

  // Méthode pour tester une URL Google Drive directement
  testGoogleDriveUrl(url: string): void {
    console.log('Test de l\'URL Google Drive:', url);
    console.log('Instructions pour corriger le problème:');
    console.log('1. Ouvrez cette URL dans un nouvel onglet:', url);
    console.log('2. Si vous voyez "Accès refusé", le fichier n\'est pas public');
    console.log('3. Dans Google Drive, faites clic droit sur le fichier → Partager');
    console.log('4. Changez les permissions à "Toute personne ayant le lien"');
    console.log('5. Répétez pour tous les fichiers de vos dossiers');
  }
}