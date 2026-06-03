"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export function SupportModal() {
  const API_BASE = ((import.meta as any).env?.VITE_API_URL as string) || "http://localhost:5000";
  const [supportType, setSupportType] = useState("report bug");
  const [supportComment, setSupportComment] = useState("");
  const [supportSent, setSupportSent] = useState(false);
  const [incompleteMessage, setIncompleteMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!supportComment.trim()) {
      setSupportSent(false);
      setIncompleteMessage(true);
      return;
    }

    setIncompleteMessage(false);
    setSupportSent(false);
    setErrorMessage("");
    setIsLoading(true);

    fetch(`${API_BASE}/api/support`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: supportType, comment: supportComment }),
    })
      .then(async (res) => {
        setIsLoading(false);
        if (res.ok) {
          setSupportSent(true);
          setSupportComment("");
          setSupportType("report bug");
        } else {
          let detail = "Erro ao enviar mensagem";

          try {
            const text = await res.text();

            try {
              const data = JSON.parse(text);
              detail = data.message || data.error || JSON.stringify(data);
            } catch {
              detail = text || "Erro desconhecido";
            }
          } catch {
            detail = "Erro desconhecido";
          }

          setErrorMessage(detail);
        }
      })
      .catch((err) => {
        setIsLoading(false);
        setErrorMessage(err.message || "Erro de rede");
      });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          Abrir formulário de suporte
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enviar solicitação ao suporte</DialogTitle>
          <DialogDescription>
            Selecione o tipo da sua mensagem e escreva seu comentário.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="grid gap-5">
          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>
              O que você gostaria de enviar para nossa equipe de suporte?
            </span>
            <select
              value={supportType}
              onChange={(event) => setSupportType(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            >
              <option value="report bug">Reportar problema</option>
              <option value="suggestion">Sugestão</option>
              <option value="feedback">Feedback</option>
              <option value="report violation">Denúncia</option>
            </select>
          </label>

          <label className="space-y-2 text-sm font-semibold text-slate-700">
            <span>Comentário</span>
            <textarea
              value={supportComment}
              onChange={(event) => setSupportComment(event.target.value)}
              rows={8}
              placeholder="Descreva sua solicitação com detalhes..."
              className="min-h-[180px] w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm outline-none focus:border-violet-500 focus:ring-2 focus:ring-violet-100"
            />
          </label>

          {supportSent && (
            <div className="rounded-2xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700">
              Sua mensagem foi enviada com sucesso!
            </div>
          )}
          {incompleteMessage && (
            <div className="rounded-2xl bg-amber-50 border border-amber-200 p-3 text-sm text-amber-700">
              Por favor, preencha todos os campos obrigatórios.
            </div>
          )}

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <DialogFooter className="flex flex-col gap-3 sm:flex-row sm:justify-between">
            <a
              href="https://wa.me/555532208500"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
              WhatsApp
            </a>
            <div className="flex flex-wrap gap-2 justify-end">
              <DialogClose asChild>
                <button
                  type="button"
                  className="rounded-xl bg-slate-200 px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-300"
                >
                  Fechar
                </button>
              </DialogClose>
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60"
              >
                {isLoading ? "Enviando..." : "Enviar"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
