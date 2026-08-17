import { Skeleton } from "@/components/ui/skeleton";
import { GameCard } from "@/components/GameCard";
import type { Game } from "@/types/product";
import { Gamepad2 } from "lucide-react";

export function GameGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-3 rounded-xl border border-border/60 bg-card p-4">
          <Skeleton className="aspect-square w-full rounded-xl" />
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
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center text-muted-foreground">
        <Gamepad2 className="h-10 w-10" />
        <p className="font-medium text-foreground">Game tidak ditemukan</p>
        <p className="text-sm">Coba kata kunci lain, misalnya nama game yang berbeda.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {games.map((game) => (
        <GameCard key={game.code} game={game} />
      ))}
    </div>
  );
}
