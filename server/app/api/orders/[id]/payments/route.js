import { NextResponse } from 'next/server';
import { query } from '../../../../../lib/db.js';
import { authenticateRequest } from '../../../../../lib/auth.js';
import { isUserAdmin } from '../../../../../lib/user-roles.js';

const ALLOWED_METHODS = ['credit', 'debit', 'pix', 'boleto'];

function toPositiveNumber(value) {
  const amount = Number(value);
  if (Number.isNaN(amount) || amount <= 0) return null;
  return Number(amount.toFixed(2));
}

function toOrderId(params) {
  const id = Number(params?.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function getOrder(orderId) {
  const result = await query(
    `SELECT id, user_id, status, grand_total, payment_method
     FROM orders
     WHERE id = $1`,
    [orderId]
  );
  return result.rows[0] || null;
}

function detectCardBrand(cardNumber = '') {
  const n = String(cardNumber).replace(/\D/g, '');
  if (/^4/.test(n)) return 'visa';
  if (/^(5[1-5]|2[2-7])/.test(n)) return 'mastercard';
  if (/^3[47]/.test(n)) return 'amex';
  if (/^(4011|4312|4389|4514|4576|5041|5066|5090|6277|6362|6363|6500|6516|6550)/.test(n)) return 'elo';
  if (/^(6062|6370|6375|38)/.test(n)) return 'hipercard';
  return null;
}

function buildMethodMetadata(method, body = {}) {
  if (method === 'pix') {
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    const pixCode = `00020126PIX${Date.now()}5802BR5920TESTER COM6009SAO PAULO62070503***6304ABCD`;
    return {
      expiresAt,
      pixCode,
      qrCode: `PIX-QR-${Date.now()}`,
    };
  }

  if (method === 'boleto') {
    const dueDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
    return {
      dueDate,
      line: `34191.79001 01043.510047 91020.150008 8 97270026000${String(Date.now()).slice(-4)}`,
      downloadUrl: `/api/orders/${body.orderId || ''}/boleto/${Date.now()}`,
    };
  }

  return {
    installments: Number(body.installments || 1),
    cardLast4: String(body.cardNumber || '').replace(/\D/g, '').slice(-4),
  };
}

export async function POST(request, { params }) {
  try {
    const authResult = authenticateRequest(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const orderId = toOrderId(params);
    if (!orderId) {
      return NextResponse.json({ error: 'ID de pedido inválido' }, { status: 400 });
    }

    const order = await getOrder(orderId);
    if (!order) {
      return NextResponse.json({ error: 'Pedido não encontrado' }, { status: 404 });
    }

    const { userId: authUserId } = authResult.auth;
    const admin = await isUserAdmin(authUserId);
    if (!admin && order.user_id !== authUserId) {
      return NextResponse.json({ error: 'Acesso negado para este pedido' }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const method = String(body.method || '').trim().toLowerCase();
    if (!ALLOWED_METHODS.includes(method)) {
      return NextResponse.json({ error: 'Método de pagamento inválido' }, { status: 400 });
    }

    const paidResult = await query(
      `SELECT COALESCE(SUM(amount), 0)::numeric AS paid
       FROM payments
       WHERE order_id = $1 AND status = 'authorized'`,
      [orderId]
    );

    const alreadyPaid = Number(paidResult.rows[0]?.paid || 0);
    const orderTotal = Number(order.grand_total || 0);
    const remaining = Math.max(0, Number((orderTotal - alreadyPaid).toFixed(2)));

    const amount = toPositiveNumber(body.amount ?? remaining);
    if (!amount) {
      return NextResponse.json({ error: 'Valor de pagamento inválido' }, { status: 400 });
    }

    if (amount > remaining) {
      return NextResponse.json({ error: 'Valor maior que saldo do pedido' }, { status: 400 });
    }

    let status = 'authorized';
    if (method === 'pix' || method === 'boleto') status = 'pending';

    const digits = String(body.cardNumber || '').replace(/\D/g, '');
    if ((method === 'credit' || method === 'debit') && digits.endsWith('0000')) {
      status = 'failed';
    }

    const cardBrand = (method === 'credit' || method === 'debit')
      ? (body.cardBrand || detectCardBrand(body.cardNumber))
      : null;

    const metadata = buildMethodMetadata(method, { ...body, orderId });

    const inserted = await query(
      `INSERT INTO payments (
          order_id, user_id, method, amount, status,
          card_brand, provider_reference, metadata, updated_at
       ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING id, order_id, user_id, method, amount, status, card_brand,
                 provider_reference, metadata, created_at, updated_at`,
      [
        orderId,
        authUserId,
        method,
        amount,
        status,
        cardBrand,
        `sim-${method}-${Date.now()}`,
        metadata,
      ]
    );

    const payment = inserted.rows[0];

    if (status === 'authorized') {
      const newPaid = Number((alreadyPaid + amount).toFixed(2));
      if (newPaid >= orderTotal) {
        await query(
          `UPDATE orders
           SET status = 'paid', payment_method = $2, updated_at = NOW()
           WHERE id = $1`,
          [orderId, method]
        );
      }
    } else if (status === 'pending') {
      await query(
        `UPDATE orders
         SET status = 'pending_payment', payment_method = $2, updated_at = NOW()
         WHERE id = $1`,
        [orderId, method]
      );
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders/:id/payments]', err.message);
    return NextResponse.json({ error: 'Erro ao processar pagamento' }, { status: 500 });
  }
}
