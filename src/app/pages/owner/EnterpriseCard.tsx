import { FileDown, QrCode, Pencil, ExternalLink } from "lucide-react";
import { Link } from "react-router";
import { getCategoryColors, getCategoryMeta } from "../../utils/categoryStyle";
import { exportCatalogPDF } from "../../utils/pdfExport";

export function EnterpriseCard({
  e,
  categoryItems,
  setShowQrCode,
  setEditingEnterprise
}: any) {
  return (
    <>
              
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Cover image */}
          <div className="relative h-40 sm:h-52 overflow-hidden">
            <img
              src={e.coverImage}
              alt={e.name}
              className="w-full h-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(to top, rgba(0,0,0,0.6), transparent)",
              }}
            />
            <div className="absolute bottom-4 left-4 right-4 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
              <div>
                {(() => {
                  const meta = categoryItems.find(
                    (c) => c.name.toLowerCase() === e.category.toLowerCase(),
                  );
                  const colors = getCategoryColors(meta?.color);
                  const emoji = meta?.emoji || "🏷️";
                  return (
                    <span
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border mb-2"
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        backgroundColor: colors.bg,
                        color: colors.text,
                        borderColor: colors.bg,
                      }}
                    >
                      <span>{emoji}</span>
                      {e.category}
                    </span>
                  );
                })()}
                <h2
                  className="text-white"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 800,
                    fontSize: "1.3rem",
                    textShadow: "0 2px 8px rgba(0,0,0,0.4)",
                  }}
                >
                  {e.name}
                </h2>
              </div>
                <div className="flex flex-wrap sm:flex-nowrap gap-2 w-full sm:w-auto">
                <button
                  onClick={() => exportCatalogPDF(e, getCategoryMeta(categoryItems, e.category))}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-colors"
                  style={{
                    background: "rgba(124,58,237,0.7)",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  <FileDown className="w-4 h-4" />
                  Baixar PDF
                </button>
                <button
                  onClick={() => setShowQrCode(true)}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-colors"
                  style={{
                    background: "rgba(37,99,235,0.7)",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  <QrCode className="w-4 h-4" />
                  QR Code
                </button>
                <button
                  onClick={() => setEditingEnterprise(true)}
                  className="flex-1 sm:flex-none justify-center flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-colors"
                  style={{
                    background: "rgba(234,88,12,0.7)",
                    fontFamily: "Nunito, sans-serif",
                  }}
                >
                  <Pencil className="w-4 h-4" />
                  Editar
                </button>
              </div>
            </div>
          </div>

          {/* Info grid */}
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <p
                className="text-gray-500 text-xs mb-1 uppercase tracking-wider"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
              >
                Descrição
              </p>
              <p
                className="text-gray-700 text-sm leading-relaxed"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                {e.description}
              </p>
            </div>
            <div className="space-y-2">
              <p
                className="text-gray-500 text-xs mb-1 uppercase tracking-wider"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
              >
                Contatos
              </p>
              {[
                {
                  label: "WhatsApp",
                  value: `+${e.whatsapp}`,
                  color: "text-green-600",
                },
                {
                  label: "Instagram",
                  value: e.instagram,
                  color: "text-pink-600",
                },
                ...(e.email
                  ? [
                      {
                        label: "E-mail",
                        value: e.email,
                        color: "text-blue-600",
                      },
                    ]
                  : []),
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span
                    className="text-gray-500 w-20 flex-shrink-0"
                    style={{
                      fontFamily: "Nunito, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {c.label}:
                  </span>
                  <span
                    className={`${c.color} font-semibold`}
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {c.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          {e.tags.length > 0 && (
            <div className="px-5 pb-5">
              <div className="flex flex-wrap gap-2">
                {e.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Actions row */}
          <div className="px-5 pb-5 pt-0 flex flex-wrap gap-3">
            <Link
              to={`/empreendimento/${e.id}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-purple-700 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <ExternalLink className="w-4 h-4" />
              Ver página pública
            </Link>
              <button
                onClick={() => exportCatalogPDF(e, getCategoryMeta(categoryItems, e.category))}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <FileDown className="w-4 h-4" />
              Exportar catálogo PDF
            </button>
          </div>
        </div>
    </>
  );
}