import { Plus, ShoppingBag, Pencil, Trash2 } from "lucide-react";
import { getPrimaryProductImage, getProductImages } from "../../utils/productImages";
import { getProductPriceLabel } from "../../utils/pricing";

export function ProductsSection({
  e,
  setShowAddProduct,
  setEditProductData,
  setDeleteProductData
}: any) {
  return (
    <>
              
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-1 h-5 rounded-full"
                  style={{
                    background: "linear-gradient(180deg, #7C3AED, #EA580C)",
                  }}
                />
                <h2
                  className="text-gray-900"
                  style={{
                    fontFamily: "Poppins, sans-serif",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                  }}
                >
                  Catálogo de Produtos
                </h2>
              </div>
              <p
                className="text-gray-500 text-xs"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                {e.products.length} produto{e.products.length !== 1 ? "s" : ""}{" "}
                cadastrado{e.products.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
              style={{
                background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                fontFamily: "Nunito, sans-serif",
              }}
            >
              <Plus className="w-4 h-4" />
              Novo produto
            </button>
          </div>

          {e.products.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 bg-purple-50">
                <ShoppingBag className="w-8 h-8 text-purple-400" />
              </div>
              <p
                className="text-gray-500 mb-2"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                Nenhum produto cadastrado ainda
              </p>
              <button
                onClick={() => setShowAddProduct(true)}
                className="px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-md"
                style={{
                  background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                Adicionar primeiro produto
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {e.products.map((p) => (
                <div
                  key={p.id}
                  className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow"
                >
                  {getPrimaryProductImage(p) && (
                    <div className="relative overflow-hidden aspect-[4/3] bg-gray-50 flex items-center justify-center border-b border-gray-100">
                      <div
                        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-125 transition-transform duration-500 group-hover:scale-[1.35]"
                        style={{ backgroundImage: `url(${getPrimaryProductImage(p)})` }}
                      />
                      <img
                        src={getPrimaryProductImage(p)}
                        alt={p.name}
                        className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
                      />
                      {getProductImages(p).length > 1 && (
                        <span className="absolute right-2 top-2 z-20 rounded-full bg-white/95 px-2 py-1 text-xs font-bold text-purple-700 shadow">
                          {getProductImages(p).length} fotos
                        </span>
                      )}
                    </div>
                  )}
                  <div className="p-4">
                    <h3
                      className="text-gray-900 mb-1"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                        fontSize: "0.9rem",
                      }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2"
                      style={{
                        fontFamily: "Nunito, sans-serif",
                        fontWeight: 600,
                      }}
                    >
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      {getProductPriceLabel(p) ? (
                        <span
                          className="text-purple-700 font-black"
                          style={{
                            fontFamily: "Poppins, sans-serif",
                            fontSize: "1rem",
                          }}
                        >
                          {getProductPriceLabel(p)}
                        </span>
                      ) : (
                        <span />
                      )}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setEditProductData(p)}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors border border-blue-200"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setDeleteProductData(p)}
                          className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 transition-colors border border-red-200"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
    </>
  );
}