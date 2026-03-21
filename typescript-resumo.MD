# TypeScript: Guia Completo

## O que é TypeScript?

TypeScript é uma linguagem de programação de código aberto desenvolvida pela Microsoft em 2012, criada por Anders Hejlsberg — o mesmo criador do C#. Ela é definida como um **superset tipado do JavaScript**, o que significa que todo código JavaScript válido também é TypeScript válido, mas TypeScript adiciona recursos poderosos que o JavaScript puro não possui nativamente.

A principal proposta do TypeScript é trazer **tipagem estática opcional** ao ecossistema JavaScript, permitindo que desenvolvedores detectem erros em tempo de desenvolvimento (no editor de código) antes mesmo de executar a aplicação. O código TypeScript é **transpilado** para JavaScript puro, podendo rodar em qualquer ambiente que suporte JS — browsers, Node.js, Deno, Bun, etc.

---

## Conceitos Fundamentais

### Tipagem Estática

```typescript
// JavaScript — sem tipo, erro só aparece em runtime
function calcularDesconto(preco, desconto) {
  return preco - desconto;
}

// TypeScript — erro detectado antes de rodar
function calcularDesconto(preco: number, desconto: number): number {
  return preco - desconto;
}

calcularDesconto("100", 10); // ❌ Erro em tempo de desenvolvimento!
```

### Tipos Básicos

```typescript
let nome: string = "Reinaldo";
let idade: number = 30;
let ativo: boolean = true;
let tags: string[] = ["typescript", "ecommerce", "backend"];
let qualquer: any = "pode ser qualquer coisa"; // evite ao máximo

// Union Types — pode ser mais de um tipo
let id: string | number = "abc123";
id = 456; // também válido

// Literal Types
type Status = "pendente" | "aprovado" | "cancelado";
let pedidoStatus: Status = "aprovado";
pedidoStatus = "expirado"; // ❌ Erro! Não está na lista
```

### Interfaces e Types

```typescript
// Interface — ideal para objetos e contratos
interface Endereco {
  rua: string;
  numero: number;
  complemento?: string; // opcional
  cidade: string;
  estado: string;
  cep: string;
}

// Type Alias — mais flexível, suporta unions e intersections
type MetodoPagamento = "cartao_credito" | "pix" | "boleto" | "cartao_debito";

type ProdutoBase = {
  id: string;
  nome: string;
  preco: number;
};

type ProdutoComEstoque = ProdutoBase & {
  estoque: number; // Intersection Type
};
```

---

## Tipagem, Declaração de Variáveis e Conversão de Tipos

### `var`, `let` e `const` — As Diferenças Fundamentais

Antes de falar de TypeScript especificamente, é importante entender como essas três formas de declarar variáveis se comportam, porque TypeScript herda esse comportamento do JavaScript e adiciona tipagem em cima.

#### `var` — O Legado Problemático

`var` é a forma antiga de declarar variáveis no JavaScript. Ela tem dois comportamentos perigosos que causaram (e ainda causam) muitos bugs históricos: **escopo de função** (em vez de bloco) e **hoisting**.

```typescript
function exemploVar() {
  if (true) {
    var mensagem = "Olá";
  }
  console.log(mensagem); // "Olá" — var vaza do bloco if!
}

// Hoisting: var é "içada" para o topo do escopo
console.log(nome); // undefined — não dá erro, mas não tem valor ainda
var nome = "Reinaldo";
console.log(nome); // "Reinaldo"
```

No contexto de um e-commerce, esse comportamento pode gerar bugs sutis e difíceis de rastrear, especialmente dentro de loops:

```typescript
// Bug clássico com var em loop
for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Imprime: 3, 3, 3 — porque i é compartilhada por todas as iterações

// Com let, funciona corretamente
for (let i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 100);
}
// Imprime: 0, 1, 2 — cada iteração tem seu próprio i
```

Em TypeScript moderno, `var` é praticamente banida pelo uso de boas práticas. O linter padrão (`@typescript-eslint`) inclusive tem uma regra `no-var` para isso.

#### `let` — Mutável com Escopo de Bloco

`let` foi introduzida no ES6 e resolve os problemas do `var`. Ela tem escopo de bloco `{}` e não sofre de hoisting da mesma forma.

```typescript
let quantidade: number = 1;
quantidade = 5; // permitido, let é mutável

if (true) {
  let desconto: number = 10;
  console.log(desconto); // 10 — funciona aqui
}
// console.log(desconto); // ❌ Erro! desconto não existe fora do bloco
```

