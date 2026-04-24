import { useState, useMemo } from "react";
import { Search, X, Sparkles } from "lucide-react";
import { EnterpriseCard } from "../components/EnterpriseCard";
import type { Category } from "../types";
import { useAuth } from "../contexts/AuthContext";

const HERO_BG = "https://images.unsplash.com/photo-1761666520258-e6de315a61c5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb21tdW5pdHklMjBlbnRyZXByZW5ldXJzaGlwJTIwc21hbGwlMjBidXNpbmVzcyUyMHBlb3BsZXxlbnwxfHx8fDE3NzQzODMxMTN8MA&ixlib=rb-4.1.0&q=80&w=1080";

const categoryIcons: Record<Category, string> = {
  Artesanato: "🎨",
  Alimentação: "🍞",
  Moda: "👗",
  Plantas: "🌿",
  Cosmética: "✨",
  Reciclagem: "♻️",
};

export function HomePage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<Category | "Todas">("Todas");
  const { enterprises, categories } = useAuth();

  const filtered = useMemo(() => {
    return enterprises.filter((e) => {
      const matchesSearch =
        search.trim() === "" ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        e.products.some(
          (p) =>
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.description.toLowerCase().includes(search.toLowerCase())
        );
      const matchesCategory =
        selectedCategory === "Todas" || e.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, selectedCategory, enterprises]);

  const clearFilters = () => {
    setSearch("");
    setSelectedCategory("Todas");
  };

  const hasActiveFilters = search.trim() !== "" || selectedCategory !== "Todas";

  return (
    <div id="topo" className="w-full">
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden min-h-[520px] md:min-h-[600px] flex items-center">
        {/* Background image + overlay */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(109,40,217,0.88) 0%, rgba(234,88,12,0.78) 55%, rgba(37,99,235,0.72) 100%)",
            }}
          />
        </div>

        {/* Decorative blobs */}
        <div
          className="absolute -top-20 -right-20 w-80 h-80 rounded-full opacity-20 blur-3xl"
          style={{ background: "#FBBF24" }}
        />
        <div
          className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full opacity-20 blur-3xl"
          style={{ background: "#2563EB" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6">
            <svg className="w-4 h-4 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span
              className="text-white text-sm font-semibold"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Incubadora Social UFSM
            </span>
          </div>

          <h1
            className="text-white mb-5 max-w-3xl"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              lineHeight: 1.15,
            }}
          >
            Vitrine dos{" "}
            <span style={{ color: "#FBBF24" }}>Empreendimentos</span>{" "}
            <br className="hidden sm:block" />
            Incubados
          </h1>

          <p
            className="text-white/90 mb-8 max-w-xl"
            style={{
              fontFamily: "Nunito, sans-serif",
              fontWeight: 600,
              fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
              lineHeight: 1.7,
            }}
          >
            Conheça produtos únicos feitos com criatividade, cuidado e propósito
            pelos empreendedores incubados pela{" "}
            <span className="text-yellow-300 font-bold">
              Incubadora Social da UFSM
            </span>
            .
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar empreendimentos ou produtos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-2xl text-gray-800 bg-white shadow-xl border-0 outline-none focus:ring-2 focus:ring-yellow-400 transition-all"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            
            {/* Category filters - Always visible and more discrete */}
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("Todas")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  selectedCategory === "Todas"
                    ? "bg-white text-purple-700 shadow-md"
                    : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                }`}
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Todas
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? "bg-white text-purple-700 shadow-md"
                      : "bg-white/20 text-white border border-white/30 hover:bg-white/30"
                  }`}
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  <span>{categoryIcons[cat]}</span>
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISES GRID ─────────────────────────────────────── */}
      <section id="empreendimentos" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        {/* Section header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-1 h-6 rounded-full"
                style={{ background: "linear-gradient(180deg, #7C3AED, #EA580C)" }}
              />
              <span
                className="text-purple-700 font-bold text-sm uppercase tracking-wider"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                Nossos Empreendimentos
              </span>
            </div>
            <h2
              className="text-gray-900"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
              }}
            >
              {hasActiveFilters ? "Resultados da busca" : "Conheça os empreendimentos"}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className="text-gray-500 text-sm font-semibold"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {filtered.length} empreendimento{filtered.length !== 1 ? "s" : ""}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold text-orange-600 bg-orange-50 hover:bg-orange-100 border border-orange-200 transition-all"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                <X className="w-3.5 h-3.5" />
                Limpar filtros
              </button>
            )}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((enterprise) => (
              <EnterpriseCard key={enterprise.id} enterprise={enterprise} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-6xl mb-4">🔍</div>
            <h3
              className="text-gray-700 mb-2"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.3rem" }}
            >
              Nenhum resultado encontrado
            </h3>
            <p
              className="text-gray-500 mb-6 max-w-md"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Não encontramos empreendimentos ou produtos com esses termos. Tente
              outras palavras ou limpe os filtros.
            </p>
            <button
              onClick={clearFilters}
              className="px-6 py-3 rounded-2xl text-white font-bold shadow-md hover:shadow-lg transition-all"
              style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
            >
              Ver todos os empreendimentos
            </button>
          </div>
        )}
      </section>

      {/* ── ABOUT SECTION ────────────────────────────────────────── */}
      <section id="sobre-incubadora" className="py-16 overflow-hidden relative"
        style={{ background: "linear-gradient(135deg, #F3F0FF 0%, #FFF7ED 50%, #EFF6FF 100%)" }}>
        {/* Decorative elements */}
        <div className="absolute top-8 right-8 w-32 h-32 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #FBBF24, transparent)" }} />
        <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full opacity-30"
          style={{ background: "radial-gradient(circle, #7C3AED, transparent)" }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 border border-purple-200 rounded-full px-4 py-1.5 mb-5">
                <Sparkles className="w-4 h-4 text-purple-600" />
                <span className="text-purple-700 text-sm font-bold" style={{ fontFamily: "Nunito, sans-serif" }}>
                  Sobre a Incubadora
                </span>
              </div>
              <h2
                className="text-gray-900 mb-5"
                style={{
                  fontFamily: "Poppins, sans-serif",
                  fontWeight: 800,
                  fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                  lineHeight: 1.25,
                }}
              >
                Empreendedorismo social{" "}
                <span style={{ color: "#7C3AED" }}>com propósito</span>
              </h2>
              <p
                className="text-gray-600 leading-relaxed mb-5"
                style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", fontWeight: 600 }}
              >
                A Incubadora Social da UFSM apoia empreendimentos de base comunitária e
                solidária, oferecendo suporte técnico, capacitação e visibilidade para
                pequenos negócios que geram impacto social positivo.
              </p>
              <p
                className="text-gray-600 leading-relaxed mb-8"
                style={{ fontFamily: "Nunito, sans-serif", fontSize: "1.05rem", fontWeight: 600 }}
              >
                Nossa missão é fortalecer a economia solidária, promover a inclusão produtiva
                e valorizar o trabalho criativo e artesanal de pessoas e comunidades de
                Santa Maria e região.
              </p>
              <div className="flex flex-wrap gap-3">
                <a
                  href="https://www.ufsm.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105"
                  style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
                >
                  Conheça a UFSM
                </a>
                <a
                  href="https://wa.me/555532208500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 rounded-2xl font-bold border-2 border-purple-600 text-purple-600 hover:bg-purple-50 transition-all"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Entrar em contato
                </a>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "🤝", title: "Comunidade", desc: "Empreendimentos com foco em impacto social e inclusão" },
                { icon: "🌱", title: "Sustentabilidade", desc: "Produtos ecológicos e práticas responsáveis com o meio ambiente" },
                { icon: "💡", title: "Inovação", desc: "Criatividade e originalidade em cada produto oferecido" },
                { icon: "❤️", title: "Solidariedade", desc: "Economia solidária que valoriza as pessoas e o trabalho digno" },
              ].map((card, i) => (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-5 shadow-sm border border-white/80 hover:shadow-md transition-shadow"
                >
                  <div className="text-3xl mb-3">{card.icon}</div>
                  <h4
                    className="text-gray-800 mb-1"
                    style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
                  >
                    {card.title}
                  </h4>
                  <p
                    className="text-gray-500"
                    style={{ fontFamily: "Nunito, sans-serif", fontSize: "0.82rem", fontWeight: 600 }}
                  >
                    {card.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────── */}
      <section
        className="py-14 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #1E3A8A 100%)" }}
      >
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #FBBF24 0%, transparent 40%), radial-gradient(circle at 80% 50%, #EA580C 0%, transparent 40%)",
          }} />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
            }}
          >
            Quer fazer parte da{" "}
            <span style={{ color: "#FBBF24" }}>Incubadora Social</span>?
          </h2>
          <p
            className="text-white/80 mb-8 max-w-2xl mx-auto"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "1.05rem" }}
          >
            Se você tem um empreendimento social, comunitário ou solidário e quer receber
            apoio, capacitação e visibilidade, entre em contato com a equipe da Incubadora
            Social da UFSM.
          </p>
          <a
            href="https://wa.me/555532208500"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all hover:scale-105"
            style={{ background: "linear-gradient(135deg, #FBBF24, #EA580C)", color: "#1E1B4B", fontFamily: "Nunito, sans-serif", fontSize: "1.05rem" }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Quero ser incubado!
          </a>
        </div>
      </section>
    </div>
  );
}