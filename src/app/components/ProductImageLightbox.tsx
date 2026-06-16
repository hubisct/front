import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const MIN_ZOOM = 1;
const MAX_ZOOM = 10;
const WHEEL_ZOOM_STEP = 0.0035;

type Point = {
  x: number;
  y: number;
};

function clampZoom(value: number) {
  return Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, value));
}

function normalizeWheelDelta(event: WheelEvent) {
  if (event.deltaMode === 1) return event.deltaY * 16;
  if (event.deltaMode === 2) return event.deltaY * 120;
  return event.deltaY;
}

function getTouchPoint(touch: Touch): Point {
  return { x: touch.clientX, y: touch.clientY };
}

function getDistance(first: Point, second: Point) {
  return Math.hypot(first.x - second.x, first.y - second.y);
}

function getMidpoint(first: Point, second: Point) {
  return {
    x: (first.x + second.x) / 2,
    y: (first.y + second.y) / 2,
  };
}

function isInteractiveTarget(target: EventTarget | null) {
  return target instanceof Element && Boolean(target.closest("button, a, input, select, textarea"));
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
  const [pan, setPan] = useState<Point>({ x: 0, y: 0 });
  const lightboxRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef(MIN_ZOOM);
  const panRef = useRef<Point>({ x: 0, y: 0 });
  const dragStartRef = useRef<Point | null>(null);
  const panStartRef = useRef<Point>({ x: 0, y: 0 });
  const pinchStartRef = useRef<{
    distance: number;
    zoom: number;
  } | null>(null);
  const activeImage = images[activeIndex] || images[0];

  const updateView = (nextZoom: number, nextPan: Point) => {
    const clampedZoom = clampZoom(nextZoom);
    const clampedPan = clampPan(nextPan, clampedZoom);

    zoomRef.current = clampedZoom;
    panRef.current = clampedPan;
    setZoom(clampedZoom);
    setPan(clampedPan);
  };

  const clampPan = (nextPan: Point, nextZoom = zoomRef.current): Point => {
    if (nextZoom <= MIN_ZOOM) return { x: 0, y: 0 };

    const rect = viewerRef.current?.getBoundingClientRect();
    if (!rect) return nextPan;

    const maxX = (rect.width * (nextZoom - 1)) / 2;
    const maxY = (rect.height * (nextZoom - 1)) / 2;

    return {
      x: Math.min(maxX, Math.max(-maxX, nextPan.x)),
      y: Math.min(maxY, Math.max(-maxY, nextPan.y)),
    };
  };

  const zoomAtPoint = (clientPoint: Point, nextZoom: number) => {
    const rect = viewerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentZoom = zoomRef.current;
    const currentPan = panRef.current;
    const pointInViewer = {
      x: clientPoint.x - rect.left - rect.width / 2,
      y: clientPoint.y - rect.top - rect.height / 2,
    };
    const imagePoint = {
      x: (pointInViewer.x - currentPan.x) / currentZoom,
      y: (pointInViewer.y - currentPan.y) / currentZoom,
    };
    const clampedZoom = clampZoom(nextZoom);
    const nextPan = {
      x: pointInViewer.x - imagePoint.x * clampedZoom,
      y: pointInViewer.y - imagePoint.y * clampedZoom,
    };

    updateView(clampedZoom, nextPan);
  };

  const goToImage = (index: number) => {
    const nextIndex = (index + images.length) % images.length;
    onSelect(nextIndex);
    updateView(MIN_ZOOM, { x: 0, y: 0 });
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
      const nextZoom = zoomRef.current * Math.exp(-delta * WHEEL_ZOOM_STEP);
      zoomAtPoint({ x: event.clientX, y: event.clientY }, nextZoom);
    };

    window.addEventListener("wheel", handleWheelZoom, { passive: false, capture: true });
    return () => {
      window.removeEventListener("wheel", handleWheelZoom, { capture: true });
    };
  }, []);

  useEffect(() => {
    const resetTouchState = () => {
      dragStartRef.current = null;
      pinchStartRef.current = null;
    };

    const isInsideLightbox = (event: Event) => {
      const lightbox = lightboxRef.current;
      const target = event.target instanceof Node ? event.target : null;
      return Boolean(lightbox && target && lightbox.contains(target));
    };

    const handleGesture = (event: Event) => {
      if (!isInsideLightbox(event)) return;
      if (isInteractiveTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();
    };

    const handleTouchStart = (event: TouchEvent) => {
      if (!isInsideLightbox(event)) return;
      if (event.touches.length === 1 && isInteractiveTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();

      if (event.touches.length === 2) {
        const first = getTouchPoint(event.touches[0]);
        const second = getTouchPoint(event.touches[1]);
        pinchStartRef.current = {
          distance: getDistance(first, second),
          zoom: zoomRef.current,
        };
        dragStartRef.current = null;
        return;
      }

      if (event.touches.length === 1) {
        dragStartRef.current = getTouchPoint(event.touches[0]);
        panStartRef.current = panRef.current;
      }
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isInsideLightbox(event)) return;
      if (event.touches.length === 1 && isInteractiveTarget(event.target)) return;
      event.preventDefault();
      event.stopPropagation();

      if (event.touches.length === 2 && pinchStartRef.current) {
        const first = getTouchPoint(event.touches[0]);
        const second = getTouchPoint(event.touches[1]);
        const distance = getDistance(first, second);
        const midpoint = getMidpoint(first, second);
        const nextZoom = pinchStartRef.current.zoom * (distance / pinchStartRef.current.distance);

        zoomAtPoint(midpoint, nextZoom);
        return;
      }

      if (event.touches.length === 1 && dragStartRef.current && zoomRef.current > MIN_ZOOM) {
        const currentPoint = getTouchPoint(event.touches[0]);
        updateView(zoomRef.current, {
          x: panStartRef.current.x + currentPoint.x - dragStartRef.current.x,
          y: panStartRef.current.y + currentPoint.y - dragStartRef.current.y,
        });
      }
    };

    window.addEventListener("gesturestart", handleGesture, { passive: false, capture: true });
    window.addEventListener("gesturechange", handleGesture, { passive: false, capture: true });
    window.addEventListener("gestureend", handleGesture, { passive: false, capture: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: false, capture: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: false, capture: true });
    window.addEventListener("touchend", resetTouchState, { passive: false, capture: true });
    window.addEventListener("touchcancel", resetTouchState, { passive: false, capture: true });

    return () => {
      window.removeEventListener("gesturestart", handleGesture, { capture: true });
      window.removeEventListener("gesturechange", handleGesture, { capture: true });
      window.removeEventListener("gestureend", handleGesture, { capture: true });
      window.removeEventListener("touchstart", handleTouchStart, { capture: true });
      window.removeEventListener("touchmove", handleTouchMove, { capture: true });
      window.removeEventListener("touchend", resetTouchState, { capture: true });
      window.removeEventListener("touchcancel", resetTouchState, { capture: true });
    };
  }, []);

  useEffect(() => {
    const resetPointerState = () => {
      dragStartRef.current = null;
    };

    window.addEventListener("pointerup", resetPointerState);
    window.addEventListener("pointercancel", resetPointerState);

    return () => {
      window.removeEventListener("pointerup", resetPointerState);
      window.removeEventListener("pointercancel", resetPointerState);
    };
  }, []);

  if (!activeImage) return null;

  return createPortal(
    <div
      ref={lightboxRef}
      className="fixed inset-0 z-[70] flex items-center justify-center bg-black/85 p-3 sm:p-6"
      style={{ touchAction: "none" }}
    >
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
          ref={viewerRef}
          className="relative min-h-0 flex-1 overflow-hidden rounded-xl bg-black/30"
          style={{ touchAction: "none" }}
          onPointerDown={(event) => {
            if (event.target instanceof Element && event.target.closest("button")) return;
            if (event.pointerType === "touch" || zoomRef.current <= MIN_ZOOM) return;
            event.currentTarget.setPointerCapture(event.pointerId);
            dragStartRef.current = { x: event.clientX, y: event.clientY };
            panStartRef.current = panRef.current;
          }}
          onPointerMove={(event) => {
            if (event.pointerType === "touch" || !dragStartRef.current || zoomRef.current <= MIN_ZOOM) return;
            updateView(zoomRef.current, {
              x: panStartRef.current.x + event.clientX - dragStartRef.current.x,
              y: panStartRef.current.y + event.clientY - dragStartRef.current.y,
            });
          }}
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
              className="max-h-[74vh] max-w-full select-none object-contain"
              draggable={false}
              style={{
                cursor: zoom > MIN_ZOOM ? "grab" : "zoom-in",
                transform: `translate3d(${pan.x}px, ${pan.y}px, 0) scale(${zoom})`,
                transformOrigin: "center center",
                touchAction: "none",
              }}
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
