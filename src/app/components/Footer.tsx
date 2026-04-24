import { Sprout, MapPin, Phone, Mail, Instagram, ExternalLink, Heart } from "lucide-react";

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
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
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
