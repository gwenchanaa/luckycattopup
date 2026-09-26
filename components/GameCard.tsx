import Image from "next/image";
import Link from "next/link";
import type { Game } from "@/types/product";

export function GameCard({ game }: { game: Game }) {
  return (
    <Link href={`/games/${game.code}`} className="group block">
      <div className="ink drop-ink press h-full rounded-2xl bg-card p-3">
        <div className="cover-placeholder relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src={game.logoUrl}
            alt={game.name}
            fill
            sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 260px"
            className="object-cover"
          />
        </div>
        <div className="mt-2.5 truncate font-display text-[15px] font-bold leading-tight text-ink">
          {game.name}
        </div>
        <div className="mb-2 truncate text-[11px] text-[#9c8c84]">{game.description}</div>
        <span className="inline-block rounded-full border-[1.5px] border-koban-line bg-koban-soft px-2.5 py-1 text-[11px] font-bold text-[#6b4a16]">
          {game.category}
        </span>
      </div>
    </Link>
  );
}
