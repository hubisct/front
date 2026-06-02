import { Trash2 } from "lucide-react";

export function ConfirmDialog({
  message,
  onConfirm,
  onCancel,
}: {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
        <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-6 h-6 text-red-600" />
        </div>
        <p
          className="text-gray-800 mb-6"
          style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
        >
          {message}
        </p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl bg-red-600 text-white font-bold hover:bg-red-700 transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Confirmar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
            style={{ fontFamily: "Nunito, sans-serif" }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
