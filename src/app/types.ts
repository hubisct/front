export type Category = "Artesanato" | "Alimentação" | "Moda" | "Plantas" | "Cosmética" | "Reciclagem";
export type ProductPriceMode = "single" | "range" | "hidden";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  priceMode?: ProductPriceMode;
  priceMin?: number;
  priceMax?: number;
  image: string;
}

export interface Enterprise {
  id: string;
  name: string;
  category: Category;
  coverImage: string;
  description: string;
  fullDescription?: string;
  whatsapp?: string;
  instagram?: string;
  email?: string;
  tags: string[];
  products: Product[];
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "admin" | "owner";
  enterpriseId?: string;
  active: boolean;
}
