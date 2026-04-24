import { useParams, Link } from "react-router";
import {
  ArrowLeft,
  Instagram,
  Mail,
  Tag,
  ShoppingBag,
  ExternalLink,
  FileDown,
} from "lucide-react";
import { categoryColors } from "../data/constants";
import { ProductCard } from "../components/ProductCard";
import { useAuth } from "../contexts/AuthContext";
import { exportCatalogPDF } from "../utils/pdfExport";
import { useState } from "react";

export function EnterprisePage() {
  const { id } = useParams<{ id: string }>();
  const { enterprises, isAdmin, isOwner, myEnterprise } = useAuth();
  const enterprise = enterprises.find((e) => e.id === id);
  const [expanded, setExpanded] = useState(false);

  // Can user export PDF?
  const canExportPDF =
    isAdmin || (isOwner && myEnterprise?.id === enterprise?.id);

  if (!enterprise) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="text-6xl mb-4">😕</div>
        <h2
          className="text-gray-800 mb-2"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 700,
            fontSize: "1.6rem",
          }}
        >
          Empreendimento não encontrado
        </h2>
        <p
          className="text-gray-500 mb-6"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          O empreendimento que você procura não existe ou foi removido.
        </p>
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-bold shadow-md"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #EA580C)",
            fontFamily: "Nunito, sans-serif",
          }}
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar ao início
        </Link>
      </div>
    );
  }

  const isLong = enterprise.description.length > 85;
  const colors = categoryColors[enterprise.category];
  const whatsappMessage = encodeURIComponent(
    `Olá! Conheci o empreendimento "${enterprise.name}" na Vitrine Social da Incubadora UFSM. Gostaria de saber mais!`,
  );
  const whatsappUrl = `https://wa.me/${enterprise.whatsapp}?text=${whatsappMessage}`;

  return (
    <div className="w-full">
      {/* ── HERO COVER ────────────────────────────────────────────── */}
      <div className="relative h-64 sm:h-80 md:h-96 overflow-hidden">
        <img
          src={enterprise.coverImage}
          alt={enterprise.name}
          className="w-full h-full object-cover object-center"
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 60%, transparent 100%)",
          }}
        />
        {/* Back button */}
        <div className="absolute top-5 left-5 flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white px-4 py-2 rounded-full shadow-md transition-all font-bold text-gray-700 text-sm"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar
          </Link>
          {canExportPDF && (
            <button
              onClick={() => exportCatalogPDF(enterprise)}
              className="flex items-center gap-2 bg-purple-600/90 hover:bg-purple-700 backdrop-blur-sm px-4 py-2 rounded-full shadow-md transition-all font-bold text-white text-sm"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <FileDown className="w-4 h-4" />
              Baixar PDF
            </button>
          )}
        </div>
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
          <div className="max-w-7xl mx-auto">
            <span
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border mb-3 ${colors.bg} ${colors.text} ${colors.border}`}
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <Tag className="w-3 h-3" />
              {enterprise.category}
            </span>
            <h1
              className="text-white"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 800,
                fontSize: "clamp(1.8rem, 4vw, 2.8rem)",
                lineHeight: 1.15,
                textShadow: "0 2px 12px rgba(0,0,0,0.4)",
              }}
            >
              {enterprise.name}
            </h1>
          </div>

          {/* Description with "Read more" toggle if too long */}
          <div className="max-w-7xl mx-auto">
            <p
              className="text-gray-200 leading-relaxed"
              style={{
                fontFamily: "Nunito, sans-serif",
                fontWeight: 600,
                fontSize: "0.95rem",
              }}
            >
              {expanded || !isLong ? (
                <>
                  {enterprise.description}
                  {isLong && (
                    <span
                      onClick={() => setExpanded(false)}
                      className="text-purple-600 hover:text-purple-700 font-bold text-sm cursor-pointer"
                    >
                      {" "}
                      Ler menos
                    </span>
                  )}
                </>
              ) : (
                <>
                  {enterprise.description.slice(0, 70)}...
                  <span
                    onClick={() => setExpanded(true)}
                    className="text-purple-600 hover:text-purple-700 font-bold text-sm cursor-pointer"
                  >
                    {" "}
                    Ler mais
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT ─────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ── LEFT COLUMN: About ─────────────────────────────── */}
          <div className="lg:col-span-1">
            {/* About card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #7C3AED, #EA580C)",
                  }}
                />
                <h2
                  className="text-gray-800"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "1rem",
                  }}
                >
                  Sobre o Empreendimento
                </h2>
              </div>
              <p
                className="text-gray-600 leading-relaxed"
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                }}
              >
                {enterprise.fullDescription}
              </p>
            </div>
          </div>

          {/* ── RIGHT COLUMN: Products ─────────────────────────── */}
          <div className="lg:col-span-2">
            {/* Section header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, #7C3AED, #EA580C)",
                    }}
                  />
                  <span
                    className="text-purple-700 font-bold text-xs uppercase tracking-wider"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    Catálogo
                  </span>
                </div>
                <h2
                  className="text-gray-900"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.4rem",
                  }}
                >
                  Produtos disponíveis
                </h2>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-50 border border-purple-200">
                <ShoppingBag className="w-4 h-4 text-purple-600" />
                <span
                  className="text-purple-700 font-bold text-sm"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {enterprise.products.length} produto
                  {enterprise.products.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Products grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
              {enterprise.products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  whatsapp={enterprise.whatsapp}
                  enterpriseName={enterprise.name}
                />
              ))}
            </div>

            {/* Tags and Contact sections below products */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Tags */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, #FBBF24, #F97316)",
                    }}
                  />
                  <h2
                    className="text-gray-800"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    Tags
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  {enterprise.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex items-center gap-2 mb-5">
                  <div
                    className="w-1 h-5 rounded-full"
                    style={{
                      background: "linear-gradient(180deg, #2563EB, #3B82F6)",
                    }}
                  />
                  <h2
                    className="text-gray-800"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    Contato
                  </h2>
                </div>

                <div className="flex flex-col gap-4">
                  {/* WhatsApp */}
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-green-50 border border-green-200 hover:bg-green-100 transition-all group"
                  >
                    <div className="w-9 h-9 rounded-xl bg-green-500 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                      <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                      </svg>
                    </div>
                    <div>
                      <div
                        className="text-green-700 font-bold text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        WhatsApp
                      </div>
                      <div
                        className="text-green-600 text-xs"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        +{enterprise.whatsapp}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-green-500 ml-auto" />
                  </a>

                  {/* Instagram */}
                  <a
                    href={`https://instagram.com/${enterprise.instagram.replace("@", "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 border border-pink-200 hover:bg-pink-100 transition-all group"
                  >
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform"
                      style={{
                        background:
                          "linear-gradient(135deg, #E1306C, #833AB4, #F77737)",
                      }}
                    >
                      <Instagram className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div
                        className="text-pink-700 font-bold text-sm"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Instagram
                      </div>
                      <div
                        className="text-pink-600 text-xs"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {enterprise.instagram}
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-pink-400 ml-auto" />
                  </a>

                  {/* Email (optional) */}
                  {enterprise.email && (
                    <a
                      href={`mailto:${enterprise.email}`}
                      className="flex items-center gap-3 p-3 rounded-xl bg-blue-50 border border-blue-200 hover:bg-blue-100 transition-all group"
                    >
                      <div className="w-9 h-9 rounded-xl bg-blue-500 flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-110 transition-transform">
                        <Mail className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div
                          className="text-blue-700 font-bold text-sm"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          E-mail
                        </div>
                        <div
                          className="text-blue-600 text-xs"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          {enterprise.email}
                        </div>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-blue-400 ml-auto" />
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Order CTA banner */}
            <div
              className="mt-8 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-5 overflow-hidden relative"
              style={{
                background: "linear-gradient(135deg, #F3F0FF, #EDE9FE)",
              }}
            >
              <div
                className="absolute -top-4 -right-4 w-24 h-24 rounded-full opacity-30 blur-xl"
                style={{ background: "#7C3AED" }}
              />
              <div className="flex-1 relative z-10">
                <p
                  className="text-purple-900 mb-1"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.05rem",
                  }}
                >
                  Quer encomendar algum produto?
                </p>
                <p
                  className="text-purple-700 text-sm"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                >
                  Entre em contato direto com o empreendimento via WhatsApp para
                  pedidos personalizados, quantidades maiores ou tirar dúvidas.
                </p>
              </div>
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl text-white font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 whitespace-nowrap flex-shrink-0 relative z-10"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Falar no WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── OTHER ENTERPRISES ─────────────────────────────────────── */}
      <section
        className="py-12"
        style={{
          background: "linear-gradient(135deg, #F3F0FF 0%, #FFF7ED 100%)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <h3
              className="text-gray-800"
              style={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                fontSize: "1.3rem",
              }}
            >
              Outros empreendimentos
            </h3>
            <Link
              to="/"
              className="text-purple-600 font-bold text-sm hover:text-purple-700 flex items-center gap-1"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {enterprises
              .filter((e) => e.id !== enterprise.id)
              .slice(0, 3)
              .map((e) => {
                const c = categoryColors[e.category];
                return (
                  <Link
                    key={e.id}
                    to={`/empreendimento/${e.id}`}
                    className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-all hover:-translate-y-0.5 group"
                  >
                    <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={e.coverImage}
                        alt={e.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${c.bg} ${c.text} ${c.border} border mb-1 inline-block`}
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {e.category}
                      </span>
                      <p
                        className="text-gray-800 truncate"
                        style={{
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 700,
                          fontSize: "0.9rem",
                        }}
                      >
                        {e.name}
                      </p>
                      <p
                        className="text-gray-500 text-xs truncate"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        {e.products.length} produtos
                      </p>
                    </div>
                    <div className="text-purple-400 group-hover:text-purple-600 transition-colors">
                      →
                    </div>
                  </Link>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
}
