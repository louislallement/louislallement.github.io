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
}

export interface JournalistData {
  instagramReels: InstagramReel[];
  newsArticles: NewsArticle[];
}
