"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { SearchBar } from "@/components/SearchBar";
import { GameGrid, GameGridSkeleton } from "@/components/GameGrid";
import { Button } from "@/components/ui/button";
import type { Game } from "@/types/product";

type LoadState = "loading" | "error" | "ready";

export function GameBrowser() {
  const [games, setGames] = useState<Game[]>([]);
  const [state, setState] = useState<LoadState>("loading");
  const [search, setSearch] = useState("");

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
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-destructive/40 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="font-medium">Gagal memuat daftar game</p>
          <p className="text-sm text-muted-foreground">
            Terjadi masalah saat mengambil data. Coba lagi ya.
          </p>
          <Button variant="outline" onClick={load} className="mt-2 gap-2">
            <RefreshCw className="h-4 w-4" />
            Muat Ulang
          </Button>
        </div>
      )}

      {state === "ready" && <GameGrid games={filtered} />}
    </div>
  );
}