Use `let` quando o valor da variável precisa mudar ao longo da execução, como contadores, acumuladores ou estados que são reatribuídos.

```typescript
let totalCarrinho: number = 0;

for (const item of itensCarrinho) {
  totalCarrinho += item.subtotal; // totalCarrinho muda a cada iteração
}
```

#### `const` — Imutável por Padrão

`const` também tem escopo de bloco, mas não permite **reatribuição** da variável. É a opção preferida na grande maioria dos casos.

```typescript
const taxaFrete: number = 15.90;
taxaFrete = 20; // ❌ Erro! Não pode reatribuir uma const

const nomeLoja: string = "Minha Loja";
```

Um ponto importante e frequentemente mal entendido: `const` não significa que o valor é imutável, apenas que a **referência** não pode ser reatribuída. Objetos e arrays declarados com `const` ainda podem ter seus conteúdos modificados:

```typescript
const carrinho = {
  itens: [],
  total: 0,
};

carrinho.total = 150;            // ✅ permitido
carrinho.itens.push("camiseta"); // ✅ também permitido
carrinho = {};                   // ❌ Erro! Isso seria reatribuição
```

Para tornar um objeto realmente imutável, use `as const`:

```typescript
const configPagamento = {
  tentativasMaximas: 3,
  timeoutMs: 5000,
  ambiente: "producao",
} as const;

configPagamento.tentativasMaximas = 5; // ❌ Erro! Objeto é readonly
```

#### Tabela Comparativa

| Característica    | `var`              | `let`               | `const`             |
|-------------------|--------------------|---------------------|---------------------|
| Escopo            | Função             | Bloco               | Bloco               |
| Hoisting          | Sim (como undefined) | Sim (inacessível) | Sim (inacessível)   |
| Reatribuição      | Sim                | Sim                 | Não                 |
| Redeclaração      | Sim                | Não                 | Não                 |
| Uso recomendado   | Nunca              | Quando muda         | Sempre que possível |

---

### Tipagem em Variáveis

#### Inferência de Tipos

O TypeScript infere o tipo automaticamente na maioria das situações. Você não precisa sempre escrever o tipo explicitamente:

```typescript
const preco = 99.90;       // TypeScript infere: number
const nome = "Reinaldo";   // TypeScript infere: string
const ativo = true;        // TypeScript infere: boolean
const tags = ["ts", "js"]; // TypeScript infere: string[]

preco = "cem reais"; // ❌ Erro! Mesmo sem declarar, TS sabe que é number
```

#### Anotação Explícita

Quando a inferência não é suficiente ou você quer ser explícito por clareza:

```typescript
let statusPedido: string;
let precoPromocional: number | null = null;
let callback: (() => void) | null = null;
```

---

### Tipos Primitivos em Detalhe

```typescript
// string
const sku: string = "CAM-001";
const descricao: string = `Produto ${sku} disponível`;

// number — TypeScript não diferencia int de float
const preco: number = 49.90;
const estoque: number = 100;
const infinito: number = Infinity;
const naoNumero: number = NaN;

// boolean
const emPromocao: boolean = true;

// null e undefined — tipos distintos
let valorNulo: null = null;
let valorIndefinido: undefined = undefined;

// symbol
const idUnico: symbol = Symbol("produto-id");

// bigint
const estoqueGigante: bigint = 9007199254740991n;
```

---

### `unknown` vs `any` vs `never`

#### `any` — Fuja dele

`any` desliga completamente a verificação de tipos. Use apenas como último recurso:

```typescript
let dado: any = "texto";
dado = 123;
dado = true;
dado.metodoFicticio(); // sem erro no TS, mas quebra em runtime!
```

#### `unknown` — O `any` Seguro

`unknown` aceita qualquer valor, mas força você a verificar o tipo antes de usar:

```typescript
function processarResposta(dados: unknown): string {
  if (typeof dados === "string") {
    return dados.toUpperCase();
  }
  if (typeof dados === "number") {
    return dados.toFixed(2);
  }
  return "formato desconhecido";
}
```

#### `never` — O Tipo do Impossível

Representa valores que nunca ocorrem, útil para exaustividade e funções que sempre lançam exceção:

```typescript
function lancarErro(mensagem: string): never {
  throw new Error(mensagem);
}

type MetodoPagamento = "pix" | "cartao" | "boleto";

function processarPagamento(metodo: MetodoPagamento): string {
  switch (metodo) {
    case "pix":    return "Gerar QR Code";
    case "cartao": return "Processar cartão";
    case "boleto": return "Gerar boleto";
    default:
      const _exaustivo: never = metodo; // ❌ Erro se um caso não foi coberto
      return _exaustivo;
  }
}
```

