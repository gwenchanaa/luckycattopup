import { NextResponse } from "next/server";
import { getGameProvider } from "@/lib/providers";
import { getTransactionStore } from "@/lib/db/transactions";
import { generateTransactionId } from "@/lib/id-generator";
import { createOrderSchema } from "@/lib/validation";

const PAYMENT_WINDOW_MS = 24 * 60 * 60 * 1000;

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  }

  const { gameCode, productCode, accountUserId, accountServerId } = parsed.data;
  const provider = getGameProvider();

  try {
    const [games, products] = await Promise.all([
      provider.getGameList(),
      provider.getPriceList(gameCode),
    ]);

    const game = games.find((g) => g.code === gameCode);
    const product = products.find((p) => p.code === productCode);

    if (!game || !product || !product.isAvailable) {
      return NextResponse.json({ error: "Produk tidak tersedia." }, { status: 404 });
    }

    if (game.idFieldType === "user-id-server-id" && !accountServerId) {
      return NextResponse.json({ error: `${game.serverIdLabel ?? "Server ID"} wajib diisi.` }, { status: 400 });
    }

    const id = generateTransactionId();
    const transaction = await getTransactionStore().create({
      id,
      gameCode: game.code,
      gameName: game.name,
      productCode: product.code,
      productName: product.name,
      price: product.price,
      accountUserId,
      accountServerId: accountServerId ?? null,
      midtransOrderId: id,
      expiredAt: new Date(Date.now() + PAYMENT_WINDOW_MS).toISOString(),
    });

    return NextResponse.json({ transaction });
  } catch (err) {
    console.error("[POST /api/order]", err);
    return NextResponse.json({ error: "Gagal membuat pesanan." }, { status: 502 });
  }
}
