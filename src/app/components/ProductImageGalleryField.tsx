import { useId, useRef, useState } from "react";
import type { ChangeEvent, DragEvent, KeyboardEvent } from "react";
import { Camera, ImagePlus, Star, Trash2 } from "lucide-react";

const ACCEPT_ATTR = "image/jpeg,image/jpg,image/png,image/webp";
const ALLOWED_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

type ProductImageGalleryFieldProps = {
  value: string[];
  onChange: (value: string[]) => void;
  maxImages?: number;
};

export function ProductImageGalleryField({
  value,
  onChange,
  maxImages = 8,
}: ProductImageGalleryFieldProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState("");

  const images = value.filter(Boolean);
  const remainingSlots = Math.max(maxImages - images.length, 0);

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

  const readFile = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const validationError = validateFile(file);
      if (validationError) {
        reject(new Error(validationError));
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result !== "string") {
          reject(new Error("Nao foi possivel processar a imagem selecionada."));
          return;
        }

        resolve(reader.result);
      };
      reader.onerror = () => reject(new Error("Nao foi possivel processar a imagem selecionada."));
      reader.readAsDataURL(file);
    });

  const processFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    if (remainingSlots === 0) {
      setError(`Limite de ${maxImages} fotos atingido.`);
      clearFileInput();
      return;
    }

    const selectedFiles = Array.from(files).slice(0, remainingSlots);

    try {
      const nextImages = await Promise.all(selectedFiles.map(readFile));
      onChange([...images, ...nextImages]);
      setError(files.length > remainingSlots ? `Foram adicionadas ${remainingSlots} fotos. Limite de ${maxImages}.` : "");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Nao foi possivel processar as imagens.");
    } finally {
      clearFileInput();
    }
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

  const removeImage = (index: number) => {
    onChange(images.filter((_, currentIndex) => currentIndex !== index));
    setError("");
  };

  const setPrimaryImage = (index: number) => {
    if (index === 0) return;
    const selected = images[index];
    onChange([selected, ...images.filter((_, currentIndex) => currentIndex !== index)]);
  };

  return (
    <div className="space-y-3">
      <input
        id={inputId}
        ref={fileInputRef}
        type="file"
        accept={ACCEPT_ATTR}
        multiple
        className="hidden"
        onChange={handleInputChange}
      />

      <div
        role="button"
        tabIndex={0}
        aria-label="Area de upload de fotos do produto"
        onClick={openFilePicker}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={[
          "group relative min-h-[180px] overflow-hidden rounded-2xl border-2 border-dashed bg-gray-50 transition-all",
          isDragging
            ? "border-purple-500 bg-purple-50 ring-4 ring-purple-100"
            : "border-gray-300 hover:border-purple-400 hover:bg-purple-50/40",
        ].join(" ")}
      >
        {images.length > 0 ? (
          <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-4">
            {images.map((image, index) => (
              <div
                key={`${image}-${index}`}
                className={[
                  "relative overflow-hidden rounded-xl border bg-white shadow-sm",
                  index === 0 ? "col-span-2 row-span-2 aspect-[4/3] border-purple-300" : "aspect-square border-gray-200",
                ].join(" ")}
                onClick={(event) => event.stopPropagation()}
              >
                <img src={image} alt={`Foto ${index + 1} do produto`} className="h-full w-full object-cover" />
                {index === 0 && (
                  <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-purple-600 px-2 py-1 text-xs font-bold text-white shadow">
                    <Star className="h-3 w-3 fill-current" />
                    Capa
                  </span>
                )}
                <div className="absolute inset-x-2 bottom-2 flex justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  {index !== 0 && (
                    <button
                      type="button"
                      title="Usar como capa"
                      onClick={() => setPrimaryImage(index)}
                      className="rounded-lg bg-white/95 p-1.5 text-purple-700 shadow hover:bg-purple-50"
                    >
                      <Star className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    title="Remover foto"
                    onClick={() => removeImage(index)}
                    className="rounded-lg bg-white/95 p-1.5 text-red-600 shadow hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex h-[180px] flex-col items-center justify-center p-5 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-gray-200">
              <Camera className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-sm font-semibold text-gray-700" style={{ fontFamily: "Nunito, sans-serif" }}>
              Arraste e solte fotos aqui
            </p>
            <p className="mt-1 text-xs text-gray-500" style={{ fontFamily: "Nunito, sans-serif" }}>
              Ou clique para selecionar varios arquivos
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
          <ImagePlus className="h-4 w-4" />
          Adicionar fotos
        </button>

        <span className="text-xs text-gray-500" style={{ fontFamily: "Nunito, sans-serif" }}>
          {images.length}/{maxImages} fotos. A primeira foto sera a capa. JPG, PNG e WEBP (max. 5 MB cada).
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