---

### Conversão de Tipos

#### Conversão Explícita de Primitivos

```typescript
// string → number
const precoTexto: string = "49.90";
const precoNumero: number = Number(precoTexto);    // 49.9
const precoInt: number = parseInt(precoTexto, 10); // 49
const precoFloat: number = parseFloat(precoTexto); // 49.9

const invalido = Number("abc"); // NaN — não lança erro, mas é perigoso
if (isNaN(invalido)) {
  console.log("Conversão falhou");
}

// number → string
const estoqueTexto: string = String(100);      // "100"
const estoqueTexto2: string = (100).toString(); // "100"
const estoqueTexto3: string = `${100}`;         // "100"

// string → boolean
const ativoTexto: string = "true";
const ativo: boolean = ativoTexto === "true";  // true

// number → boolean
const quantidade: number = 0;
const temItens: boolean = Boolean(quantidade); // false
const temItens2: boolean = !!quantidade;       // false — forma idiomática
```

#### Type Assertion

Quando você sabe mais sobre um valor do que o TypeScript consegue inferir:

```typescript
const dados = await resposta.json() as Produto[];

// Trabalhando com o DOM
const inputPreco = document.getElementById("preco") as HTMLInputElement;
const valor = inputPreco.value;

// Double assertion — use com extremo cuidado
const valorDesconhecido = "123" as unknown as number;
```

#### Type Guards — Verificação Segura em Runtime

```typescript
// typeof — para primitivos
function formatarValor(valor: string | number): string {
  if (typeof valor === "string") {
    return valor.trim().toUpperCase();
  }
  return valor.toFixed(2);
}

// Type Guard customizado com "is"
interface ProdutoFisico {
  peso: number;
  dimensoes: { altura: number; largura: number; profundidade: number };
}

interface ProdutoDigital {
  urlDownload: string;
  tamanhoMb: number;
}

type ProdutoUnion = ProdutoFisico | ProdutoDigital;

function eFisico(produto: ProdutoUnion): produto is ProdutoFisico {
  return "peso" in produto;
}

function calcularFrete(produto: ProdutoUnion): number {
  if (eFisico(produto)) {
    return produto.peso * 2.5;
  }
  return 0; // produto digital não tem frete
}
```

#### Narrowing com Operadores Modernos

```typescript
// Nullish coalescing
const nomeCliente: string | null = null;
const nomeFinal = nomeCliente ?? "Cliente não identificado";

// Optional chaining
const cliente: Cliente | null = buscarCliente("id-123");
const cidade = cliente?.endereco?.cidade ?? "Cidade não informada";

// Non-null assertion — use com cautela
const elemento = document.getElementById("app")!;
elemento.innerHTML = "Carregado";
```


---

## Testes em TypeScript

Escrever testes automatizados em TypeScript eleva a segurança do seu código a outro nível. Além de garantir que a lógica de negócio funciona, o compilador do TypeScript garante que seus testes (e seus *mocks*) estão estruturalmente corretos, evitando que testes quebrem por mudanças de contrato na aplicação.

### Principais Ferramentas (Test Runners)

1. **Vitest**: Atualmente a escolha favorita da comunidade moderna. É extremamente rápido, tem a mesma API do Jest e **suporta TypeScript nativamente** (sem precisar de configurações complexas ou plugins adicionais).
2. **Jest + ts-jest**: O padrão da indústria por muitos anos. Exige a biblioteca `ts-jest` ou o compilador do Babel/SWC para entender arquivos `.ts`.
3. **Node.js Native Test Runner**: A partir do Node 20+, o Node possui um test runner nativo (`node:test`) que, combinado com o Node executando TypeScript nativamente (via `--experimental-strip-types` no Node 22+), está se tornando uma opção minimalista e poderosa.

---

### Exemplo Prático: Teste Unitário

Vamos testar a nossa classe `Produto` do e-commerce usando a sintaxe do **Vitest/Jest**:

