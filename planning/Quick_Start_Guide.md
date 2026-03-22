# 🚀 Guia de Execução Rápida - 120 Testes Frontend

## ⚡ Quick Start

### Opção 1: Terminal CMD (Recomendado - Sem Restrições PowerShell)

1. **Abra CMD.exe** (não PowerShell)
2. Execute os comandos:

```batch
cd d:\github-projects\tester.com
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8 @faker-js/faker
npm run test
```

### Opção 2: Usando script batch incluído

```batch
d:\github-projects\tester.com\run-tests.bat
```

---

## 📋 Passos Detalhados

### 1. Verificar Node.js e NPM
```bash
node --version    # Deve ser >= v16
npm --version     # Deve ser >= v7
```

### 2. Navegar ao Projeto
```bash
cd d:\github-projects\tester.com
```

### 3. Instalar Dependências
```bash
npm install --save-dev vitest@latest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8 @faker-js/faker
```

### 4. Verificar Instalação
```bash
npm list vitest
npm list @testing-library/react
```

### 5. Rodar Testes
```bash
# Rodar uma vez
npm run test

# Modo watch (atualiza ao salvar)
npm run test:watch

# Com coverage
npm run test:coverage

# UI Interativa
npm run test:ui
```

---

## 📊 Resultados Esperados

### Sucesso
```
✓ src/__tests__/components/Login.test.jsx (10)
✓ src/__tests__/components/Register.test.jsx (10)
✓ src/__tests__/components/Catalog.test.jsx (10)
✓ src/__tests__/components/ProductDetails.test.jsx (10)
✓ src/__tests__/components/Cart.test.jsx (10)
✓ src/__tests__/components/CartItem.test.jsx (10)
✓ src/__tests__/components/Checkout.test.jsx (10)
✓ src/__tests__/components/ThankYouPage.test.jsx (10)
✓ src/__tests__/components/Product.test.jsx (10)
✓ src/__tests__/contexts/AuthContext.test.jsx (15)
✓ src/__tests__/contexts/DatabaseContext.test.jsx (15)
✓ src/__tests__/contexts/LanguageContext.test.jsx (15)

Test Files  12 passed (12)
     Tests  120 passed (120)
  Duration  XX.XXms
```

---

## 🔍 Visualizar Coverage

```bash
npm run test:coverage
```

Abrirá em: `coverage/index.html`

**Coverage esperado:**
- Lines: 80%+
- Functions: 80%+
- Branches: 80%+
- Statements: 80%+

---

## 🛠️ Troubleshooting

### ❌ Erro: "vitest not found"
**Solução:**
```bash
npm install --global vitest
npm install --save-dev vitest @vitest/runner
```

### ❌ Erro: "jsdom not found"
**Solução:**
```bash
npm install --save-dev jsdom
```

### ❌ Erro: "@testing-library/react not found"
**Solução:**
```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### ❌ Erro: "PowerShell execution policy"
**Solução (Usar CMD em vez de PowerShell):**
```bash
# Abra CMD.exe, não PowerShell
cmd.exe
# Aí execute os comandos npm
```

### ❌ Testes não executam
**Verificar:**
```bash
# 1. Verificar se vitest.config.js existe
dir vitest.config.js

# 2. Verificar se setup.js existe
dir src\__tests__\setup.js

# 3. Verificar se fixtures.js existe
dir src\__tests__\fixtures.js

# 4. Limpar cache
rm -r node_modules
npm install
npm run test
```

---

## 📁 Arquivos Principais

```
✅ vitest.config.js               - Configuração framework
✅ src/__tests__/setup.js          - Setup global
✅ src/__tests__/fixtures.js       - Dados mock com faker
✅ src/__tests__/components/       - 90 testes componentes
✅ src/__tests__/contexts/         - 30 testes contexts
✅ package.json                    - Scripts de teste
```

---

## 💡 Dicas Úteis

### Rodar apenas um arquivo
```bash
npm run test -- src/__tests__/components/Login.test.jsx
```

### Rodar apenas componentes (sem contexts)
```bash
npm run test -- src/__tests__/components
```

### Rodar apenas contexts
```bash
npm run test -- src/__tests__/contexts
```

### Watch mode + UI
```bash
npm run test:ui
```

---

## 📈 Monitorar Progresso

### 1. Primeiro Teste
```bash
npm run test -- src/__tests__/components/Login.test.jsx
```

### 2. Todos Componentes
```bash
npm run test -- src/__tests__/components
```

### 3. Todos Contexts
```bash
npm run test -- src/__tests__/contexts
```

### 4. Coverage Final
```bash
npm run test:coverage
```

---

## ✅ Confirmação Final

Após `npm run test`, você deve ver:

```
 PASS  src/__tests__/components/Login.test.jsx
 PASS  src/__tests__/components/Register.test.jsx
 PASS  src/__tests__/components/Catalog.test.jsx
 PASS  src/__tests__/components/ProductDetails.test.jsx
 PASS  src/__tests__/components/Cart.test.jsx
 PASS  src/__tests__/components/CartItem.test.jsx
 PASS  src/__tests__/components/Checkout.test.jsx
 PASS  src/__tests__/components/ThankYouPage.test.jsx
 PASS  src/__tests__/components/Product.test.jsx
 PASS  src/__tests__/contexts/AuthContext.test.jsx
 PASS  src/__tests__/contexts/DatabaseContext.test.jsx
 PASS  src/__tests__/contexts/LanguageContext.test.jsx

Test Files  12 passed (12)
     Tests  120 passed (120) ✨
  Start at: XX:XX:XX
  Duration: XX.XXs
```

---

## 🎯 Próximas Ações

1. ✅ Instalar dependências
2. ✅ Executar testes
3. ✅ Visualizar coverage
4. ✅ Commit & push
5. ⏳ Backend tests (30 testes)

---

**Pronto? Execute agora:**
```bash
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom @vitest/coverage-v8 @faker-js/faker && npm run test
```

🚀 **Let's test!**
