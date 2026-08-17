import { NextResponse } from "next/server";
import { getGameProvider } from "@/lib/providers";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ gameCode: string }> }
) {
  const { gameCode } = await params;
  const provider = getGameProvider();

  try {
    const games = await provider.getGameList();
    const game = games.find((g) => g.code === gameCode);
    if (!game) {
      return NextResponse.json({ error: "Game tidak ditemukan." }, { status: 404 });
    }

    const products = await provider.getPriceList(gameCode);
    return NextResponse.json({ game, products });
  } catch (err) {
    console.error("[GET /api/products/[gameCode]]", err);
    return NextResponse.json({ error: "Gagal mengambil data game." }, { status: 502 });
  }
}
