import { OpenGraphMetadata } from './opengraph.model';

export interface InstagramReel {
  id: string;
  url: string;
  embedUrl?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  date?: string;
}

export interface NewsArticle {
  id: string;
  url: string;
  title: string;
  description?: string;
  source: string;
  thumbnail?: string;
  date?: string;
  previewUrl?: string;
  metadata?: OpenGraphMetadata;
  loading?: boolean;
}

export interface JournalistData {
  instagramReels: InstagramReel[];
  newsArticles: NewsArticle[];
}
