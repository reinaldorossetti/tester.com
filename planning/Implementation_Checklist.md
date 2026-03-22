# ✅ Checklist Detalhado de Implementação

## Fase 1: Setup Inicial (Dia 1-2)

### 1.1 Dependencies Frontend
```bash
npm install --save-dev vitest @vitejs/plugin-react
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev jsdom
npm install --save-dev @vitest/coverage-v8
npm install --save-dev @faker-js/faker
```

- [ ] Todos os packages instalados
- [ ] `vitest.config.js` criado
- [ ] `src/__tests__/setup.js` criado
- [ ] `src/__tests__/fixtures.js` criado
- [ ] Scripts adicionados ao `package.json`

### 1.2 Dependencies Backend
```bash
cd server
npm install --save-dev mocha chai sinon chai-http
npm install --save-dev nyc
npm install --save-dev @faker-js/faker
npm install --save-dev dotenv
```

- [ ] Todos os packages instalados
- [ ] `.mocharc.json` criado
- [ ] `.nycrc` criado
- [ ] `server/__tests__/setup-tests.js` criado
- [ ] `server/__tests__/fixtures.js` criado
- [ ] `.env.test` criado (DB test config)
- [ ] Scripts adicionados ao `package.json`

### 1.3 Estrutura de Pastas
```
src/__tests__/
├── components/
├── contexts/
├── hooks/
├── setup.js
└── fixtures.js

server/__tests__/
├── api/
├── setup-tests.js
└── fixtures.js
```

- [ ] Pastas criadas
- [ ] `.gitignore` atualizado (ignora `coverage/`, `.nyc_output/`)

### 1.4 Baseline Coverage
- [ ] Executar `npm run test:coverage` - frontend
- [ ] Executar `cd server && npm run test:coverage` - backend
- [ ] Documentar baseline (0%, esperado inicialmente)
- [ ] Criar GitHub branch: `feature/unit-tests-implementation`

---

## Fase 2: Frontend Tests (Dia 3-7)

### 2.1 Componentes de Autenticação

#### Login.jsx (10 testes)
- [ ] TC_LOGIN_001: Renderiza form
- [ ] TC_LOGIN_002: Validação email
- [ ] TC_LOGIN_003: Validação password vazio
- [ ] TC_LOGIN_004: Submit válido
- [ ] TC_LOGIN_005: API error handling
- [ ] TC_LOGIN_006: Loading state
- [ ] TC_LOGIN_007: Clear error on input
- [ ] TC_LOGIN_008: Redirect on success
- [ ] TC_LOGIN_009: Save token localStorage
- [ ] TC_LOGIN_010: Reset form

**Arquivo:** `src/__tests__/components/Login.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%

---

#### Register.jsx (10 testes)
- [ ] TC_REG_001: Renderiza form completo
- [ ] TC_REG_002: Email duplicado
- [ ] TC_REG_003: Password fraca
- [ ] TC_REG_004: Password mismatch
- [ ] TC_REG_005: Submit válido
- [ ] TC_REG_006: Password hash
- [ ] TC_REG_007: Success message
- [ ] TC_REG_008: Redirect
- [ ] TC_REG_009: Clear errors
- [ ] TC_REG_010: Disable submit invalid

**Arquivo:** `src/__tests__/components/Register.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%
- [ ] Mocks de validação funcionando

---

### 2.2 Componentes Catálogo

#### Catalog.jsx (10 testes)
- [ ] TC_CAT_001: Lista produtos
- [ ] TC_CAT_002: Filtro categoria
- [ ] TC_CAT_003: Ordenação
- [ ] TC_CAT_004: Paginação
- [ ] TC_CAT_005: Busca com debounce
- [ ] TC_CAT_006: Loading indicator
- [ ] TC_CAT_007: Empty state
- [ ] TC_CAT_008: Navigate detalhe
- [ ] TC_CAT_009: Add to cart
- [ ] TC_CAT_010: API error fallback

**Arquivo:** `src/__tests__/components/Catalog.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%
- [ ] Mock de API implementado

---

#### ProductDetails.jsx (10 testes)
- [ ] TC_PD_001: Carrega por ID
- [ ] TC_PD_002: Galeria imagens
- [ ] TC_PD_003: Selector quantidade
- [ ] TC_PD_004: Selector tamanho/cor
- [ ] TC_PD_005: Add to cart
- [ ] TC_PD_006: Calcula preço desconto
- [ ] TC_PD_007: Reviews
- [ ] TC_PD_008: Modal zoom
- [ ] TC_PD_009: Produto não encontrado
- [ ] TC_PD_010: Scroll topo

**Arquivo:** `src/__tests__/components/ProductDetails.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%

