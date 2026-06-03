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
  QrCode,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import type { Product, Category } from "../types";
import { exportCatalogPDF } from "../utils/pdfExport";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUploadField } from "../components/ImageUploadField";
import { ProductImageGalleryField } from "../components/ProductImageGalleryField";
import {
  isValidEmail,
  isValidBrazilPhone,
  normalizeBrazilPhone,
} from "../utils/validation";
import { SubmitButton } from "../components/SubmitButton";
import { getProductPriceLabel, resolvePriceMode } from "../utils/pricing";
import { getPrimaryProductImage, getProductImages } from "../utils/productImages";
import QRCode from "react-qr-code";
import { getCategoryColors, getCategoryMeta } from "../utils/categoryStyle";

import { Modal } from "../components/shared/Modal";
import { Field, inputCls } from "../components/shared/Field";
import { ConfirmDialog } from "../components/shared/ConfirmDialog";
import { ProductForm } from "../components/shared/ProductForm";

import { EnterpriseCard } from "./owner/EnterpriseCard";
import { ProductsSection } from "./owner/ProductsSection";

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
  onSave: (data: typeof enterprise) => Promise<void> | void;
  onClose: () => void;
  categories: Category[];
}) {
  const [form, setForm] = useState({
    ...enterprise,
    tags: enterprise.tags.join(", "),
  });
  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const [emailError, setEmailError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const handleSave = async () => {
    setEmailError("");
    setWhatsappError("");
    const normalizedWhatsapp = normalizeBrazilPhone(form.whatsapp);
    if (form.email && !isValidEmail(form.email)) {
      setEmailError("E-mail inválido");
      throw new Error("Validation Error");
    }
    if (normalizedWhatsapp && !isValidBrazilPhone(normalizedWhatsapp)) {
      setWhatsappError(
        "Telefone inválido, use DDD + número (ex: 55999999999)",
      );
      throw new Error("Validation Error");
    }
    await onSave({
      ...form,
      whatsapp: normalizedWhatsapp,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category: form.category as Category,
    });
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className="space-y-4">
      <Field label="Nome do empreendimento *">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => {
            if (!form.name) setNameError("Campo obrigatório");
            else setNameError("");
          }}
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
        {nameError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {nameError}
          </p>
        )}
      </Field>
      <Field label="Categoria *">
        <select
          className={inputCls}
          value={form.category}
          onChange={(e) => set("category", e.target.value)}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Descrição curta *">
        <textarea
          className={inputCls}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          onBlur={() => {
            if (!form.description) setDescriptionError("Campo obrigatório");
            else setDescriptionError("");
          }}
          rows={2}
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
        {descriptionError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {descriptionError}
          </p>
        )}
      </Field>
      <Field label="Descrição completa">
        <textarea
          className={inputCls}
          value={form.fullDescription}
          onChange={(e) => set("fullDescription", e.target.value)}
          rows={3}
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <Field label="Imagem de capa">
        <ImageUploadField
          value={form.coverImage}
          onChange={(value) => set("coverImage", value)}
          ariaLabel="Area de upload da imagem de capa do empreendimento"
          emptyTitle="Arraste e solte a imagem de capa aqui"
          previewAlt="Preview da imagem de capa do empreendimento"
          buttonLabel="Carregar imagem de capa"
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="WhatsApp">
          <input
            className={inputCls}
            value={form.whatsapp}
            onChange={(e) =>
              set("whatsapp", normalizeBrazilPhone(e.target.value))
            }
            onBlur={(e) => {
              const v = normalizeBrazilPhone(e.target.value);
              if (v && !isValidBrazilPhone(v))
                setWhatsappError(
                  "Telefone inválido, use DDD + número (ex: 55999999999)",
                );
              else setWhatsappError("");
            }}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
          {whatsappError && (
            <p
              className="text-red-600 text-sm mt-1"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            >
              {whatsappError}
            </p>
          )}
        </Field>
        <Field label="Instagram">
          <input
            className={inputCls}
            value={form.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </Field>
      </div>
      <Field label="E-mail">
        <input
          className={inputCls}
          value={form.email || ""}
          onChange={(e) => set("email", e.target.value)}
          onBlur={(e) => {
            const v = e.target.value;
            if (v && !isValidEmail(v)) setEmailError("E-mail inválido");
            else setEmailError("");
          }}
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
        {emailError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {emailError}
          </p>
        )}
      </Field>
      <Field label="Tags (separadas por vírgula)">
        <input
          className={inputCls}
          value={form.tags}
          onChange={(e) => set("tags", e.target.value)}
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <SubmitButton
          onClick={handleSave}
          className="flex-1 py-2.5 rounded-xl text-white font-bold shadow-md hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)" }}
          idleText="Salvar alterações"
        />
        <button
          onClick={onClose}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-gray-200 text-gray-600 hover:bg-gray-50"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── MAIN OWNER PANEL ───────────────────────────────────────────────────────
