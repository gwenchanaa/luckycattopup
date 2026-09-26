"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatusCard } from "@/components/TransactionStatusCard";
import type { Transaction, TransactionStatus } from "@/types/transaction";

const HEADLINE: Record<TransactionStatus, { chip: string; title: string; blurb: string }> = {
  PENDING_PAYMENT: {
    chip: "MENUNGGU PEMBAYARAN",
    title: "Pesanan sudah dibuat.",
    blurb: "Selesaikan pembayaran supaya item langsung kami proses.",
  },
  PAID: {
    chip: "✓ PEMBAYARAN DITERIMA",
    title: "Hoki! Pembayaran masuk.",
    blurb: "Pesananmu sedang diteruskan ke publisher. Biasanya selesai dalam hitungan menit.",
  },
  PROCESSING: {
    chip: "DIPROSES",
    title: "Lagi diproses, ya.",
    blurb: "Pesananmu sedang antre di publisher. Halaman status akan ikut diperbarui.",
  },
  SUCCESS: {
    chip: "✓ TERKIRIM",
    title: "Hoki! Top up berhasil.",
    blurb: "Item sudah masuk ke akunmu. Restart game kalau belum kelihatan.",
  },
  FAILED: {
    chip: "GAGAL",
    title: "Yah, pesanan gagal.",
    blurb: "Dana yang sudah masuk akan kami kembalikan. Hubungi kami dengan Order ID kamu.",
  },
  EXPIRED: {
    chip: "KEDALUWARSA",
    title: "Waktu bayar sudah lewat.",
    blurb: "Tenang, buat pesanan baru gratis — harga akan dihitung ulang.",
  },
};

export function SuccessClient({ transactionId }: { transactionId: string }) {
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/transaction/${transactionId}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setError(true);
          return;
        }
        if (!cancelled) setTransaction(data.transaction);
      } catch {
        if (!cancelled) setError(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [transactionId]);

  if (error) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <Image src="/cat-face.png" alt="" width={72} height={72} className="size-[72px] opacity-85" />
        <p className="font-display text-lg font-extrabold text-ink">Transaksi tidak ditemukan</p>
        <Link
          href="/"
          className="ink drop-ink-sm press mt-1 rounded-full bg-bell px-5 py-2.5 font-display text-[13px] font-bold text-background"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  const copy = transaction ? HEADLINE[transaction.status] : null;
  const coins = transaction ? Math.floor(transaction.price / 10_000) : 0;

  return (
    <div>
      <div className="sakura-dots relative overflow-hidden border-b-2 border-ink">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 py-6 text-center sm:px-6 sm:flex-row sm:text-left">
          <Image
            src="/cat-full.png"
            alt=""
            width={148}
            height={201}
            priority
            className="animate-bob h-auto w-[120px] shrink-0 sm:w-[148px]"
          />
          <div className="min-w-0 flex-1">
            {copy ? (
              <>
                <span className="inline-flex items-center rounded-full bg-collar px-3 py-1.5 text-[11px] font-bold text-white">
                  {copy.chip}
                </span>
                <h1 className="mb-1.5 mt-2.5 font-display text-[30px] font-extrabold leading-[1.05] text-ink sm:text-[38px]">
                  {copy.title}
                </h1>
                <p className="text-[13.5px] font-medium leading-[1.6] text-hero-ink">
                  {copy.blurb}
                  <br />
                  <span className="text-xs text-hero-ink/70">
                    Simpan Order ID di bawah — tanpa akun, selamanya.
                  </span>
                </p>
              </>
            ) : (
              <div className="space-y-2">
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-9 w-72" />
                <Skeleton className="h-4 w-full max-w-sm" />
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-4xl items-start gap-4 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_236px]">
        {transaction ? (
          <TransactionStatusCard transaction={transaction} />
        ) : (
          <Skeleton className="h-80 w-full rounded-[18px]" />
        )}

        <div className="flex flex-col gap-3">
          {coins > 0 && (
            <div className="ink drop-ink relative overflow-hidden rounded-[18px] bg-koban p-4">
              <div className="animate-shine absolute inset-y-0 left-0 w-[70px] bg-gradient-to-r from-transparent via-white/70 to-transparent" />
              <div className="relative mb-2 flex items-center gap-2.5">
                <span className="ink flex size-[30px] items-center justify-center rounded-full bg-koban-pale text-[13px] font-bold text-[#6b4a16]">
                  福
                </span>
                <span className="font-display text-[15px] font-extrabold text-ink">
                  +{coins} Koin Hoki
                </span>
              </div>
              <p className="relative text-[11.5px] font-medium leading-[1.5] text-[#6b4a16]">
                Koin nempel di nomor WhatsApp kamu. Kumpulkan 30 koin untuk voucher Rp 25.000.
              </p>
            </div>
          )}

          <div className="rounded-[18px] border-[1.5px] border-[#e3d3cb] bg-card p-4">
            <div className="mb-2 font-display text-[12.5px] font-bold text-ink">
              Item belum masuk?
            </div>
            <p className="mb-2.5 text-[11.5px] leading-[1.55] text-[#8c7d75]">
              Restart game dulu. Kalau 10 menit masih kosong, kirim Order ID ke kami — refund atau
              kirim ulang.
            </p>
            <Link
              href={`/status/${transactionId}`}
              className="block w-full rounded-[9px] bg-ink px-4 py-2.5 text-center text-xs font-bold text-background"
            >
              Lacak pesanan ini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