---

#### Product.jsx (10 testes - Card)
- [ ] TC_PROD_001: Renderiza imagem
- [ ] TC_PROD_002: Nome e preço
- [ ] TC_PROD_003: Rating/estrelas
- [ ] TC_PROD_004: Badge sale
- [ ] TC_PROD_005: Hover buttons
- [ ] TC_PROD_006: Click detalhe
- [ ] TC_PROD_007: Add to cart
- [ ] TC_PROD_008: Wishlist toggle
- [ ] TC_PROD_009: Skeleton loader
- [ ] TC_PROD_010: Image fallback

**Arquivo:** `src/__tests__/components/Product.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%

---

### 2.3 Componentes Carrinho & Checkout

#### Cart.jsx (10 testes)
- [ ] TC_CART_001: Lista itens
- [ ] TC_CART_002: Update quantidade
- [ ] TC_CART_003: Remove item
- [ ] TC_CART_004: Clear cart
- [ ] TC_CART_005: Calcula subtotal
- [ ] TC_CART_006: Aplica cupom
- [ ] TC_CART_007: Aviso estoque
- [ ] TC_CART_008: Checkout disabled vazio
- [ ] TC_CART_009: Persiste localStorage
- [ ] TC_CART_010: Empty state

**Arquivo:** `src/__tests__/components/Cart.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%

---

#### CartItem.jsx (10 testes)
- [ ] TC_CI_001: Renderiza info
- [ ] TC_CI_002: Input quantidade
- [ ] TC_CI_003: Botão remover
- [ ] TC_CI_004: Preço linha
- [ ] TC_CI_005: Quantity min
- [ ] TC_CI_006: Quantity max
- [ ] TC_CI_007: onChange callback
- [ ] TC_CI_008: onRemove callback
- [ ] TC_CI_009: Badge "em falta"
- [ ] TC_CI_010: Desconto/promo

**Arquivo:** `src/__tests__/components/CartItem.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%

---

#### Checkout.jsx / CheckoutButton.jsx (10 testes)
- [ ] TC_CHK_001: Renderiza form
- [ ] TC_CHK_002: Validação endereço
- [ ] TC_CHK_003: Validação cartão
- [ ] TC_CHK_004: Validação data
- [ ] TC_CHK_005: Validação CVV
- [ ] TC_CHK_006: Máscaras input
- [ ] TC_CHK_007: Submit invalid disabled
- [ ] TC_CHK_008: API payment
- [ ] TC_CHK_009: Loading durante payment
- [ ] TC_CHK_010: Redirect success

**Arquivo:** `src/__tests__/components/Checkout.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%
- [ ] Mocks de pagamento funcionando

---

#### ThankYouPage.jsx (10 testes)
- [ ] TC_TY_001: Mensagem sucesso
- [ ] TC_TY_002: Order ID
- [ ] TC_TY_003: Resumo pedido
- [ ] TC_TY_004: Email confirmação
- [ ] TC_TY_005: Botão voltar
- [ ] TC_TY_006: Download PDF
- [ ] TC_TY_007: Link track ordem
- [ ] TC_TY_008: Compartilhar
- [ ] TC_TY_009: Dados persistent
- [ ] TC_TY_010: Timer cleanup

**Arquivo:** `src/__tests__/components/ThankYouPage.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 80%

---

### 2.4 Contexts

#### AuthContext.jsx (10 testes)
- [ ] TC_AUTH_001: Estado inicial
- [ ] TC_AUTH_002: Login state
- [ ] TC_AUTH_003: Logout state
- [ ] TC_AUTH_004: Refresh token válido
- [ ] TC_AUTH_005: Refresh token inválido
- [ ] TC_AUTH_006: Persist localStorage
- [ ] TC_AUTH_007: Restore session
- [ ] TC_AUTH_008: isAuthenticated
- [ ] TC_AUTH_009: userRole
- [ ] TC_AUTH_010: Error state

**Arquivo:** `src/__tests__/contexts/AuthContext.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 85%

---

#### DatabaseContext.jsx (10 testes)
- [ ] TC_DB_001: Inicializa
- [ ] TC_DB_002: Cria collection
- [ ] TC_DB_003: Insert
- [ ] TC_DB_004: Read
- [ ] TC_DB_005: Update
- [ ] TC_DB_006: Delete
- [ ] TC_DB_007: Query filtros
- [ ] TC_DB_008: Sync server
- [ ] TC_DB_009: Error handler
- [ ] TC_DB_010: Cleanup