```typescript
import { describe, it, expect } from 'vitest';
import { Produto } from './Produto';

describe('Entidade Produto', () => {
  const dadosProduto = {
    id: 'prod-123',
    nome: 'Teclado Mecânico',
    preco: 200.0,
    estoque: 10,
    categoria: 'Informática',
    sku: 'TEC-001',
  };

  it('deve criar um produto corretamente', () => {
    const produto = new Produto(dadosProduto);

    expect(produto.nome).toBe('Teclado Mecânico');
    expect(produto.temEstoque()).toBe(true);
  });

  it('deve aplicar o desconto corretamente', () => {
    const produto = new Produto(dadosProduto);
    const precoComDesconto = produto.aplicarDesconto(10); // 10% de desconto

    expect(precoComDesconto).toBe(180.0);
  });

  it('deve lançar um erro se o desconto for maior que 100%', () => {
    const produto = new Produto(dadosProduto);

    // Para testar exceções, passamos uma função de callback
    expect(() => produto.aplicarDesconto(110)).toThrowError('Percentual de desconto inválido.');
  });
});
```

---

### Mocks com Tipagem Segura (Type-Safe Mocks)

Um dos maiores desafios em testes JavaScript é criar *mocks* (simulações de dependências, como APIs ou banco de dados) que fiquem desatualizados em relação ao código real. Em TypeScript, usamos utilitários como `vi.mocked()` (Vitest) ou `jest.mocked()` para garantir que o mock obedeça à interface original.

Exemplo testando um caso de uso que depende de uma API externa:

```typescript
import { describe, it, expect, vi } from 'vitest';

// 1. Interface da dependência
interface ApiCorreios {
  calcularFrete(cep: string, peso: number): Promise<number>;
}

// 2. Classe que queremos testar
class CalculadoraCheckout {
  constructor(private apiCorreios: ApiCorreios) {}

  async obterTotal(subtotal: number, cep: string, peso: number): Promise<number> {
    const frete = await this.apiCorreios.calcularFrete(cep, peso);
    return subtotal + frete;
  }
}

describe('CalculadoraCheckout', () => {
  it('deve somar o subtotal com o valor do frete retornado pela API', async () => {
    // Criamos um mock tipado da API
    const mockApiCorreios: ApiCorreios = {
      calcularFrete: vi.fn(),
    };

    // Garantimos a tipagem do mock para usar métodos como mockResolvedValue
    const calcularFreteMock = vi.mocked(mockApiCorreios.calcularFrete);

    // Simulamos que a API vai retornar R$ 25.00
    calcularFreteMock.mockResolvedValue(25.0);

    const calculadora = new CalculadoraCheckout(mockApiCorreios);
    const total = await calculadora.obterTotal(100.0, '01001-000', 2);

    expect(total).toBe(125.0);
    expect(calcularFreteMock).toHaveBeenCalledWith('01001-000', 2);
    expect(calcularFreteMock).toHaveBeenCalledTimes(1);
  });
});
```

### Vantagens de Testar com TypeScript

1. **Refatoração sem medo**: Se você adicionar um novo parâmetro obrigatório no construtor de `Produto`, todos os testes que instanciam `Produto` vão ficar vermelhos no seu editor imediatamente, antes mesmo de você rodar o comando de teste.
2. **Autocompletar nos Mocks**: Ao "mockar" um objeto complexo, o TypeScript sugere as propriedades que você precisa preencher, evitando mocks incompletos que causariam falsos positivos.
3. **Documentação Executável**: Testes tipados servem como a melhor documentação possível de como suas classes e funções devem ser consumidas por outros desenvolvedores.

---

## Exemplos Reais de E-commerce com Classes

### 1. Entidade Produto

```typescript
interface IProduto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  sku: string;
}

class Produto implements IProduto {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
  categoria: string;
  sku: string;

  constructor(dados: IProduto) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.preco = dados.preco;
    this.estoque = dados.estoque;
    this.categoria = dados.categoria;
    this.sku = dados.sku;
  }

  temEstoque(): boolean {
    return this.estoque > 0;
  }

  aplicarDesconto(percentual: number): number {
    if (percentual < 0 || percentual > 100) {
      throw new Error("Percentual de desconto inválido.");
    }
    return this.preco * (1 - percentual / 100);
  }

  toString(): string {
    return `[${this.sku}] ${this.nome} - R$ ${this.preco.toFixed(2)}`;
  }
}

const camiseta = new Produto({
  id: "prod-001",
  nome: "Camiseta Premium",
  preco: 89.9,
  estoque: 50,
  categoria: "Vestuário",
  sku: "CAM-PREM-001",
});

console.log(camiseta.aplicarDesconto(10)); // 80.91
console.log(camiseta.temEstoque());        // true
```

### 2. Entidade Cliente

