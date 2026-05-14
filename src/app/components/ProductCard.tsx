import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, ImageIcon, X, ZoomIn, ZoomOut } from "lucide-react";
import type { Product } from "../types";
import { getProductImages } from "../utils/productImages";
import { getProductPriceLabel } from "../utils/pricing";
import { normalizeBrazilPhone } from "../utils/validation";

interface ProductCardProps {
  product: Product;
  whatsapp: string;
  enterpriseName: string;
}

export function ProductCard({ product, whatsapp, enterpriseName }: ProductCardProps) {
  const images = getProductImages(product);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const normalizedWhatsapp = normalizeBrazilPhone(whatsapp);
  const whatsappMessage = encodeURIComponent(
    `Olá! Vi o produto "${product.name}" da ${enterpriseName} na Vitrine Social da Incubadora UFSM e tenho interesse. Pode me dar mais informações?`
  );
  const whatsappUrl = `https://wa.me/${normalizedWhatsapp}?text=${whatsappMessage}`;
  const priceLabel = getProductPriceLabel(product);
  const selectedImage = images[selectedImageIndex] || images[0] || "";

  useEffect(() => {
    if (selectedImageIndex >= images.length) {
      setSelectedImageIndex(0);
    }
  }, [images.length, selectedImageIndex]);

  const showPreviousImage = () => {
    setSelectedImageIndex((currentIndex) => Math.max(currentIndex - 1, 0));
  };

  const showNextImage = () => {
    setSelectedImageIndex((currentIndex) => Math.min(currentIndex + 1, images.length - 1));
  };

  const openLightbox = (index = selectedImageIndex) => {
    if (images.length === 0) return;
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100 flex flex-col group">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3] bg-gray-50 flex items-center justify-center border-b border-gray-100">
        {selectedImage ? (
          <button
            type="button"
            onClick={() => openLightbox()}
            className="absolute inset-0 flex items-center justify-center"
            aria-label={`Ampliar imagem de ${product.name}`}
          >
            <div
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-50 scale-125 transition-transform duration-500 group-hover:scale-[1.35]"
              style={{ backgroundImage: `url(${selectedImage})` }}
            />
            <img
              src={selectedImage}
              alt={product.name}
              className="w-full h-full object-contain relative z-10 transition-transform duration-500 group-hover:scale-110 drop-shadow-md"
            />
            <span className="absolute bottom-3 right-3 z-20 inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-purple-700 opacity-0 shadow transition-opacity group-hover:opacity-100">
              <ZoomIn className="h-4 w-4" />
            </span>
          </button>
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400">
            <ImageIcon className="h-9 w-9" />
            <span className="text-xs font-bold" style={{ fontFamily: "Nunito, sans-serif" }}>
              Sem imagem
            </span>
          </div>
        )}

        {images.length > 1 && selectedImageIndex > 0 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPreviousImage();
              event.currentTarget.blur();
            }}
            className="absolute left-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-purple-700 opacity-0 shadow-lg transition-all hover:bg-white hover:scale-105 focus-visible:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-300 group-hover:opacity-100"
            aria-label={`Ver foto anterior de ${product.name}`}
            title="Foto anterior"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
        )}

        {images.length > 1 && selectedImageIndex < images.length - 1 && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
              event.currentTarget.blur();
            }}
            className="absolute right-3 top-1/2 z-30 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-purple-700 opacity-0 shadow-lg transition-all hover:bg-white hover:scale-105 focus-visible:opacity-100 focus:outline-none focus:ring-2 focus:ring-purple-300 group-hover:opacity-100"
            aria-label={`Ver proxima foto de ${product.name}`}
            title="Proxima foto"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h4
          className="text-gray-900 mb-1.5"
          style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
        >
          {product.name}
        </h4>
        <p
          className="text-gray-500 text-sm leading-relaxed flex-1 mb-3"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
          {product.description}
        </p>

        {/* Price Label */}
        {priceLabel && (
          <div
            className="text-purple-700 font-black mb-4"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: "1rem" }}
          >
            {priceLabel}
          </div>
        )}

        {/* CTA */}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-bold shadow-sm hover:shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
          style={{ background: "linear-gradient(135deg, #16A34A, #15803D)", fontFamily: "Nunito, sans-serif" }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Pedir pelo WhatsApp
        </a>
      </div>

      {isLightboxOpen && (
        <ProductImageLightbox
          images={images}
          productName={product.name}
          activeIndex={selectedImageIndex}
          onSelect={setSelectedImageIndex}
          onClose={() => setIsLightboxOpen(false)}
        />
      )}
    </div>
  );
}

function ProductImageLightbox({
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
  const [zoom, setZoom] = useState(1);
  const activeImage = images[activeIndex] || images[0];

  const goToImage = (index: number) => {
    const nextIndex = (index + images.length) % images.length;
    onSelect(nextIndex);
    setZoom(1);
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

  if (!activeImage) return null;

  return createPortal(
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 sm:p-6">
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

          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Reduzir zoom"
              onClick={() => setZoom((currentZoom) => Math.max(1, currentZoom - 0.25))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <button
              type="button"
              title="Ampliar zoom"
              onClick={() => setZoom((currentZoom) => Math.min(2.5, currentZoom + 0.25))}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
            <button
              type="button"
              title="Fechar"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-gray-800 shadow hover:bg-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 overflow-auto rounded-xl bg-black/30">
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
              className="max-h-[74vh] max-w-full object-contain transition-transform duration-200"
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
