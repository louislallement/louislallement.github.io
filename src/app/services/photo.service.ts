import { Injectable, inject } from '@angular/core';
import { Photo, PhotoCategory } from '../models/photo.model';
import { Observable, forkJoin, map, of, tap } from 'rxjs';
import { GoogleDriveFile, GoogleDriveService } from './google-drive.service';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private driveService = inject(GoogleDriveService);

  private folderIds = {
    mariage: '1OGgs9QF9dLi5XmK30FlmzssaYztLc4Ne',
    portrait: '1fnmWPVg72XHdSf7TE-ET4rQiCO818pVp',
    paysage: '1Z8KZsiIUxItN4TvtZSXfNrvkx5zm2iA_',
  };

  private cache = new Map<PhotoCategory, Photo[]>();

  getPhotos(category: PhotoCategory = 'all'): Observable<Photo[]> {
    if (!category || category === 'all') {
      const subCategories: (keyof typeof this.folderIds)[] = ['mariage', 'portrait', 'paysage'];
      const allCached = subCategories.every((cat) => this.cache.has(cat));

      if (allCached) {
        const allPhotos = subCategories.flatMap((cat) => this.cache.get(cat)!);
        return of(allPhotos);
      }

      const allPhotosObservables = Object.entries(this.folderIds).map(([cat, id]) =>
        this.driveService.getFilesInFolder(id).pipe(
          map((files) => files.map((file) => this.mapFileToPhoto(file, cat as PhotoCategory))),
          tap((photos) => this.cache.set(cat as PhotoCategory, photos)),
        ),
      );
      return forkJoin(allPhotosObservables).pipe(map((results) => results.flat()));
    }

    if (this.cache.has(category)) {
      return of(this.cache.get(category)!);
    }

    const folderId = this.folderIds[category as keyof typeof this.folderIds];
    if (!folderId || folderId.startsWith('ID_DE_VOTRE_DOSSIER')) {
      return of([]);
    }

    return this.driveService.getFilesInFolder(folderId).pipe(
      map((files) => files.map((file) => this.mapFileToPhoto(file, category))),
      tap((photos) => this.cache.set(category, photos)),
    );
  }

  private mapFileToPhoto(file: GoogleDriveFile, category: PhotoCategory): Photo {
    const baseUrl = file.thumbnailLink
      ? file.thumbnailLink.replace(/=s\d+$/, '')
      : `https://drive.google.com/uc?export=view&id=${file.id}`;

    const hasThumbnail = !!file.thumbnailLink;

    return {
      src: hasThumbnail ? `${baseUrl}=s800` : baseUrl,
      lqipSrc: hasThumbnail ? `${baseUrl}=s20` : baseUrl,
      lightboxSrc: hasThumbnail ? `${baseUrl}=s1600` : baseUrl,
      alt: file.name,
      category,
    };
  }
}
