import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Enterprise, User, Category, CategoryItem } from "../../types";
import { Field, inputCls } from "./Field";
import { SubmitButton } from "../SubmitButton";
import { isValidEmail, isValidPassword, isValidBrazilPhone, normalizeBrazilPhone } from "../../utils/validation";
import { ImageUploadField } from "../ImageUploadField";

const btnPrimary = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]";
const btnSecondary = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all";

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


export { UserForm };
