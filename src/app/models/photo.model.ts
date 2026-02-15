export type PhotoCategory = 'mariage' | 'portrait' | 'paysage' | 'all';

export interface Photo {
  src: string;
  lightboxSrc: string;
  alt: string;
  category: PhotoCategory;
}