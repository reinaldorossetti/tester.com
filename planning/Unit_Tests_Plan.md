# 📋 Plano de Testes Unitários com Mocha + Mocks

**Objetivo:** 10 testes por Feature/Component/API com cobertura de código (Coverage)  
**Data:** 2026-03-22  
**Ferramentas:** Mocha, Chai, Sinon (backend), Jest/Vitest (frontend), Istanbul (coverage)

---

## 📊 Resumo Executivo

- **Frontend:** 9 componentes + 3 contexts = 120 testes (10 cada)
- **Backend:** 3 APIs (users, products, cart) = 30 testes (10 cada)
- **Total:** 150 testes unitários
- **Cobertura esperada:** Mínimo 80% (linhas, branches, functions)

---

## 🎯 FRONTEND - Estrutura de Testes

### **Localização:** `src/__tests__/`

#### **Setup Inicial**
```bash
npm install --save-dev mocha vitest @testing-library/react @testing-library/jest-dom
npm install --save-dev jsdom
npm install --save-dev @faker-js/faker
```

#### **Arquivo de Configuração:** `vitest.config.js`
```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80
    }
  }
});
```

---

## 🧩 COMPONENTES FRONTEND (9 componentes × 10 testes)

### 1. **Login.jsx** (10 testes)
```
✅ TC_LOGIN_001: Renderiza form com campos email e password
✅ TC_LOGIN_002: Validação de email inválido (mock validation)
✅ TC_LOGIN_003: Validação de password vazio
✅ TC_LOGIN_004: Submit do formulário com dados válidos
✅ TC_LOGIN_005: Exibe erro ao retorno falho da API (mock API)
✅ TC_LOGIN_006: Desabilita botão durante requisição (mock loading)
✅ TC_LOGIN_007: Limpa mensagem de erro ao digitação
✅ TC_LOGIN_008: Redireciona ao sucesso (mock React Router)
✅ TC_LOGIN_009: Persiste token no localStorage (mock localStorage)
✅ TC_LOGIN_010: Reset do form após navegação
```

**Mocks necessários:**
- `useAuth()` context
- Validação de email
- API `/api/users/login`
- localStorage
- navigate()

---

### 2. **Register.jsx** (10 testes)
```
✅ TC_REG_001: Renderiza form com campos nome, email, password, confirmação
✅ TC_REG_002: Validação de email duplicado (mock API)
✅ TC_REG_003: Validação senha fraca
✅ TC_REG_004: Validação confirmação password mismatch
✅ TC_REG_005: Submit com dados válidos
✅ TC_REG_006: Criptografia de password antes envio (mock bcrypt)
✅ TC_REG_007: Exibe mensagem sucesso
✅ TC_REG_008: Redireciona após sucesso
✅ TC_REG_009: Limpa erros entre submissões
✅ TC_REG_010: Desabilita submit se campos inválidos
```

**Mocks necessários:**
- Validação de dados
- API `/api/users/register`
- bcrypt
- useAuth context

---

### 3. **Catalog.jsx** (10 testes)
```
✅ TC_CAT_001: Lista todos produtos (mock API)
✅ TC_CAT_002: Aplica filtro por categoria
✅ TC_CAT_003: Ordena por preço ASC/DESC
✅ TC_CAT_004: Paginação funciona (ex: 24 itens, 12 por página)
✅ TC_CAT_005: Busca por termo (debounce mock)
✅ TC_CAT_006: Exibe loader enquanto carrega
✅ TC_CAT_007: Exibe vazio quando sem produtos
✅ TC_CAT_008: Clique produto redireciona para detalhe
✅ TC_CAT_009: Add to cart dispara ação (mock dispatch)
✅ TC_CAT_010: Erro na API mostra fallback
```

**Mocks necessários:**
- API `/api/products`
- Redux/Context dispatch
- Router navigate
- useEffect cleanup

---

