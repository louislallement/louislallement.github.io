import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnChanges,
  OnDestroy,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  imports: [],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '(document:keydown)': 'onKeyDown($event)',
    '(document:fullscreenchange)': 'onFullscreenChange()',
    role: 'dialog',
    'aria-modal': 'true',
    'aria-label': 'Visionneuse de photos',
  },
})
export class LightboxComponent implements OnChanges, OnDestroy {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly doc = inject(DOCUMENT);

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
  isDragging = false;
  readonly minZoom = 0.5;
  readonly maxZoom = 3;
  readonly zoomStep = 0.25;

  // Pan state
  panX = 0;
  panY = 0;
  private dragStartX = 0;
  private dragStartY = 0;
  private panStartX = 0;
  private panStartY = 0;
  private hasDragged = false;

  private closeBtn = viewChild<ElementRef>('closeBtnRef');

  private touchStartX = 0;
  private touchStartY = 0;
  private readonly SWIPE_THRESHOLD = 50;

  // Fullscreen state
  isFullscreen = signal(false);

  // Slideshow state
  isSlideshowPlaying = signal(false);
  private slideshowIntervalId: ReturnType<typeof setInterval> | null = null;
  private readonly SLIDESHOW_INTERVAL = 5000;

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;

    if (this.isZoomed) {
      this.startDrag(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    }
  }

  onTouchMove(event: TouchEvent): void {
    if (this.isZoomed && this.isDragging) {
      this.updateDrag(event.touches[0].clientX, event.touches[0].clientY);
      event.preventDefault();
    }
  }

