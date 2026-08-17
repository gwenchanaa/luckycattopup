import { NextResponse } from "next/server";
import { getGameProvider } from "@/lib/providers";
import { validateIdSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = validateIdSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
  }

  const { gameCode, accountUserId, accountServerId } = parsed.data;

  try {
    const result = await getGameProvider().checkNickname(gameCode, accountUserId, accountServerId);
    return NextResponse.json(result);
  } catch (err) {
    console.error("[POST /api/validate-id]", err);
    return NextResponse.json({ error: "Gagal memvalidasi ID." }, { status: 502 });
  }
}
