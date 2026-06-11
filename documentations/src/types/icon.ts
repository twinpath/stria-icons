export type IconStyle = 'solid' | 'regular' | 'light' | 'thin' | 'duotone';

export interface IconMetadata {
  name: string;
  styles: IconStyle[];
  categories: string[];
  tags: string[];
  unicode: string;
}

export interface IconsCatalog {
  [id: string]: IconMetadata;
}
