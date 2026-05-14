import type { Product } from "../types";

export function getProductImages(product: Partial<Product>): string[] {
  const galleryImages = Array.isArray(product.images) ? product.images : [];
  const fallbackImages = product.image ? [product.image] : [];
  const images = [...galleryImages, ...fallbackImages]
    .map((image) => image.trim())
    .filter(Boolean);

  return Array.from(new Set(images));
}

export function getPrimaryProductImage(product: Partial<Product>): string {
  return getProductImages(product)[0] || "";
}
