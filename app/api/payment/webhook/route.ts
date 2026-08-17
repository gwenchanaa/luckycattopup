import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payment";
import { getGameProvider } from "@/lib/providers";
import { getTransactionStore } from "@/lib/db/transactions";
import type { RawWebhookPayload } from "@/lib/payment/types";

function isPaidStatus(notif: { transactionStatus: string; fraudStatus?: string }) {
  if (notif.transactionStatus === "settlement") return true;
  if (notif.transactionStatus === "capture" && notif.fraudStatus === "accept") return true;
  return false;
}

function isFailedStatus(status: string) {
  return status === "deny" || status === "cancel" || status === "failure";
}

export async function POST(req: Request) {
  const payload = (await req.json().catch(() => null)) as RawWebhookPayload | null;
  if (!payload?.order_id) {
    return NextResponse.json({ error: "Payload tidak valid." }, { status: 400 });
  }

  const paymentProvider = getPaymentProvider();

  if (!paymentProvider.verifyWebhookSignature(payload)) {
    console.warn("[payment/webhook] invalid signature for order", payload.order_id);
    return NextResponse.json({ error: "Signature tidak valid." }, { status: 403 });
  }

  const notif = paymentProvider.parseNotification(payload);
  const store = getTransactionStore();
  const transaction = await store.getByMidtransOrderId(notif.orderId);

  if (!transaction) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  // Idempotency guard: only act on the payment event once.
  if (transaction.status !== "PENDING_PAYMENT") {
    return NextResponse.json({ ok: true, note: "already processed" });
  }

  if (notif.transactionStatus === "expire") {
    await store.update(transaction.id, { status: "EXPIRED" });
    return NextResponse.json({ ok: true });
  }

  if (isFailedStatus(notif.transactionStatus)) {
    await store.update(transaction.id, {
      status: "FAILED",
      providerNote: `Pembayaran ${notif.transactionStatus}.`,
    });
    return NextResponse.json({ ok: true });
  }

  if (!isPaidStatus(notif)) {
    // pending / authorize — nothing to do yet, wait for the next callback.
    return NextResponse.json({ ok: true });
  }

  await store.update(transaction.id, { status: "PAID", paymentMethod: notif.paymentType ?? null });

  try {
    const result = await getGameProvider().createOrder({
      gameCode: transaction.gameCode,
      productCode: transaction.productCode,
      accountUserId: transaction.accountUserId,
      accountServerId: transaction.accountServerId ?? undefined,
      referenceId: transaction.id,
    });

    await store.update(transaction.id, {
      status: result.status,
      providerOrderId: result.providerOrderId,
      providerNote: result.note ?? null,
    });
  } catch (err) {
    console.error("[payment/webhook] provider order failed", err);
    await store.update(transaction.id, {
      status: "FAILED",
      providerNote: err instanceof Error ? err.message : "Gagal membuat pesanan ke provider.",
    });
  }

  return NextResponse.json({ ok: true });
}
