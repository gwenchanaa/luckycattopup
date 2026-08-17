import { NextResponse } from "next/server";
import { getTransactionStore } from "@/lib/db/transactions";
import { transactionIdParamSchema } from "@/lib/validation";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const ip = getClientIp(req);
  const { allowed, retryAfterMs } = checkRateLimit(`transaction-status:${ip}`, {
    limit: 20,
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

  const transaction = await getTransactionStore().getById(parsed.data);
  if (!transaction) {
    return NextResponse.json({ error: "Transaksi tidak ditemukan." }, { status: 404 });
  }

  return NextResponse.json({ transaction });
}
