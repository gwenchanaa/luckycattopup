import { NextResponse } from "next/server";
import { getPaymentProvider, usingMockPayment } from "@/lib/payment";
import { getTransactionStore } from "@/lib/db/transactions";
import { transactionIdParamSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = transactionIdParamSchema.safeParse(body?.transactionId);
  if (!parsed.success) {
    return NextResponse.json({ error: "Transaction ID tidak valid." }, { status: 400 });
  }

  const transaction = await getTransactionStore().getById(parsed.data);
  if (!transaction) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }
  if (transaction.status !== "PENDING_PAYMENT") {
    return NextResponse.json(
      { error: "Transaksi ini sudah tidak menunggu pembayaran." },
      { status: 409 }
    );
  }

  try {
    const snap = await getPaymentProvider().createSnapTransaction({
      orderId: transaction.midtransOrderId ?? transaction.id,
      grossAmount: transaction.price,
      itemName: `${transaction.gameName} - ${transaction.productName}`,
    });
    return NextResponse.json({ ...snap, mock: usingMockPayment() });
  } catch (err) {
    console.error("[POST /api/payment/create]", err);
    return NextResponse.json({ error: "Gagal membuat transaksi pembayaran." }, { status: 502 });
  }
}
