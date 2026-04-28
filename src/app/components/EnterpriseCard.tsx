import { Link } from "react-router";
import { Tag, ShoppingBag } from "lucide-react";
import type { Enterprise } from "../types";
import { categoryColors } from "../data/constants";

interface EnterpriseCardProps {
  enterprise: Enterprise;
}

const categoryEmojis: Record<string, string> = {
  Artesanato: "🎨",
  Alimentação: "🍞",
  Moda: "👗",
  Plantas: "🌿",
  Cosmética: "✨",
  Reciclagem: "♻️",
};

export function EnterpriseCard({ enterprise }: EnterpriseCardProps) {
  const colors = categoryColors[enterprise.category];

  return (
    <Link
      to={`/empreendimento/${enterprise.id}`}
      className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1.5 border border-gray-100 flex flex-col group cursor-pointer"
    >
      {/* Image */}
      <div className="relative overflow-hidden h-52">
        <img
          src={enterprise.coverImage}
          alt={enterprise.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

        {/* Category Badge */}
        <div
          className={`absolute top-3 left-3 px-3 py-1.5 rounded-full text-xs font-bold border shadow-sm backdrop-blur-sm flex items-center gap-1 ${colors.bg} ${colors.text} ${colors.border}`}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <span>{categoryEmojis[enterprise.category]}</span>
          {enterprise.category}
        </div>

        {/* Products count badge */}
        <div
          className="absolute bottom-3 right-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full shadow-sm"
        >
          <ShoppingBag className="w-3.5 h-3.5 text-purple-600" />
          <span
            className="text-xs font-bold text-gray-700"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {enterprise.products.length} produto{enterprise.products.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-1">
        <h3
          className="text-gray-900 mb-2"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.1rem", lineHeight: 1.3 }}
        >
          {enterprise.name}
        </h3>
        <p
          className="text-gray-500 leading-relaxed flex-1 mb-4"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "0.9rem" }}
        >
          {enterprise.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {enterprise.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-gray-100 text-gray-500 group-hover:bg-purple-50 group-hover:text-purple-600 transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
}