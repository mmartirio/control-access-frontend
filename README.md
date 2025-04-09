# Control Access Frontend

Este é o frontend do sistema de controle de acesso, desenvolvido com React, TypeScript e Vite. Ele fornece uma interface para gerenciar visitantes, funcionários e visitas, com autenticação e autorização baseadas em permissões.

## Requisitos

- Node.js (versão 16 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/seu-usuario/control-access-frontend.git
   cd control-access-frontend
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

## Uso

### Ambiente de Desenvolvimento

Para iniciar o servidor de desenvolvimento, execute:

```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`.

### Build para Produção

Para gerar os arquivos otimizados para produção, execute:

```bash
npm run build
```

Os arquivos serão gerados na pasta `dist`.

### Pré-visualização do Build

Para pré-visualizar o build de produção, execute:

```bash
npm run preview
```

### Lint

Para verificar e corrigir problemas de lint, execute:

```bash
npm run lint
```

## Estrutura do Projeto

- `src/`: Contém o código-fonte do projeto.
  - `components/`: Componentes reutilizáveis, como modais e cabeçalhos.
  - `pages/`: Páginas principais do sistema, como login, lista de visitantes e área do funcionário.
  - `App.tsx`: Configuração das rotas do sistema.
  - `ProtectedRoute.tsx`: Gerenciamento de rotas protegidas.
- `public/`: Arquivos estáticos, como imagens.
- `vite.config.ts`: Configuração do Vite.

## Configuração do Backend

Este projeto depende de um backend para autenticação e gerenciamento de dados. Certifique-se de que o backend esteja rodando em `http://localhost:8080` ou ajuste a configuração de proxy no arquivo [`vite.config.ts`](vite.config.ts).

O repositório do backend pode ser encontrado [aqui](https://github.com/mmartirio/controlAccess).

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.