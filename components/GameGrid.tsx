import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/GameCard";
import type { Game } from "@/types/product";

const GRID = "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4";

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className={GRID}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="ink drop-ink space-y-2.5 rounded-2xl bg-card p-3">
          <Skeleton className="aspect-[4/3] w-full rounded-xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-5 w-1/2 rounded-full" />
        </div>
      ))}
    </div>
  );
}

export function GameGrid({ games }: { games: Game[] }) {
  if (games.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-ink/30 bg-sakura-soft py-14 text-center">
        <Image src="/cat-face.png" alt="" width={64} height={64} className="size-16 opacity-80" />
        <p className="font-display text-base font-bold text-ink">Yah, gak ketemu</p>
        <p className="max-w-xs text-[12.5px] text-[#8c7d75]">
          Coba kata kunci lain, misalnya nama game yang berbeda.
        </p>
      </div>
    );
  }

  return (
    <div className={GRID}>
      {games.map((game) => (
        <GameCard key={game.code} game={game} />
      ))}
    </div>
  );
}