  onTouchEnd(event: TouchEvent): void {
    if (this.isZoomed) {
      if (!this.hasDragged) {
        this.toggleZoom();
      }
      this.stopDrag();
      return;
    }
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > this.SWIPE_THRESHOLD) {
      if (dx > 0) {
        this.prev();
      } else {
        this.nextManual();
      }
    }
  }

  onMouseDown(event: MouseEvent): void {
    if (!this.isZoomed) return;
    event.preventDefault();
    this.startDrag(event.clientX, event.clientY);
  }

  onMouseMove(event: MouseEvent): void {
    if (!this.isDragging) return;
    this.updateDrag(event.clientX, event.clientY);
  }

  onMouseUp(): void {
    this.stopDrag();
  }

  onWheel(event: WheelEvent): void {
    event.preventDefault();
    if (event.deltaY < 0) {
      this.zoomIn();
    } else {
      this.zoomOut();
    }
  }

  ngOnChanges(): void {
    if (this.imageUrl()) {
      this.isLoading.set(true);
      this.hasTriedFallback = false;
      this.resetZoom();
      this.preloadAdjacentImages();
    }
    setTimeout(() => this.closeBtn()?.nativeElement?.focus());
  }

  ngOnDestroy(): void {
    this.stopSlideshow();
    if (this.isFullscreen()) {
      this.exitFullscreen();
    }
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
    this.stopSlideshow();
    if (this.hasPrev) {
      this.navigateEvent.emit(this.currentIndex() - 1);
    }
  }

  next(): void {
    if (this.hasNext) {
      this.navigateEvent.emit(this.currentIndex() + 1);
    }
  }

  nextManual(): void {
    this.stopSlideshow();
    this.next();
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
      if (this.zoomLevel === 1) {
        this.panX = 0;
        this.panY = 0;
      }
    }
  }

  resetZoom(): void {
    this.zoomLevel = 1;
    this.panX = 0;
    this.panY = 0;
    this.isDragging = false;
    this.updateZoomState();
  }

  toggleZoom(): void {
    if (this.zoomLevel === 1) {
      this.zoomLevel = 2;
    } else {
      this.zoomLevel = 1;
      this.panX = 0;
      this.panY = 0;
    }
    this.updateZoomState();
  }

  getTransform(): string {
    if (this.isZoomed) {
      return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoomLevel})`;
    }
    return `scale(${this.zoomLevel})`;
  }

  onImageClick(event: MouseEvent): void {
    if (this.hasDragged) {
      event.stopPropagation();
      return;
    }
    this.toggleZoom();
    event.stopPropagation();
  }

  onKeyDown(event: KeyboardEvent): void {
    switch (event.key) {
      case 'Escape':
        this.closeEvent.emit();
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (this.isZoomed) {
          this.panX += 80;
        } else {
          this.prev();
        }
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (this.isZoomed) {
          this.panX -= 80;
        } else {
          this.nextManual();
        }
        break;
      case 'ArrowUp':
        if (this.isZoomed) {
          event.preventDefault();
          this.panY += 80;
        }
        break;
      case 'ArrowDown':
        if (this.isZoomed) {
          event.preventDefault();
          this.panY -= 80;
        }
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
      case 'f':
      case 'F':
        event.preventDefault();
        this.toggleFullscreen();
        break;
      case ' ':
        event.preventDefault();
        this.toggleSlideshow();
        break;
      case 's':
      case 'S':
        event.preventDefault();
        this.sharePhoto();
        break;
    }
  }

  // --- Preload adjacent images ---

  private preloadAdjacentImages(): void {
    const allPhotos = this.photos();
    const idx = this.currentIndex();
    if (allPhotos.length <= 1) return;

    const indicesToPreload = [idx - 1, idx + 1];
    for (const i of indicesToPreload) {
      if (i >= 0 && i < allPhotos.length) {
        const img = new Image();
        img.src = allPhotos[i].lightboxSrc;
      }
    }
  }

  // --- Fullscreen ---

  toggleFullscreen(): void {
    if (this.isFullscreen()) {
      this.exitFullscreen();
    } else {
      this.enterFullscreen();
    }
  }

  private enterFullscreen(): void {
    const elem = this.doc.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    }
  }

  private exitFullscreen(): void {
    if (this.doc.fullscreenElement) {
      this.doc.exitFullscreen();
    }
  }

  onFullscreenChange(): void {
    this.isFullscreen.set(!!this.doc.fullscreenElement);
    this.cdr.markForCheck();
  }

  // --- Slideshow ---

  toggleSlideshow(): void {
    if (this.isSlideshowPlaying()) {
      this.stopSlideshow();
    } else {
      this.startSlideshow();
    }
  }

  private startSlideshow(): void {
    if (!this.hasNext) return;
    this.isSlideshowPlaying.set(true);
    this.slideshowIntervalId = setInterval(() => {
      if (this.hasNext) {
        this.navigateEvent.emit(this.currentIndex() + 1);
        this.cdr.markForCheck();
      } else {
        this.stopSlideshow();
      }
    }, this.SLIDESHOW_INTERVAL);
  }

  private stopSlideshow(): void {
    if (this.slideshowIntervalId !== null) {
      clearInterval(this.slideshowIntervalId);
      this.slideshowIntervalId = null;
    }
    this.isSlideshowPlaying.set(false);
  }

  // --- Share ---

  async sharePhoto(): Promise<void> {
    const photo = this.photos()[this.currentIndex()];
    if (!photo) return;

    const shareData = {
      title: this.altText() || 'Photo - Louis Lallement',
      text: `${this.altText()} — Louis Lallement, Photographe`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // User cancelled or error - ignore
      }
    } else {
      // Fallback: copy URL to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        // Could show a toast here but keeping it simple
      } catch {
        // Clipboard not available
      }
    }
  }

  private startDrag(x: number, y: number): void {
    this.isDragging = true;
    this.hasDragged = false;
    this.dragStartX = x;
    this.dragStartY = y;
    this.panStartX = this.panX;
    this.panStartY = this.panY;
  }

  private updateDrag(x: number, y: number): void {
    const dx = x - this.dragStartX;
    const dy = y - this.dragStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      this.hasDragged = true;
    }
    this.panX = this.panStartX + dx;
    this.panY = this.panStartY + dy;
  }

  private stopDrag(): void {
    this.isDragging = false;
  }

  private updateZoomState(): void {
    this.isZoomed = this.zoomLevel !== 1;
  }
}
