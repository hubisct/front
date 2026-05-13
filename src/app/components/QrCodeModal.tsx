import { X, QrCode } from "lucide-react";
import { useEffect, useRef } from "react";
import QRCode from "qrcode";

interface QRCodeModalProps {
  url: string;
  enterpriseName: string;
  onClose: () => void;
}

export function QRCodeModal({ url, enterpriseName, onClose }: QRCodeModalProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (canvasRef.current) {
      QRCode.toCanvas(canvasRef.current, url, {
        width: 240,
        margin: 2,
        color: { dark: "#3B0764", light: "#FFFFFF" },
      });
    }
  }, [url]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center gap-4 max-w-xs w-full relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #7C3AED, #EA580C)" }}
          >
            <QrCode className="w-4 h-4 text-white" />
          </div>
          <span
            className="text-gray-800 font-bold text-sm"
            style={{ fontFamily: "Poppins, sans-serif" }}
          >
            Página pública
          </span>
        </div>

        {/* QR Canvas */}
        <div className="rounded-2xl overflow-hidden border-4 border-purple-100 shadow-inner">
          <canvas ref={canvasRef} />
        </div>

        {/* Enterprise name */}
        <p
          className="text-center text-gray-600 text-xs px-2"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
          Aponte a câmera para acessar o empreendimento{" "}
          <span className="text-purple-700 font-bold">{enterpriseName}</span>
        </p>

        {/* Copy link */}
        <button
          onClick={() => navigator.clipboard.writeText(url)}
          className="w-full py-2 rounded-xl border border-purple-200 text-purple-700 text-xs font-bold hover:bg-purple-50 transition-all"
          style={{ fontFamily: "Nunito, sans-serif" }}
        >
          Copiar link
        </button>
      </div>
    </div>
  );
}