### 4. **ProductDetails.jsx** (10 testes)
```
✅ TC_PD_001: Carrega dados produto por ID (mock useParams)
✅ TC_PD_002: Exibe imagem principal e thumbnails
✅ TC_PD_003: Seletor de quantidade (min/max)
✅ TC_PD_004: Seletor de tamanho/cor (se houver)
✅ TC_PD_005: Botão add to cart com quantidade correta
✅ TC_PD_006: Calcula preço com desconto corretamente
✅ TC_PD_007: Reviews/ratings renderizam
✅ TC_PD_008: Modal zoom imagem funciona
✅ TC_PD_009: Produto não encontrado mostra erro
✅ TC_PD_010: Scroll para topo ao montar componente
```

**Mocks necessários:**
- useParams (React Router)
- API `/api/products/{id}`
- Cálculo de desconto
- useEffect

---

### 5. **Cart.jsx** (10 testes)
```
✅ TC_CART_001: Renderiza itens do carrinho (mock useCart context)
✅ TC_CART_002: Atualiza quantidade item (increment/decrement)
✅ TC_CART_003: Remove item do carrinho
✅ TC_CART_004: Limpa carrinho (clear cart)
✅ TC_CART_005: Calcula subtotal corretamente
✅ TC_CART_006: Aplica cupom desconto (mock validation)
✅ TC_CART_007: Mostra aviso estoque insuficiente
✅ TC_CART_008: Botão checkout desabilitado se vazio
✅ TC_CART_009: Persiste carrinho em localStorage
✅ TC_CART_010: Carrinho vazio mostra mensagem apropriada
```

**Mocks necessários:**
- useCart context
- localStorage
- Cálculo de totais
- Cupom validation

---

### 6. **CartItem.jsx** (10 testes)
```
✅ TC_CI_001: Renderiza info produto (imagem, nome, preço)
✅ TC_CI_002: Input quantidade com validação
✅ TC_CI_003: Botão remover item
✅ TC_CI_004: Calcula preço linha corretamente
✅ TC_CI_005: Valida quantity min (ex: 1)
✅ TC_CI_006: Valida quantity max (ex: 10 ou stock)
✅ TC_CI_007: Dispara callback onChange
✅ TC_CI_008: Dispara callback onRemove
✅ TC_CI_009: Mostra badge "em falta" se sem stock
✅ TC_CI_010: Respeita desconto/promocão do item
```

**Mocks necessários:**
- Props item
- Callbacks (onChange, onRemove)
- Validação de quantidade

---

### 7. **Checkout.jsx / CheckoutButton.jsx** (10 testes)
```
✅ TC_CHK_001: Renderiza formulário endereço/pagamento
✅ TC_CHK_002: Validação endereço completo
✅ TC_CHK_003: Validação cartão crédito (Luhn algorithm)
✅ TC_CHK_004: Validação data validade formato MM/YY
✅ TC_CHK_005: Validação CVV (3-4 dígitos)
✅ TC_CHK_006: Máscara automática em campos
✅ TC_CHK_007: Submit desabilitado dados inválidos (mock form state)
✅ TC_CHK_008: Chamada API processamento pagamento (mock)
✅ TC_CHK_009: Exibe loader durante processamento
✅ TC_CHK_010: Redireciona para sucesso com order ID
```

**Mocks necessários:**
- Form validation
- API `/api/orders`
- Payment gateway mock
- Máscaras de entrada

---

### 8. **ThankYouPage.jsx** (10 testes)
```
✅ TC_TY_001: Renderiza mensagem sucesso
✅ TC_TY_002: Exibe order ID/número do pedido
✅ TC_TY_003: Exibe resumo pedido (itens, total)
✅ TC_TY_004: Exibe email confirmação
✅ TC_TY_005: Botão voltar ao catálogo funciona
✅ TC_TY_006: Download invoice PDF (mock window.print)
✅ TC_TY_007: Link track ordem leva ao histórico
✅ TC_TY_008: Compartilhar pedido (mock social share)
✅ TC_TY_009: Dados persistem mesmo com reload (mock sessionStorage)
✅ TC_TY_010: Tempo para cleanup (redireciona após inatividade)
```

