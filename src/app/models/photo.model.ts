export type PhotoCategory = 'mariage' | 'portrait' | 'paysage' | 'all';

export interface Photo {
  src: string;
  lqipSrc: string;
  lightboxSrc: string;
  alt: string;
  category: PhotoCategory;
  focus: string; // CSS object-position, ex: "top", "center", "20% 30%"
}