**Arquivo:** `src/__tests__/contexts/DatabaseContext.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 85%
- [ ] Mocks RxDB funcionando

---

#### LanguageContext.jsx (10 testes)
- [ ] TC_LANG_001: Language inicial
- [ ] TC_LANG_002: Toggle language
- [ ] TC_LANG_003: Load strings
- [ ] TC_LANG_004: currentLanguage
- [ ] TC_LANG_005: t() function
- [ ] TC_LANG_006: Fallback EN
- [ ] TC_LANG_007: Persist localStorage
- [ ] TC_LANG_008: Restore ao iniciar
- [ ] TC_LANG_009: Date format
- [ ] TC_LANG_010: Number format

**Arquivo:** `src/__tests__/contexts/LanguageContext.test.jsx`

- [ ] Todos 10 testes passando
- [ ] Coverage >= 85%

---

### 2.5 Frontend - Validação Final
- [ ] Todos 90 testes passando (`npm run test`)
- [ ] Coverage geral >= 80%
  - Linhas: >= 80%
  - Functions: >= 80%
  - Branches: >= 80%
- [ ] Coverage report gerado em `coverage/index.html`
- [ ] Commit: `"feat: add frontend unit tests - 90 testes"`

---

## Fase 3: Backend Tests (Dia 8-10)

### 3.1 Users API (10 testes)

#### POST /api/users/register (Tests 1-3)
- [ ] TC_USERS_001: Register sucesso
  - [ ] Password é hasheado (bcrypt)
  - [ ] User criado no DB
  - [ ] Não retorna password hash
  - [ ] Status 201

- [ ] TC_USERS_002: Email duplicado
  - [ ] Mock DB check existing email
  - [ ] Status 409
  - [ ] Error message apropriada

- [ ] TC_USERS_003: Validação campos obrigatórios
  - [ ] Mock validation
  - [ ] Status 400
  - [ ] Lista campos faltantes

**Arquivo:** `server/__tests__/api/users.test.js` (Parte 1)

- [ ] 3 testes passando

---

#### POST /api/users/login (Tests 4-6)
- [ ] TC_USERS_004: Login sucesso
  - [ ] Mock DB find user
  - [ ] Mock bcrypt compare
  - [ ] Retorna JWT token
  - [ ] Status 200

- [ ] TC_USERS_005: Senha incorreta
  - [ ] Mock bcrypt compare falha
  - [ ] Status 401
  - [ ] Não retorna user

- [ ] TC_USERS_006: Usuário não existe
  - [ ] Mock DB find null
  - [ ] Status 404

**Arquivo:** `server/__tests__/api/users.test.js` (Parte 2)

- [ ] 3 testes passando

---

#### GET, PUT, DELETE /api/users/:id (Tests 7-10)
- [ ] TC_USERS_007: GET profile autenticado
  - [ ] Mock JWT verify
  - [ ] Mock DB find
  - [ ] Status 200
  - [ ] Retorna dados user

- [ ] TC_USERS_008: PUT atualizar perfil
  - [ ] Mock autenticação
  - [ ] Mock DB update
  - [ ] Validação campos
  - [ ] Status 200

- [ ] TC_USERS_009: DELETE conta
  - [ ] Mock autenticação
  - [ ] Mock DB delete user
  - [ ] Mock delete orders cascata
  - [ ] Status 200

- [ ] TC_USERS_010: GET orders histórico
  - [ ] Mock autenticação
  - [ ] Mock DB query orders
  - [ ] Paginação (limit, offset)
  - [ ] Status 200

**Arquivo:** `server/__tests__/api/users.test.js` (Parte 3)

- [ ] 4 testes passando
- [ ] Total Users: 10 testes passando
- [ ] Coverage >= 90%

---

### 3.2 Products API (10 testes)

#### GET /api/products (Tests 1-5)
- [ ] TC_PROD_API_001: Lista todos
  - [ ] Mock DB query
  - [ ] Paginação default (limit: 24, offset: 0)
  - [ ] Status 200
  - [ ] Array de produtos

- [ ] TC_PROD_API_002: Filtro categoria
  - [ ] Mock DB WHERE category
  - [ ] Query param: ?category=electronics
  - [ ] Apenas produtos categoria

- [ ] TC_PROD_API_003: Ordenação
  - [ ] Mock DB ORDER BY
  - [ ] Query params: ?sort=price&order=asc|desc
  - [ ] Produtos ordenados corretamente

- [ ] TC_PROD_API_004: Busca termo
  - [ ] Mock DB LIKE query
  - [ ] Query param: ?search=laptop
  - [ ] Resultados contêm termo

- [ ] TC_PROD_API_005: Detalhe produto
  - [ ] GET /api/products/:id
  - [ ] Mock DB find by id
  - [ ] Todos campos retornados
  - [ ] Mock related products

**Arquivo:** `server/__tests__/api/products.test.js` (Parte 1)

- [ ] 5 testes passando

---

#### POST, PUT, DELETE /api/products (Tests 6-8)
- [ ] TC_PROD_API_006: Criar produto (admin)
  - [ ] Mock JWT verify admin
  - [ ] Mock DB insert
  - [ ] Validação campos obrigatórios
  - [ ] Mock upload imagem
  - [ ] Status 201

- [ ] TC_PROD_API_007: Atualizar produto (admin)
  - [ ] Mock autenticação admin
  - [ ] Mock DB update
  - [ ] Apenas admin consegue
  - [ ] Status 200

- [ ] TC_PROD_API_008: Deletar produto (admin)
  - [ ] Mock autenticação admin
  - [ ] Mock DB delete
  - [ ] Remove de carrinhos
  - [ ] Status 200

**Arquivo:** `server/__tests__/api/products.test.js` (Parte 2)

- [ ] 3 testes passando

---

#### Reviews & Stock (Tests 9-10)
- [ ] TC_PROD_API_009: GET reviews
  - [ ] GET /api/products/:id/reviews
  - [ ] Mock DB query reviews
  - [ ] Calcula média rating
  - [ ] Paginação reviews
  - [ ] Status 200

- [ ] TC_PROD_API_010: Verificar estoque
  - [ ] GET /api/products/stock/:id
  - [ ] Mock DB select stock
  - [ ] Retorna integer quantity
  - [ ] Status "in_stock" vs "out_of_stock"
  - [ ] Status 200

**Arquivo:** `server/__tests__/api/products.test.js` (Parte 3)

- [ ] 2 testes passando
- [ ] Total Products: 10 testes passando
- [ ] Coverage >= 90%

---

### 3.3 Cart API (10 testes)

#### GET /api/cart & POST Add Item (Tests 1-2)
- [ ] TC_CART_API_001: GET carrinho
  - [ ] Mock autenticação
  - [ ] Mock DB find by user_id
  - [ ] Calcula total
  - [ ] Status 200

- [ ] TC_CART_API_002: ADD item ao carrinho
  - [ ] Mock autenticação
  - [ ] Mock DB insert cart_item
  - [ ] Validação estoque disponível
  - [ ] Quantity validação (>= 1)
  - [ ] Status 201

**Arquivo:** `server/__tests__/api/cart.test.js` (Parte 1)

- [ ] 2 testes passando

---

#### PUT, DELETE Items (Tests 3-5)
- [ ] TC_CART_API_003: Atualizar quantidade
  - [ ] PUT /api/cart/items/:itemId
  - [ ] Mock autenticação
  - [ ] Mock DB update quantity
  - [ ] Validação min=1, max=stock
  - [ ] Status 200

- [ ] TC_CART_API_004: Remover item
  - [ ] DELETE /api/cart/items/:itemId
  - [ ] Mock autenticação
  - [ ] Mock DB delete
  - [ ] Item realmente removido
  - [ ] Status 200

- [ ] TC_CART_API_005: Limpar carrinho
  - [ ] DELETE /api/cart
  - [ ] Mock autenticação
  - [ ] Mock DB delete todos items
  - [ ] Carrinho vazio
  - [ ] Status 200

**Arquivo:** `server/__tests__/api/cart.test.js` (Parte 2)

- [ ] 3 testes passando

---

#### Cupom & Checkout (Tests 6-8)
- [ ] TC_CART_API_006: Aplicar cupom
  - [ ] POST /api/cart/coupon
  - [ ] Mock autenticação
  - [ ] Mock DB find coupon
  - [ ] Validação data expiração
  - [ ] Calcula desconto corretamente
  - [ ] Prevent 2x aplicação
  - [ ] Status 200

- [ ] TC_CART_API_007: Remover cupom
  - [ ] DELETE /api/cart/coupon
  - [ ] Mock autenticação
  - [ ] Mock DB update
  - [ ] Recalcula total
  - [ ] Status 200

- [ ] TC_CART_API_008: Checkout/Processar payment
  - [ ] POST /api/cart/checkout
  - [ ] Mock autenticação
  - [ ] Validação carrinho não vazio
  - [ ] Mock criar order
  - [ ] Mock payment gateway (stripe)
  - [ ] Mock limpar carrinho
  - [ ] Mock enviar email confirmação
  - [ ] Status 201

**Arquivo:** `server/__tests__/api/cart.test.js` (Parte 3)

- [ ] 3 testes passando

---

#### Summary & Validação (Tests 9-10)
- [ ] TC_CART_API_009: Resumo carrinho
  - [ ] GET /api/cart/summary
  - [ ] Mock DB query items + totals
  - [ ] Calcula subtotal corretamente
  - [ ] Calcula impostos
  - [ ] Aplica desconto
  - [ ] Calcula total final
  - [ ] Currency format

- [ ] TC_CART_API_010: Validar carrinho
  - [ ] POST /api/cart/validate
  - [ ] Valida itens existem
  - [ ] Valida estoque suficiente
  - [ ] Valida preços não mudaram
  - [ ] Retorna car válido ou lista problemas
  - [ ] Status 200/422

**Arquivo:** `server/__tests__/api/cart.test.js` (Parte 4)

- [ ] 2 testes passando
- [ ] Total Cart: 10 testes passando
- [ ] Coverage >= 90%

---

### 3.4 Backend - Validação Final
- [ ] Todos 30 testes passando (`cd server && npm test`)
- [ ] Coverage geral >= 90%
  - Linhas: >= 90%
  - Functions: >= 90%
  - Branches: >= 85%
- [ ] Coverage report gerado em `server/coverage/index.html`
- [ ] Commit: `"feat: add backend unit tests - 30 testes"`

---

## Fase 4: Validação & CI/CD (Dia 11-12)

### 4.1 Coverage Validation
- [ ] Frontend coverage >= 80%
- [ ] Backend coverage >= 90%
- [ ] Total coverage >= 85%
- [ ] Relatório consolidado criado em `planning/Coverage_Report.md`

### 4.2 Test Execution
- [ ] `npm run test:all` executa tudo sem erros
- [ ] Todos 120 testes passando
- [ ] Tempo de execução < 60 segundos

### 4.3 CI/CD Pipeline
- [ ] `.github/workflows/test.yml` criado
- [ ] Testes rodam em PR automaticamente
- [ ] Coverage report enviado para Codecov
- [ ] Merge bloqueado se coverage < 80%

### 4.4 Documentação
- [ ] README de testes atualizado
- [ ] Instruções de setup claras
- [ ] Exemplos de como rodar testes
- [ ] Commands para coverage report

### 4.5 Final Merge
- [ ] Todos arquivos commitados
- [ ] PR reviewer aproveu changes
- [ ] Merge para `main` branch
- [ ] Tag release criada v1.0.0-tests

---

## Métricas Finais

| Métrica | Target | Atual |
|---------|--------|-------|
| Frontend Tests | 90 ✅ | ___ |
| Backend Tests | 30 ✅ | ___ |
| **Total Tests** | **120** | ___ |
| Frontend Coverage | 80%+ | ___ |
| Backend Coverage | 90%+ | ___ |
| **Overall Coverage** | **85%+** | ___ |
| Test Execution Time | < 60s | ___ |

---

## Dicas & Boas Práticas

### ✅ DO's
- Usar fixtures com faker para dados realistas
- Mockar dependências externas (API, DB, localStorage)
- Testar comportamento, não implementação
- Um teste = uma responsabilidade
- Usar `beforeEach` para setup
- Nomes descritivos nos testes

### ❌ DON'Ts
- Não deixar testes dependentes entre si
- Não testar bibliotecas (React, Express)
- Não mockar sem necessidade
- Não ignorar testes com `.skip` ou `.only`
- Não fazer assertions multiplas em um teste
- Não testar detalhes de implementação

### 🎯 Coverage Foco
- **Prioridade 1:** Critical paths (auth, checkout)
- **Prioridade 2:** Business logic (cart, products)
- **Prioridade 3:** UI components
- **Prioridade 4:** Utilities/helpers

---

## Troubleshooting

### Frontend - Erro "Cannot find module"
```bash
npm install --save-dev vitest-mock-extended
# Adicionar ao setup.js
```

### Backend - Erro de conexão DB
```bash
# Usar .env.test com URL mock DB
DATABASE_URL=postgresql://test:test@localhost:5433/testdb
```

### Coverage não increasing
- Verificar if blocks sem testes
- Adicionar testes para error paths
- Mockar corretamente async calls
- Validar afterEach cleanup

---

**Status:** [ ] Não iniciado | [~] Em progresso | [x] Completado

