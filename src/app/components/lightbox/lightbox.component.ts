import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  OnChanges,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-lightbox',
  imports: [],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeyDown($event)',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Visionneuse de photos',
  },
})
export class LightboxComponent implements OnChanges {
  imageUrl = input<string | null>(null);
  fallbackUrl = input<string | null>(null);
  altText = input<string>('Photo en grand format');
  photos = input<{ lightboxSrc: string; src: string; alt: string }[]>([]);
  currentIndex = input(0);

  closeEvent = output<void>();
  navigateEvent = output<number>();

  isLoading = signal(true);
  hasTriedFallback = false;

  zoomLevel = 1;
  isZoomed = false;
  readonly minZoom = 0.5;
  readonly maxZoom = 3;
  readonly zoomStep = 0.25;

  private closeBtn = viewChild<ElementRef>('closeBtnRef');

  private touchStartX = 0;
  private touchStartY = 0;
  private readonly SWIPE_THRESHOLD = 50;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.isZoomed) return;
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.SWIPE_THRESHOLD) {
      if (dx > 0) {
        this.prev();
      } else {
        this.next();
      }
    }
  }

  ngOnChanges(): void {
    if (this.imageUrl()) {
      this.isLoading.set(true);
      this.hasTriedFallback = false;
      this.resetZoom();
    }
    // Focus trap : mettre le focus sur le bouton fermer à l'ouverture
    setTimeout(() => this.closeBtn()?.nativeElement?.focus());
  }

  onImageLoad(): void {
    this.isLoading.set(false);
  }

  onImageError(): void {
    if (this.fallbackUrl() && !this.hasTriedFallback) {
      this.hasTriedFallback = true;
      this.isLoading.set(true);
    } else {
      this.isLoading.set(false);
    }
  }

  get displayUrl(): string | null {
    if (this.hasTriedFallback && this.fallbackUrl()) {
      return this.fallbackUrl();
    }
    return this.imageUrl();
  }

  get hasPrev(): boolean {
    return this.photos().length > 1 && this.currentIndex() > 0;
  }

  get hasNext(): boolean {
    return this.photos().length > 1 && this.currentIndex() < this.photos().length - 1;
  }

  get counter(): string {
    const total = this.photos().length;
    return total > 1 ? `${this.currentIndex() + 1} / ${total}` : '';
  }

  prev(): void {
    if (this.hasPrev) {
      this.navigateEvent.emit(this.currentIndex() - 1);
    }
  }

  next(): void {
    if (this.hasNext) {
      this.navigateEvent.emit(this.currentIndex() + 1);
    }
  }

  zoomIn(): void {
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
      this.updateZoomState();
    }
  }

  zoomOut(): void {
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
      this.updateZoomState();
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.updateZoomState();
  }

  toggleZoom(): void {
    this.zoomLevel = this.zoomLevel === 1 ? 2 : 1;
    this.updateZoomState();
  }

  getTransform(): string {
    return `scale(${this.zoomLevel})`;
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.closeEvent.emit();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        this.prev();
        break;
      case 'ArrowRight':
        event.preventDefault();
        this.next();
        break;
      case '+':
      case '=':
        event.preventDefault();
        this.zoomIn();
        break;
      case '-':
        event.preventDefault();
        this.zoomOut();
        break;
      case '0':
        event.preventDefault();
        this.resetZoom();
        break;
    }
  }

  private updateZoomState(): void {
    this.isZoomed = this.zoomLevel !== 1;
  }
}
