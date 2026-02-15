import { Component, EventEmitter, HostListener, Input, Output, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-lightbox',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lightbox.component.html',
  styleUrl: './lightbox.component.scss'
})
export class LightboxComponent implements OnChanges {
  @Input() imageUrl: string | null = null;
  @Input() fallbackUrl: string | null = null;
  @Output() close = new EventEmitter<void>();
  
  isLoading = true;
  hasTriedFallback = false;
  
  // Propriétés pour le zoom
  zoomLevel = 1;
  isZoomed = false;
  readonly minZoom = 0.5;
  readonly maxZoom = 3;
  readonly zoomStep = 0.25;

  ngOnChanges(): void {
    // Réinitialiser l'état de chargement quand l'URL change
    if (this.imageUrl) {
      console.log('Lightbox - Chargement de l\'image:', this.imageUrl);
      this.isLoading = true;
      this.hasTriedFallback = false;
      this.resetZoom(); // Réinitialiser le zoom pour chaque nouvelle image
    }
  }

  // Permet de fermer la modale avec la touche "Échap"
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: any) {
    this.close.emit();
  }

  onImageLoad(): void {
    console.log('Lightbox - Image chargée avec succès:', this.imageUrl);
    this.isLoading = false;
  }

  onImageError(): void {
    console.error('Lightbox - Erreur de chargement de l\'image:', this.imageUrl);
    
    // Essayer l'URL de fallback si disponible et pas encore essayée
    if (this.fallbackUrl && !this.hasTriedFallback) {
      console.log('Lightbox - Tentative avec l\'URL de fallback:', this.fallbackUrl);
      this.imageUrl = this.fallbackUrl;
      this.hasTriedFallback = true;
      this.isLoading = true;
    } else {
      this.isLoading = false;
    }
  }

  // Méthodes de zoom
  zoomIn(): void {
    console.log('Zoom In appelé, niveau actuel:', this.zoomLevel);
    if (this.zoomLevel < this.maxZoom) {
      this.zoomLevel = Math.min(this.zoomLevel + this.zoomStep, this.maxZoom);
      this.updateZoomState();
      console.log('Nouveau niveau de zoom:', this.zoomLevel);
    }
  }

  zoomOut(): void {
    console.log('Zoom Out appelé, niveau actuel:', this.zoomLevel);
    if (this.zoomLevel > this.minZoom) {
      this.zoomLevel = Math.max(this.zoomLevel - this.zoomStep, this.minZoom);
      this.updateZoomState();
      console.log('Nouveau niveau de zoom:', this.zoomLevel);
    }
  }

  resetZoom(): void {
    console.log('Reset Zoom appelé');
    this.zoomLevel = 1;
    this.updateZoomState();
    console.log('Zoom réinitialisé à:', this.zoomLevel);
  }

  toggleZoom(): void {
    if (this.zoomLevel === 1) {
      this.zoomLevel = 2; // Zoom par défaut au double
    } else {
      this.zoomLevel = 1; // Retour à la taille normale
    }
    this.updateZoomState();
  }

  private updateZoomState(): void {
    this.isZoomed = this.zoomLevel !== 1;
  }

  getTransform(): string {
    const transform = `scale(${this.zoomLevel})`;
    console.log('getTransform appelé:', transform);
    return transform;
  }

  // Raccourcis clavier pour le zoom
  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      this.zoomIn();
    } else if (event.key === '-') {
      event.preventDefault();
      this.zoomOut();
    } else if (event.key === '0') {
      event.preventDefault();
      this.resetZoom();
    }
  }
}