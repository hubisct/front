import { useState } from "react";
import { Check, X, Loader2 } from "lucide-react";

export function SubmitButton({
  onClick,
  idleText = "Salvar",
  className,
  style,
}: {
  onClick: () => Promise<void>;
  idleText?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleClick = async () => {
    if (status !== "idle") return;
    setStatus("loading");
    try {
      await onClick();
      setStatus("success");
    } catch {
      setStatus("error");
      setTimeout(() => setStatus("idle"), 2500);
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${className || ""} transition-all duration-300 flex items-center justify-center gap-2 font-bold`}
      style={
        status === "success"
          ? { background: "#16a34a", color: "white" }
          : status === "error"
          ? { background: "#dc2626", color: "white" }
          : style
      }
      disabled={status === "loading" || status === "success"}
    >
      {status === "idle" && (
        <>
          <Check className="w-4 h-4" />
          {idleText}
        </>
      )}
      {status === "loading" && (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          Salvando...
        </>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 animate-in zoom-in duration-300">
          <Check className="w-5 h-5" />
          Salvo!
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 animate-in zoom-in duration-300">
          <X className="w-5 h-5" />
          Erro!
        </div>
      )}
    </button>
  );
}