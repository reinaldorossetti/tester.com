# 🧪 README de Testes — Projeto `tester.com`

Este documento consolida **como os testes estão estruturados**, **quais frameworks são usados**, e **os resultados mais recentes registrados** no repositório.

---

## 🎯 Objetivo da suíte de testes

A estratégia de testes do projeto cobre principalmente:

- **Fluxos de frontend (E2E/UI)**: autenticação, catálogo, carrinho/checkout, cadastro, detalhes de produto e regras de segurança/acesso.
- **Fluxos de API**: produtos, usuários e carrinho.
- **Evidências de falha**: screenshot, vídeo e trace na primeira repetição.

---

## 📊 Resumo quantitativo dos testes

### 1) Casos de teste implementados no código

- **Arquivos spec totais:** `12`
- Frontend: `9` arquivos
- API: `3` arquivos
- **Casos de teste (`test(...)`) implementados:** `59`
- Frontend: `50`
- API: `9`

### 2) Resultado da última execução ampla de frontend (sessão atual)

Execução realizada em `e2e/specs/frontend/*.spec.ts`.

- **Testes executados:** `50`
- **Passaram:** `50`
- **Falharam:** `0`
- **Ignorados (skipped):** `0`
- **Erros técnicos (errors):** `0`

Taxas da última execução:

- **Taxa de sucesso:** $50/50 = 100\%$
- **Taxa de falha:** $0/50 = 0\%$

> Observação importante: nesta rodada, a suíte de frontend executou de forma estável, sem falhas funcionais nem falhas de infraestrutura.

### 3) Execução focada dos specs alterados (novos testes)

- **Escopo:**
	- `e2e/specs/frontend/cart-checkout.spec.ts`
	- `e2e/specs/frontend/catalog.spec.ts`
	- `e2e/specs/frontend/security.spec.ts`
	- `e2e/specs/frontend/register-language.spec.ts`
- **Passaram:** `25`
- **Falharam:** `0`

> Essa execução confirma que os **5 novos testes adicionados** estão passando no conjunto validado.

---

## 🧱 Estrutura dos testes no repositório

```text
e2e/
├── data/
│   └── products.mock.ts
├── fixtures/
│   ├── failure-capture.fixture.ts
│   ├── login.fixture.ts
│   ├── register.fixture.ts
│   ├── test-data.fixture.ts
│   ├── ui.fixture.ts
│   └── selectors/selectors.ts
├── helpers/
│   ├── auth.ts
│   ├── PageBase.ts
│   ├── RegisterPage.ts
│   └── selectors.ts
├── specs/
│   ├── api/
│   │   ├── cart.api.spec.ts
│   │   ├── products.api.spec.ts
│   │   └── users.api.spec.ts
│   └── frontend/
│       ├── auth.spec.ts
│       ├── cart-checkout.spec.ts
│       ├── catalog.spec.ts
│       ├── login.spec.ts
│       ├── product-details.spec.ts
│       ├── register.spec.ts
│       ├── register-language.spec.ts
│       ├── register-login.spec.ts
│       └── security.spec.ts
└── results/
		└── artefatos auxiliares de execução
```

### Arquivos de saída de execução

- `junit-report.xml`: resultado em formato JUnit (bom para CI).
- `playwright-report/`: relatório HTML navegável.
- `test-results/`: evidências por cenário (screenshot, vídeo, trace, contexto de erro).

---

## ⚙️ Configuração atual do Playwright

Arquivo: `playwright.config.ts`

- `timeout` por teste: **45s**
- `expect.timeout`: **15s**
- Paralelismo: `fullyParallel: true`
- Tentativas: `1` local / `2` em CI
- Workers: `70%` local / `3` em CI
- Reporters:
	- `list`
	- `html` (pasta `playwright-report`)
	- `junit` (arquivo `junit-report.xml`)
- Coleta de evidências:
	- `trace: on-first-retry`
	- `screenshot: only-on-failure`
	- `video: retain-on-failure`

### Projetos definidos no config

- `frontend-chromium`
- `frontend-webkit`
- `frontend-edge`
- `api`

> Nota técnica: o `testDir` está apontando para `./e2e/specs/frontend`, então a execução padrão foca os testes de frontend.

---

