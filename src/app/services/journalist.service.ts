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
    return this.http.get<NewsArticle[]>(this.NEWS_DATA_URL).pipe(
      switchMap(articles => {
        const articlesWithMetadata$ = articles.map(article =>
          this.openGraphService.createArticlePreview(article.url).pipe(
            map(preview => ({
              ...article,
              metadata: preview.metadata,
              loading: false,
              title: preview.metadata.title || article.title,
              description: preview.metadata.description || article.description,
              thumbnail: preview.metadata.image || article.thumbnail,
              source: preview.metadata.siteName || article.source
            })),
            catchError(() => of({
              ...article,
              loading: false,
              metadata: undefined
            }))
          )
        );

        return forkJoin(articlesWithMetadata$) as Observable<NewsArticle[]>;
      })
    );
  }

  private processInstagramReel(reel: InstagramReel): InstagramReel {
    return {
      ...reel,
      id: reel.id || this.extractInstagramId(reel.url),
      thumbnail: reel.thumbnail || this.generateInstagramThumbnail(reel.url),
      embedUrl: this.generateInstagramEmbedUrl(reel.url)
    };
  }

  private extractInstagramId(url: string): string {
    const match = url.match(/\/reel\/([^\/\?]+)/);
    return match ? match[1] : url;
  }

  private generateInstagramThumbnail(_url: string): string {
    return 'assets/images/instagram-placeholder.svg';
  }

  private generateInstagramEmbedUrl(url: string): string {
    const id = this.extractInstagramId(url);
    return `https://www.instagram.com/p/${id}/embed/?cr=1&v=14&wp=1080`;
  }
}
