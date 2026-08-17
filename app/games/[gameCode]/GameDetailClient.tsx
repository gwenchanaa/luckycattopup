"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { AlertTriangle, ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ProductList } from "@/components/ProductList";
import { AccountIdForm } from "@/components/AccountIdForm";
import { OrderSummary } from "@/components/OrderSummary";
import type { Game, Product } from "@/types/product";

type LoadState = "loading" | "not-found" | "error" | "ready";

export function GameDetailClient({ gameCode }: { gameCode: string }) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [game, setGame] = useState<Game | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [userId, setUserId] = useState("");
  const [serverId, setServerId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setState("loading");
      try {
        const res = await fetch(`/api/products/${gameCode}`);
        if (res.status === 404) {
          if (!cancelled) setState("not-found");
          return;
        }
        if (!res.ok) throw new Error("failed");
        const data = await res.json();
        if (cancelled) return;
        setGame(data.game);
        setProducts(data.products ?? []);
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [gameCode]);

  if (state === "loading") {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-20 w-20 rounded-xl" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
        <Skeleton className="mt-8 h-40 w-full" />
      </div>
    );
  }

  if (state === "not-found") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-muted-foreground" />
        <p className="text-lg font-semibold">Game tidak ditemukan</p>
        <p className="text-sm text-muted-foreground">
          Game yang kamu cari mungkin belum tersedia. Coba kembali ke halaman utama.
        </p>
        <Button className="mt-2" onClick={() => router.push("/")}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  if (state === "error" || !game) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-semibold">Gagal memuat halaman</p>
        <Button variant="outline" className="mt-2" onClick={() => router.refresh()}>
          Coba Lagi
        </Button>
      </div>
    );
  }

  const needsServerId = game.idFieldType === "user-id-server-id";
  const idFilled = game.idFieldType === "none" || (userId.trim().length >= 3 && (!needsServerId || serverId.trim().length >= 1));
  const canSubmit = Boolean(selectedProduct) && idFilled && !submitting;

  async function handleSubmit() {
    if (!selectedProduct || !game) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameCode: game.code,
          productCode: selectedProduct.code,
          accountUserId: userId,
          accountServerId: needsServerId ? serverId : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal membuat pesanan.");
        return;
      }
      router.push(`/checkout/${data.transaction.id}`);
    } catch {
      toast.error("Gagal membuat pesanan. Periksa koneksi kamu.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <div className="flex items-center gap-4">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
          <Image src={game.logoUrl} alt={game.name} fill className="object-cover" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">{game.name}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{game.description}</p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <section>
            <h2 className="mb-3 font-semibold">1. Pilih Nominal</h2>
            <ProductList
              products={products}
              selectedCode={selectedProduct?.code ?? null}
              onSelect={setSelectedProduct}
            />
          </section>

          {game.idFieldType !== "none" && (
            <section>
              <h2 className="mb-3 font-semibold">2. Masukkan Data Akun</h2>
              <AccountIdForm
                game={game}
                userId={userId}
                serverId={serverId}
                onUserIdChange={setUserId}
                onServerIdChange={setServerId}
              />
            </section>
          )}
        </div>

        <div className="space-y-4">
          <OrderSummary
            gameName={game.name}
            productName={selectedProduct?.name ?? "Belum dipilih"}
            price={selectedProduct?.price ?? 0}
            rows={
              game.idFieldType !== "none"
                ? [
                    {
                      label: game.userIdLabel,
                      value: userId || "-",
                    },
                    ...(needsServerId
                      ? [{ label: game.serverIdLabel ?? "Server ID", value: serverId || "-" }]
                      : []),
                  ]
                : []
            }
          />
          <Button size="lg" className="w-full gap-2" disabled={!canSubmit} onClick={handleSubmit}>
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Lanjut ke Pembayaran
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
