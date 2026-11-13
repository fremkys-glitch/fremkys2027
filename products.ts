export interface Product {
  id: string;
  name: string;
  category: 'all' | 'manteaux' | 'pantalons' | 'robes' | 'tops' | 'chaussures' | 'accessoires' | string;
  categoryLabel: string;
  priceDZD: number;
  priceEUR: number;
  priceUSD: number;
  tag?: string;
  image: string;
  editorialImage?: string;
  galleryImages?: string[];
  colors?: { name: string; hex: string; img?: string }[];
  sizes: string[];
  description: string;
  sizeFit: string;
  material: string;
  care: string;
  createdAt?: string;
  isOutOfStock?: boolean;
  shopTheLook?: {
    modelImg: string;
    items: { name: string; priceDZD: number; img: string }[];
  };
}

export const PRODUCTS: Product[] = [];

export const WILAYAS_ALGERIE = [
  "16 - Alger",
  "31 - Oran",
  "25 - Constantine",
  "19 - Sétif",
  "09 - Blida",
  "35 - Boumerdès",
  "15 - Tizi Ouzou",
  "06 - Béjaïa",
  "13 - Tlemcen",
  "23 - Annaba",
  "05 - Batna",
  "10 - Bouira",
  "27 - Mostaganem",
  "22 - Sidi Bel Abbès",
  "34 - Bordj Bou Arreridj",
  "42 - Tipaza",
  "Toutes les 58 Wilayas d'Algérie..."
];