**Mocks necessários:**
- useLocation/useSearchParams
- PDF generation
- Social share APIs
- sessionStorage

---

### 9. **Product.jsx** (Card Component) (10 testes)
```
✅ TC_PROD_001: Renderiza imagem produto
✅ TC_PROD_002: Renderiza nome e preço
✅ TC_PROD_003: Renderiza rating/estrelas
✅ TC_PROD_004: Exibe badge "sale" se desconto
✅ TC_PROD_005: Hover mostra botões ações
✅ TC_PROD_006: Click abre detalhe (mock navigate)
✅ TC_PROD_007: Add to cart via ícone (mock dispatch)
✅ TC_PROD_008: Wishlist toggle salva (mock localStorage)
✅ TC_PROD_009: Skeleton loader durante carregamento
✅ TC_PROD_010: Imagem fallback se quebrada
```

**Mocks necessários:**
- Props product
- navigate
- dispatch
- localStorage
- Image loading

---

## 🔄 CONTEXTS FRONTEND (3 contexts × 10 testes)

### 10. **AuthContext.jsx** (10 testes)
```
✅ TC_AUTH_001: Inicializa estado autenticado false
✅ TC_AUTH_002: Login atualiza user e token
✅ TC_AUTH_003: Logout limpa dados
✅ TC_AUTH_004: Refresh token válido
✅ TC_AUTH_005: Refresh token inválido faz logout
✅ TC_AUTH_006: Persiste token em localStorage
✅ TC_AUTH_007: Restaura sessão ao montar
✅ TC_AUTH_008: isAuthenticated retorna boolean correto
✅ TC_AUTH_009: userRole retornado corretamente
✅ TC_AUTH_010: Error login atualiza error state
```

**Mocks necessários:**
- localStorage
- API de auth
- Token JWT

---

### 11. **DatabaseContext.jsx** (10 testes)
```
✅ TC_DB_001: Inicializa database (RxDB)
✅ TC_DB_002: Cria collection produto
✅ TC_DB_003: Insere documento
✅ TC_DB_004: Lê documento por ID
✅ TC_DB_005: Atualiza documento
✅ TC_DB_006: Deleta documento
✅ TC_DB_007: Query com filtros
✅ TC_DB_008: Sync com server
✅ TC_DB_009: Erro inicialização DB
✅ TC_DB_010: Cleanup ao destruir context
```

**Mocks necessários:**
- RxDB
- IndexedDB
- SQLite (wa-sqlite)

---

### 12. **LanguageContext.jsx** (10 testes)
```
✅ TC_LANG_001: Inicializa language padrão (PT/EN)
✅ TC_LANG_002: Troca language
✅ TC_LANG_003: Tradução carrega strings
✅ TC_LANG_004: currentLanguage retorna correto
✅ TC_LANG_005: t() função traduz termos
✅ TC_LANG_006: Fallback EN se chave não existe
✅ TC_LANG_007: Persiste language em localStorage
✅ TC_LANG_008: Restaura language ao iniciar
✅ TC_LANG_009: Date format por language
✅ TC_LANG_010: Number format por language
```

**Mocks necessários:**
- localStorage
- i18n strings
- Formatadores locale

---

## 🔗 BACKEND - Estrutura de Testes

### **Localização:** `server/__tests__/`

#### **Setup Inicial**
```bash
cd server
npm install --save-dev mocha chai sinon chai-http
npm install --save-dev nyc (coverage)
npm install --save-dev @faker-js/faker
```

#### **Arquivo de Configuração:** `.mocharc.json`
```json
{
  "require": ["setup-tests.js"],
  "spec": "__tests__/**/*.test.js",
  "timeout": 5000,
  "reporter": "spec",
  "watch": false
}
```