## 🧰 Frameworks e bibliotecas utilizadas nos testes

### Playwright (`@playwright/test`)

É o framework principal de automação. No projeto, ele oferece:

- Execução E2E com múltiplos navegadores.
- API testing com `request` (nos specs de API).
- Fixtures reutilizáveis para setup e organização.
- Repetição automática e coleta rica de evidências.
- Relatórios HTML e JUnit para análise local e CI.

### Faker (`@faker-js/faker`)

Usado para gerar dados dinâmicos de teste (ex.: cadastro), reduzindo colisões de dados e aumentando a robustez dos cenários.

### Node.js + scripts utilitários

- Script customizado de falhas: `scripts/generate-failure-report.js`
- Comando para abrir relatório de falhas em HTML.

---

## 🚀 Instalação detalhada para executar os testes

## 1. Pré-requisitos

- Node.js 18+
- npm
- Docker + Docker Compose

## 2. Instalar dependências (frontend)

Na raiz do projeto:

`npm install`

## 3. Instalar dependências (backend/API)

Na pasta `server/`:

`npm install`

## 4. Subir banco de dados

Na raiz do projeto:

`docker compose up -d`

## 5. Preparar base de dados

Na pasta `server/`:

`npm run seed`

## 6. Iniciar backend

Na pasta `server/`:

`npm run dev`

Backend esperado em: `http://localhost:3001`

## 7. Iniciar frontend

Na raiz do projeto:

`npm run dev`

Frontend esperado em: `http://localhost:5174`

> Esse passo é crítico para os testes de frontend. Sem a aplicação ativa, haverá `ERR_CONNECTION_REFUSED`.

---

## ▶️ Execução dos testes (detalhado)

Comandos disponíveis no `package.json` da raiz:

- `npm run test:e2e` → execução padrão Playwright
- `npm run test:e2e:ui` → modo UI interativo
- `npm run test:e2e:debug` → modo debug
- `npm run test:e2e:headed` → execução com navegador visível
- `npm run test:e2e:report` → abre último relatório HTML
- `npm run test:e2e:failure-report` → gera relatório customizado de falhas

### Sequência recomendada de execução local

1. Confirmar banco/API/frontend ativos.
2. Rodar `npm run test:e2e`.
3. Abrir relatório com `npm run test:e2e:report`.
4. Se houver falha, investigar `test-results/` (screenshot/vídeo/trace).

---

## 📋 Tabela completa dos testes (nome + numeração + feature)

