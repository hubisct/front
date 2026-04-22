import { Link } from "react-router";
import { ArrowLeft, Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
      <div className="text-8xl mb-6">🔍</div>
      <h1
        className="text-gray-800 mb-3"
        style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "2.5rem" }}
      >
        Página não encontrada
      </h1>
      <p
        className="text-gray-500 mb-8 max-w-md"
        style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "1.05rem" }}
      >
        A página que você está procurando não existe. Que tal explorar os
        empreendimentos incubados?
      </p>
      <Link
        to="/"
        className="flex items-center gap-2 px-8 py-3.5 rounded-2xl text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
        style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif", fontSize: "1rem" }}
      >
        <Home className="w-5 h-5" />
        Ir para o início
      </Link>
    </div>
  );
}
