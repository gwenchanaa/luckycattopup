import { GameDetailClient } from "./GameDetailClient";

export default async function GameDetailPage({
  params,
}: {
  params: Promise<{ gameCode: string }>;
}) {
  const { gameCode } = await params;
  return <GameDetailClient gameCode={gameCode} />;
}
