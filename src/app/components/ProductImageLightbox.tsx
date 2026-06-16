import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 5;
const WHEEL_ZOOM_STEP = 0.0035;

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * 120;
  return event.deltaY;
}

export function ProductImageLightbox({
  images,
  productName,
  activeIndex,
  onSelect,
  onClose,
}: {
  images: string[];
  productName: string;
  activeIndex: number;
  onSelect: (index: number) => void;
  onClose: () => void;
}) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const lightboxRef = useRef<HTMLDivElement>(null);
  const activeImage = images[activeIndex] || images[0];

  const goToImage = (index: number) => {
    const nextIndex = (index + images.length) % images.length;
    onSelect(nextIndex);
    setZoom(MIN_ZOOM);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft" && images.length > 1) goToImage(activeIndex - 1);
      if (event.key === "ArrowRight" && images.length > 1) goToImage(activeIndex + 1);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, images.length, onClose]);

  useEffect(() => {
    const handleWheelZoom = (event: WheelEvent) => {
      const lightbox = lightboxRef.current;
      const target = event.target instanceof Node ? event.target : null;
      if (!lightbox || (target && !lightbox.contains(target))) return;

      event.preventDefault();
      event.stopPropagation();

      const delta = normalizeWheelDelta(event);
      setZoom((currentZoom) => clampZoom(currentZoom - delta * WHEEL_ZOOM_STEP));
    };

    window.addEventListener("wheel", handleWheelZoom, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", handleWheelZoom, { capture: true });
    };
  }, []);

  if (!activeImage) return null;

  return createPortal(
    <div ref={lightboxRef} className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 sm:p-6">
      <button type="button" className="absolute inset-0 cursor-default" onClick={onClose} aria-label="Fechar zoom" />

      <div className="relative z-10 flex h-full w-full max-w-6xl flex-col">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white" style={{ fontFamily: "Nunito, sans-serif" }}>
              {productName}
            </p>
            <p className="text-xs font-semibold text-white/70" style={{ fontFamily: "Nunito, sans-serif" }}>
              Foto {activeIndex + 1} de {images.length}
            </p>
          </div>

          <button
            type="button"
            title="Fechar"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-black/30"
        >
          {images.length > 1 && (
            <>
              <button
                type="button"
                title="Foto anterior"
                onClick={() => goToImage(activeIndex - 1)}
                className="absolute left-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                type="button"
                title="Proxima foto"
                onClick={() => goToImage(activeIndex + 1)}
                className="absolute right-3 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          <div className="flex min-h-full items-center justify-center p-4 sm:p-8">
            <img
              src={activeImage}
              alt={productName}
              className="max-h-[74vh] max-w-full select-none object-contain transition-transform duration-100"
              draggable={false}
              style={{ transform: `scale(${zoom})` }}
            />
          </div>
        </div>

        {images.length > 1 && (
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {images.map((image, index) => (
              <button
                key={`${image}-${index}`}
                type="button"
                onClick={() => goToImage(index)}
                className={[
                  "h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg border bg-white/10 transition-all",
                  index === activeIndex ? "border-white ring-2 ring-white/40" : "border-white/25 hover:border-white/70",
                ].join(" ")}
                aria-label={`Abrir foto ${index + 1}`}
              >
                <img src={image} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
}