export function OwnerPanel() {
  useEffect(() => {
    document.title = "Painel do Empreendedor | Vitrine HUBIS";
  }, []);

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
    categoryItems,
  } = useAuth();

  

  const [editingEnterprise, setEditingEnterprise] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editProductData, setEditProductData] = useState<Product | null>(null);
  const [deleteProductData, setDeleteProductData] = useState<Product | null>(
    null,
  );
  const [showQrCode, setShowQrCode] = useState(false);

  // Protect route
  useEffect(() => {
    if (!user) navigate("/login");
    else if (!isOwner) navigate("/admin");
  }, [user, isOwner, navigate]);

  if (!user || !isOwner || !myEnterprise)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p
            className="text-gray-600 mb-4"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Você não está vinculado a nenhum empreendimento.
          </p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="px-6 py-3 rounded-xl text-white font-bold"
            style={{
              background: "linear-gradient(135deg, #7C3AED, #EA580C)",
              fontFamily: "Nunito, sans-serif",
            }}
          >
            Voltar ao site
          </button>
        </div>
      </div>
    );

  const e = myEnterprise;

  const handleSaveEnterprise = async (data: Partial<typeof e>) => {
    const res = await updateEnterprise(e.id, data);
    if (!res) throw new Error("Failed");
  };

  const handleAddProduct = async (data: Partial<Product>) => {
    const priceMode = resolvePriceMode(data);
    const newProduct: Product = {
      id: `${e.id}-${Date.now()}`,
      name: data.name!,
      description: data.description || "",
      priceMode,
      price: data.price ?? data.priceMin ?? 0,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      image: data.image || "",
      images: data.images || (data.image ? [data.image] : []),
    };
    const res = await addProduct(e.id, newProduct);
    if (!res) throw new Error("Failed");
    setShowAddProduct(false);
  };

  const handleEditProduct = async (data: Partial<Product>) => {
    if (!editProductData) throw new Error("Failed");
    const res = await updateProduct(e.id, editProductData.id, data);
    if (!res) throw new Error("Failed");
    setEditProductData(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Accent bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, #7C3AED, #EA580C, #FBBF24, #2563EB)",
        }}
      />

      {/* Top nav bar */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <ImageWithFallback
                src="/logo-hubis.png"
                alt="HUB IS"
                className="h-8 w-auto object-contain"
              />
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
              onClick={() => {
                logout();
                navigate("/");
              }}
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
            style={{
              fontFamily: "Poppins, sans-serif",
              fontWeight: 800,
              fontSize: "1.6rem",
            }}
          >
            Meu Painel
          </h1>
          <p
            className="text-gray-500 text-sm"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
          >
            Gerencie seu empreendimento e catálogo de produtos
          </p>
        </div>

{/* ── ENTERPRISE CARD ──────────────────────────────────────── */}
        <EnterpriseCard 
          e={e}
          categoryItems={categoryItems}
          setShowQrCode={setShowQrCode}
          setEditingEnterprise={setEditingEnterprise}
        />

{/* ── PRODUCTS ─────────────────────────────────────────────── */}
        <ProductsSection 
          e={e}
          setShowAddProduct={setShowAddProduct}
          setEditProductData={setEditProductData}
          setDeleteProductData={setDeleteProductData}
        />
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────── */}
      {editingEnterprise && (
        <Modal
          title="Editar Empreendimento"
          onClose={() => setEditingEnterprise(false)}
        >
          <EnterpriseEditForm
            enterprise={{
              name: e.name,
              category: e.category,
              description: e.description,
              fullDescription: e.fullDescription || "",
              coverImage: e.coverImage,
              whatsapp: e.whatsapp || "",
              instagram: e.instagram || "",
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
        <Modal
          title={`Editar: ${editProductData.name}`}
          onClose={() => setEditProductData(null)}
        >
          <ProductForm
            initial={editProductData}
            onSave={handleEditProduct}
            onClose={() => setEditProductData(null)}
          />
        </Modal>
      )}

      {showQrCode && (
        <Modal
          title="QR Code da Página Pública"
          onClose={() => setShowQrCode(false)}
        >
          <div className="flex flex-col items-center gap-5">
            <div className="bg-white p-4 rounded-2xl border border-gray-200">
              <QRCode
                value={`${window.location.origin}/empreendimento/${e.id}`}
                size={220}
              />
            </div>

            <div className="w-full">
              <p
                className="text-gray-500 text-sm mb-2 text-center"
                style={{
                  fontFamily: "Nunito, sans-serif",
                  fontWeight: 600,
                }}
              >
                Link da página pública
              </p>

              <div className="flex gap-2">
                <input
                  readOnly
                  value={`${window.location.origin}/empreendimento/${e.id}`}
                  className={`${inputCls} flex-1`}
                  style={{ fontFamily: "Nunito, sans-serif" }}
                />

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/empreendimento/${e.id}`,
                    );
                  }}
                  className="px-4 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 transition-colors"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  Copiar
                </button>
              </div>
            </div>
          </div>
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
