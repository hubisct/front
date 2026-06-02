import { useState } from "react";
import type { Product } from "../../types";
import { resolvePriceMode } from "../../utils/pricing";
import { getProductImages, getPrimaryProductImage } from "../../utils/productImages";
import { Field, inputCls } from "./Field";
import { ProductImageGalleryField } from "../ProductImageGalleryField";
import { SubmitButton } from "../SubmitButton";

export function ProductForm({
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
          placeholder="Descreva o produto"
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
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-white font-bold shadow-md transition-all hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, #7C3AED, #EA580C)",
            fontFamily: "Nunito, sans-serif",
          }}
          idleText="Salvar produto"
        />
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
