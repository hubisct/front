import { Sprout, MapPin, Phone, Mail, Instagram, ExternalLink, Heart } from "lucide-react";
import { WhatsAppIcon } from "./shared/WhatsAppIcon";


export function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-10 border-b border-gray-800">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-lg"
                style={{ background: "linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)" }}
              >
                <Sprout className="text-white w-6 h-6" />
              </div>
              <div className="flex flex-col leading-tight">
                <span
                  className="text-white"
                  style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800, fontSize: "1.1rem" }}
                >
                  Vitrine Social
                </span>
                <span
                  className="text-gray-500"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "0.75rem" }}
                >
                  Incubadora Social UFSM
                </span>
              </div>
            </div>
            <p
              className="text-gray-400 leading-relaxed max-w-sm mb-6"
              style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600, fontSize: "0.9rem" }}
            >
              Plataforma de divulgação dos empreendimentos incubados pela Incubadora Social
              da Universidade Federal de Santa Maria (UFSM). Promovendo empreendedorismo,
              inclusão e geração de renda.
            </p>
            {/* Social */}
            <div className="flex gap-3">
              <a
                href="https://www.instagram.com/hubisufsm/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gradient-to-br flex items-center justify-center transition-colors group"
                style={{ transition: "background 0.2s" }}
                title="Instagram"
              >
                <Instagram className="w-5 h-5 group-hover:text-pink-400 transition-colors" />
              </a>
              <a
                href="https://wa.me/555591580632"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-green-700 flex items-center justify-center transition-colors"
                title="WhatsApp"
              >
                <WhatsAppIcon className="w-5 h-5 fill-current" />
              </a>
              <a
                href="mailto:incubadorasocial@ufsm.br"
                className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-blue-700 flex items-center justify-center transition-colors"
                title="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3
              className="text-white mb-4"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
            >
              Links Rápidos
            </h3>
            <ul className="space-y-2.5">
              {[
                { label: "Início", href: "/#topo" },
                { label: "Empreendimentos", href: "/#empreendimentos" },
                { label: "Sobre a Incubadora", href: "/#sobre-incubadora" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-orange-400 transition-colors text-sm font-semibold flex items-center gap-2 group"
                    style={{ fontFamily: "Nunito, sans-serif" }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0 group-hover:bg-orange-400 transition-colors" />
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <a
                  href="https://www.ufsm.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-orange-400 transition-colors text-sm font-semibold flex items-center gap-2 group"
                  style={{ fontFamily: "Nunito, sans-serif" }}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                  Site da UFSM
                  <ExternalLink className="w-3 h-3 opacity-60" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3
              className="text-white mb-4"
              style={{ fontFamily: "Poppins, sans-serif", fontWeight: 700, fontSize: "0.95rem" }}
            >
              Contato
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-400 flex-shrink-0 mt-0.5" />
                <a
                  href="https://maps.app.goo.gl/BLM7VkwpAWGWTqU1A"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                >
                  R. Floriano Peixoto, 1184 - Centro<br />Santa Maria, RS 97015-372
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a
                  href="https://wa.me/555591580632"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                >
                  (55) 9158-0632
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a
                  href="mailto:incubadorasocial@ufsm.br"
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                >
                  incubadorasocial@ufsm.br
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Instagram className="w-4 h-4 text-orange-400 flex-shrink-0" />
                <a
                  href="https://www.instagram.com/hubisufsm/"
                  className="text-gray-400 text-sm"
                  style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
                >
                  @hubisufsm
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p
            className="text-gray-600 text-sm text-center"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
          >
            © 2026 Incubadora Social UFSM — Todos os direitos reservados
          </p>
          <p
            className="text-gray-700 text-xs text-center flex items-center gap-1.5"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
          >
            Desenvolvido com <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" /> para o empreendedorismo social
          </p>
        </div>
      </div>
    </footer>
  );
}
