import { NextResponse } from "next/server";
import { getGameProvider } from "@/lib/providers";
import { getTransactionStore } from "@/lib/db/transactions";
import { transactionIdParamSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = checkRateLimit(`transaction-sync:${ip}`, {
    limit: 10,
    windowMs: 60_000,
  });
  if (!allowed) {
    return NextResponse.json(
      { error: "Terlalu banyak percobaan. Coba lagi sebentar lagi." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } }
    );
  }

  const { id } = await params;
  const parsed = transactionIdParamSchema.safeParse(id);
  if (!parsed.success) {
    return NextResponse.json({ error: "Format Transaction ID tidak valid." }, { status: 400 });
  }

  const store = getTransactionStore();
  const transaction = await store.getById(parsed.data);
  if (!transaction) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  if (transaction.status !== "PROCESSING" || !transaction.providerOrderId) {
    return NextResponse.json({ transaction });
  }

  try {
    const result = await getGameProvider().checkOrderStatus(transaction.providerOrderId);
    const updated = await store.update(transaction.id, {
      status: result.status,
      providerNote: result.note ?? transaction.providerNote,
    });
    return NextResponse.json({ transaction: updated });
  } catch (err) {
    console.error("[transaction/sync]", err);
    return NextResponse.json({ transaction });
  }
}
