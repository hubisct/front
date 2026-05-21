import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router";
import {
  LayoutDashboard,
  Store,
  Users,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  FileDown,
  ChevronDown,
  ChevronUp,
  X,
  Check,
  ShoppingBag,
  UserCheck,
  UserX,
  Eye,
  EyeOff,
  Home,
  Package,
  Tags,
} from "lucide-react";
import { useAuth, User } from "../contexts/AuthContext";
import type { Enterprise, Product, Category, CategoryItem } from "../types";
import * as api from "../api";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { exportCatalogPDF } from "../utils/pdfExport";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { ImageUploadField } from "../components/ImageUploadField";
import { ProductImageGalleryField } from "../components/ProductImageGalleryField";
import {
  isValidEmail,
  isValidPassword,
  isValidBrazilPhone,
  normalizeBrazilPhone,
} from "../utils/validation";
import { getProductPriceLabel, resolvePriceMode } from "../utils/pricing";
import { getPrimaryProductImage, getProductImages } from "../utils/productImages";
import { SubmitButton } from "../components/SubmitButton";

type Tab = "dashboard" | "enterprises" | "users" | "categories";
// ── MODAL ──────────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto mx-2 sm:mx-0">
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-gray-100 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3
            className="text-gray-900 text-base sm:text-lg"
            style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700 }}
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
        <div className="p-4 sm:p-5">{children}</div>
      </div>
    </div>
  );
}

