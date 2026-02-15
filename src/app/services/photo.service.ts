import { Injectable, inject } from '@angular/core';
import { Photo, PhotoCategory } from '../models/photo.model';
import { Observable, forkJoin, map, of, tap, switchMap } from 'rxjs';
import { GoogleDriveFile, GoogleDriveService } from './google-drive.service';
import { GoogleSheetsService } from './google-sheets.service';

interface PhotoMetaRow {
  filename: string;
  alt: string;
  focus: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private driveService = inject(GoogleDriveService);
  private sheets = inject(GoogleSheetsService);

  private folderIds = {
    mariage: '1OGgs9QF9dLi5XmK30FlmzssaYztLc4Ne',
    portrait: '1fnmWPVg72XHdSf7TE-ET4rQiCO818pVp',
    paysage: '1Z8KZsiIUxItN4TvtZSXfNrvkx5zm2iA_',
  };

  private cache = new Map<PhotoCategory, Photo[]>();
  private metaCache: Map<string, PhotoMetaRow> | null = null;

  getPhotos(category: PhotoCategory = 'all'): Observable<Photo[]> {
    if (!category || category === 'all') {
      const subCategories: (keyof typeof this.folderIds)[] = ['mariage', 'portrait', 'paysage'];
      const allCached = subCategories.every((cat) => this.cache.has(cat));

      if (allCached) {
        const allPhotos = subCategories.flatMap((cat) => this.cache.get(cat)!);
        return of(allPhotos);
      }

      return this.loadMeta().pipe(
        switchMap((meta) => {
          const allPhotosObservables = Object.entries(this.folderIds).map(([cat, id]) =>
            this.driveService.getFilesInFolder(id).pipe(
              map((files) => files.map((file) => this.mapFileToPhoto(file, cat as PhotoCategory, meta))),
              tap((photos) => this.cache.set(cat as PhotoCategory, photos)),
            ),
          );
          return forkJoin(allPhotosObservables).pipe(map((results) => results.flat()));
        }),
      );
    }

    if (this.cache.has(category)) {
      return of(this.cache.get(category)!);
    }

    const folderId = this.folderIds[category as keyof typeof this.folderIds];
    if (!folderId) {
      return of([]);
    }

    return this.loadMeta().pipe(
      switchMap((meta) =>
        this.driveService.getFilesInFolder(folderId).pipe(
          map((files) => files.map((file) => this.mapFileToPhoto(file, category, meta))),
          tap((photos) => this.cache.set(category, photos)),
        ),
      ),
    );
  }

  private loadMeta(): Observable<Map<string, PhotoMetaRow>> {
    if (this.metaCache) return of(this.metaCache);

    return this.sheets.readSheet<PhotoMetaRow>('Photos').pipe(
      map((rows) => {
        const metaMap = new Map<string, PhotoMetaRow>();
        for (const row of rows) {
          if (row.filename) {
            metaMap.set(row.filename.toLowerCase(), row);
          }
        }
        this.metaCache = metaMap;
        return metaMap;
      }),
    );
  }

  private mapFileToPhoto(
    file: GoogleDriveFile,
    category: PhotoCategory,
    meta: Map<string, PhotoMetaRow>,
  ): Photo {
    const baseUrl = file.thumbnailLink
      ? file.thumbnailLink.replace(/=s\d+$/, '')
      : `https://drive.google.com/uc?export=view&id=${file.id}`;

    const hasThumbnail = !!file.thumbnailLink;
    const photoMeta = meta.get(file.name.toLowerCase());

    return {
      src: hasThumbnail ? `${baseUrl}=s800-rw` : baseUrl,
      lqipSrc: hasThumbnail ? `${baseUrl}=s20-rw` : baseUrl,
      lightboxSrc: hasThumbnail ? `${baseUrl}=s1600-rw` : baseUrl,
      alt: photoMeta?.alt || file.name,
      category,
      focus: photoMeta?.focus || 'center',
    };
  }
}