```typescript
class Cliente implements ICliente {
  id: string;
  nome: string;
  email: string;
  cpf: string;
  endereco: Endereco;
  private _historicoCompras: Pedido[] = [];

  constructor(dados: ICliente) {
    this.id = dados.id;
    this.nome = dados.nome;
    this.email = dados.email;
    this.cpf = dados.cpf;
    this.endereco = dados.endereco;
  }

  adicionarPedido(pedido: Pedido): void {
    this._historicoCompras.push(pedido);
  }

  get totalGasto(): number {
    return this._historicoCompras
      .filter((p) => p.status === "aprovado")
      .reduce((acc, p) => acc + p.total, 0);
  }

  get historicoCompras(): Pedido[] {
    return [...this._historicoCompras];
  }
}
```

### 3. Item do Carrinho

```typescript
class ItemCarrinho {
  produto: Produto;
  quantidade: number;

  constructor(produto: Produto, quantidade: number) {
    if (quantidade <= 0) {
      throw new Error("Quantidade deve ser maior que zero.");
    }
    if (!produto.temEstoque()) {
      throw new Error(`Produto "${produto.nome}" está fora de estoque.`);
    }
    this.produto = produto;
    this.quantidade = quantidade;
  }

  get subtotal(): number {
    return this.produto.preco * this.quantidade;
  }

  aumentarQuantidade(qtd: number): void {
    this.quantidade += qtd;
  }
}
```

### 4. Carrinho de Compras

```typescript
class Carrinho {
  private _itens: ItemCarrinho[] = [];
  private _cupomDesconto: number = 0;

  adicionarItem(produto: Produto, quantidade: number = 1): void {
    const itemExistente = this._itens.find(
      (i) => i.produto.id === produto.id
    );

    if (itemExistente) {
      itemExistente.aumentarQuantidade(quantidade);
    } else {
      this._itens.push(new ItemCarrinho(produto, quantidade));
    }
  }

  removerItem(produtoId: string): void {
    this._itens = this._itens.filter((i) => i.produto.id !== produtoId);
  }

  aplicarCupom(percentual: number): void {
    this._cupomDesconto = percentual;
  }

  get subtotal(): number {
    return this._itens.reduce((acc, item) => acc + item.subtotal, 0);
  }

  get desconto(): number {
    return this.subtotal * (this._cupomDesconto / 100);
  }

  get total(): number {
    return this.subtotal - this.desconto;
  }

  get itens(): ItemCarrinho[] {
    return [...this._itens];
  }

  estaVazio(): boolean {
    return this._itens.length === 0;
  }

  limpar(): void {
    this._itens = [];
    this._cupomDesconto = 0;
  }
}
```

### 5. Pedido com Status Tipado

```typescript
type StatusPedido =
  | "rascunho"
  | "aguardando_pagamento"
  | "aprovado"
  | "em_separacao"
  | "enviado"
  | "entregue"
  | "cancelado";

class Pedido {
  readonly id: string;
  readonly cliente: Cliente;
  readonly itens: ItemCarrinho[];
  readonly total: number;
  readonly metodoPagamento: MetodoPagamento;
  private _status: StatusPedido;
  readonly criadoEm: Date;

  constructor(
    cliente: Cliente,
    carrinho: Carrinho,
    metodoPagamento: MetodoPagamento
  ) {
    if (carrinho.estaVazio()) {
      throw new Error("Não é possível criar pedido com carrinho vazio.");
    }

    this.id = `PED-${Date.now()}`;
    this.cliente = cliente;
    this.itens = carrinho.itens;
    this.total = carrinho.total;
    this.metodoPagamento = metodoPagamento;
    this._status = "aguardando_pagamento";
    this.criadoEm = new Date();
  }

  get status(): StatusPedido {
    return this._status;
  }

  avancarStatus(): void {
    const fluxo: StatusPedido[] = [
      "aguardando_pagamento",
      "aprovado",
      "em_separacao",
      "enviado",
      "entregue",
    ];

    const indexAtual = fluxo.indexOf(this._status);
    if (indexAtual === -1 || indexAtual === fluxo.length - 1) {
      throw new Error("Não é possível avançar o status deste pedido.");
    }

    this._status = fluxo[indexAtual + 1];
  }

  cancelar(): void {
    if (["enviado", "entregue"].includes(this._status)) {
      throw new Error("Pedido não pode ser cancelado neste estágio.");
    }
    this._status = "cancelado";
  }

  resumo(): string {
    return `
      Pedido: ${this.id}
      Cliente: ${this.cliente.nome}
      Total: R$ ${this.total.toFixed(2)}
      Pagamento: ${this.metodoPagamento}
      Status: ${this._status}
      Data: ${this.criadoEm.toLocaleDateString("pt-BR")}
    `;
  }
}
```

