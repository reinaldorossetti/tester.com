# 🧪 Templates & Snippets Reutilizáveis

## Frontend Setup - `vitest.config.js`

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov', 'text-summary'],
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
      include: ['src/**/*.{js,jsx}'],
      exclude: [
        'src/**/*.test.{js,jsx}',
        'src/**/__tests__',
        'src/main.jsx',
        'src/index.js',
      ],
    },
  },
});
```

---

## Frontend Setup - `src/__tests__/setup.js`

```javascript
import { expect, afterEach, vi } from 'vitest';
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Cleanup após cada teste
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.sessionStorage = sessionStorageMock;

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};

// Suppress console errors em testes
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning: ReactDOM.render') ||
        args[0].includes('Not implemented'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
```

---

## Frontend Setup - `src/__tests__/fixtures.js`

```javascript
import { faker } from '@faker-js/faker';

export const createMockUser = (overrides = {}) => ({
  id: overrides.id || faker.number.int(),
  name: overrides.name || faker.person.fullName(),
  email: overrides.email || faker.internet.email(),
  phone: overrides.phone || faker.phone.number(),
  createdAt: overrides.createdAt || faker.date.past(),
  ...overrides,
});

export const createMockProduct = (overrides = {}) => ({
  id: overrides.id || faker.number.int(),
  name: overrides.name || faker.commerce.productName(),
  description: overrides.description || faker.commerce.productDescription(),
  price: overrides.price || parseFloat(faker.commerce.price()),
  originalPrice: overrides.originalPrice || parseFloat(faker.commerce.price({ min: 100 })),
  category: overrides.category || faker.commerce.department(),
  images: overrides.images || [faker.image.url(), faker.image.url()],
  rating: overrides.rating || faker.number.float({ min: 1, max: 5, precision: 0.1 }),
  reviews: overrides.reviews || faker.number.int({ min: 0, max: 1000 }),
  stock: overrides.stock || faker.number.int({ min: 0, max: 100 }),
  sku: overrides.sku || faker.string.alphaNumeric(10),
  ...overrides,
});

export const createMockCartItem = (overrides = {}) => ({
  id: overrides.id || faker.number.int(),
  productId: overrides.productId || faker.number.int(),
  product: overrides.product || createMockProduct(),
  quantity: overrides.quantity || faker.number.int({ min: 1, max: 10 }),
  price: overrides.price || parseFloat(faker.commerce.price()),
  ...overrides,
});

export const createMockCart = (overrides = {}) => ({
  id: overrides.id || faker.number.int(),
  userId: overrides.userId || faker.number.int(),
  items: overrides.items || [createMockCartItem(), createMockCartItem()],
  subtotal: overrides.subtotal || 100,
  tax: overrides.tax || 10,
  discount: overrides.discount || 0,
  total: overrides.total || 110,
  coupon: overrides.coupon || null,
  ...overrides,
});

export const createMockOrder = (overrides = {}) => ({
  id: overrides.id || `ORD-${faker.string.alphaNumeric(8)}`,
  userId: overrides.userId || faker.number.int(),
  items: overrides.items || [createMockCartItem()],
  status: overrides.status || 'pending',
  total: overrides.total || 150,
  shippingAddress: overrides.shippingAddress || {
    street: faker.location.streetAddress(),
    city: faker.location.city(),
    state: faker.location.state(),
    zip: faker.location.zipCode(),
    country: faker.location.country(),
  },
  createdAt: overrides.createdAt || faker.date.past(),
  ...overrides,
});

export const createMockAuthToken = (overrides = {}) => ({
  token: overrides.token || faker.string.alphaNumeric(100),
  refreshToken: overrides.refreshToken || faker.string.alphaNumeric(100),
  expiresIn: overrides.expiresIn || 3600,
  user: overrides.user || createMockUser(),
});
```

---

## Frontend - Template Teste Componente

```javascript
// __tests__/components/ExampleComponent.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ExampleComponent from '../../components/ExampleComponent';
import * as mockService from '../../services/mockService';

vi.mock('../../services/mockService');
vi.mock('react-router-dom', async () => ({
  ...(await vi.importActual('react-router-dom')),
  useNavigate: () => vi.fn(),
}));

// Wrapper para provider se necessário
const renderComponent = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ExampleComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe('Rendering', () => {
    it('TC_EX_001: Renderiza corretamente', () => {
      renderComponent(<ExampleComponent />);
      expect(screen.getByTestId('example-component')).toBeInTheDocument();
    });

    it('TC_EX_002: Exibe conteúdo esperado', () => {
      renderComponent(<ExampleComponent />);
      expect(screen.getByText(/expected text/i)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('TC_EX_003: Clique botão funciona', async () => {
      const user = userEvent.setup();
      renderComponent(<ExampleComponent />);
      
      const button = screen.getByRole('button', { name: /click me/i });
      await user.click(button);
      
      expect(screen.getByText(/clicked/i)).toBeInTheDocument();
    });

    it('TC_EX_004: Input atualiza estado', async () => {
      const user = userEvent.setup();
      renderComponent(<ExampleComponent />);
      
      const input = screen.getByRole('textbox');
      await user.type(input, 'test value');
      
      expect(input.value).toBe('test value');
    });
  });

  describe('API Integration', () => {
    it('TC_EX_005: Carrega dados da API', async () => {
      mockService.fetchData.mockResolvedValue({ id: 1, name: 'Test' });
      
      renderComponent(<ExampleComponent />);
      
      await waitFor(() => {
        expect(screen.getByText(/Test/i)).toBeInTheDocument();
      });
    });

    it('TC_EX_006: Trata erro da API', async () => {
      mockService.fetchData.mockRejectedValue(new Error('API Error'));
      
      renderComponent(<ExampleComponent />);
      
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument();
      });
    });
  });

  describe('Storage', () => {
    it('TC_EX_007: Salva no localStorage', () => {
      renderComponent(<ExampleComponent />);
      fireEvent.click(screen.getByRole('button', { name: /save/i }));
      
      expect(localStorage.setItem).toHaveBeenCalled();
    });

    it('TC_EX_008: Carrega do localStorage', () => {
      localStorage.getItem.mockReturnValue('stored value');
      renderComponent(<ExampleComponent />);
      
      expect(screen.getByText(/stored value/i)).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('TC_EX_009: Trata prop vazia', () => {
      renderComponent(<ExampleComponent items={[]} />);
      expect(screen.getByText(/no items/i)).toBeInTheDocument();
    });

    it('TC_EX_010: Cleanup ao desmontar', () => {
      const { unmount } = renderComponent(<ExampleComponent />);
      unmount();
      // Verificar se cleanup ocorreu (timers cancelados, etc)
      expect(vi.getTimerCount()).toBe(0);
    });
  });
});
```

---

## Backend Setup - `.mocharc.json`

```json
{
  "require": ["server/__tests__/setup-tests.js"],
  "spec": "server/__tests__/**/*.test.js",
  "timeout": 5000,
  "reporter": "spec",
  "watch": false,
  "recursive": true
}
```

---

## Backend Setup - `server/__tests__/setup-tests.js`

```javascript
const sinon = require('sinon');
const dotenv = require('dotenv');

// Load env vars
dotenv.config({ path: '.env.test' });

// Suppress console logs em testes
if (!process.env.DEBUG) {
  console.log = sinon.stub();
  console.info = sinon.stub();
}

// Global setup
global.testTimeout = 5000;

// Restore após suite
afterEach(function () {
  sinon.restore();
});
```

---

## Backend - Template Teste API

```javascript
// __tests__/api/example.test.js
const chai = require('chai');
const expect = chai.expect;
const sinon = require('sinon');
const chaiHttp = require('chai-http');

const app = require('../../app');
const db = require('../../lib/db');
const { createMockUser, createMockProduct } = require('../fixtures');

chai.use(chaiHttp);

describe('Example API', () => {
  let dbStub;
  let request;

  beforeEach(() => {
    dbStub = sinon.stub(db, 'query');
    request = chai.request(app);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('GET /api/example', () => {
    it('TC_EX_API_001: Retorna lista com sucesso', async () => {
      const mockData = [createMockProduct(), createMockProduct()];
      dbStub.resolves(mockData);

      const res = await request.get('/api/example');

      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body).to.have.lengthOf(2);
      expect(dbStub.calledOnce).to.be.true;
    });

    it('TC_EX_API_002: Aplica filtros corretamente', async () => {
      const mockData = [createMockProduct({ category: 'electronics' })];
      dbStub.resolves(mockData);

      const res = await request
        .get('/api/example')
        .query({ category: 'electronics' });

      expect(res).to.have.status(200);
      expect(res.body[0].category).to.equal('electronics');
    });

    it('TC_EX_API_003: Trata erro database', async () => {
      dbStub.rejects(new Error('Database connection failed'));

      const res = await request.get('/api/example');

      expect(res).to.have.status(500);
      expect(res.body).to.have.property('error');
    });
  });

  describe('POST /api/example', () => {
    it('TC_EX_API_004: Cria recurso com sucesso', async () => {
      const mockUser = createMockUser();
      dbStub.resolves([{ id: 1, ...mockUser }]);

      const res = await request
        .post('/api/example')
        .send(mockUser)
        .set('Authorization', 'Bearer token123');

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('id');
    });

    it('TC_EX_API_005: Validação dados entrada', async () => {
      const res = await request
        .post('/api/example')
        .send({ invalid: 'data' });

      expect(res).to.have.status(400);
      expect(res.body).to.have.property('error');
    });
  });

  describe('PUT /api/example/:id', () => {
    it('TC_EX_API_006: Atualiza recurso', async () => {
      dbStub.resolves([{ id: 1, name: 'Updated' }]);

      const res = await request
        .put('/api/example/1')
        .send({ name: 'Updated' })
        .set('Authorization', 'Bearer token123');

      expect(res).to.have.status(200);
      expect(res.body.name).to.equal('Updated');
    });

    it('TC_EX_API_007: Recurso não encontrado', async () => {
      dbStub.resolves([]);

      const res = await request
        .put('/api/example/999')
        .send({ name: 'Updated' });

      expect(res).to.have.status(404);
    });
  });

  describe('DELETE /api/example/:id', () => {
    it('TC_EX_API_008: Deleta recurso', async () => {
      dbStub.resolves([{ id: 1 }]);

      const res = await request
        .delete('/api/example/1')
        .set('Authorization', 'Bearer token123');

      expect(res).to.have.status(200);
      expect(res.body).to.have.property('message', 'Deleted successfully');
    });

    it('TC_EX_API_009: Trata deleção não autorizada', async () => {
      const res = await request.delete('/api/example/1');

      expect(res).to.have.status(401);
    });

    it('TC_EX_API_010: Erro em cascade delete', async () => {
      dbStub.rejects(new Error('Foreign key constraint'));

      const res = await request
        .delete('/api/example/1')
        .set('Authorization', 'Bearer token123');

      expect(res).to.have.status(409);
    });
  });
});
```

---

## Backend Fixtures - `server/__tests__/fixtures.js`

```javascript
const { faker } = require('@faker-js/faker');
const bcrypt = require('bcrypt');

class Fixtures {
  static async createMockUser(overrides = {}) {
    const hashedPassword = await bcrypt.hash('Password123', 10);
    return {
      id: overrides.id || faker.number.int(),
      name: overrides.name || faker.person.fullName(),
      email: overrides.email || faker.internet.email(),
      password: overrides.password || hashedPassword,
      role: overrides.role || 'user',
      createdAt: overrides.createdAt || new Date(),
      ...overrides,
    };
  }

  static createMockProduct(overrides = {}) {
    return {
      id: overrides.id || faker.number.int(),
      name: overrides.name || faker.commerce.productName(),
      description: overrides.description || faker.commerce.productDescription(),
      price: overrides.price || parseFloat(faker.commerce.price()),
      category: overrides.category || faker.commerce.department(),
      stock: overrides.stock || faker.number.int({ min: 0, max: 1000 }),
      sku: overrides.sku || faker.string.alphaNumeric(10),
      createdAt: overrides.createdAt || new Date(),
      ...overrides,
    };
  }

  static createMockOrder(overrides = {}) {
    return {
      id: overrides.id || faker.number.int(),
      userId: overrides.userId || faker.number.int(),
      orderNumber: overrides.orderNumber || `ORD-${faker.string.alphaNumeric(8)}`,
      status: overrides.status || 'pending',
      total: overrides.total || parseFloat(faker.commerce.price({ min: 100 })),
      paymentMethod: overrides.paymentMethod || 'credit_card',
      shippingAddress: overrides.shippingAddress || {
        street: faker.location.streetAddress(),
        city: faker.location.city(),
        zip: faker.location.zipCode(),
      },
      createdAt: overrides.createdAt || new Date(),
      ...overrides,
    };
  }

  static createMockCoupon(overrides = {}) {
    return {
      id: overrides.id || faker.number.int(),
      code: overrides.code || faker.string.alphaNumeric(8).toUpperCase(),
      discount: overrides.discount || 10,
      discountType: overrides.discountType || 'percentage', // 'percentage' | 'fixed'
      maxUses: overrides.maxUses || 100,
      usedCount: overrides.usedCount || 0,
      expiresAt: overrides.expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      isActive: overrides.isActive !== false,
      ...overrides,
    };
  }
}

module.exports = Fixtures;
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:frontend": "vitest run src/__tests__",
    "test:backend": "cd server && npm run test",
    "test:all": "npm run test:frontend && npm run test:backend",
    "coverage:report": "open coverage/index.html"
  }
}
```

---

## GitHub Actions CI/CD - `.github/workflows/test.yml`

```yaml
name: Unit Tests

on: [push, pull_request]

jobs:
  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: frontend

  backend-tests:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: cd server && npm install
      - run: cd server && npm run test:coverage
      - uses: codecov/codecov-action@v3
        with:
          files: ./server/coverage/coverage-final.json
          flags: backend
```

---

## Executar Testes

```bash
# Frontend
npm run test                    # Executa todos testes
npm run test:watch             # Watch mode
npm run test:coverage          # Com coverage report

# Backend
cd server
npm test                        # Executa todos testes
npm run test:watch             # Watch mode
npm run test:coverage          # Com coverage report

# Tudo junto
npm run test:all               # Frontend + Backend
```

