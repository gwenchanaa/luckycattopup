"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductList } from "@/components/ProductList";
import { AccountIdForm } from "@/components/AccountIdForm";
import { OrderSummary } from "@/components/OrderSummary";
import { formatRupiah } from "@/lib/utils";
import type { Game, Product } from "@/types/product";

type LoadState = "loading" | "not-found" | "error" | "ready";

function Fallback({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action: React.ReactNode;
}) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
      <Image src="/cat-face.png" alt="" width={72} height={72} className="size-[72px] opacity-85" />
      <p className="font-display text-lg font-extrabold text-ink">{title}</p>
      <p className="text-[12.5px] text-[#8c7d75]">{description}</p>
      <div className="mt-1">{action}</div>
    </div>
  );
}

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
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Skeleton className="h-[68px] w-full rounded-2xl" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-44 w-full rounded-2xl" />
            <Skeleton className="h-56 w-full rounded-2xl" />
          </div>
          <Skeleton className="h-64 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (state === "not-found") {
    return (
      <Fallback
        title="Game tidak ditemukan"
        description="Game yang kamu cari mungkin belum tersedia. Coba kembali ke halaman utama."
        action={
          <Link
            href="/"
            className="ink drop-ink-sm press inline-block rounded-full bg-bell px-5 py-2.5 font-display text-[13px] font-bold text-background"
          >
            Kembali ke Beranda
          </Link>
        }
      />
    );
  }

  if (state === "error" || !game) {
    return (
      <Fallback
        title="Gagal memuat halaman"
        description="Terjadi masalah saat mengambil data game ini."
        action={
          <button
            type="button"
            onClick={() => router.refresh()}
            className="ink drop-ink-sm press rounded-full bg-card px-5 py-2.5 font-display text-[13px] font-bold text-ink"
          >
            Coba Lagi
          </button>
        }
      />
    );
  }

  const needsServerId = game.idFieldType === "user-id-server-id";
  const idFilled =
    game.idFieldType === "none" ||
    (userId.trim().length >= 3 && (!needsServerId || serverId.trim().length >= 1));
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

  const summaryRows =
    game.idFieldType !== "none"
      ? [
          { label: game.userIdLabel, value: userId || "—" },
          ...(needsServerId
            ? [{ label: game.serverIdLabel ?? "Server ID", value: serverId || "—" }]
            : []),
        ]
      : [];

  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b-2 border-ink bg-sakura px-4 py-3 sm:px-6">
        <Image
          src="/cat-face.png"
          alt=""
          width={40}
          height={40}
          className="ink drop-ink-sm size-10 rounded-full bg-sakura object-cover"
        />
        <span className="font-display text-[17px] font-extrabold text-ink">Konter Top Up</span>
        <span className="text-xs font-medium text-hero-ink">
          Semua di satu halaman · tanpa daftar
        </span>
        <span className="ink ml-auto hidden rounded-full bg-card px-3.5 py-1.5 text-xs font-bold text-ink sm:block">
          ⏱ rata-rata 48 detik
        </span>
      </div>

      <div className="mx-auto max-w-6xl px-4 pb-28 pt-5 sm:px-6">
        <div className="grid items-start gap-4 lg:grid-cols-[1fr_280px]">
          <div className="flex flex-col gap-3.5">
            <div className="ink drop-ink flex items-center gap-4 rounded-[20px] bg-card p-3.5">
              <div className="cover-placeholder relative size-20 shrink-0 overflow-hidden rounded-[14px]">
                <Image src={game.logoUrl} alt={game.name} fill className="object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-display text-2xl font-extrabold leading-tight text-ink">
                  {game.name}
                </div>
                <div className="mt-0.5 truncate text-xs text-[#8c7d75]">{game.description}</div>
              </div>
              <Link
                href="/#games"
                className="ink press hidden shrink-0 rounded-full bg-koban-soft px-4 py-2.5 font-display text-[12.5px] font-bold text-ink sm:block"
              >
                Ganti game
              </Link>
            </div>

            {game.idFieldType !== "none" && (
              <div className="flex flex-col gap-3.5 sm:flex-row sm:items-stretch">
                <div className="ink drop-ink flex-1 rounded-[20px] bg-card p-4">
                  <AccountIdForm
                    game={game}
                    userId={userId}
                    serverId={serverId}
                    onUserIdChange={setUserId}
                    onServerIdChange={setServerId}
                  />
                </div>
                <div className="ink drop-ink flex w-full shrink-0 flex-col items-center gap-1.5 rounded-[20px] bg-sakura p-3.5 sm:w-[210px]">
                  <Image
                    src="/cat-full.png"
                    alt=""
                    width={118}
                    height={161}
                    className="animate-bob h-auto w-[118px]"
                  />
                  <p className="text-center text-xs font-bold leading-[1.45] text-hero-ink">
                    “ID sudah benar?
                    <br />
                    Hoki datang setelah bayar!”
                  </p>
                </div>
              </div>
            )}

            <div className="ink drop-ink rounded-[20px] bg-card p-4">
              <div className="mb-3 font-display text-[15px] font-extrabold text-ink">
                Mau berapa banyak?
              </div>
              <ProductList
                products={products}
                selectedCode={selectedProduct?.code ?? null}
                onSelect={setSelectedProduct}
              />
            </div>
          </div>

          <OrderSummary
            gameName={game.name}
            productName={selectedProduct?.name ?? "Belum dipilih"}
            price={selectedProduct?.price ?? 0}
            rows={summaryRows}
          />
        </div>
      </div>

      <div className="sticky bottom-0 z-30 px-4 pb-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl items-center gap-4 rounded-full bg-ink py-3 pl-6 pr-3 shadow-[0_8px_22px_rgba(47,39,35,0.3)]">
          <div className="min-w-0">
            <div className="truncate text-[10.5px] text-background/60">
              {selectedProduct?.name ?? "Pilih nominal dulu"}
              {userId ? ` · ${userId}` : ""}
            </div>
            <div className="font-display text-[21px] font-extrabold leading-tight text-background">
              {formatRupiah(selectedProduct?.price ?? 0)}
            </div>
          </div>
          <div className="flex-1" />
          <span className="hidden text-[11.5px] font-medium text-background/65 lg:block">
            Harga terkunci 10 menit
          </span>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={handleSubmit}
            className="flex shrink-0 items-center gap-2 rounded-full border-2 border-koban-pale bg-koban px-6 py-2.5 font-display text-[15px] font-extrabold text-ink transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {submitting && <Loader2 className="size-4 animate-spin" />}
            Bayar sekarang
            <ArrowRight className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