#### **Script testes no package.json**
```json
"test": "mocha",
"test:watch": "mocha --watch",
"test:coverage": "nyc mocha"
```

#### **Arquivo .nycrc** (Coverage Config)
```json
{
  "all": true,
  "include": ["app/**/*.js"],
  "exclude": ["app/api/**/*.test.js", "node_modules/**"],
  "reporter": ["text", "html", "lcov", "json"],
  "lines": 80,
  "functions": 80,
  "branches": 80,
  "statements": 80
}
```

---

## 🔐 API USERS (10 testes)

### **Arquivo:** `server/__tests__/api/users.test.js`

```
✅ TC_USERS_001: POST /api/users/register - sucesso
   - Mock database insert
   - Validar bcrypt hash password
   - Retorna user (sem password)

✅ TC_USERS_002: POST /api/users/register - email duplicado
   - Mock duplicate email error
   - Validar status 409

✅ TC_USERS_003: POST /api/users/register - validação campos obrigatórios
   - Mock validation error
   - Validar status 400

✅ TC_USERS_004: POST /api/users/login - sucesso
   - Mock database find
   - Mock bcrypt compare
   - Validar JWT gerado
   - Retorna token

✅ TC_USERS_005: POST /api/users/login - senha incorreta
   - Mock bcrypt compare falha
   - Validar status 401

✅ TC_USERS_006: POST /api/users/login - usuário não encontrado
   - Mock database find retorna null
   - Validar status 404

✅ TC_USERS_007: GET /api/users/:id - usuário autenticado
   - Mock JWT verification
   - Mock database find
   - Validar dados retornados

✅ TC_USERS_008: PUT /api/users/:id - atualização perfil
   - Mock autenticação
   - Mock database update
   - Validar campos atualizados

✅ TC_USERS_009: DELETE /api/users/:id - deleção conta
   - Mock autenticação
   - Mock database delete
   - Validar também deleta pedidos associados

✅ TC_USERS_010: GET /api/users/:id/orders - histórico pedidos
   - Mock autenticação
   - Mock database query orders
   - Validar paginação
```

**Mocks necessários:**
- Banco dados (PostgreSQL)
- bcrypt
- JWT
- Queries SQL

---

## 🛒 API PRODUCTS (10 testes)

### **Arquivo:** `server/__tests__/api/products.test.js`

```
✅ TC_PROD_API_001: GET /api/products - lista todos
   - Mock database query
   - Validar status 200
   - Validar array de produtos
   - Validar paginação default (limit, offset)

✅ TC_PROD_API_002: GET /api/products?category=electronics - filtro categoria
   - Mock database query com WHERE
   - Validar apenas produtos categoria selecionada

✅ TC_PROD_API_003: GET /api/products?sort=price&order=asc - ordenação
   - Mock database query ORDER BY
   - Validar produtos ordenados corretamente

✅ TC_PROD_API_004: GET /api/products?search=laptop - busca termo
   - Mock database LIKE query
   - Validar resultados contêm termo

✅ TC_PROD_API_005: GET /api/products/:id - detalhe produto
   - Mock database find by id
   - Validar todos campos retornados
   - Mock incluir relacionados (related products)

✅ TC_PROD_API_006: POST /api/products - criar (admin)
   - Mock autenticação admin
   - Mock database insert
   - Validar validação campos
   - Mock upload imagem

✅ TC_PROD_API_007: PUT /api/products/:id - atualizar (admin)
   - Mock autenticação admin
   - Mock database update
   - Validar apenas admin consegue

✅ TC_PROD_API_008: DELETE /api/products/:id - deletar (admin)
   - Mock autenticação admin
   - Mock database delete
   - Mock também deleta dos carrinhos

✅ TC_PROD_API_009: GET /api/products/:id/reviews - reviews produto
   - Mock database query reviews
   - Validar media rating
   - Validar paginação reviews

✅ TC_PROD_API_010: GET /api/products/stock/:id - verificar estoque
   - Mock database select stock
   - Validar retorna integer
   - Validar status "in stock" vs "out"
```

