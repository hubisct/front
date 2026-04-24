import { useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { Camera, Upload } from "lucide-react";

const ACCEPT_ATTR = "image/jpeg,image/jpg,image/png,image/webp";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type ImageUploadFieldProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel?: string;
  emptyTitle?: string;
  emptyHint?: string;
  previewAlt?: string;
  replaceHint?: string;
  buttonLabel?: string;
  removeLabel?: string;
  helperText?: string;
};

export function ImageUploadField({
  value,
  onChange,
  ariaLabel = "Area de upload de imagem",
  emptyTitle = "Arraste e solte uma imagem aqui",
  emptyHint = "Ou clique para selecionar um arquivo",
  previewAlt = "Preview da imagem",
  replaceHint = "Arraste outra imagem ou clique para substituir",
  buttonLabel = "Carregar imagem",
  removeLabel = "Remover imagem",
  helperText = "Formatos: JPG, PNG e WEBP (max. 5 MB)",
}: ImageUploadFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const clearFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateFile = (file: File): string => {
    if (!ALLOWED_TYPES.has(file.type)) {
      return "Formato de imagem invalido. Use JPG, PNG ou WEBP.";
    }

    if (file.size > MAX_SIZE_BYTES) {
      return "A imagem excede 5 MB. Escolha um arquivo menor.";
    }

    return "";
  };

  const processFile = (file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      clearFileInput();
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setError("Nao foi possivel processar a imagem selecionada.");
        return;
      }

      setError("");
      onChange(reader.result);
    };

    reader.onerror = () => {
      setError("Nao foi possivel processar a imagem selecionada.");
      clearFileInput();
    };

    reader.readAsDataURL(file);
  };

  const processFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    processFile(files[0]);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    processFiles(event.target.files);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    processFiles(event.dataTransfer.files);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openFilePicker();
    }
  };

  const removeImage = () => {
    onChange("");
    setError("");
    clearFileInput();
  };

  return (
    <div className="space-y-3">
      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label={ariaLabel}
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "group relative min-h-[220px] overflow-hidden rounded-2xl border-2 border-dashed bg-gray-50 transition-all",
          isDragging
            ? "border-purple-500 bg-purple-50 ring-4 ring-purple-100"
            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/40",
        ].join(" ")}
      >
        {value ? (
          <>
            <img
              src={value}
              alt={previewAlt}
              className="h-full w-full object-cover"
            />
            <div className="pointer-events-none absolute inset-0 flex items-end justify-center bg-black/0 p-4 transition-colors group-hover:bg-black/35">
              <span className="rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-gray-700 opacity-0 shadow transition-opacity group-hover:opacity-100">
                {replaceHint}
              </span>
            </div>
          </>
        ) : (
          <div className="flex h-[220px] flex-col items-center justify-center p-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
              <Camera className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: "Nunito, sans-serif" }}>
              {emptyTitle}
            </p>
            <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: "Nunito, sans-serif" }}>
              {emptyHint}
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openFilePicker}
          className="inline-flex items-center gap-2 rounded-xl border border-purple-200 bg-purple-50 px-4 py-2 text-sm font-bold text-purple-700 transition-colors hover:bg-purple-100"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          <Upload className="h-4 w-4" />
          {buttonLabel}
        </button>

        {value && (
          <button
            type="button"
            onClick={removeImage}
            className="inline-flex items-center rounded-xl border border-gray-200 px-3 py-2 text-sm font-bold text-gray-600 transition-colors hover:bg-gray-100"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            {removeLabel}
          </button>
        )}

        <span className="text-xs text-gray-500" style={{ fontFamily: "Nunito, sans-serif" }}>
          {helperText}
        </span>
      </div>

      {error && (
        <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-semibold text-red-700" style={{ fontFamily: "Nunito, sans-serif" }}>
          {error}
        </p>
      )}
    </div>
  );
}
