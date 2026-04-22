import type { Category } from "../types";

export const categoryColors: Record<Category, { bg: string; text: string; border: string }> = {
  Artesanato: { bg: "bg-purple-100", text: "text-purple-700", border: "border-purple-300" },
  Alimentação: { bg: "bg-orange-100", text: "text-orange-700", border: "border-orange-300" },
  Moda: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
  Plantas: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
  Cosmética: { bg: "bg-pink-100", text: "text-pink-700", border: "border-pink-300" },
  Reciclagem: { bg: "bg-blue-100", text: "text-blue-700", border: "border-blue-300" },
};
