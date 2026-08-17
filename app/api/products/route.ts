import { NextResponse } from "next/server";
import { getGameProvider } from "@/lib/providers";

export async function GET() {
  try {
    const games = await getGameProvider().getGameList();
    return NextResponse.json({ games });
  } catch (err) {
    console.error("[GET /api/products]", err);
    return NextResponse.json({ error: "Gagal mengambil daftar game." }, { status: 502 });
  }
}
