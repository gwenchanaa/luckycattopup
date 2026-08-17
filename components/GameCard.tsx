import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Game } from "@/types/product";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.code}`} className="group block">
      <Card className="h-full overflow-hidden py-0 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
        <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
          <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
            <Image
              src={game.logoUrl}
              alt={game.name}
              fill
              sizes="(max-width: 640px) 45vw, (max-width: 1024px) 22vw, 180px"
              className="object-cover transition-transform duration-200 group-hover:scale-105"
            />
          </div>
          <div className="w-full">
            <p className="truncate font-semibold leading-tight">{game.name}</p>
            <Badge variant="secondary" className="mt-1.5">
              {game.category}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
