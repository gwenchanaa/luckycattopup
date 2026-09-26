"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusBadge } from "@/components/StatusBadge";
import { OrderTimeline } from "@/components/OrderTimeline";
import { CopyButton } from "@/components/CopyButton";
import { formatRupiah } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

type LoadState = "loading" | "not-found" | "error" | "ready";

const NOTE: Partial<Record<Transaction["status"], string>> = {
  PENDING_PAYMENT: "Pesanan menunggu pembayaran. Selesaikan sebelum waktu habis.",
  PAID: "Pembayaran diterima. Pesanan sedang diteruskan ke publisher.",
  PROCESSING: "Sedang antre di publisher. Biasanya selesai dalam hitungan menit.",
  SUCCESS: "Pesanan selesai. Restart game kalau item belum terlihat.",
  FAILED: "Pesanan gagal. Hubungi kami dengan Order ID untuk refund atau kirim ulang.",
  EXPIRED: "QR sudah lewat batas waktu. Buat pesanan baru gratis.",
};

export function StatusResultClient({ transactionId }: { transactionId: string }) {
  const [state, setState] = useState<LoadState>("loading");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [syncing, setSyncing] = useState(false);

  async function load() {
    setState("loading");
    try {
      const res = await fetch(`/api/transaction/${transactionId}`);
      if (res.status === 404) {
        setState("not-found");
        return;
      }
      if (!res.ok) {
        setState("error");
        return;
      }
      const data = await res.json();
      setTransaction(data.transaction);
      setState("ready");
    } catch {
      setState("error");
    }
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- fetch-on-mount, load() is also reused by the retry button
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionId]);

  async function handleSync() {
    setSyncing(true);
    try {
      const res = await fetch(`/api/transaction/sync/${transactionId}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Gagal sinkronisasi status.");
        return;
      }
      setTransaction(data.transaction);
      toast.success("Status berhasil diperbarui.");
    } catch {
      toast.error("Gagal sinkronisasi status.");
    } finally {
      setSyncing(false);
    }
  }

  const success = transaction?.status === "SUCCESS";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <div className="mb-4 flex items-center gap-3">
        <Image
          src="/cat-face.png"
          alt=""
          width={34}
          height={34}
          className="size-[34px] rounded-[9px] bg-sakura object-cover"
        />
        <h1 className="font-display text-[26px] font-extrabold leading-none text-ink">
          Status pesanan
        </h1>
      </div>

      {state === "loading" && <Skeleton className="h-72 w-full rounded-[18px]" />}

      {(state === "not-found" || state === "error") && (
        <div className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-ink/30 bg-sakura-soft py-14 text-center">
          <Image src="/cat-face.png" alt="" width={64} height={64} className="size-16 opacity-80" />
          <p className="font-display text-base font-bold text-ink">
            {state === "not-found" ? "Order ID tidak ditemukan" : "Gagal memuat status"}
          </p>
          <p className="max-w-xs text-[12.5px] text-[#8c7d75]">
            {state === "not-found"
              ? "Periksa kembali ID yang kamu masukkan."
              : "Terjadi masalah saat mengambil data pesanan."}
          </p>
          {state === "not-found" ? (
            <Link
              href="/status"
              className="ink drop-ink-sm press mt-1 rounded-full bg-card px-4 py-2 font-display text-[13px] font-bold text-ink"
            >
              Cari Lagi
            </Link>
          ) : (
            <button
              type="button"
              onClick={load}
              className="ink drop-ink-sm press mt-1 flex items-center gap-2 rounded-full bg-card px-4 py-2 font-display text-[13px] font-bold text-ink"
            >
              <RefreshCw className="size-4" />
              Coba Lagi
            </button>
          )}
        </div>
      )}

      {state === "ready" && transaction && (
        <div className="space-y-3.5">
          <div className="ink drop-ink overflow-hidden rounded-[18px] bg-card">
            <div className="flex items-center gap-3.5 border-b border-[#f4ede7] px-4 py-3.5">
              <span className="cover-placeholder size-[46px] shrink-0 rounded-[10px]" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14.5px] font-bold text-ink">
                  {transaction.productName} · {transaction.gameName}
                </div>
                <div className="truncate text-[11.5px] text-[#a99a92]">
                  {transaction.accountUserId}
                  {transaction.accountServerId ? ` (${transaction.accountServerId})` : ""} ·{" "}
                  {formatRupiah(transaction.price)}
                </div>
              </div>
              <StatusBadge status={transaction.status} className="shrink-0" />
            </div>

            <OrderTimeline transaction={transaction} />

            <div
              className={`mx-4 mb-4 mt-3.5 flex flex-wrap items-center gap-2.5 rounded-[10px] border px-3.5 py-3 ${
                success
                  ? "border-collar-line bg-collar-soft"
                  : "border-sakura-line bg-sakura-soft"
              }`}
            >
              <span
                className={`flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white ${
                  success ? "bg-collar" : "bg-bell"
                }`}
              >
                {success ? "✓" : "!"}
              </span>
              <span
                className={`min-w-0 flex-1 text-xs font-medium ${
                  success ? "text-collar-ink" : "text-bell"
                }`}
              >
                {NOTE[transaction.status]}
              </span>
              <CopyButton value={transaction.id} className="shrink-0" />
            </div>
          </div>

          {transaction.status === "PROCESSING" && (
            <button
              type="button"
              disabled={syncing}
              onClick={handleSync}
              className="ink drop-ink-sm press flex w-full items-center justify-center gap-2 rounded-full bg-card px-4 py-2.5 font-display text-[13px] font-bold text-ink disabled:opacity-50"
            >
              {syncing ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Sync Ulang
            </button>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <div className="flex-1 rounded-xl border border-dashed border-[#e3d3cb] bg-card px-4 py-3.5">
              <div className="mb-1 text-xs font-bold text-ink">
                Status lain yang mungkin kamu lihat
              </div>
              <div className="text-[11.5px] leading-[1.6] text-[#8c7d75]">
                <b className="text-bell">Menunggu bayar</b> · pembayaran belum masuk ·{" "}
                <b className="text-[#6b4a16]">Diproses</b> · antre di publisher ·{" "}
                <b className="text-[#8c7d75]">Kedaluwarsa</b> · lewat batas waktu, buat ulang gratis
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2.5 rounded-xl bg-ink px-4 py-3.5 sm:w-[200px]">
              <Image
                src="/cat-face.png"
                alt=""
                width={30}
                height={30}
                className="size-[30px] shrink-0 rounded-full bg-sakura object-cover"
              />
              <div className="text-[11px] leading-[1.45] text-background/75">
                Ada kendala? <b className="text-koban">Chat kami</b> dengan Order ID.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
