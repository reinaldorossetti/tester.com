# 🛒 AmazonQA — Loja Online

Aplicação de e-commerce completa construída com **React + Vite**, com design visual inspirado na Amazon. Inclui catálogo de produtos conectado a um banco SQLite rodando via WebAssembly no navegador, internacionalização PT/EN e um fluxo completo de compra.

---

## 🚀 Funcionalidades

- **Catálogo com Filtros:** Grade responsiva de produtos com busca em tempo real e filtro por categoria. Produtos exibidos em **ordem alfabética**.
- **Página de Detalhes do Produto:** Exibe imagem ampliada, descrição, fabricante, linha, modelo, seleção de quantidade e botão de adicionar ao carrinho.
- **Gestão de Carrinho:** Adicionar, atualizar quantidade e remover produtos. Contador dinâmico no ícone da NavBar.
- **Checkout / Thank You Page:** Finalização de compra com resumo do pedido e mensagem de agradecimento.
- **Notificações (Toast):** Alertas visuais elegantes para ações do usuário via `react-toastify`.
- **Internacionalização (i18n):** Alternância de idioma PT ⇆ EN com botão na NavBar. Preferência salva no `localStorage`.
- **Logo Personalizada:** Imagem `logo.PNG` exibida na barra de navegação no lugar do texto.

---

## 💾 Banco de Dados Local (SQLite via WebAssembly)

A aplicação utiliza um banco de dados **SQLite real rodando diretamente no navegador**, sem necessidade de backend externo.

| Arquivo | Responsabilidade |
|---|---|
| `src/db/database.js` | Inicialização do banco, criação de tabelas, seed e queries (`getProducts`, `getProductById`) |
| `src/db/generate_db.js` | Script Node.js para gerar o arquivo físico `ecommerce.sqlite` localmente |
| `src/db/ecommerce.sqlite` | Arquivo SQLite físico gerado com todos os produtos |
| `src/contexts/DatabaseContext.jsx` | Context API que aguarda a inicialização do banco antes de renderizar os filhos |
| `public/sql-wasm.wasm` | Módulo WebAssembly da biblioteca `sql.js` |

### Estratégia de Sincronização

- **UPSERT automático:** A cada inicialização da app, o conteúdo de `products_mock.json` é sincronizado com o banco via `INSERT ... ON CONFLICT(id) DO UPDATE SET`, garantindo que edições no JSON (nomes, preços, imagens) sejam refletidas imediatamente.
- **Persistência via LocalStorage:** O banco in-memory é exportado em Base64 e salvo no `localStorage` a cada atualização.

### Gerar o banco físico manualmente

```bash
node src/db/generate_db.js
```

---

## 🧩 Componentes

| Componente | Descrição |
|---|---|
| `NavBar` (em `App.jsx`) | Logo, busca estilo Amazon, toggle de idioma, carrinho com contador |
| `Catalog` | Grade de produtos com busca e filtro por categoria |
| `Product` | Card de produto com imagem, preço, categoria e botão de adicionar ao carrinho |
| `ProductDetails` | Página de detalhes: imagem, descrição, fabricante/linha/modelo, quantidade e carrinho |
| `Cart` | Carrinho com lista de itens, resumo do pedido e subtotais |
| `CartItem` | Item do carrinho com seleção de quantidade e exclusão |
| `CheckoutButton` | Botão de finalização com validação de carrinho vazio |
| `ThankYouPage` | Confirmação de pedido com tabela de itens e total |

---

## 🌐 Internacionalização (i18n)

- Implementada via `LanguageContext` (Context API) em `src/contexts/LanguageContext.jsx`.
- Dicionários em **Português** e **Inglês** cobrem todos os textos da UI: NavBar, Catálogo, Carrinho, Detalhes, Checkout, Página de Agradecimento e Toast messages.
- Preferência do idioma persistida no `localStorage`.
- Botão na NavBar com ícone de idioma para alternar PT ⇆ EN.

---

## 🎨 Design e Tematização (MUI)

Utilizamos **Material-UI (MUI v7+)** com `ThemeProvider` e `createTheme` para replicar a identidade visual da Amazon:

- **Paleta Primary:** `#131921` (dark) e `#0f1111` (foco) para NavBar e fundos.
- **Paleta Secondary (CTA):** `#ff9900`, `#FFD814`, `#FFA41C` para botões e destaques de preço.
- **Overrides de Componentes:**
  - `Button`: sem maiúsculas automáticas, estilo "Add to Cart" com fundo âmbar.
  - `Card`: sombra sutil, borda fina `#D5D9D9`, hover com elevação.
  - `AppBar`: cor sólida `#131921`, sem bordas arredondadas.

---

## 📁 Estrutura de Pastas

```text
tester.com/
├── public/
│   ├── logo.PNG              # Logo da marca exibida na NavBar
│   ├── sql-wasm.wasm         # WebAssembly do sql.js
│   └── sql-wasm-browser.wasm # WASM específico para ambientes de browser
├── src/
│   ├── components/           # Componentes visuais (Product, Cart, Catalog, etc.)
│   ├── contexts/
│   │   ├── DatabaseContext.jsx   # Context de inicialização do banco SQLite
│   │   └── LanguageContext.jsx   # Context de i18n com dicionários PT/EN
│   ├── data/
│   │   └── products_mock.json    # Fonte de verdade dos produtos (seed do SQLite)
│   ├── db/
│   │   ├── database.js           # Core do SQLite: inicialização, queries, persistência
│   │   ├── generate_db.js        # Script Node.js para gerar o .sqlite físico
│   │   └── ecommerce.sqlite      # Arquivo SQLite gerado com os dados dos produtos
│   ├── App.jsx               # Roteamento, thema MUI e NavBar
│   └── main.jsx              # Ponto de entrada React
├── package.json
└── vite.config.js
```

---

## ⚛️ Padrões de Arquitetura

- **Componentização por propósito:** Um componente por arquivo, nomeado de forma idêntica ao export.
- **Separação de Responsabilidades:** Lógica de estado no `App.jsx` (container), apresentação nos componentes filhos (props + callbacks).
- **Context API:** `LanguageContext` e `DatabaseContext` para estados verdadeiramente globais.
- **Hooks nativos:** `useState`, `useEffect`, `useContext`, `useParams`, `useNavigate` — sem bibliotecas de estado externo.
- **IDs semânticos em componentes:** Cada `Box` (MuiBox-root) possui um `id` descritivo para facilitar testes automatizados com Playwright ou ferramentas similares.

---

## ⚙️ Como Rodar

### Pré-requisitos
- [Node.js](https://nodejs.org/) 18.x ou 20.x+
- NPM ou Yarn

### Instalação

```bash
git clone <URL_DO_REPOSITORIO>
cd tester.com
npm install
```

### Desenvolvimento (HMR)

```bash
npm run dev
# Acesse: http://localhost:5173
```

### Build de Produção

```bash
npm run build
npm run preview
# Acesse: http://localhost:4173
```

### Dependências Principais

| Dependência | Função |
|---|---|
| `react` + `react-dom` | Core da UI |
| `react-router-dom` | Roteamento SPA (catálogo, produto, carrinho) |
| `@mui/material` + `@mui/icons-material` | Design System / componentes visuais |
| `@emotion/react` + `@emotion/styled` | Engine de CSS-in-JS do MUI |
| `sql.js` | SQLite via WebAssembly no browser |
| `react-toastify` | Notificações toast |
| `vite` + `@vitejs/plugin-react` | Build tool e servidor de desenvolvimento |
