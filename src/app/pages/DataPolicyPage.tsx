import { ShieldCheck } from "lucide-react";

export function DataPolicyPage() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-sm p-8 md:p-12">
          
          <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #7C3AED 0%, #EA580C 100%)" }}
            >
              <ShieldCheck className="text-white w-7 h-7" />
            </div>
            <div>
              <h1 
                className="text-3xl text-gray-900"
                style={{ fontFamily: "Poppins, sans-serif", fontWeight: 800 }}
              >
                Política de Tratamento de Dados
              </h1>
              <p 
                className="text-gray-500 mt-1"
                style={{ fontFamily: "Nunito, sans-serif", fontWeight: 600 }}
              >
                Vitrine Social - Incubadora Social UFSM
              </p>
            </div>
          </div>

          <div 
            className="prose prose-orange max-w-none text-gray-600"
            style={{ fontFamily: "Nunito, sans-serif", fontWeight: 500 }}
          >
            <p className="mb-6">
              A plataforma Vitrine HUBIS ("Vitrine Social", ou simplesmente "Vitrine") preza pela privacidade e pela segurança dos dados de todos os usuários. Esta Política de Tratamento de Dados descreve como coletamos, usamos, armazenamos e protegemos as suas informações, em conformidade com a <strong>Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018)</strong>.
            </p>

            <h2 className="text-xl text-gray-900 font-bold mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>1. Quais dados são coletados?</h2>
            <p className="mb-4">Podemos coletar e tratar os seguintes tipos de dados pessoais:</p>  
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li><strong>Dados de identificação e contato:</strong> Para usuários cadastrados, nome, email, telefone, handles de redes sociais e dados de login.</li>
              <li><strong>Dados de navegação (Cookies e similares):</strong> Informações sobre como você utiliza o nosso site (endereço IP, páginas visitadas, tempo de permanência), para fins de melhoria de usabilidade e segurança, de maneira anonimizada.</li>
            </ul>

            <h2 className="text-xl text-gray-900 font-bold mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>2. Como utilizamos os seus dados?</h2>
            <p className="mb-4">Os dados coletados são utilizados exclusivamente para as seguintes finalidades:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Facilitar o contato direto entre visitantes e os empreendimentos divulgados na plataforma.</li>
              <li>Gerenciar os perfis de empreendimentos cadastrados pela equipe da Incubadora.</li>
              <li>Melhorar a experiência de navegação e realizar análises estatísticas não identificáveis.</li>
              <li>Responder a dúvidas, sugestões ou solicitações enviadas através dos nossos canais de contato.</li>
            </ul>

            <h2 className="text-xl text-gray-900 font-bold mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>3. Compartilhamento de Dados</h2>
            <p className="mb-6">
              A Vitrine <strong>não vende, aluga ou comercializa</strong> dados pessoais. O compartilhamento de informações ocorrerá apenas quando estritamente necessário para o funcionamento da plataforma (como serviços de hospedagem e infraestrutura) ou quando houver obrigação legal, mediante os termos da legislação competente.
            </p>

            <h2 className="text-xl text-gray-900 font-bold mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>4. Segurança dos Dados</h2>
            <p className="mb-6">
              Adotamos medidas técnicas e organizacionais adequadas para proteger seus dados pessoais contra acessos não autorizados, perdas, destruição ou alteração.
            </p>

            <h2 className="text-xl text-gray-900 font-bold mt-8 mb-4" style={{ fontFamily: "Poppins, sans-serif" }}>5. Seus Direitos (Titular dos Dados)</h2>
            <p className="mb-4">Conforme previsto na LGPD, você tem o direito de:</p>
            <ul className="list-disc pl-6 mb-6 space-y-2">
              <li>Solicitar a confirmação da existência de tratamento de seus dados.</li>
              <li>Acessar os dados que possuímos sobre você.</li>
              <li>Solicitar a correção de dados incompletos, inexatos ou desatualizados.</li>
              <li>Solicitar a eliminação, bloqueio ou anonimização de dados desnecessários ou tratados em desconformidade com a lei.</li>
              <li>Revogar o consentimento para o tratamento dos dados, quando aplicável.</li>
            </ul>

            <div className="mt-12 p-6 bg-orange-50 rounded-2xl text-sm text-orange-900 border border-orange-100">
              <p>
                <strong>Última atualização:</strong> {new Date().toLocaleDateString('pt-BR')}
              </p>
              <p className="mt-2">
                Esta política pode ser atualizada periodicamente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
