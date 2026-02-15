import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { InstagramReel, NewsArticle, JournalistData } from '../models/journalist.model';
import { GoogleSheetsService } from './google-sheets.service';

interface ReelRow {
  id: string;
  url: string;
  title: string;
  description: string;
  thumbnail: string;
  date: string;
}

interface ArticleRow {
  id: string;
  url: string;
  title: string;
  description: string;
  source: string;
  thumbnail: string;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class JournalistService {
  private sheets = inject(GoogleSheetsService);

  getJournalistData(): Observable<JournalistData> {
    return this.getInstagramReels().pipe(
      map((instagramReels) => ({
        instagramReels,
        newsArticles: [] as NewsArticle[],
      })),
    );
  }

  getInstagramReels(): Observable<InstagramReel[]> {
    return this.sheets.readSheet<ReelRow>('Reels').pipe(
      map((rows) =>
        rows
          .filter((row) => row.url)
          .map((row) => this.processInstagramReel(row)),
      ),
    );
  }

  getNewsArticles(): Observable<NewsArticle[]> {
    return this.sheets.readSheet<ArticleRow>('Articles').pipe(
      map((rows) =>
        rows
          .filter((row) => row.url)
          .map((row) => ({
            id: row.id || row.url,
            url: row.url,
            title: row.title || 'Article',
            description: row.description || '',
            source: row.source || '',
            thumbnail: row.thumbnail || '',
            date: row.date || '',
          })),
      ),
    );
  }

  private processInstagramReel(row: ReelRow): InstagramReel {
    const id = row.id || this.extractInstagramId(row.url);
    return {
      id,
      url: row.url,
      title: row.title || 'Reel Instagram',
      description: row.description || '',
      thumbnail: row.thumbnail || 'assets/images/instagram-placeholder.svg',
      date: row.date || '',
      embedUrl: this.generateInstagramEmbedUrl(row.url),
    };
  }

  private extractInstagramId(url: string): string {
    const match = url.match(/\/reel\/([^\/\?]+)/);
    return match ? match[1] : url;
  }

  private generateInstagramEmbedUrl(url: string): string {
    const id = this.extractInstagramId(url);
    return `https://www.instagram.com/p/${id}/embed/?cr=1&v=14&wp=1080`;
  }
}