### 6. Serviço de Pagamento com Generics

```typescript
interface RespostaPagamento<T> {
  sucesso: boolean;
  dados: T;
  mensagem: string;
  timestamp: Date;
}

interface DadosCartao {
  ultimosDigitos: string;
  bandeira: string;
  parcelas: number;
}

interface DadosPix {
  chavePix: string;
  qrCode: string;
  expiracao: Date;
}

class ServicoPagamento {
  async processarCartao(
    pedido: Pedido,
    parcelas: number
  ): Promise<RespostaPagamento<DadosCartao>> {
    return {
      sucesso: true,
      dados: {
        ultimosDigitos: "4242",
        bandeira: "Visa",
        parcelas,
      },
      mensagem: "Pagamento aprovado com sucesso.",
      timestamp: new Date(),
    };
  }

  async gerarPix(
    pedido: Pedido
  ): Promise<RespostaPagamento<DadosPix>> {
    return {
      sucesso: true,
      dados: {
        chavePix: "pagamentos@loja.com.br",
        qrCode: "00020126...",
        expiracao: new Date(Date.now() + 30 * 60 * 1000),
      },
      mensagem: "PIX gerado com sucesso.",
      timestamp: new Date(),
    };
  }
}
```

### 7. Normalizando Dados de API Externa

```typescript
interface ProdutoAPI {
  produto_id: string;
  preco_centavos: number;
  em_estoque: string;   // API retorna "true" ou "false"
  peso_gramas?: string; // opcional, vem como string
}

function normalizarProduto(dadosAPI: unknown): Produto | null {
  if (!dadosAPI || typeof dadosAPI !== "object") {
    return null;
  }

  const api = dadosAPI as ProdutoAPI;

  const preco = Number(api.preco_centavos) / 100;
  if (isNaN(preco)) {
    console.error("Preço inválido recebido da API");
    return null;
  }

  const emEstoque = api.em_estoque === "true";

  return new Produto({
    id: api.produto_id,
    nome: "Produto importado",
    preco,
    estoque: emEstoque ? 1 : 0,
    categoria: "Importado",
    sku: api.produto_id,
  });
}
```

---

## O que há de Novo nas Últimas Versões do TypeScript

O TypeScript evoluiu significativamente ao longo das versões 5.x, trazendo melhorias de performance, novos recursos de tipagem e alinhamento com as últimas especificações do ECMAScript. Abaixo estão os destaques das versões mais recentes.

### TypeScript 5.5

#### Inferência Automática de Type Predicates
Uma das features mais pedidas pela comunidade. Antes, para filtrar arrays com type guards, você precisava anotar manualmente o retorno com `is`. Agora o TypeScript infere isso automaticamente:

```typescript
const valores: (string | null)[] = ["camiseta", null, "calça", null];

// Antes — precisava anotar manualmente
const apenasStrings = valores.filter(
  (v): v is string => v !== null
);

// Agora — TypeScript 5.5 infere automaticamente
const apenasStrings = valores.filter((v) => v !== null);
// TypeScript já sabe que o resultado é string[]
```

#### Verificação de Sintaxe em Expressões Regulares
O TypeScript 5.5 passou a verificar a sintaxe de expressões regulares diretamente no código, capturando erros comuns antes mesmo de executar:

```typescript
// ❌ Erro detectado em tempo de desenvolvimento
const cepRegex = /
^
\d{5-}/; // grupo incompleto — TypeScript avisa agora

// ✅ Correto
const cepRegex = /
^
\d{5}-\d{3}
$
/;
```

#### Novos Métodos de `Set` do ECMAScript
TypeScript 5.5 adicionou suporte nativo aos novos métodos de `Set`:

```typescript
const categoriasLoja = new Set(["eletronicos", "vestuario", "livros"]);
const categoriasParceiro = new Set(["vestuario", "esportes", "livros"]);

// Interseção — categorias em comum
const emComum = categoriasLoja.intersection(categoriasParceiro);
// Set { "vestuario", "livros" }

// Diferença — o que a loja tem e o parceiro não
const exclusivaLoja = categoriasLoja.difference(categoriasParceiro);
// Set { "eletronicos" }

// União
const todas = categoriasLoja.union(categoriasParceiro);
```

#### `--isolatedDeclarations`
Nova opção de compilador que força cada arquivo a ter declarações de tipo inferíveis de forma independente, permitindo que ferramentas como Vite e esbuild paralelizem a geração de `.d.ts`, acelerando drasticamente o build em monorepos grandes.