| # | Feature | Nome do teste |
|---:|---|---|
| 1 | Cart and Checkout | TS01 authenticated user should complete checkout and navigate to thank-you page |
| 2 | Cart and Checkout | TS02 non-authenticated user should be redirected to login with next parameter |
| 3 | Cart and Checkout | TS03 empty cart should keep checkout unavailable |
| 4 | Cart and Checkout | TS04 should update quantity, total and badge for a valid positive value |
| 5 | Cart and Checkout | TS05 should keep previous quantity when value is zero |
| 6 | Cart and Checkout | TS06 should keep previous quantity when value is negative |
| 7 | Cart and Checkout | TS07 should handle larger valid quantity values correctly |
| 8 | Cart and Checkout | TS08 should normalize decimal input to integer quantity |
| 9 | Cart and Checkout | TS09 should remove a single item and show empty cart state |
| 10 | Cart and Checkout | TS10 should add three items, remove all of them, and validate empty cart |
| 11 | Cart and Checkout | TS11 should clear cart after successful checkout when leaving thank-you page |
| 12 | Cart and Checkout | TS12 should decrement cart badge after each item removal |
| 13 | Login (`auth.spec.ts`) | TS01 - should log in successfully with next redirect and greeting |
| 14 | Login (`auth.spec.ts`) | TS02 - should display error for invalid credentials |
| 15 | Login (`auth.spec.ts`) | TS03 - should validate required fields |
| 16 | Login (`auth.spec.ts`) | TS04 - should show validation when password is blank |
| 17 | Login (`auth.spec.ts`) | TS05 - should show validation when email is blank |
| 18 | Login (`auth.spec.ts`) | TS06 - should keep authenticated state after reload |
| 19 | Login (`login.spec.ts`) | TS01 - Should successfully log in when providing valid credentials |
| 20 | Login (`login.spec.ts`) | TS02 - Should display an error alert when credentials are invalid |
| 21 | Login (`login.spec.ts`) | TS03 - Should display a validation message when submitting with empty fields |
| 22 | Login (`login.spec.ts`) | TS04 - Should display a validation message when password is empty |
| 23 | Login (`login.spec.ts`) | TS05 - Should navigate to the register page when clicking the create account button |
| 24 | Catalog Page | TS01 deve listar produtos ao carregar página |
| 25 | Catalog Page | TS02 deve permitir busca por texto e atualizar contagem |
| 26 | Catalog Page | TS03 deve aplicar filtro por categoria |
| 27 | Catalog Page | TS04 deve mostrar estado vazio quando busca não retorna itens |
| 28 | Catalog Page | TS05 deve navegar para detalhes ao clicar no produto |
| 29 | Catalog Page | TS06 should preserve search filter after navigating to details and back |
| 30 | Product Details | TS01 deve exibir dados principais do produto |
| 31 | Product Details | TS02/TS03 deve permitir adicionar ao carrinho e atualizar badge |
| 32 | Product Details | TS04 deve tratar ID inválido |
| 33 | Product Details | TS05 deve voltar para catálogo |
| 34 | Register | TS01 - Should successfully register a new user when providing all valid requirements |
| 35 | Register | TS02 - rejeita email em formato inválido aleatório |
| 36 | Register | TS03 - rejeita senha curta no step 0 |
| 37 | Register | TS04 - rejeita senhas não-correspondentes com dados aleatórios |
| 38 | Register | TS05 - Should display specific validation errors and prevent step advancement when individual required fields are empty |
| 39 | Register | TS06 - rejeita email duplicado com dados aleatórios |
| 40 | Register | TS07 - valida todos os campos vazios com mensagens de validação individuais |
| 41 | Register and Language | TS01 registro PF completo com sucesso |
| 42 | Register and Language | TS03 validação de campos obrigatórios no registro |
| 43 | Register and Language | TS01/TS02 idioma alterna e persiste após reload |
| 44 | Register and Language | TS04 should render cart empty-state content in English after language toggle |
| 45 | Register → Login — Fluxo Completo | TS01 - Should register a new user and immediately login with the same credentials |
| 46 | Register → Login — Fluxo Completo | TS02 - Should allow the user to log out and log back in with the same credentials |
| 47 | Register → Login — Fluxo Completo | TS03 - Should show an error when logging in with wrong password after registration |
| 48 | Security / Access Control | SE01 - Não logado tentando fazer checkout deve redirecionar para login |
| 49 | Security / Access Control | SE02 - Tentar acessar a página de confirmação (/thank-you) diretamente sem estar logado deve redirecionar |
| 50 | Security / Access Control | SE03 - Should revoke protected access after logout |
| 51 | API Products | deve criar, buscar, filtrar, atualizar e remover produto |
| 52 | API Products | deve retornar 400 ao criar produto sem campos obrigatórios |
| 53 | API Products | deve retornar array vazio para categoria inexistente |
| 54 | API Users | deve registrar e autenticar usuário válido |
| 55 | API Users | deve retornar 409 para e-mail duplicado |
| 56 | API Users | deve retornar 401 para credenciais inválidas |
| 57 | API Users | deve retornar 400 para payload incompleto |
| 58 | API Cart | deve adicionar, incrementar, listar e remover item do carrinho |
| 59 | API Cart | deve validar erros de payload do carrinho |

---

## 🔍 Interpretação rápida de falhas

Quando um teste falhar:

1. Verifique se frontend (`5174`) e backend (`3001`) estão ativos.
2. Abra o HTML report para timeline e logs.
3. Inspecione o `trace.zip` do cenário com falha.
4. Revise os fixtures envolvidos no cenário.

---

## ✅ Conclusão

Hoje o projeto possui **59 cenários implementados** (50 frontend + 9 API), com rastreabilidade por feature e por caso de teste.

A tabela acima traz a visão completa e numerada dos cenários. Já os resultados de execução demonstram que a saúde da suíte depende diretamente do ambiente estar ativo (`localhost:5174`), reforçando a necessidade de subir a aplicação antes dos testes E2E.
