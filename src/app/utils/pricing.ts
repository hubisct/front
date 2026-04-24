import type { Product, ProductPriceMode } from "../types";

export function formatMoney(value: number): string {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

export function resolvePriceMode(product: Partial<Product>): ProductPriceMode {
  if (product.priceMode === "single" || product.priceMode === "range" || product.priceMode === "hidden") {
    return product.priceMode;
  }

  if (typeof product.priceMin === "number" && typeof product.priceMax === "number") {
    return "range";
  }

  return "single";
}

export function getProductPriceLabel(product: Partial<Product>): string | null {
  const mode = resolvePriceMode(product);

  if (mode === "hidden") {
    return null;
  }

  if (mode === "range") {
    const min = typeof product.priceMin === "number" ? product.priceMin : product.price;
    const max = typeof product.priceMax === "number" ? product.priceMax : min;

    if (typeof min !== "number" || typeof max !== "number") {
      return null;
    }

    return `${formatMoney(min)} a ${formatMoney(max)}`;
  }

  if (typeof product.price !== "number") {
    return null;
  }

  return formatMoney(product.price);
}