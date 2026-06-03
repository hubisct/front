import {
  FileDown,
  Pencil,
  Trash2,
  ChevronDown,
  ChevronUp,
  ShoppingBag,
  Plus,
} from "lucide-react";
import type { Enterprise, CategoryItem } from "../../types";
import { getPrimaryProductImage, getProductImages } from "../../utils/productImages";
import { getProductPriceLabel } from "../../utils/pricing";
import { getCategoryMeta } from "../../utils/categoryStyle";
import { exportCatalogPDF } from "../../utils/pdfExport";

export function EnterprisesTab({
  enterprises,
  categoryItems,
  expandedEnterprise,
  setExpandedEnterprise,
  setEditEnterprise,
  setDeleteEnterprise,
  setShowAddProduct,
  setEditProduct,
  setDeleteProduct,
}: any) {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
        <h1
          className="text-gray-900 text-xl sm:text-2xl lg:text-3xl"
          style={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 800,
          }}
        >
          Gestão de Empreendimentos
        </h1>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {enterprises.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p
              className="text-gray-500 font-semibold"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              Nenhum empreendimento cadastrado.
            </p>
          </div>
        ) : (
          enterprises.map((e: Enterprise) => (
            <div
              key={e.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
            >
              {/* Enterprise header row */}
              <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4">
                <img
                  src={e.coverImage}
                  alt={e.name}
                  className="w-12 sm:w-14 h-12 sm:h-14 rounded-xl object-cover flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p
                    className="text-gray-900 truncate text-sm sm:text-base"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    {e.name}
                  </p>
                  <p
                    className="text-gray-500 text-xs"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {e.category} · {e.products.length} produto
                    {e.products.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() =>
                      exportCatalogPDF(
                        e,
                        getCategoryMeta(categoryItems, e.category),
                      )
                    }
                    title="Exportar PDF"
                    className="p-1.5 sm:p-2 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors border border-purple-200"
                  >
                    <FileDown className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditEnterprise(e)}
                    title="Editar"
                    className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors border border-blue-200"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setDeleteEnterprise(e)}
                    title="Remover"
                    className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors border border-red-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedEnterprise(
                        expandedEnterprise === e.id ? null : e.id,
                      )
                    }
                    className="p-1.5 sm:p-2 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors"
                  >
                    {expandedEnterprise === e.id ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Expanded: products */}
              {expandedEnterprise === e.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <p
                      className="text-gray-700 font-bold text-sm"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      <ShoppingBag className="inline w-4 h-4 mr-1 text-purple-600" />
                      Produtos ({e.products.length})
                    </p>
                    <button
                      onClick={() => setShowAddProduct(e.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow-sm"
                      style={{
                        background:
                          "linear-gradient(135deg, #7C3AED, #EA580C)",
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      <Plus className="w-3 h-3" />
                      Novo produto
                    </button>
                  </div>
                  {e.products.length === 0 ? (
                    <p
                      className="text-gray-400 text-sm text-center py-4"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Nenhum produto cadastrado
                    </p>
                  ) : (
                    <div className="space-y-2">
                      {e.products.map((p) => (
                        <div
                          key={p.id}
                          className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100"
                        >
                          {getPrimaryProductImage(p) && (
                            <div className="relative h-10 w-10 flex-shrink-0">
                              <img
                                src={getPrimaryProductImage(p)}
                                alt={p.name}
                                className="h-10 w-10 rounded-lg object-cover"
                              />
                              {getProductImages(p).length > 1 && (
                                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-purple-600 px-1 text-[10px] font-black text-white shadow">
                                  {getProductImages(p).length}
                                </span>
                              )}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p
                              className="text-gray-800 truncate text-sm"
                              style={{
                                fontFamily: "Nunito, sans-serif",
                                fontWeight: 700,
                              }}
                            >
                              {p.name}
                            </p>
                            {getProductPriceLabel(p) && (
                              <p
                                className="text-purple-600 text-xs font-bold"
                                style={{
                                  fontFamily: "Nunito, sans-serif",
                                }}
                              >
                                {getProductPriceLabel(p)}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() =>
                                setEditProduct({
                                  enterpriseId: e.id,
                                  product: p,
                                })
                              }
                              className="p-1.5 rounded-lg text-blue-500 hover:bg-blue-50 transition-colors"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() =>
                                setDeleteProduct({
                                  enterpriseId: e.id,
                                  product: p,
                                })
                              }
                              className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
