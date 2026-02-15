import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, of, switchMap, catchError } from 'rxjs';
import { InstagramReel, NewsArticle, JournalistData } from '../models/journalist.model';
import { OpenGraphService } from './opengraph.service';

@Injectable({
  providedIn: 'root',
})
export class JournalistService {
  private http = inject(HttpClient);
  private openGraphService = inject(OpenGraphService);

  // URLs des fichiers JSON (à adapter selon votre structure)
  private readonly INSTAGRAM_DATA_URL = 'assets/data/instagram-reels.json';
  private readonly NEWS_DATA_URL = 'assets/data/news-articles.json';

  getJournalistData(): Observable<JournalistData> {
    return forkJoin({
      instagramReels: this.getInstagramReels(),
      newsArticles: this.getNewsArticles()
    });
  }

  getInstagramReels(): Observable<InstagramReel[]> {
    return this.http.get<InstagramReel[]>(this.INSTAGRAM_DATA_URL).pipe(
      map(reels => reels.map(reel => this.processInstagramReel(reel)))
    );
  }

  getNewsArticles(): Observable<NewsArticle[]> {
    console.log('JournalistService - Chargement des articles...');
    return this.http.get<NewsArticle[]>(this.NEWS_DATA_URL).pipe(
      switchMap(articles => {
        console.log('JournalistService - Articles chargés:', articles);
        // Charger les métadonnées Open Graph pour chaque article
        const articlesWithMetadata$ = articles.map(article => 
          this.openGraphService.createArticlePreview(article.url).pipe(
            map(preview => {
              console.log('JournalistService - Prévisualisation créée pour:', article.url, preview);
              return {
                ...article,
                metadata: preview.metadata,
                loading: false,
                // Utiliser les métadonnées Open Graph si disponibles
                title: preview.metadata.title || article.title,
                description: preview.metadata.description || article.description,
                thumbnail: preview.metadata.image || article.thumbnail,
                source: preview.metadata.siteName || article.source
              };
            }),
            catchError(error => {
              console.error('JournalistService - Erreur pour article:', article.url, error);
              return of({
                ...article,
                loading: false,
                metadata: undefined
              });
            })
          )
        );
        
        return forkJoin(articlesWithMetadata$) as Observable<NewsArticle[]>;
      })
    );
  }

  private processInstagramReel(reel: InstagramReel): InstagramReel {
    // Traitement des données Instagram (extraction d'ID, génération de thumbnail, etc.)
    return {
      ...reel,
      id: reel.id || this.extractInstagramId(reel.url),
      thumbnail: reel.thumbnail || this.generateInstagramThumbnail(reel.url),
      embedUrl: this.generateInstagramEmbedUrl(reel.url)
    };
  }

  private processNewsArticle(article: NewsArticle): NewsArticle {
    // Traitement des données d'article (génération de preview URL, etc.)
    return {
      ...article,
      previewUrl: article.previewUrl || this.generatePreviewUrl(article.url),
      thumbnail: article.thumbnail || this.generateArticleThumbnail(article.url)
    };
  }

  private extractInstagramId(url: string): string {
    // Extraire l'ID du reel Instagram depuis l'URL
    const match = url.match(/\/reel\/([^\/\?]+)/);
    return match ? match[1] : url;
  }

  private generateInstagramThumbnail(url: string): string {
    // Pour l'instant, utiliser un placeholder
    return 'assets/images/instagram-placeholder.svg';
  }

  private generatePreviewUrl(url: string): string {
    // Utiliser un service de prévisualisation simple
    return `https://api.linkpreview.net/?q=${encodeURIComponent(url)}`;
  }

  private generateArticleThumbnail(url: string): string {
    // Pour l'instant, utiliser un placeholder
    return 'assets/images/article-placeholder.svg';
  }

  private generateInstagramEmbedUrl(url: string): string {
    // Essayer différentes URLs d'embed pour la lecture directe
    const id = this.extractInstagramId(url);
    
    // Essayer l'URL d'embed Instagram standard avec paramètres optimisés
    return `https://www.instagram.com/p/${id}/embed/?cr=1&v=14&wp=1080`;
  }

  // Méthode alternative pour obtenir l'URL de la vidéo directe (si disponible)
  private getDirectVideoUrl(url: string): string {
    const id = this.extractInstagramId(url);
    // Cette méthode pourrait utiliser une API tierce pour extraire l'URL directe de la vidéo
    // Pour l'instant, retourner l'URL d'embed
    return this.generateInstagramEmbedUrl(url);
  }
}
