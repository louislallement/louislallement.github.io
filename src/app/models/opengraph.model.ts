export interface OpenGraphMetadata {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  siteName?: string;
  type?: string;
  publishedTime?: string;
  author?: string;
}

export interface ArticlePreview {
  url: string;
  metadata: OpenGraphMetadata;
  loading: boolean;
  error?: string;
}


