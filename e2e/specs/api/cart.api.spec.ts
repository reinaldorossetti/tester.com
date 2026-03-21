import { expect, test } from '@playwright/test';

async function createUser(request: any) {
  const suffix = `${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  const response = await request.post('users/register', {
    data: {
      first_name: 'Cart',
      last_name: `Tester-${suffix}`,
      email: `pw.cart.${suffix}@example.com`,
      password: 'Senha@1234',
      person_type: 'PF',
      cpf: null,
    },
  });

  expect(response.status()).toBe(201);
  return response.json();
}

async function loginAndGetAccessToken(request: any, email: string, password: string) {
  const loginRes = await request.post('users/login', {
    data: { email, password },
  });

  expect(loginRes.status()).toBe(200);
  const loginPayload = await loginRes.json();
  expect(loginPayload.accessToken).toBeTruthy();
  return loginPayload.accessToken as string;
}

async function createProduct(request: any) {
  const suffix = Date.now();
  const response = await request.post('products', {
    data: {
      name: `Produto Carrinho ${suffix}`,
      price: 49.9,
      category: `Cart-${suffix}`,
      description: 'Produto para teste de carrinho',
    },
  });

  expect(response.status()).toBe(201);
  return response.json();
}

test.describe('API Cart', () => {
  test('deve adicionar, incrementar, listar e remover item do carrinho', async ({ request }) => {
    const user = await createUser(request);
    const product = await createProduct(request);
    const accessToken = await loginAndGetAccessToken(request, user.email, 'Senha@1234');

    const authHeaders = { Authorization: `Bearer ${accessToken}` };

    const addRes1 = await request.post('cart', {
      headers: authHeaders,
      data: { userId: user.id, productId: product.id, quantity: 2 },
    });
    expect(addRes1.status()).toBe(201);

    const addRes2 = await request.post('cart', {
      headers: authHeaders,
      data: { userId: user.id, productId: product.id, quantity: 1 },
    });
    expect(addRes2.status()).toBe(201);

    const listRes = await request.get(`cart?userId=${user.id}`, {
      headers: authHeaders,
    });
    expect(listRes.status()).toBe(200);
    const items = await listRes.json();
    expect(items.length).toBeGreaterThan(0);
    expect(items[0].quantity).toBe(3);

    const removeRes = await request.delete('cart', {
      headers: authHeaders,
      data: { cartItemId: items[0].id },
    });
    expect(removeRes.status()).toBe(200);

    const listAfterDelete = await request.get(`cart?userId=${user.id}`, {
      headers: authHeaders,
    });
    expect(listAfterDelete.status()).toBe(200);
    const afterItems = await listAfterDelete.json();
    expect(afterItems.length).toBe(0);

    await request.delete(`products/${product.id}`);
  });

  test('deve validar erros de payload do carrinho', async ({ request }) => {
    const getNoUser = await request.get('cart');
    expect(getNoUser.status()).toBe(401);

    const addWithoutData = await request.post('cart', { data: {} });
    expect(addWithoutData.status()).toBe(401);

    const deleteWithoutId = await request.delete('cart', { data: {} });
    expect(deleteWithoutId.status()).toBe(401);
  });
});
