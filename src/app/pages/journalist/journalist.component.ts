import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { InstagramReel, NewsArticle } from '../../models/journalist.model';
import { JournalistService } from '../../services/journalist.service';

@Component({
  selector: 'app-journalist',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './journalist.component.html',
  styleUrls: ['./journalist.component.scss'],
})
export class JournalistComponent implements OnInit, AfterViewInit {
  private journalistService = inject(JournalistService);

  instagramReels$!: Observable<InstagramReel[]>;
  newsArticles$!: Observable<NewsArticle[]>;
  
  @ViewChild('instagramContainer', { static: false }) instagramContainer!: ElementRef;

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // Plus besoin de charger le script Instagram avec les iframes
  }

  private loadInstagramScript(): void {
    // Méthode supprimée - plus nécessaire avec les iframes
  }

  private loadData(): void {
    this.instagramReels$ = this.journalistService.getInstagramReels();
    this.newsArticles$ = this.journalistService.getNewsArticles();
    
    // Souscrire aux données Instagram pour injecter le contenu
    this.instagramReels$.subscribe(reels => {
      setTimeout(() => this.injectInstagramEmbeds(reels), 100);
    });
  }

  private injectInstagramEmbeds(reels: InstagramReel[]): void {
    reels.forEach((reel, index) => {
      const container = document.getElementById(`instagram-reel-${index}`);
      if (container) {
        container.innerHTML = `
          <iframe 
            src="${reel.embedUrl}" 
            width="320" 
            height="568" 
            frameborder="0" 
            scrolling="no" 
            allowtransparency="true"
            style="border-radius: 8px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); max-width: 100%;">
          </iframe>
        `;
      }
    });
  }

  openInstagramReel(reel: InstagramReel): void {
    window.open(reel.url, '_blank');
  }

  openNewsArticle(article: NewsArticle): void {
    console.log('Clic sur "Lire l\'article" pour:', article.url);
    window.open(article.url, '_blank');
  }

  openPreview(article: NewsArticle): void {
    console.log('Clic sur "Prévisualisation" pour:', article.url);
    console.log('previewUrl disponible:', article.previewUrl);
    if (article.previewUrl) {
      window.open(article.previewUrl, '_blank');
    } else {
      // Fallback vers l'article original
      console.log('Fallback vers l\'article original');
      this.openNewsArticle(article);
    }
  }
}