// ── FORM FIELD ─────────────────────────────────────────────────────────────
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        className="block text-gray-700 mb-1"
        style={{
          fontFamily: "Nunito, sans-serif",
          fontWeight: 700,
          fontSize: "0.85rem",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputCls =
  "w-full px-3 py-2.5 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-100 outline-none transition-all bg-gray-50 focus:bg-white text-gray-800";

const btnPrimary =
  "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]";
const btnDanger =
  "flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg text-red-600 hover:bg-red-50 border border-red-200 font-bold text-xs transition-all";
const btnSecondary =
  "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all";

// ── ENTERPRISE FORM ────────────────────────────────────────────────────────
function EnterpriseForm({
  initial,
  onSave,
  onClose,
  categories,
}: {
  initial?: Partial<Enterprise>;
  onSave: (data: Partial<Enterprise>) => Promise<void> | void;
  onClose: () => void;
  categories: Category[];
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    category: initial?.category || ("Artesanato" as Category),
    description: initial?.description || "",
    fullDescription: initial?.fullDescription || "",
    coverImage: initial?.coverImage || "",
    whatsapp: initial?.whatsapp || "",
    instagram: initial?.instagram || "",
    email: initial?.email || "",
    tags: (initial?.tags || []).join(", "),
  });

  const [emailError, setEmailError] = useState("");
  const [whatsappError, setWhatsappError] = useState("");
  const [nameError, setNameError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setEmailError("");
    setWhatsappError("");
    setNameError("");
    setDescriptionError("");
    const normalizedWhatsapp = normalizeBrazilPhone(form.whatsapp);
    if (!form.name) {
      setNameError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    if (!form.description) {
      setDescriptionError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    if (form.email && !isValidEmail(form.email)) {
      setEmailError("E-mail inválido");
      throw new Error("Validation Error");
    }
    if (normalizedWhatsapp && !isValidBrazilPhone(normalizedWhatsapp)) {
      setWhatsappError("Telefone inválido, use DDD + número (ex: 55999999999)");
      throw new Error("Validation Error");
    }
    await onSave({
      ...form,
      whatsapp: normalizedWhatsapp,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
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
          placeholder="Nome"
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
          placeholder="Descrição breve"
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
          placeholder="Descrição detalhada"
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="WhatsApp (DDD + número)">
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
            placeholder="55999999999"
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
            placeholder="@perfil"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </Field>
      </div>
      <Field label="E-mail">
        <input
          className={inputCls}
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={(e) => {
            const v = e.target.value;
            if (v && !isValidEmail(v)) setEmailError("E-mail inválido");
            else setEmailError("");
          }}
          placeholder="email@exemplo.com"
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
          placeholder="artesanato, moda, local"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <SubmitButton
          onClick={handleSave}
          className={btnPrimary + " flex-1"}
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)" }}
          idleText="Salvar empreendimento"
        />
        <button
          onClick={onClose}
          className={
            btnSecondary + " border-gray-200 text-gray-600 hover:bg-gray-50"
          }
        >
          Cancelar
        </button>
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
  onSave: (data: Partial<Product>) => Promise<void> | void;
  onClose: () => void;
}) {
  const initialPriceMode = resolvePriceMode(initial || {});
  const initialImages = getProductImages(initial || {});
  const [form, setForm] = useState({
    name: initial?.name || "",
    description: initial?.description || "",
    priceMode: initialPriceMode,
    price:
      initialPriceMode === "single" ? initial?.price?.toString() || "" : "",
    priceMin:
      initialPriceMode === "range"
        ? initial?.priceMin?.toString() || initial?.price?.toString() || ""
        : "",
    priceMax:
      initialPriceMode === "range"
        ? initial?.priceMax?.toString() || initial?.price?.toString() || ""
        : "",
    image: getPrimaryProductImage(initial || {}),
    images: initialImages,
  });

  const [productNameError, setProductNameError] = useState("");
  const [productPriceError, setProductPriceError] = useState("");

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const setImages = (images: string[]) => {
    setForm((f) => ({ ...f, images, image: images[0] || "" }));
  };

  const handleSave = async () => {
    setProductNameError("");
    setProductPriceError("");
    if (!form.name) {
      setProductNameError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    if (form.priceMode === "single") {
      if (!form.price) {
        setProductPriceError("Campo obrigatório");
        throw new Error("Validation Error");
      }
      const singlePrice = parseFloat(form.price.replace(",", "."));
      if (Number.isNaN(singlePrice) || singlePrice < 0) {
        setProductPriceError("Informe um preço válido");
        throw new Error("Validation Error");
      }
      await onSave({
        name: form.name,
        description: form.description,
        image: form.image,
        images: form.images,
        priceMode: "single",
        price: singlePrice,
      });
      setTimeout(() => onClose(), 1200);
      return;
    }
    if (form.priceMode === "range") {
      if (!form.priceMin || !form.priceMax) {
        setProductPriceError("Preencha mínimo e máximo");
        throw new Error("Validation Error");
      }
      const min = parseFloat(form.priceMin.replace(",", "."));
      const max = parseFloat(form.priceMax.replace(",", "."));
      if (Number.isNaN(min) || Number.isNaN(max) || min < 0 || max < 0) {
        setProductPriceError("Informe uma faixa válida");
        throw new Error("Validation Error");
      }
      if (min > max) {
        setProductPriceError("O mínimo não pode ser maior que o máximo");
        throw new Error("Validation Error");
      }
      await onSave({
        name: form.name,
        description: form.description,
        image: form.image,
        images: form.images,
        priceMode: "range",
        price: min,
        priceMin: min,
        priceMax: max,
      });
      setTimeout(() => onClose(), 1200);
      return;
    }
    await onSave({
      name: form.name,
      description: form.description,
      image: form.image,
      images: form.images,
      priceMode: "hidden",
      price: 0,
    });
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className="space-y-4">
      <Field label="Nome do produto *">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => {
            if (!form.name) setProductNameError("Campo obrigatório");
            else setProductNameError("");
          }}
          placeholder="Nome"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
        {productNameError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {productNameError}
          </p>
        )}
      </Field>
      <Field label="Descrição">
        <textarea
          className={inputCls}
          value={form.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          placeholder="Descrição do produto"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
      </Field>
      <Field label="Exibição de preço *">
        <select
          className={inputCls}
          value={form.priceMode}
          onChange={(e) => {
            set("priceMode", e.target.value);
            setProductPriceError("");
          }}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <option value="single">Preço único</option>
          <option value="range">Faixa de preço</option>
          <option value="hidden">Não mostrar preço</option>
        </select>
      </Field>
      {form.priceMode === "single" && (
        <Field label="Preço (R$) *">
          <input
            className={inputCls}
            type="text"
            inputMode="decimal"
            value={form.price}
            onChange={(e) => set("price", e.target.value)}
            onBlur={() => {
              if (!form.price) setProductPriceError("Campo obrigatório");
              else setProductPriceError("");
            }}
            placeholder="0,00"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
        </Field>
      )}
      {form.priceMode === "range" && (
        <div className="grid grid-cols-2 gap-3">
          <Field label="Preço mínimo (R$) *">
            <input
              className={inputCls}
              type="text"
              inputMode="decimal"
              value={form.priceMin}
              onChange={(e) => set("priceMin", e.target.value)}
              placeholder="0,00"
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </Field>
          <Field label="Preço máximo (R$) *">
            <input
              className={inputCls}
              type="text"
              inputMode="decimal"
              value={form.priceMax}
              onChange={(e) => set("priceMax", e.target.value)}
              placeholder="0,00"
              style={{ fontFamily: "Nunito, sans-serif" }}
            />
          </Field>
        </div>
      )}
      {productPriceError && (
        <p
          className="text-red-600 text-sm mt-1"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
        >
          {productPriceError}
        </p>
      )}
      <Field label="Fotos do produto">
        <ProductImageGalleryField
          value={form.images}
          onChange={setImages}
        />
      </Field>
      <div className="flex gap-3 pt-2">
        <SubmitButton
          onClick={handleSave}
          className={btnPrimary + " flex-1"}
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)" }}
          idleText="Salvar produto"
        />
        <button
          onClick={onClose}
          className={
            btnSecondary + " border-gray-200 text-gray-600 hover:bg-gray-50"
          }
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── USER FORM ──────────────────────────────────────────────────────────────
function UserForm({
  initial,
  enterprises,
  onSave,
  onClose,
}: {
  initial?: Partial<User>;
  enterprises: Enterprise[];
  onSave: (data: Omit<User, "id">) => Promise<void> | void;
  onClose: () => void;
}) {
  const [form, setForm] = useState({
    name: initial?.name || "",
    email: initial?.email || "",
    password: initial?.password || "",
    role: initial?.role || ("owner" as "admin" | "owner"),
    enterpriseId: initial?.enterpriseId || "",
    active: initial?.active !== undefined ? initial.active : true,
  });
  const [showPwd, setShowPwd] = useState(false);
  const [userEmailError, setUserEmailError] = useState("");
  const [userPasswordError, setUserPasswordError] = useState("");
  const [userNameError, setUserNameError] = useState("");

  const set = (k: string, v: string | boolean) =>
    setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setUserEmailError("");
    setUserPasswordError("");
    setUserNameError("");
    if (!form.name) {
      setUserNameError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    if (!form.email || !form.password) throw new Error("Validation Error");
    if (!isValidEmail(form.email)) {
      setUserEmailError("E-mail inválido");
      throw new Error("Validation Error");
    }
    if (!isValidPassword(form.password)) {
      setUserPasswordError("Senha deve ter ao menos 10 caracteres");
      throw new Error("Validation Error");
    }
    await onSave({ ...form, role: form.role as "admin" | "owner" });
    setTimeout(() => onClose(), 1200);
  };

  return (
    <div className="space-y-4">
      <Field label="Nome completo *">
        <input
          className={inputCls}
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          onBlur={() => {
            if (!form.name) setUserNameError("Campo obrigatório");
            else setUserNameError("");
          }}
          placeholder="Nome"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
        {userNameError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {userNameError}
          </p>
        )}
      </Field>
      <Field label="E-mail *">
        <input
          className={inputCls}
          type="email"
          value={form.email}
          onChange={(e) => set("email", e.target.value)}
          onBlur={(e) => {
            const v = e.target.value;
            if (!v) setUserEmailError("E-mail obrigatório");
            else if (!isValidEmail(v)) setUserEmailError("E-mail inválido");
            else setUserEmailError("");
          }}
          placeholder="email@exemplo.com"
          style={{ fontFamily: "Nunito, sans-serif" }}
        />
        {userEmailError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {userEmailError}
          </p>
        )}
      </Field>
      <Field label="Senha *">
        <div className="relative">
          <input
            className={inputCls}
            type={showPwd ? "text" : "password"}
            value={form.password}
            onChange={(e) => set("password", e.target.value)}
            onBlur={(e) => {
              const v = e.target.value;
              if (!v) setUserPasswordError("Senha obrigatória");
              else if (!isValidPassword(v))
                setUserPasswordError("Senha deve ter ao menos 10 caracteres");
              else setUserPasswordError("");
            }}
            placeholder="••••••••"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
          <button
            type="button"
            onClick={() => setShowPwd(!showPwd)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
          >
            {showPwd ? (
              <Eye className="w-4 h-4" />
            ) : (
              <EyeOff className="w-4 h-4" />
            )}
          </button>
        </div>
        {userPasswordError && (
          <p
            className="text-red-600 text-sm mt-1"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
          >
            {userPasswordError}
          </p>
        )}
      </Field>
      <Field label="Perfil de acesso">
        <select
          className={inputCls}
          value={form.role}
          onChange={(e) => set("role", e.target.value)}
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <option value="owner">Dono de empreendimento</option>
          <option value="admin">Administrador</option>
        </select>
      </Field>
      {form.role === "owner" && (
        <Field label="Empreendimento vinculado">
          <select
            className={inputCls}
            value={form.enterpriseId}
            onChange={(e) => set("enterpriseId", e.target.value)}
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            <option value="">Selecione...</option>
            {enterprises.map((e) => (
              <option key={e.id} value={e.id}>
                {e.name}
              </option>
            ))}
          </select>
        </Field>
      )}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => set("active", !form.active)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            form.active ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              form.active ? "translate-x-6" : "translate-x-1"
            }`}
          />
        </button>
        <span
          className="text-sm font-semibold text-gray-600"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Conta {form.active ? "ativa" : "inativa"}
        </span>
      </div>
      <div className="flex gap-3 pt-2">
        <SubmitButton
          onClick={handleSave}
          className={btnPrimary + " flex-1"}
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)" }}
          idleText="Salvar usuário"
        />
        <button
          onClick={onClose}
          className={
            btnSecondary + " border-gray-200 text-gray-600 hover:bg-gray-50"
          }
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── CATEGORY FORM ─────────────────────────────────────────────────────────
function CategoryForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: CategoryItem | null;
  onSave: (name: string) => Promise<void> | void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");

  const handleSave = async () => {
    setNameError("");
    setServerError("");
    const trimmed = name.trim();
    if (!trimmed) {
      setNameError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    try {
      await onSave(trimmed);
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao salvar categoria";
      setServerError(msg);
      throw err;
    }
  };

  return (
    <div className="space-y-4">
      <Field label="Nome da categoria *">
        <input
          className={inputCls}
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (nameError) setNameError("");
            if (serverError) setServerError("");
          }}
          onBlur={() => {
            if (!name.trim()) setNameError("Campo obrigatório");
          }}
          placeholder="Ex: Artesanato"
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
      {serverError && (
        <div
          className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 font-semibold"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          {serverError}
        </div>
      )}
      <div className="flex gap-3 pt-2">
        <SubmitButton
          onClick={handleSave}
          className={btnPrimary + " flex-1"}
          style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)" }}
          idleText="Salvar categoria"
        />
        <button
          onClick={onClose}
          className={
            btnSecondary + " border-gray-200 text-gray-600 hover:bg-gray-50"
          }
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

// ── CONFIRM DIALOG ─────────────────────────────────────────────────────────
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
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <p
          className="text-gray-800 mb-6"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
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

// ── MAIN ADMIN PANEL ───────────────────────────────────────────────────────
export function AdminPanel() {
  useEffect(() => {
      document.title = "Painel do Administrador | Vitrine HUBIS";
    }, []);

  const navigate = useNavigate();
  const {
    user,
    users,
    enterprises,
    categories,
    isAdmin,
    refreshCategories,
    logout,
    addEnterprise,
    updateEnterprise,
    removeEnterprise,
    addProduct,
    updateProduct,
    removeProduct,
    addUser,
    updateUser,
    removeUser,
  } = useAuth();

  const [tab, setTab] = useState<Tab>("dashboard");
  const [categoryItems, setCategoryItems] = useState<CategoryItem[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [categoryPage, setCategoryPage] = useState(1);
  const [expandedEnterprise, setExpandedEnterprise] = useState<string | null>(
    null,
  );

  // Enterprise modals
  const [showAddEnterprise, setShowAddEnterprise] = useState(false);
  const [editEnterprise, setEditEnterprise] = useState<Enterprise | null>(null);
  const [deleteEnterprise, setDeleteEnterprise] = useState<Enterprise | null>(
    null,
  );

  // Product modals
  const [showAddProduct, setShowAddProduct] = useState<string | null>(null); // enterpriseId
  const [editProduct, setEditProduct] = useState<{
    enterpriseId: string;
    product: Product;
  } | null>(null);
  const [deleteProduct, setDeleteProduct] = useState<{
    enterpriseId: string;
    product: Product;
  } | null>(null);

  // User modals
  const [showAddUser, setShowAddUser] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [deleteUser, setDeleteUser] = useState<User | null>(null);

  // Category modals
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [editCategory, setEditCategory] = useState<CategoryItem | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<CategoryItem | null>(null);

  // Protect route
  useEffect(() => {
    if (!user) navigate("/login");
    else if (!isAdmin) navigate("/painel");
  }, [user, isAdmin, navigate]);

  useEffect(() => {
    if (!user || !isAdmin) return;
    const load = async () => {
      setCategoriesLoading(true);
      setCategoryError("");
      try {
        const data = await api.getCategoryObjects();
        setCategoryItems(data);
      } catch (err) {
        setCategoryError("Nao foi possivel carregar as categorias.");
      } finally {
        setCategoriesLoading(false);
      }
    };
    load();
  }, [user, isAdmin]);

  if (!user || !isAdmin) return null;

  const ownerUsers = users.filter((u) => u.role === "owner");
  const adminUsers = users.filter((u) => u.role === "admin");
  const sortedCategories = [...categoryItems].sort((a, b) =>
    a.name.localeCompare(b.name, "pt-BR"),
  );
  const categoriesPerPage = 15;
  const totalCategoryPages = Math.max(
    1,
    Math.ceil(sortedCategories.length / categoriesPerPage),
  );
  const categoryStart = (categoryPage - 1) * categoriesPerPage;
  const pagedCategories = sortedCategories.slice(
    categoryStart,
    categoryStart + categoriesPerPage,
  );

  useEffect(() => {
    if (categoryPage > totalCategoryPages) {
      setCategoryPage(totalCategoryPages);
    }
  }, [categoryPage, totalCategoryPages]);

  const resolveCategoryError = (err: unknown, action: "save" | "delete") => {
    const status = (err as any)?.response?.status;
    if (status === 409) {
      return action === "delete"
        ? "Esta categoria esta em uso por algum empreendimento."
        : "Esta categoria ja existe.";
    }
    if (status === 400) return "Informe um nome valido.";
    return action === "delete"
      ? "Nao foi possivel excluir a categoria."
      : "Nao foi possivel salvar a categoria.";
  };

  const handleAddEnterprise = async (data: Partial<Enterprise>) => {
    const newEnterprise: Enterprise = {
      id: data
        .name!.toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
      name: data.name!,
      category: data.category || "Artesanato",
      description: data.description || "",
      fullDescription: data.fullDescription || data.description || "",
      coverImage: data.coverImage || "",
      whatsapp: data.whatsapp || "",
      instagram: data.instagram || "",
      email: data.email,
      tags: data.tags || [],
      products: [],
    };
    const res = await addEnterprise(newEnterprise);
    if (!res) throw new Error("Failed to add enterprise");
  };

  const handleEditEnterprise = async (data: Partial<Enterprise>) => {
    if (!editEnterprise) throw new Error("No enterprise to edit");
    const res = await updateEnterprise(editEnterprise.id, data);
    if (!res) throw new Error("Failed to edit enterprise");
  };

  const handleDeleteEnterprise = async () => {
    if (!deleteEnterprise) return;
    await removeEnterprise(deleteEnterprise.id);
    setDeleteEnterprise(null);
    if (expandedEnterprise === deleteEnterprise.id) setExpandedEnterprise(null);
  };

  const handleAddProduct = async (enterpriseId: string, data: Partial<Product>) => {
    const priceMode = resolvePriceMode(data);
    const newProduct: Product = {
      id: `${enterpriseId}-${Date.now()}`,
      name: data.name!,
      description: data.description || "",
      priceMode,
      price: data.price ?? data.priceMin ?? 0,
      priceMin: data.priceMin,
      priceMax: data.priceMax,
      image: data.image || "",
      images: data.images || (data.image ? [data.image] : []),
    };
    const res = await addProduct(enterpriseId, newProduct);
    if (!res) throw new Error("Failed to add product");
    // Removed toast here as it is now animated in the button
  };

  const handleEditProduct = async (data: Partial<Product>) => {
    if (!editProduct) throw new Error("No product to edit");
    const res = await updateProduct(editProduct.enterpriseId, editProduct.product.id, data);
    if (!res) throw new Error("Failed to edit product");
  };

  const handleAddUser = async (data: Omit<User, "id">) => {
    const res = await addUser(data);
    if (!res) throw new Error("Failed to add user");
    // Removed toast here as it is now animated in the button
  };

  const handleEditUser = async (data: Omit<User, "id">) => {
    if (!editUser) throw new Error("No user to edit");
    const res = await updateUser(editUser.id, data);
    if (!res) throw new Error("Failed to edit user");
  };

  const handleAddCategory = async (name: string) => {
    setCategoryError("");
    try {
      const created = await api.createCategory(name);
      setCategoryItems((prev) => [...prev, created]);
      await refreshCategories();
    } catch (err) {
      throw new Error(resolveCategoryError(err, "save"));
    }
  };

  const handleEditCategory = async (name: string) => {
    if (!editCategory) throw new Error("No category to edit");
    setCategoryError("");
    try {
      const updated = await api.updateCategory(editCategory.id, name);
      setCategoryItems((prev) =>
        prev.map((c) => (c.id === editCategory.id ? updated : c)),
      );
      await refreshCategories();
    } catch (err) {
      throw new Error(resolveCategoryError(err, "save"));
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteCategory) return;
    setCategoryError("");
    try {
      await api.deleteCategory(deleteCategory.id);
      setCategoryItems((prev) =>
        prev.filter((c) => c.id !== deleteCategory.id),
      );
      await refreshCategories();
      setDeleteCategory(null);
    } catch (err) {
      setCategoryError(resolveCategoryError(err, "delete"));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <div
        className="h-1.5 w-full"
        style={{
          background:
            "linear-gradient(90deg, #7C3AED, #EA580C, #FBBF24, #2563EB)",
        }}
      />

      <div className="flex flex-1">
        {/* ── SIDEBAR ────────────────────────────────────────────────── */}
        <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 min-h-screen sticky top-0 h-screen">
          {/* Logo area */}
          <div className="p-5 border-b border-gray-100">
            <Link to="/">
              <ImageWithFallback
                src="/logo-hubis.png"
                alt="HUB IS"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <div className="mt-3 px-3 py-2 rounded-xl bg-purple-50 border border-purple-100">
              <p
                className="text-purple-700 text-xs"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
              >
                🛡️ Painel Administrativo
              </p>
              <p
                className="text-purple-500 text-xs truncate"
                style={{ fontFamily: "Nunito, sans-serif" }}
              >
                {user.name}
              </p>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 p-4 space-y-1">
            {(
              [
                {
                  id: "dashboard",
                  icon: LayoutDashboard,
                  label: "Visão Geral",
                },
                { id: "enterprises", icon: Store, label: "Empreendimentos" },
                { id: "users", icon: Users, label: "Usuários" },
                { id: "categories", icon: Tags, label: "Categorias" },
              ] as { id: Tab; icon: typeof LayoutDashboard; label: string }[]
            ).map(({ id, icon: Icon, label }) => (
              <button
                key={id}
                onClick={() => setTab(id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left font-bold text-sm ${
                  tab === id
                    ? "text-white shadow-md"
                    : "text-gray-600 hover:bg-gray-50 hover:text-purple-700"
                }`}
                style={{
                  background:
                    tab === id
                      ? "linear-gradient(135deg, #7C3AED, #EA580C)"
                      : "transparent",
                  fontFamily: "Nunito, sans-serif",
                }}
              >
                <Icon className="w-4.5 h-4.5 w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          {/* Bottom actions */}
          <div className="p-4 border-t border-gray-100 space-y-2">
            <Link
              to="/"
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-600 hover:bg-gray-50 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <Home className="w-4 h-4" />
              Ver site público
            </Link>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-red-600 hover:bg-red-50 font-bold text-sm transition-colors"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </aside>

        {/* ── MAIN CONTENT ───────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden">
          {/* Mobile top bar */}
          <div className="md:hidden bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
            <Link to="/">
              <ImageWithFallback
                src="/logo-hubis.png"
                alt="HUB IS"
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex gap-1">
              {(
                [
                  { id: "dashboard", icon: LayoutDashboard },
                  { id: "enterprises", icon: Store },
                  { id: "users", icon: Users },
                  { id: "categories", icon: Tags },
                ] as { id: Tab; icon: typeof LayoutDashboard }[]
              ).map(({ id, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`p-2 rounded-xl transition-colors ${
                    tab === id
                      ? "text-purple-700 bg-purple-50"
                      : "text-gray-500"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                </button>
              ))}
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
                className="p-2 rounded-xl text-red-500 hover:bg-red-50"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="p-4 md:p-6 lg:p-8 overflow-y-auto">
            {/* ── DASHBOARD TAB ──────────────────────────────────────── */}
            {tab === "dashboard" && (
              <div>
                <h1
                  className="text-gray-900 text-xl sm:text-2xl lg:text-3xl mb-4 sm:mb-6"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
                >
                  Visão Geral
                </h1>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
                  {[
                    {
                      label: "Empreendimentos",
                      value: enterprises.length,
                      icon: Store,
                      color: "#7C3AED",
                      bg: "#F3F0FF",
                    },
                    {
                      label: "Produtos",
                      value: enterprises.reduce(
                        (a, e) => a + e.products.length,
                        0,
                      ),
                      icon: Package,
                      color: "#EA580C",
                      bg: "#FFF7ED",
                    },
                    {
                      label: "Donos Cadastrados",
                      value: ownerUsers.length,
                      icon: Users,
                      color: "#2563EB",
                      bg: "#EFF6FF",
                    },
                    {
                      label: "Usuários Ativos",
                      value: users.filter((u) => u.active).length,
                      icon: UserCheck,
                      color: "#16A34A",
                      bg: "#F0FDF4",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className="bg-white rounded-2xl p-3 sm:p-5 border border-gray-100 shadow-sm"
                    >
                      <div
                        className="w-8 sm:w-10 h-8 sm:h-10 rounded-xl flex items-center justify-center mb-2 sm:mb-3"
                        style={{ background: stat.bg }}
                      >
                        <stat.icon
                          className="w-4 h-4 sm:w-5 sm:h-5"
                          style={{ color: stat.color }}
                        />
                      </div>
                      <p
                        className="text-xl sm:text-2xl font-black text-gray-900"
                        style={{ fontFamily: "Poppins, sans-serif" }}
                      >
                        {stat.value}
                      </p>
                      <p
                        className="text-gray-500 text-sm"
                        style={{
                          fontFamily: "Nunito, sans-serif",
                          fontWeight: 600,
                        }}
                      >
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Quick actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    {
                      label: "Adicionar empreendimento",
                      icon: Store,
                      action: () => {
                        setTab("enterprises");
                        setShowAddEnterprise(true);
                      },
                      color: "linear-gradient(135deg, #7C3AED, #EA580C)",
                    },
                    {
                      label: "Cadastrar novo usuário",
                      icon: Users,
                      action: () => {
                        setTab("users");
                        setShowAddUser(true);
                      },
                      color: "linear-gradient(135deg, #2563EB, #7C3AED)",
                    },
                    {
                      label: "Ver site público",
                      icon: Home,
                      action: () => navigate("/"),
                      color: "linear-gradient(135deg, #EA580C, #FBBF24)",
                    },
                  ].map((action) => (
                    <button
                      key={action.label}
                      onClick={action.action}
                      className="flex items-center justify-center gap-2 sm:gap-3 p-3 sm:p-4 rounded-2xl text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
                      style={{
                        background: action.color,
                        fontFamily: "Nunito, sans-serif",
                      }}
                    >
                      <action.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      {action.label}
                    </button>
                  ))}
                </div>

                {/* Recent enterprises */}
                <div className="mt-6 sm:mt-8">
                  <h2
                    className="text-gray-800 mb-3 sm:mb-4 text-base sm:text-lg"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 700,
                    }}
                  >
                    Empreendimentos recentes
                  </h2>
                  <div className="space-y-2 sm:space-y-3">
                    {enterprises.slice(0, 5).map((e) => (
                      <div
                        key={e.id}
                        className="flex items-center gap-3 sm:gap-4 bg-white rounded-xl p-3 sm:p-4 border border-gray-100 shadow-sm"
                      >
                        <img
                          src={e.coverImage}
                          alt={e.name}
                          className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p
                            className="text-gray-900 truncate text-sm"
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
                        <button
                          onClick={() => exportCatalogPDF(e)}
                          className="flex items-center gap-1 px-2 sm:px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-200 hover:bg-purple-100 transition-colors"
                          style={{ fontFamily: "Nunito, sans-serif" }}
                        >
                          <FileDown className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">PDF</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── ENTERPRISES TAB ───────────────────────────────────── */}
            {tab === "enterprises" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h1
                    className="text-gray-900 text-xl sm:text-2xl lg:text-3xl"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    Empreendimentos
                  </h1>
                  <button
                    onClick={() => setShowAddEnterprise(true)}
                    className={btnPrimary + " text-sm"}
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">
                      Novo empreendimento
                    </span>
                    <span className="sm:hidden">Novo</span>
                  </button>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {enterprises.map((e) => (
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
                            onClick={() => exportCatalogPDF(e)}
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
                  ))}
                </div>
              </div>
            )}

            {/* ── CATEGORIES TAB ───────────────────────────────────── */}
            {tab === "categories" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h1
                    className="text-gray-900 text-xl sm:text-2xl lg:text-3xl"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    Gestão de Categorias
                  </h1>
                  <button
                    onClick={() => {
                      setShowAddCategory(true);
                      setCategoryError("");
                    }}
                    className={btnPrimary + " text-sm"}
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nova categoria</span>
                    <span className="sm:hidden">Nova</span>
                  </button>
                </div>

                {categoryError && (
                  <div
                    className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-semibold"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    {categoryError}
                  </div>
                )}

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 via-white to-orange-50">
                        <TableHead className="text-gray-700 text-xs uppercase tracking-wider font-semibold">
                          Categoria
                        </TableHead>
                        <TableHead className="text-right text-gray-700 text-xs uppercase tracking-wider font-semibold">
                          Acoes
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="[&>tr:nth-child(even)]:bg-gray-50/60">
                      {categoriesLoading && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center text-gray-400"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            Carregando categorias...
                          </TableCell>
                        </TableRow>
                      )}
                      {!categoriesLoading && sortedCategories.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center text-gray-400"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            Nenhuma categoria cadastrada
                          </TableCell>
                        </TableRow>
                      )}
                      {!categoriesLoading &&
                        pagedCategories.map((cat) => (
                          <TableRow key={cat.id}>
                            <TableCell className="py-3">
                              <p
                                className="text-gray-900 font-bold text-sm sm:text-base truncate"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                {cat.name}
                              </p>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="inline-flex items-center gap-1">
                                <button
                                  onClick={() => {
                                    setEditCategory(cat);
                                    setCategoryError("");
                                  }}
                                  className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                                  title="Editar"
                                >
                                  <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setDeleteCategory(cat);
                                    setCategoryError("");
                                  }}
                                  className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                                  title="Excluir"
                                >
                                  <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                                </button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
                {!categoriesLoading && sortedCategories.length > 0 && (
                  <div className="flex items-center justify-between mt-4">
                    <span
                      className="text-sm text-gray-500 font-semibold"
                      style={{ fontFamily: "Nunito, sans-serif" }}
                    >
                      Pagina {categoryPage} de {totalCategoryPages}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          setCategoryPage((p) => Math.max(1, p - 1))
                        }
                        disabled={categoryPage === 1}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Anterior
                      </button>
                      <button
                        onClick={() =>
                          setCategoryPage((p) =>
                            Math.min(totalCategoryPages, p + 1),
                          )
                        }
                        disabled={categoryPage === totalCategoryPages}
                        className="px-3 py-1.5 rounded-lg text-sm font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Proxima
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ── USERS TAB ─────────────────────────────────────────── */}
            {tab === "users" && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0 mb-4 sm:mb-6">
                  <h1
                    className="text-gray-900 text-xl sm:text-2xl lg:text-3xl"
                    style={{
                      fontFamily: "Poppins, sans-serif",
                      fontWeight: 800,
                    }}
                  >
                    Gestão de Usuários
                  </h1>
                  <button
                    onClick={() => setShowAddUser(true)}
                    className={btnPrimary + " text-sm"}
                    style={{
                      background: "linear-gradient(135deg, #7C3AED, #EA580C)",
                    }}
                  >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Novo usuário</span>
                    <span className="sm:hidden">Novo</span>
                  </button>
                </div>

                {/* Owners */}
                <div className="mb-6 sm:mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-1.5 h-5 rounded-full"
                      style={{
                        background: "linear-gradient(180deg, #7C3AED, #EA580C)",
                      }}
                    />
                    <h2
                      className="text-gray-800 text-sm sm:text-base"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Donos de Empreendimentos ({ownerUsers.length})
                    </h2>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {ownerUsers.map((u) => {
                      const linked = enterprises.find(
                        (e) => e.id === u.enterpriseId,
                      );
                      return (
                        <div
                          key={u.id}
                          className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
                        >
                          <div
                            className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                            style={{
                              background:
                                "linear-gradient(135deg, #7C3AED, #EA580C)",
                            }}
                          >
                            {u.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0 order-1 sm:order-none">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p
                                className="text-gray-900 font-bold text-sm"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                {u.name}
                              </p>
                              <span
                                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                                  u.active
                                    ? "bg-green-100 text-green-700"
                                    : "bg-red-100 text-red-700"
                                }`}
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                {u.active ? "Ativo" : "Inativo"}
                              </span>
                            </div>
                            <p
                              className="text-gray-500 text-xs truncate"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              {u.email}
                            </p>
                            {linked && (
                              <p
                                className="text-purple-600 text-xs font-semibold truncate"
                                style={{ fontFamily: "Nunito, sans-serif" }}
                              >
                                📌 {linked.name}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">
                            <button
                              onClick={() =>
                                updateUser(u.id, { active: !u.active })
                              }
                              className={`p-1.5 sm:p-2 rounded-xl border transition-colors ${
                                u.active
                                  ? "text-orange-500 border-orange-200 hover:bg-orange-50"
                                  : "text-green-500 border-green-200 hover:bg-green-50"
                              }`}
                              title={u.active ? "Desativar" : "Ativar"}
                            >
                              {u.active ? (
                                <UserX className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                              ) : (
                                <UserCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                              )}
                            </button>
                            <button
                              onClick={() => setEditUser(u)}
                              className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                            >
                              <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteUser(u)}
                              className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                    {ownerUsers.length === 0 && (
                      <p
                        className="text-gray-400 text-sm text-center py-6"
                        style={{ fontFamily: "Nunito, sans-serif" }}
                      >
                        Nenhum dono cadastrado
                      </p>
                    )}
                  </div>
                </div>

                {/* Admins */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <div
                      className="w-1.5 h-5 rounded-full"
                      style={{
                        background: "linear-gradient(180deg, #2563EB, #7C3AED)",
                      }}
                    />
                    <h2
                      className="text-gray-800 text-sm sm:text-base"
                      style={{
                        fontFamily: "Poppins, sans-serif",
                        fontWeight: 700,
                      }}
                    >
                      Administradores ({adminUsers.length})
                    </h2>
                  </div>
                  <div className="space-y-2 sm:space-y-3">
                    {adminUsers.map((u) => (
                      <div
                        key={u.id}
                        className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 sm:p-4 flex items-center gap-3 sm:gap-4 flex-wrap sm:flex-nowrap"
                      >
                        <div
                          className="w-9 sm:w-10 h-9 sm:h-10 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0"
                          style={{
                            background:
                              "linear-gradient(135deg, #2563EB, #7C3AED)",
                          }}
                        >
                          {u.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0 order-1 sm:order-none">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p
                              className="text-gray-900 font-bold text-sm"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              {u.name}
                            </p>
                            <span
                              className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700"
                              style={{ fontFamily: "Nunito, sans-serif" }}
                            >
                              Admin
                            </span>
                          </div>
                          <p
                            className="text-gray-500 text-xs truncate"
                            style={{ fontFamily: "Nunito, sans-serif" }}
                          >
                            {u.email}
                          </p>
                        </div>
                        {u.id !== user.id && (
                          <div className="flex items-center gap-1 flex-shrink-0 ml-auto sm:ml-0">
                            <button
                              onClick={() => setEditUser(u)}
                              className="p-1.5 sm:p-2 rounded-xl text-blue-600 hover:bg-blue-50 border border-blue-200 transition-colors"
                            >
                              <Pencil className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteUser(u)}
                              className="p-1.5 sm:p-2 rounded-xl text-red-500 hover:bg-red-50 border border-red-200 transition-colors"
                            >
                              <Trash2 className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* ── MODALS ─────────────────────────────────────────────────────── */}

      {showAddEnterprise && (
        <Modal
          title="Novo Empreendimento"
          onClose={() => setShowAddEnterprise(false)}
        >
          <EnterpriseForm
            onSave={handleAddEnterprise}
            onClose={() => setShowAddEnterprise(false)}
            categories={categories}
          />
        </Modal>
      )}

      {editEnterprise && (
        <Modal
          title={`Editar: ${editEnterprise.name}`}
          onClose={() => setEditEnterprise(null)}
        >
          <EnterpriseForm
            initial={editEnterprise}
            onSave={handleEditEnterprise}
            onClose={() => setEditEnterprise(null)}
            categories={categories}
          />
        </Modal>
      )}

      {deleteEnterprise && (
        <ConfirmDialog
          message={`Deseja realmente remover o empreendimento "${deleteEnterprise.name}"? Esta ação não pode ser desfeita.`}
          onConfirm={handleDeleteEnterprise}
          onCancel={() => setDeleteEnterprise(null)}
        />
      )}

      {showAddProduct && (
        <Modal title="Novo Produto" onClose={() => setShowAddProduct(null)}>
          <ProductForm
            onSave={(data) => handleAddProduct(showAddProduct, data)}
            onClose={() => setShowAddProduct(null)}
          />
        </Modal>
      )}

      {editProduct && (
        <Modal
          title={`Editar: ${editProduct.product.name}`}
          onClose={() => setEditProduct(null)}
        >
          <ProductForm
            initial={editProduct.product}
            onSave={handleEditProduct}
            onClose={() => setEditProduct(null)}
          />
        </Modal>
      )}

      {deleteProduct && (
        <ConfirmDialog
          message={`Deseja remover o produto "${deleteProduct.product.name}"?`}
          onConfirm={() => {
            removeProduct(deleteProduct.enterpriseId, deleteProduct.product.id);
            setDeleteProduct(null);
          }}
          onCancel={() => setDeleteProduct(null)}
        />
      )}

      {showAddCategory && (
        <Modal title="Nova Categoria" onClose={() => setShowAddCategory(false)}>
          <CategoryForm
            onSave={handleAddCategory}
            onClose={() => setShowAddCategory(false)}
          />
        </Modal>
      )}

      {editCategory && (
        <Modal
          title={`Editar: ${editCategory.name}`}
          onClose={() => setEditCategory(null)}
        >
          <CategoryForm
            initial={editCategory}
            onSave={handleEditCategory}
            onClose={() => setEditCategory(null)}
          />
        </Modal>
      )}

      {deleteCategory && (
        <ConfirmDialog
          message={`Deseja remover a categoria "${deleteCategory.name}"?`}
          onConfirm={handleDeleteCategory}
          onCancel={() => setDeleteCategory(null)}
        />
      )}

      {showAddUser && (
        <Modal title="Cadastrar Usuário" onClose={() => setShowAddUser(false)}>
          <UserForm
            enterprises={enterprises}
            onSave={handleAddUser}
            onClose={() => setShowAddUser(false)}
          />
        </Modal>
      )}

      {editUser && (
        <Modal
          title={`Editar: ${editUser.name}`}
          onClose={() => setEditUser(null)}
        >
          <UserForm
            initial={editUser}
            enterprises={enterprises}
            onSave={handleEditUser}
            onClose={() => setEditUser(null)}
          />
        </Modal>
      )}

      {deleteUser && (
        <ConfirmDialog
          message={`Deseja remover o usuário "${deleteUser.name}"? Ele perderá o acesso ao sistema.`}
          onConfirm={() => {
            removeUser(deleteUser.id);
            setDeleteUser(null);
          }}
          onCancel={() => setDeleteUser(null)}
        />
      )}
    </div>
  );
}