**Mocks necessários:**
- Banco dados PostgreSQL
- Autenticação admin
- Upload archivos
- Queries SQL complexas (JOIN reviews)

---

## 🛒 API CART (10 testes)

### **Arquivo:** `server/__tests__/api/cart.test.js`

```
✅ TC_CART_API_001: GET /api/cart - pega carrinho usuário
   - Mock autenticação
   - Mock database find cart por user_id
   - Validar total calculado

✅ TC_CART_API_002: POST /api/cart/items - adicionar item
   - Mock autenticação
   - Mock database insert cart_item
   - Mock validação estoque
   - Validar quantity positiva

✅ TC_CART_API_003: PUT /api/cart/items/:itemId - atualizar quantidade
   - Mock autenticação
   - Mock database update quantity
   - Validar validação estoque
   - Validar min=1, max=stock

✅ TC_CART_API_004: DELETE /api/cart/items/:itemId - remover item
   - Mock autenticação
   - Mock database delete
   - Validar item realmente removido

✅ TC_CART_API_005: DELETE /api/cart - limpar carrinho
   - Mock autenticação
   - Mock database delete todos items
   - Validar cart vazio

✅ TC_CART_API_006: POST /api/cart/coupon - aplicar cupom
   - Mock autenticação
   - Mock database find cupom
   - Mock validação data expiração
   - Calcular desconto
   - Validar não aplica 2x cupom

✅ TC_CART_API_007: DELETE /api/cart/coupon - remover cupom
   - Mock autenticação
   - Mock database update remove coupon
   - Recalcula total

✅ TC_CART_API_008: POST /api/cart/checkout - processar checkout
   - Mock autenticação
   - Mock validação cart não vazio
   - Mock criação order
   - Mock payment gateway (stripe/mock)
   - Mock limpar carrinho
   - Mock enviar email confirmação

✅ TC_CART_API_009: GET /api/cart/summary - resumo carrinho
   - Mock database query itens + totals
   - Validar subtotal, impostos, desconto, total
   - Validar currency format

✅ TC_CART_API_010: POST /api/cart/validate - validar carrinho
   - Mock validar todos itens existem
   - Mock validar estoque suficiente
   - Mock validar preços não mudaram
   - Retorna cart válido ou lista problemas
```

**Mocks necessários:**
- Banco dados PostgreSQL
- Autenticação
- Validação estoque (tabela products)
- Cupom validation
- Payment gateway
- Email service

---

## 📈 Estrutura de Pastas Recomendada

```
frontend:
src/__tests__/
├── components/
│   ├── Login.test.jsx
│   ├── Register.test.jsx
│   ├── Catalog.test.jsx
│   ├── ProductDetails.test.jsx
│   ├── Cart.test.jsx
│   ├── CartItem.test.jsx
│   ├── Checkout.test.jsx
│   ├── ThankYouPage.test.jsx
│   └── Product.test.jsx
├── contexts/
│   ├── AuthContext.test.jsx
│   ├── DatabaseContext.test.jsx
│   └── LanguageContext.test.jsx
└── setup.js (configuração global vitest)

backend:
server/__tests__/
├── api/
│   ├── users.test.js
│   ├── products.test.js
│   └── cart.test.js
├── setup-tests.js (configuração mocha + db mock)
└── fixtures.js (dados mock com faker)
```

---

## 🧪 Exemplo Implementação - Login Component

### **Frontend Test:** `src/__tests__/components/Login.test.jsx`

