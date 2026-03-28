import { query } from '../../../../../../lib/db.js';

function toOrderId(params) {
  const id = Number(params?.id);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function escapePdfText(value = '') {
  return String(value)
    .replace(/\\/g, '\\\\')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/[^\x20-\x7E]/g, ' ');
}

function buildSimplePdf(lines = []) {
  const safeLines = lines.slice(0, 20).map((line) => escapePdfText(line));
  const textCommands = [
    'BT',
    '/F1 12 Tf',
    '50 800 Td',
    ...safeLines.flatMap((line, index) => (index === 0 ? [`(${line}) Tj`] : ['0 -18 Td', `(${line}) Tj`])),
    'ET',
  ].join('\n');

  const objects = [
    '<< /Type /Catalog /Pages 2 0 R >>',
    '<< /Type /Pages /Kids [3 0 R] /Count 1 >>',
    '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>',
    '<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>',
    `<< /Length ${Buffer.byteLength(textCommands, 'utf8')} >>\nstream\n${textCommands}\nendstream`,
  ];

  let pdf = '%PDF-1.4\n';
  const offsets = [0];

  objects.forEach((obj, index) => {
    offsets.push(Buffer.byteLength(pdf, 'utf8'));
    pdf += `${index + 1} 0 obj\n${obj}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, 'utf8');
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += '0000000000 65535 f \n';

  offsets.slice(1).forEach((offset) => {
    pdf += `${String(offset).padStart(10, '0')} 00000 n \n`;
  });

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(pdf, 'utf8');
}

function buildBoletoLines({ orderId, reference, orderNumber, amount, metadata }) {
  const dueDate = String(metadata?.dueDate || '').slice(0, 10) || 'N/A';
  const issuedAt = String(metadata?.issuedAt || '').slice(0, 10) || new Date().toISOString().slice(0, 10);

  return [
    'BOLETO DE PAGAMENTO - MOCK',
    'Documento sem validade bancaria real (ambiente de testes).',
    `Pedido: ${orderNumber || `#${orderId}`}`,
    `Referencia: ${reference}`,
    `Beneficiario: ${metadata?.beneficiaryName || 'Empresa Mock de Cobrancas LTDA'}`,
    `CNPJ: ${metadata?.beneficiaryDocument || '12.345.678/0001-95'}`,
    `Banco: ${metadata?.beneficiaryBank || 'Banco Mock S.A.'}`,
    `Nosso numero: ${metadata?.nossoNumero || String(orderId).padStart(8, '0')}`,
    `Valor: R$ ${Number(amount || 0).toFixed(2)}`,
    `Emissao: ${issuedAt}`,
    `Vencimento: ${dueDate}`,
    `Linha digitavel: ${metadata?.line || '00191.79001 01043.510047 91020.150008 8 9727002600010000'}`,
    `Codigo de barras: ${metadata?.barcode || '00199727000000000000000000000000000000000000'}`,
  ];
}

export async function GET(_request, { params }) {
  const orderId = toOrderId(params);
  const reference = String(params?.reference || '').trim() || 'boleto';

  if (!orderId) {
    return new Response(JSON.stringify({ error: 'ID de pedido invalido' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  let row = null;
  try {
    const result = await query(
      `SELECT p.amount, p.metadata, o.order_number
       FROM payments p
       JOIN orders o ON o.id = p.order_id
       WHERE p.order_id = $1 AND p.method = 'boleto'
       ORDER BY p.created_at DESC, p.id DESC
       LIMIT 1`,
      [orderId]
    );
    row = result.rows[0] || null;
  } catch {
    row = null;
  }

  const lines = buildBoletoLines({
    orderId,
    reference,
    orderNumber: row?.order_number,
    amount: row?.amount,
    metadata: row?.metadata || {},
  });

  const pdf = buildSimplePdf(lines);
  const filename = `boleto-${orderId}-${reference}.pdf`;

  return new Response(pdf, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'no-store',
    },
  });
}
