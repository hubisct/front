import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { Enterprise, User, Category, CategoryItem } from "../../types";
import { Field, inputCls } from "./Field";
import { SubmitButton } from "../SubmitButton";
import { isValidEmail, isValidPassword, isValidBrazilPhone, normalizeBrazilPhone } from "../../utils/validation";
import { ImageUploadField } from "../ImageUploadField";

const btnPrimary = "flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-white font-bold text-sm shadow-md hover:shadow-lg transition-all hover:scale-[1.01]";
const btnSecondary = "flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm border-2 transition-all";

// ── CATEGORY FORM ─────────────────────────────────────────────────────────
function CategoryForm({
  initial,
  onSave,
  onClose,
}: {
  initial?: CategoryItem | null;
  onSave: (data: { name: string; color: string; emoji: string }) => Promise<void> | void;
  onClose: () => void;
}) {
  const [name, setName] = useState(initial?.name || "");
  const [color, setColor] = useState(initial?.color || "#7C3AED");
  const [emoji, setEmoji] = useState(initial?.emoji || "");
  const [nameError, setNameError] = useState("");
  const [colorError, setColorError] = useState("");
  const [emojiError, setEmojiError] = useState("");
  const [serverError, setServerError] = useState("");

  const extractEmojis = (value: string) => {
    const matches = value.match(/\p{Extended_Pictographic}/gu);
    return matches ? matches.join("") : "";
  };

  const handleSave = async () => {
    setNameError("");
    setColorError("");
    setEmojiError("");
    setServerError("");
    const trimmed = name.trim();
    const trimmedEmoji = emoji.trim();
    if (!trimmed) {
      setNameError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    if (!color) {
      setColorError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    if (!trimmedEmoji) {
      setEmojiError("Campo obrigatório");
      throw new Error("Validation Error");
    }
    try {
      await onSave({ name: trimmed, color, emoji: trimmedEmoji });
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
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Field label="Cor *">
          <label className="flex items-center gap-3 cursor-pointer">
            <span
              className="h-11 w-11 rounded-xl border border-gray-200 shadow-sm"
              style={{ backgroundColor: color }}
            />
            <span
              className="px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm font-semibold text-gray-600"
              style={{ fontFamily: "Nunito, sans-serif" }}
            >
              {color.toUpperCase()}
            </span>
            <input
              className="sr-only"
              type="color"
              value={color}
              onChange={(e) => {
                setColor(e.target.value);
                if (colorError) setColorError("");
                if (serverError) setServerError("");
              }}
              onBlur={() => {
                if (!color) setColorError("Campo obrigatório");
              }}
            />
          </label>
          {colorError && (
            <p
              className="text-red-600 text-sm mt-1"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            >
              {colorError}
            </p>
          )}
        </Field>
        <Field label="Emoji *">
          <input
            className={inputCls}
            value={emoji}
            onChange={(e) => {
              setEmoji(extractEmojis(e.target.value));
              if (emojiError) setEmojiError("");
              if (serverError) setServerError("");
            }}
            onBlur={() => {
              if (!emoji.trim()) setEmojiError("Campo obrigatório");
            }}
            placeholder="Ex: 🎨"
            style={{ fontFamily: "Nunito, sans-serif" }}
          />
          <p
            className="text-xs text-gray-400 mt-1"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Apenas emojis
          </p>
          {emojiError && (
            <p
              className="text-red-600 text-sm mt-1"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 700 }}
            >
              {emojiError}
            </p>
          )}
        </Field>
      </div>
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


export { CategoryForm };
