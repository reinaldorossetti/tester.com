import { NextResponse } from 'next/server';
import { query } from '../../../../../../lib/db.js';
import { authenticateRequest } from '../../../../../../lib/auth.js';
import { isUserAdmin } from '../../../../../../lib/user-roles.js';

function toPositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0 ? n : null;
}

async function getPayment(orderId, paymentId) {
  const result = await query(
    `SELECT p.id, p.order_id, p.user_id, p.method, p.amount, p.status,
            p.card_brand, p.provider_reference, p.metadata, p.created_at, p.updated_at,
            o.user_id AS order_owner_id
     FROM payments p
     JOIN orders o ON o.id = p.order_id
     WHERE p.order_id = $1 AND p.id = $2`,
    [orderId, paymentId]
  );
  return result.rows[0] || null;
}

export async function GET(request, { params }) {
  try {
    const authResult = authenticateRequest(request);
    if (!authResult.ok) {
      return NextResponse.json({ error: authResult.error }, { status: 401 });
    }

    const orderId = toPositiveInt(params?.id);
    const paymentId = toPositiveInt(params?.paymentId);

    if (!orderId || !paymentId) {
      return NextResponse.json({ error: 'Parâmetros inválidos' }, { status: 400 });
    }

    const payment = await getPayment(orderId, paymentId);
    if (!payment) {
      return NextResponse.json({ error: 'Pagamento não encontrado' }, { status: 404 });
    }

    const { userId: authUserId } = authResult.auth;
    const admin = await isUserAdmin(authUserId);
    if (!admin && payment.order_owner_id !== authUserId) {
      return NextResponse.json({ error: 'Acesso negado para este pagamento' }, { status: 403 });
    }

    return NextResponse.json(payment, { status: 200 });
  } catch (err) {
    console.error('[GET /api/orders/:id/payments/:paymentId]', err.message);
    return NextResponse.json({ error: 'Erro ao consultar pagamento' }, { status: 500 });
  }
}
