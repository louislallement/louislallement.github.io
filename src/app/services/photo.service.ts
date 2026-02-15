import { Injectable, inject } from '@angular/core';
import { Photo, PhotoCategory } from '../models/photo.model';
import { Observable, forkJoin, map, of } from 'rxjs';
import { GoogleDriveFile, GoogleDriveService } from './google-drive.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private driveService = inject(GoogleDriveService);

  // IMPORTANT : Remplacez ces IDs par les vrais IDs de vos dossiers Google Drive
  // L'ID du dossier parent est '1ENQtsg8rcKluITkq4sjGNXVDy-pxQkdA'
  private folderIds = {
   
    mariage: '1OGgs9QF9dLi5XmK30FlmzssaYztLc4Ne', // Remplacez par le vrai ID
    portrait: '1fnmWPVg72XHdSf7TE-ET4rQiCO818pVp', // Remplacez par le vrai ID
    paysage: '1Z8KZsiIUxItN4TvtZSXfNrvkx5zm2iA_', // Remplacez par le vrai ID
  };

  getPhotos(category: PhotoCategory = 'all'): Observable<Photo[]> {
    if (!category || category === 'all') {
      // Pour 'tous', on combine les résultats de tous les dossiers
      const allPhotosObservables = Object.entries(this.folderIds).map(([cat, id]) =>
        this.driveService.getFilesInFolder(id).pipe(
          map(files => files.map(file => this.mapFileToPhoto(file, cat as PhotoCategory)))
        )
      );
      return forkJoin(allPhotosObservables).pipe(
        map(results => results.flat())
      );
    }

    const folderId = this.folderIds[category as keyof typeof this.folderIds];
    if (!folderId || folderId.startsWith('ID_DE_VOTRE_DOSSIER')) {
      // Retourne un tableau vide si l'ID n'est pas configuré pour éviter les erreurs
      console.warn(`L'ID du dossier pour la catégorie "${category}" n'est pas configuré.`);
      return of([]);
    }

    return this.driveService.getFilesInFolder(folderId).pipe(
      map(files => files.map(file => this.mapFileToPhoto(file, category)))
    );
  }

  private mapFileToPhoto(file: GoogleDriveFile, category: PhotoCategory): Photo {
    // Debug: afficher les données récupérées
    console.log('File data:', file);
    console.log('Thumbnail link:', file.thumbnailLink);
    console.log('Web content link:', file.webContentLink);
    console.log('Web view link:', file.webViewLink);
    
    // URL de prévisualisation pour la galerie (qualité réduite pour les performances)
    const galleryUrl = `https://drive.google.com/thumbnail?id=${file.id}&sz=w800-h600`;
    
    // URL de qualité maximale pour le lightbox (fallback vers galleryUrl si problème)
    const lightboxUrl = this.getHighQualityUrl(file) || galleryUrl;
    
    console.log('Gallery image URL:', galleryUrl);
    console.log('Lightbox image URL:', lightboxUrl);
    
    return { 
      src: galleryUrl, 
      lightboxSrc: lightboxUrl,
      alt: file.name, 
      category 
    };
  }

  private getHighQualityUrl(file: GoogleDriveFile): string {
    // Pour le lightbox, utiliser une URL de prévisualisation avec une taille plus grande
    // Les URLs webContentLink ne fonctionnent pas dans les balises <img> à cause des restrictions CORS
    
    // Essayer différentes tailles pour trouver la meilleure qualité qui fonctionne
    return `https://drive.google.com/thumbnail?id=${file.id}&sz=w1600-h1600`;
  }
}