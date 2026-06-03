"use client";

import { SupportModal } from "./SupportModal";

export function SupportSection() {
  return (
    <section
      id="suporte"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14"
    >
      <div className="rounded-[2rem] bg-gradient-to-r from-violet-500 via-fuchsia-600 to-orange-500 p-1 shadow-2xl">
        <div className="rounded-[1.75rem] bg-white p-8 md:p-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full bg-violet-50 px-4 py-1.5 text-sm font-semibold text-violet-700">
                Suporte
              </div>
              <h2
                className="mt-4 text-3xl font-bold text-gray-900"
                style={{ fontFamily: "Poppins, sans-serif" }}
              >
                Precisa de ajuda ou tem uma sugestão? Fale com o nosso time de
                suporte!
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Envie uma denúncia, sugestão, feedback ou reporte um erro no
                site diretamente para a nossa equipe. Sua mensagem é anonima e
                será lida com atenção.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row items-start gap-3">
                <SupportModal />
                <a
                  href="https://wa.me/555532208500"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-2xl bg-green-600 px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-green-700 transition-colors"
                >
                  Falar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