```javascript
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Login from '../../components/Login';
import * as authService from '../../services/authService';
import { BrowserRouter } from 'react-router-dom';

vi.mock('../../services/authService');
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => vi.fn(),
}));

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('TC_LOGIN_001: Renderiza form com campos email e password', () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('TC_LOGIN_002: Validação de email inválido', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'invalid-email');
    expect(screen.getByText(/invalid email/i)).toBeInTheDocument();
  });

  it('TC_LOGIN_003: Validação de password vazio', async () => {
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    const button = screen.getByRole('button', { name: /login/i });
    fireEvent.click(button);
    expect(screen.getByText(/required/i)).toBeInTheDocument();
  });

  it('TC_LOGIN_004: Submit do formulário com dados válidos', async () => {
    authService.login.mockResolvedValue({ token: 'mock-token', user: { id: 1 } });
    
    render(
      <BrowserRouter>
        <Login />
      </BrowserRouter>
    );
    
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    
    await waitFor(() => {
      expect(authService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  // ... mais 6 testes
});
```

---

### **Backend Test:** `server/__tests__/api/users.test.js`

```javascript
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const chaiHttp = require('chai-http');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const app = require('../../app');
const db = require('../../lib/db');

chai.use(chaiHttp);

describe('Users API', () => {
  let dbStub;

  beforeEach(() => {
    dbStub = sinon.stub(db, 'query');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('TC_USERS_001: POST /api/users/register - sucesso', async () => {
    dbStub.withArgs(sinon.match(/SELECT.*email/)).resolves([]);
    dbStub.withArgs(sinon.match(/INSERT INTO users/)).resolves([{ id: 1, email: 'test@example.com' }]);

    const res = await chai.request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'Password123',
        name: 'Test User'
      });

    expect(res).to.have.status(201);
    expect(res.body).to.have.property('id');
    expect(res.body).to.not.have.property('password');
  });

  it('TC_USERS_002: POST /api/users/register - email duplicado', async () => {
    dbStub.resolves([{ id: 1, email: 'test@example.com' }]);

    const res = await chai.request(app)
      .post('/api/users/register')
      .send({
        email: 'test@example.com',
        password: 'Password123'
      });

    expect(res).to.have.status(409);
    expect(res.body).to.have.property('error', 'Email already exists');
  });

  // ... mais 8 testes
});
```

---

## 🚀 Roadmap Implementação

### **Fase 1: Setup (2 dias)**
- [ ] Instalar dependencies (Vitest, Mocha, mocks)
- [ ] Configurar coverage baselines
- [ ] Criar arquivos de setup e fixtures

### **Fase 2: Frontend Tests (5 dias)**
- [ ] Semana 1: Components (Login, Register, Catalog)
- [ ] Semana 2: Components (Cart, Checkout, Product)
- [ ] Semana 3: Contexts

### **Fase 3: Backend Tests (3 dias)**
- [ ] API Users (2 dias)
- [ ] API Products (1.5 dias)
- [ ] API Cart (1.5 dias)

### **Fase 4: Validação & CI/CD (2 dias)**
- [ ] Atingir 80%+ coverage
- [ ] Integrar no CI/CD (GitHub Actions)
- [ ] Documentar resultados

**Total Estimado:** 12 dias (3 semanas)

---

## 📊 Metricas Coverage Esperadas

| Camada | Linhas | Branches | Functions | Statements |
|--------|--------|----------|-----------|------------|
| Frontend | 85%+ | 80%+ | 85%+ | 85%+ |
| Backend | 90%+ | 85%+ | 90%+ | 90%+ |
| **Total** | **87%+** | **82%+** | **87%+** | **87%+** |

---

## 🔗 Referências & Recursos

- Mocha: https://mochajs.org/
- Vitest: https://vitest.dev/
- Chai: https://www.chaijs.com/
- Sinon: https://sinonjs.org/
- @testing-library/react: https://testing-library.com/react
- Istanbul Coverage: https://istanbul.js.org/

---

**Próximos Passos:**
1. Revisar plano com time
2. Setup inicial ambiente testes
3. Começar pelos componentes críticos (Auth, Checkout)
4. Iterar e refinar baseado em resultados coverage
