import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  Pencil,
  Trash2,
  Plus,
  LogOut,
  FileDown,
  X,
  Check,
  ShoppingBag,
  Home,
  Store,
  ExternalLink,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Product, Category } from "../types";
import { exportCatalogPDF } from "../utils/pdfExport";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

// ── SHARED COMPONENTS ──────────────────────────────────────────────────────

function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3
            className="text-gray-900"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.05rem" }}
          >
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 text-gray-500 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label
        className="block text-gray-700 mb-1"
        style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700, fontSize: "0.85rem" }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800";

function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <p className="text-gray-800 mb-6" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}

// ── PRODUCT FORM ───────────────────────────────────────────────────────────
function ProductForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: Partial<Product>;
  onSave: (data: Partial<Product>) => void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    price: initial?.price?.toString() || "",
    image: initial?.image || "",
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <Field label="Nome do produto *">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          placeholder="Nome"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <Field label="Descrição">
        <textarea
          className={inputCls}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Descreva o produto"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <Field label="Preço (R$) *">
        <input
          className={inputCls}
          type="number"
          min="0"
          step="0.01"
          value={form.price}
          onChange={(e) => set("price", e.target.value)}
          placeholder="0,00"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <Field label="URL da imagem">
        <input
          className={inputCls}
          value={form.image}
          onChange={(e) => set("image", e.target.value)}
          placeholder="https://..."
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() => {
            if (!form.name || !form.price) return;
            onSave({ ...form, price: parseFloat(form.price) || 0 });
          }}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold shadow-md transition-all hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
        >
          <Check className="w-4 h-4" />
          Salvar produto
        </button>
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── ENTERPRISE EDIT FORM ───────────────────────────────────────────────────
function EnterpriseEditForm({
  enterprise,
  onSave,
  onClose,
  categories,
}: {
  enterprise: {
    name: string;
    category: Category;
    description: string;
    fullDescription: string;
    coverImage: string;
    whatsapp: string;
    instagram: string;
    email?: string;
    tags: string[];
  };
  onSave: (data: typeof enterprise) => void;
  onClose: () => void;
  categories: Category[];
}) {
  const [form, setForm] = useState({
    ...enterprise,
    tags: enterprise.tags.join(", "),
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <div className="space-y-4">
      <Field label="Nome do empreendimento">
        <input className={inputCls} value={form.name} onChange={(e) => set("name", e.target.value)} style={{ fontFamily: "Nunito, sans-serif" }} />
      </Field>
      <Field label="Categoria">
          <select className={inputCls} value={form.category} onChange={(e) => set("category", e.target.value)} style={{ fontFamily: "Nunito, sans-serif" }}>
          {categories.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Descrição curta">
        <textarea className={inputCls} value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} style={{ fontFamily: "Nunito, sans-serif" }} />
      </Field>
      <Field label="Descrição completa">
        <textarea className={inputCls} value={form.fullDescription} onChange={(e) => set("fullDescription", e.target.value)} rows={3} style={{ fontFamily: "Nunito, sans-serif" }} />
      </Field>
      <Field label="URL da imagem">
        <input className={inputCls} value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} placeholder="https://..." style={{ fontFamily: "Nunito, sans-serif" }} />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="WhatsApp">
          <input className={inputCls} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} style={{ fontFamily: "Nunito, sans-serif" }} />
        </Field>
        <Field label="Instagram">
          <input className={inputCls} value={form.instagram} onChange={(e) => set("instagram", e.target.value)} style={{ fontFamily: "Nunito, sans-serif" }} />
        </Field>
      </div>
      <Field label="E-mail">
        <input className={inputCls} value={form.email || ""} onChange={(e) => set("email", e.target.value)} style={{ fontFamily: "Nunito, sans-serif" }} />
      </Field>
      <Field label="Tags (separadas por vírgula)">
        <input className={inputCls} value={form.tags} onChange={(e) => set("tags", e.target.value)} style={{ fontFamily: "Nunito, sans-serif" }} />
      </Field>
      <div className="flex gap-3 pt-2">
        <button
          onClick={() =>
            onSave({
              ...form,
              tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
              category: form.category as Category,
            })
          }
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold shadow-md"
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
        >
          <Check className="w-4 h-4" />
          Salvar alterações
        </button>
        <button onClick={onClose} className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50" style={{ fontFamily: "Nunito, sans-serif" }}>
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── MAIN OWNER PANEL ───────────────────────────────────────────────────────
export function OwnerPanel() {
  const navigate = useNavigate();
  const {
    user,
    myEnterprise,
    categories,
    isOwner,
    logout,
    updateEnterprise,
    addProduct,
    updateProduct,
    removeProduct,
  } = useAuth();

  const [editingEnterprise, setEditingEnterprise] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProductData, setEditProductData] = useState<Product | null>(null);
  const [deleteProductData, setDeleteProductData] = useState<Product | null>(null);

  // Protect route
  useEffect(() => {
    if (!user) navigate("/login");
    else if (!isOwner) navigate("/admin");
  }, [user, isOwner, navigate]);

  if (!user || !isOwner || !myEnterprise) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-gray-600 mb-4" style={{ fontFamily: "Nunito, sans-serif" }}>
          Você não está vinculado a nenhum empreendimento.
        </p>
        <button
          onClick={() => { logout(); navigate("/"); }}
          className="px-6 py-3 rounded-xl text-white font-bold"
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
        >
          Voltar ao site
        </button>
      </div>
    </div>
  );

  const e = myEnterprise;

  const handleSaveEnterprise = (data: Partial<typeof e>) => {
    updateEnterprise(e.id, data);
    setEditingEnterprise(false);
  };

  const handleAddProduct = (data: Partial<Product>) => {
    const newProduct: Product = {
      id: `${e.id}-${Date.now()}`,
      name: data.name!,
      description: data.description || "",
      price: data.price || 0,
      image: data.image || "",
    };
    addProduct(e.id, newProduct);
    setShowAddProduct(false);
  };

  const handleEditProduct = (data: Partial<Product>) => {
    if (!editProductData) return;
    updateProduct(e.id, editProductData.id, data);
    setEditProductData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accent bar */}
      <div
        className="h-1.5 w-full"
        style={{ background: "linear-gradient(90deg, #7C3AED, #EA580C, #FBBF24, #2563EB)" }}
      />

      {/* Top nav bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <ImageWithFallback src="/logo-hubis.jpg" alt="HUB IS" className="h-8 w-auto object-contain" />
            </Link>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-gray-300">|</span>
              <span
                className="text-purple-700 text-sm"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
              >
                🏪 Meu Empreendimento
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span
              className="hidden sm:block text-gray-500 text-sm"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
            >
              Olá, {user.name.split(" ")[0]}!
            </span>
            <Link
              to="/"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-gray-600 hover:bg-gray-100 text-sm font-bold transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Site</span>
            </Link>
            <button
              onClick={() => { logout(); navigate("/"); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-red-600 hover:bg-red-50 text-sm font-bold transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Sair</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Page title */}
        <div className="mb-6">
          <h1
            className="text-gray-900 mb-1"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.6rem" }}
          >
            Meu Painel
          </h1>
          <p className="text-gray-500 text-sm" style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}>
            Gerencie seu empreendimento e catálogo de produtos
          </p>
        </div>

        {/* ── ENTERPRISE CARD ──────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
          {/* Cover image */}
          <div className="relative h-40 sm:h-52 overflow-hidden">
            <img
              src={e.coverImage}
              alt={e.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6), transparent)" }} />
            <div className="absolute bottom-4 left-5 right-5 flex items-end justify-between">
              <div>
                <span
                  className="inline-block px-2.5 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/30 mb-2 backdrop-blur-sm"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  {e.category}
                </span>
                <h2
                  className="text-white"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.3rem", textShadow: "0 2px 8px rgba(0,0,0,0.4)" }}
                >
                  {e.name}
                </h2>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => exportCatalogPDF(e)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-colors"
                  style={{ background: "rgba(124,58,237,0.7)", fontFamily: "Nunito, sans-serif" }}
                >
                  <FileDown className="w-4 h-4" />
                  Baixar PDF
                </button>
                <button
                  onClick={() => setEditingEnterprise(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-white text-sm font-bold shadow-md backdrop-blur-sm border border-white/30 hover:bg-white/20 transition-colors"
                  style={{ background: "rgba(234,88,12,0.7)", fontFamily: "Nunito, sans-serif" }}
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
                { label: "WhatsApp", value: `+${e.whatsapp}`, color: "text-green-600" },
                { label: "Instagram", value: e.instagram, color: "text-pink-600" },
                ...(e.email ? [{ label: "E-mail", value: e.email, color: "text-blue-600" }] : []),
              ].map((c) => (
                <div key={c.label} className="flex items-center gap-2 text-sm">
                  <span
                    className="text-gray-500 w-20 flex-shrink-0"
                    style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
                  >
                    {c.label}:
                  </span>
                  <span className={`${c.color} font-semibold`} style={{ fontFamily: "Nunito, sans-serif" }}>
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
              onClick={() => exportCatalogPDF(e)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-orange-700 bg-orange-50 border border-orange-200 hover:bg-orange-100 transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <FileDown className="w-4 h-4" />
              Exportar catálogo PDF
            </button>
          </div>
        </div>

        {/* ── PRODUCTS ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-1 h-5 rounded-full" style={{ background: "linear-gradient(180deg, #7C3AED, #EA580C)" }} />
                <h2
                  className="text-gray-900"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "1.1rem" }}
                >
                  Catálogo de Produtos
                </h2>
              </div>
              <p
                className="text-gray-500 text-xs"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                {e.products.length} produto{e.products.length !== 1 ? "s" : ""} cadastrado{e.products.length !== 1 ? "s" : ""}
              </p>
            </div>
            <button
              onClick={() => setShowAddProduct(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
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
                style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)", fontFamily: "Nunito, sans-serif" }}
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
                  {p.image && (
                    <div className="h-36 overflow-hidden">
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3
                      className="text-gray-900 mb-1"
                      style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.9rem" }}
                    >
                      {p.name}
                    </h3>
                    <p
                      className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-2"
                      style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                    >
                      {p.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span
                        className="text-purple-700 font-black"
                        style={{ fontFamily: "Poppins, sans-serif", fontSize: "1rem" }}
                      >
                        R$ {p.price.toFixed(2).replace(".", ",")}
                      </span>
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
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────── */}
      {editingEnterprise && (
        <Modal title="Editar Empreendimento" onClose={() => setEditingEnterprise(false)}>
          <EnterpriseEditForm
            enterprise={{
              name: e.name,
              category: e.category,
              description: e.description,
              fullDescription: e.fullDescription,
              coverImage: e.coverImage,
              whatsapp: e.whatsapp,
              instagram: e.instagram,
              email: e.email,
              tags: e.tags,
            }}
            onSave={handleSaveEnterprise}
            onClose={() => setEditingEnterprise(false)}
            categories={categories}
          />
        </Modal>
      )}

      {showAddProduct && (
        <Modal title="Novo Produto" onClose={() => setShowAddProduct(false)}>
          <ProductForm
            onSave={handleAddProduct}
            onClose={() => setShowAddProduct(false)}
          />
        </Modal>
      )}

      {editProductData && (
        <Modal title={`Editar: ${editProductData.name}`} onClose={() => setEditProductData(null)}>
          <ProductForm
            initial={editProductData}
            onSave={handleEditProduct}
            onClose={() => setEditProductData(null)}
          />
        </Modal>
      )}

      {deleteProductData && (
        <ConfirmDialog
          message={`Deseja remover o produto "${deleteProductData.name}"?`}
          onConfirm={() => {
            removeProduct(e.id, deleteProductData.id);
            setDeleteProductData(null);
          }}
          onCancel={() => setDeleteProductData(null)}
        />
      )}
    </div>
  );
}
