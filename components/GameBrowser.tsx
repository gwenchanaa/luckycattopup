"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { RefreshCw } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { GameGrid, GameGridSkeleton } from "@/components/GameGrid";
import type { Game } from "@/types/product";

type LoadState = "loading" | "error" | "ready";

export function GameBrowser() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") ?? "";

  const [games, setGames] = useState<Game[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [search, setSearch] = useState(queryParam);

  async function load() {
    setState("loading");
    try {
      const res = await fetch("/api/products");
      if (!res.ok) throw new Error("failed");
      const data = await res.json();
      setGames(data.games ?? []);
      setState("ready");
    } catch {
      setState("error");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, load() is also reused by the retry button
    load();
  }, []);

  // The hero's search box navigates to /?q=… — keep the grid in step with it.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- mirroring the URL into the controlled input
    setSearch(queryParam);
  }, [queryParam]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return games;
    return games.filter(
      (g) => g.name.toLowerCase().includes(q) || g.category.toLowerCase().includes(q)
    );
  }, [games, search]);

  return (
    <div className="space-y-6">
      <div className="mx-auto max-w-xl">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {state === "loading" && <GameGridSkeleton />}

      {state === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-bell/40 bg-sakura-soft py-14 text-center">
          <Image src="/cat-face.png" alt="" width={64} height={64} className="size-16 opacity-80" />
          <p className="font-display text-base font-bold text-ink">Gagal memuat daftar game</p>
          <p className="max-w-xs text-[12.5px] text-[#8c7d75]">
            Terjadi masalah saat mengambil data. Coba lagi ya.
          </p>
          <button
            type="button"
            onClick={load}
            className="ink drop-ink-sm press mt-1 flex items-center gap-2 rounded-full bg-card px-4 py-2 font-display text-[13px] font-bold text-ink"
          >
            <RefreshCw className="size-4" />
            Muat Ulang
          </button>
        </div>
      )}

      {state === "ready" && <GameGrid games={filtered} />}
    </div>
  );
}
