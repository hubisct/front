import type { CategoryItem } from "../types";

export function getCategoryMeta(categoryItems: CategoryItem[], name: string) {
  if (!name) return undefined;
  return categoryItems.find((c) => c.name.toLowerCase() === name.toLowerCase());
}

export function getCategoryColors(color?: string | null) {
  const safe = isValidHexColor(color) ? color! : "#E5E7EB";
  return {
    bg: safe,
    text: getContrastText(safe),
  };
}

function isValidHexColor(color?: string | null) {
  return typeof color === "string" && /^#([0-9a-fA-F]{3}){1,2}$/.test(color);
}

function getContrastText(hex: string) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#374151";
  const [r, g, b] = rgb;
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  return luminance > 0.6 ? "#111827" : "#FFFFFF";
}

function hexToRgb(hex: string) {
  const normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    const r = parseInt(normalized[0] + normalized[0], 16);
    const g = parseInt(normalized[1] + normalized[1], 16);
    const b = parseInt(normalized[2] + normalized[2], 16);
    return [r, g, b] as const;
  }
  if (normalized.length === 6) {
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return [r, g, b] as const;
  }
  return null;
}