---

### TypeScript 5.6

#### Avisos para Verificações Sempre Verdadeiras ou Nulas
TypeScript 5.6 passou a detectar comparações que são logicamente impossíveis ou sempre verdadeiras — uma fonte clássica de bugs silenciosos:

```typescript
// ❌ TypeScript 5.6 avisa: esta condição é sempre verdadeira
const desconto = 10;
if (desconto) {
  // desconto é sempre 10, nunca falsy — verificação inútil
}

// Exemplo real de bug no e-commerce
function aplicarCupom(cupom: string) {
  if (cupom !== null) { // ❌ Aviso: cupom é string, nunca será null
    // ...
  }
}
```

#### Iterator Helper Methods
Suporte aos novos métodos funcionais de iteradores do ECMAScript — `.map()`, `.filter()`, `.take()`, `.drop()`, `.flatMap()` — que funcionam de forma **lazy** (sob demanda), sem criar arrays intermediários:

```typescript
function* gerarProdutos() {
  yield { nome: "Camiseta", preco: 89.9, ativo: true };
  yield { nome: "Calça", preco: 199.9, ativo: false };
  yield { nome: "Tênis", preco: 349.9, ativo: true };
  // potencialmente milhares de produtos...
}

// Lazy: processa apenas o necessário, sem carregar tudo na memória
const primeirosAtivos = gerarProdutos()
  .filter((p) => p.ativo)
  .map((p) => p.nome)
  .take(10); // pega só os 10 primeiros ativos
```

#### `--noUncheckedSideEffectImports`
Nova opção que avisa quando você importa um módulo apenas pelos seus efeitos colaterais sem declarar isso explicitamente — evitando importações acidentais por erro de digitação:

```typescript
import "./configurar-banco";    // ✅ intencional
import "./configuarar-banco";   // ❌ TypeScript avisa — possível typo
```

#### `--noCheck`
Opção que pula a verificação de tipos durante o build, útil em pipelines de CI/CD onde a checagem de tipos é feita em uma etapa separada, acelerando o processo de compilação.

#### Diagnósticos por Região no Editor
O language server passou a reportar erros apenas na região do arquivo que você está editando ativamente, melhorando muito a responsividade em arquivos grandes.

---

### TypeScript 5.7

#### Detecção de Variáveis Nunca Inicializadas
TypeScript 5.7 passou a detectar variáveis declaradas mas que nunca recebem um valor em nenhum caminho de código — um bug sutil que antes passava despercebido:

```typescript
// ❌ Erro detectado em 5.7
let totalFrete: number;

if (pedido.internacional) {
  totalFrete = calcularFreteInternacional(pedido);
}
// Se não for internacional, totalFrete nunca é inicializado
console.log(totalFrete); // ❌ TypeScript 5.7 pega esse problema agora
```

#### `--rewriteRelativeImportExtensions`
Nova opção que permite ao TypeScript reescrever extensões de importações relativas no output — essencial para projetos que usam ES Modules (ESM) e precisam que imports `.ts` virem `.js` no arquivo compilado:

```typescript
// Você escreve no .ts:
import { calcularFrete } from "./frete.ts";

// TypeScript reescreve no output .js:
import { calcularFrete } from "./frete.js";
```

#### Suporte a `--target es2024`
TypeScript 5.7 adicionou suporte ao target ES2024, permitindo o uso nativo das features mais recentes do ECMAScript sem polyfills.

#### V8 Compile Caching
O compilador `tsc` passou a usar o cache de compilação do V8 via a API `module.enableCompileCache()` do Node.js, resultando em **startups significativamente mais rápidos** em execuções repetidas — especialmente perceptível em projetos grandes.

#### Melhorias em Project References
Builds incrementais com `--build` ficaram mais rápidos em monorepos com múltiplos pacotes interdependentes.

---

### TypeScript 5.8

#### Verificação Granular em Branches de `return`
TypeScript 5.8 passou a verificar cada branch de expressões ternárias em `return` de forma independente, capturando erros mais sutis:

```typescript
// TypeScript 5.8 verifica cada branch separadamente
function obterPreco(produto: Produto | null): number {
  return produto !== null
    ? produto.preco        // ✅ TypeScript sabe que produto é Produto aqui
    : "gratuito";          // ❌ Erro! Deveria retornar number, não string
}
```

