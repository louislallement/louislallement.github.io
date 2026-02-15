import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map, switchMap } from 'rxjs';
import { Photo, PhotoCategory } from '../../models/photo.model';
import { PhotoService } from '../../services/photo.service';
import { LightboxComponent } from '@app/components/lightbox/lightbox.component';

@Component({
  selector: 'app-gallery',
  imports: [RouterModule, LightboxComponent],
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GalleryComponent {
  private photoService = inject(PhotoService);
  private route = inject(ActivatedRoute);

  filters: PhotoCategory[] = ['all', 'mariage', 'portrait', 'paysage'];

  activeFilter = toSignal(
    this.route.paramMap.pipe(map((params) => (params.get('category') as PhotoCategory) || 'all')),
    { initialValue: 'all' as PhotoCategory },
  );

  photos = toSignal(
    this.route.paramMap.pipe(
      map((params) => (params.get('category') as PhotoCategory) || 'all'),
      switchMap((category) => this.photoService.getPhotos(category)),
    ),
    { initialValue: [] as Photo[] },
  );

  loadedImages = signal<Set<string>>(new Set());
  selectedPhoto = signal<Photo | null>(null);

  selectedIndex = computed(() => {
    const photo = this.selectedPhoto();
    if (!photo) return -1;
    return this.photos().findIndex((p) => p.src === photo.src);
  });

  constructor() {
    effect(() => {
      this.activeFilter();
      this.loadedImages.set(new Set());
    });
  }

  onImageLoaded(src: string): void {
    this.loadedImages.update((set) => {
      const next = new Set(set);
      next.add(src);
      return next;
    });
  }

  isLoaded(src: string): boolean {
    return this.loadedImages().has(src);
  }

  openLightbox(photo: Photo): void {
    this.selectedPhoto.set(photo);
  }

  closeLightbox(): void {
    this.selectedPhoto.set(null);
  }

  navigateLightbox(index: number): void {
    const list = this.photos();
    if (index >= 0 && index < list.length) {
      this.selectedPhoto.set(list[index]);
    }
  }

  onImageError(event: Event): void {
    const target = event.target as HTMLImageElement;
    target.src =
      'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjVmNWY1Ii8+CiAgPHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vbiBkaXNwb25pYmxlPC90ZXh0Pgo8L3N2Zz4K';
    target.alt = 'Image non disponible';
    target.classList.add('image-error');
  }
}
