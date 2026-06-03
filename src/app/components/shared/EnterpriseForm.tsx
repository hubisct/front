import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Enterprise, User, Category, CategoryItem } from "../../types";
import { Field, inputCls } from "./Field";
import { SubmitButton } from "../SubmitButton";
import { isValidEmail, isValidPassword, isValidBrazilPhone, normalizeBrazilPhone } from "../../utils/validation";
import { ImageUploadField } from "../ImageUploadField";

const btnPrimary = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]";
const btnSecondary = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all";

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


export { EnterpriseForm };
