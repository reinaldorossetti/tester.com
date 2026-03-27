import { beforeEach, describe, expect, it, vi } from 'vitest';

const {
  queryMock,
  authenticateRequestMock,
  isUserAdminMock,
} = vi.hoisted(() => ({
  queryMock: vi.fn(),
  authenticateRequestMock: vi.fn(),
  isUserAdminMock: vi.fn(),
}));

vi.mock('../../lib/db.js', () => ({
  query: queryMock,
}));

vi.mock('../../lib/auth.js', () => ({
  authenticateRequest: authenticateRequestMock,
}));

vi.mock('../../lib/user-roles.js', () => ({
  isUserAdmin: isUserAdminMock,
}));

import { POST as postPayment } from '../../app/api/orders/[id]/payments/route.js';
import { GET as getPaymentById } from '../../app/api/orders/[id]/payments/[paymentId]/route.js';

function jsonRequest(url, method = 'GET', body, headers = {}) {
  return new Request(url, {
    method,
    headers: {
      'content-type': 'application/json',
      ...headers,
    },
    body: body == null ? undefined : JSON.stringify(body),
  });
}

describe('Payments API endpoints', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    authenticateRequestMock.mockReturnValue({
      ok: true,
      auth: { userId: 1, email: 'pay@test.com' },
    });
    isUserAdminMock.mockResolvedValue(false);
  });

  it('POST /api/orders/:id/payments retorna 401 quando não autenticado', async () => {
    authenticateRequestMock.mockReturnValueOnce({ ok: false, error: 'Bearer token ausente' });

    const response = await postPayment(
      jsonRequest('http://localhost/api/orders/10/payments', 'POST', { method: 'credit' }),
      { params: { id: '10' } }
    );

    expect(response.status).toBe(401);
  });

  it('POST /api/orders/:id/payments valida método de pagamento', async () => {
    queryMock.mockResolvedValueOnce({ rows: [{ id: 10, user_id: 1, grand_total: 100 }] });

    const response = await postPayment(
      jsonRequest('http://localhost/api/orders/10/payments', 'POST', { method: 'cash' }),
      { params: { id: '10' } }
    );

    expect(response.status).toBe(400);
  });

  it('POST /api/orders/:id/payments cria pagamento autorizado para crédito', async () => {
    queryMock
      .mockResolvedValueOnce({ rows: [{ id: 10, user_id: 1, grand_total: 100 }] })
      .mockResolvedValueOnce({ rows: [{ paid: 0 }] })
      .mockResolvedValueOnce({
        rows: [{
          id: 1,
          order_id: 10,
          user_id: 1,
          method: 'credit',
          amount: 100,
          status: 'authorized',
          metadata: {},
        }],
      })
      .mockResolvedValueOnce({ rows: [] });

    const response = await postPayment(
      jsonRequest('http://localhost/api/orders/10/payments', 'POST', {
        method: 'credit',
        amount: 100,
        cardNumber: '4111111111111111',
      }),
      { params: { id: '10' } }
    );

    const payload = await response.json();

    expect(response.status).toBe(201);
    expect(payload.status).toBe('authorized');
    expect(payload.method).toBe('credit');
  });

  it('GET /api/orders/:id/payments/:paymentId bloqueia acesso de outro usuário', async () => {
    queryMock.mockResolvedValueOnce({
      rows: [{ id: 7, order_id: 10, order_owner_id: 9, method: 'pix', status: 'pending' }],
    });

    const response = await getPaymentById(
      new Request('http://localhost/api/orders/10/payments/7'),
      { params: { id: '10', paymentId: '7' } }
    );

    expect(response.status).toBe(403);
  });
});