#### Suporte a `require()` de Módulos ES em Node.js
TypeScript 5.8 adicionou suporte à nova funcionalidade do Node.js que permite usar `require()` para carregar módulos ES — facilitando a migração gradual de projetos CommonJS para ESM:

```typescript
// Agora funciona com --module node18 ou nodenext
const { calcularFrete } = require("./frete.js"); // carrega um módulo ESM via require
```

#### `--erasableSyntaxOnly`
Nova opção que restringe o TypeScript a usar apenas sintaxe que pode ser simplesmente apagada (type annotations, interfaces, generics), proibindo features que geram código JavaScript como `enum` e `namespace`. Isso alinha o TypeScript com runtimes modernos como Deno e Bun, que removem tipos nativamente sem compilação:

```typescript
// ❌ Proibido com --erasableSyntaxOnly (gera código JS)
enum StatusPedido {
  Aprovado = "aprovado",
  Cancelado = "cancelado",
}

// ✅ Alternativa compatível (apenas tipo, sem geração de código)
type StatusPedido = "aprovado" | "cancelado";
```

#### `--libReplacement`
Permite substituir os arquivos de lib padrão do TypeScript (como `lib.dom.d.ts`) por versões customizadas — útil para ambientes com globals não-padrão ou para testes com mocks de globals.

#### Resumo das Versões

| Versão | Destaque Principal |
|---|---|
| **5.5** | Inferência automática de type predicates, checagem de regex, novos métodos de Set |
| **5.6** | Avisos para condições impossíveis, iterator helpers lazy, diagnósticos por região |
| **5.7** | Detecção de variáveis não inicializadas, V8 cache, suporte a ES2024 |
| **5.8** | Checagem granular em ternários, suporte a require() de ESM, `--erasableSyntaxOnly` |

---

## Vantagens do TypeScript

- **Detecção antecipada de erros**: problemas capturados no editor, antes da produção.
- **IntelliSense superior**: autocomplete preciso, documentação inline e navegação entre código.
- **Refatoração segura**: o compilador aponta todos os lugares afetados automaticamente.
- **Escalabilidade para times grandes**: tipos funcionam como contratos explícitos entre partes do sistema.
- **Documentação viva**: interfaces e tipos nunca ficam desatualizados como comentários.
- **Migração gradual**: todo JS válido é também TS válido, sem necessidade de reescrever tudo.
- **Ecossistema maduro**: React, Node, Express, Prisma e NestJS têm suporte nativo ou via `@types`.

---

## Empresas que Usam TypeScript

| Empresa   | Como usam                                                       |
|-----------|-----------------------------------------------------------------|
| Microsoft | VS Code, Azure e Office 365 Web                                 |
| Airbnb    | Migrou o frontend; criou a lib `ts-migrate`                     |
| Slack     | Reescreveu o desktop app em TS                                  |
| Asana     | Migrou toda a codebase; reduziu 38% dos bugs de produção        |
| Google    | Angular (100% em TS) e projetos internos                        |
| Shopify   | Frontend e parte do backend                                     |
| Discord   | Backend e frontend em TypeScript e Elixir                       |
| Notion    | Toda a aplicação web                                            |
| Nubank    | Frontend com React + TypeScript                                 |
| iFood     | Frontend com React + TypeScript                                 |

---

## Produtos e Frameworks Escritos em TypeScript

- **Angular** — framework frontend do Google, 100% em TypeScript
- **NestJS** — framework Node.js para backend, escrito em TS
- **Prisma** — ORM moderno com tipos gerados automaticamente
- **TypeORM** — ORM com suporte a decorators e classes tipadas
- **tRPC** — APIs type-safe de ponta a ponta sem schemas intermediários
- **Zod** — biblioteca de validação com inferência automática de tipos
- **VS Code** — o editor mais popular do mundo, escrito em TypeScript
- **Deno** — runtime moderno com suporte nativo a TypeScript
- **Supabase** — alternativa open-source ao Firebase com SDK em TypeScript

---

## Quando Usar TypeScript?

TypeScript brilha especialmente em projetos de médio a grande porte com múltiplos desenvolvedores, APIs e backends com regras de negócio complexas, frontends com React, Vue ou Angular em produção, bibliotecas e SDKs públicos, e sistemas onde bugs têm alto custo — como e-commerces e plataformas financeiras.

Para scripts rápidos ou prototipagem de curtíssimo prazo, o JavaScript puro ainda pode ser mais ágil. Mas mesmo nesses casos, muitos desenvolvedores já optam pelo TypeScript pela experiência superior no editor e pela segurança que a tipagem oferece desde o primeiro dia.