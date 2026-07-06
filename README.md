# Frontend Vitrine

## Overview
Este é o frontend do projeto Vitrine, construído com React, Vite e TypeScript.

## Instruções de execução

Para rodar o projeto localmente, certifique-se de ter o Node.js instalado e siga os passos abaixo:

1. Instale as dependências:
```bash
npm install
```

2. Execute o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse o aplicativo no seu navegador. O Vite geralmente abre na porta `http://localhost:5173/` (ou conforme indicado no terminal).

Para gerar o build de produção, utilize:
```bash
npm run build
```

## Estrutura das pastas

### Principais:
- `src/`: Contém todo o código-fonte da aplicação.
  - `src/app/`: Lógica central, roteamento e estrutura principal.
    - `api/`: Funções de integração e chamadas ao backend.
    - `components/`: Componentes React reutilizáveis.
    - `contexts/`: Contextos do React para gerenciamento de estado.
    - `pages/`: Componentes de nível de página para as rotas da aplicação.
    - `utils/`: Funções utilitárias e helpers.
  - `src/styles/`: Arquivos de estilo globais (CSS/Tailwind).

### Auxiliares:
- `dist/`: Pasta gerada automaticamente contendo o build de produção (após rodar `npm run build`).
- Arquivos de configuração: `vite.config.ts`, `package.json`, etc.
