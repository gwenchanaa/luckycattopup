"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderSummary } from "@/components/OrderSummary";
import { StatusBadge } from "@/components/StatusBadge";
import type { Transaction } from "@/types/transaction";

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        options: {
          onSuccess?: () => void;
          onPending?: () => void;
          onError?: () => void;
          onClose?: () => void;
        }
      ) => void;
    };
  }
}

const SNAP_SRC =
  process.env.NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION === "true"
    ? "https://app.midtrans.com/snap/snap.js"
    : "https://app.sandbox.midtrans.com/snap/snap.js";

type LoadState = "loading" | "error" | "ready" | "not-pending";

const STEPS = [
  "Tekan tombol bayar — jendela pembayaran Midtrans akan terbuka.",
  "Pilih QRIS, e-wallet (GoPay, OVO, DANA, ShopeePay), atau VA bank.",
  "Pastikan nama merchant Lucky Cat Top Up dan nominal sesuai struk.",
  "Selesaikan pembayaran — halaman ini otomatis berpindah.",
];

function Countdown({ expiredAt }: { expiredAt: string }) {
  const [left, setLeft] = useState(() => Date.parse(expiredAt) - Date.now());

  useEffect(() => {
    const id = setInterval(() => setLeft(Date.parse(expiredAt) - Date.now()), 1000);
    return () => clearInterval(id);
  }, [expiredAt]);

  const expired = left <= 0;
  const total = Math.max(0, Math.floor(left / 1000));
  const mm = String(Math.floor(total / 60)).padStart(2, "0");
  const ss = String(total % 60).padStart(2, "0");

  return (
    <span className="flex items-center gap-2 rounded-full border border-[#f3cfc9] bg-sakura-soft px-3.5 py-1.5">
      <span className="animate-halo size-[7px] rounded-full bg-bell" />
      <span className="text-[12.5px] font-bold text-bell">
        {expired ? "Waktu pembayaran habis" : `Bayar dalam ${mm}:${ss}`}
      </span>
    </span>
  );
}

export function CheckoutClient({ transactionId }: { transactionId: string }) {
  const router = useRouter();
  const [state, setState] = useState<LoadState>("loading");
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [snapToken, setSnapToken] = useState<string | null>(null);
  const [mock, setMock] = useState(false);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(`/api/transaction/${transactionId}`);
        const data = await res.json();
        if (!res.ok) {
          if (!cancelled) setState("error");
          return;
        }
        if (data.transaction.status !== "PENDING_PAYMENT") {
          if (!cancelled) {
            setTransaction(data.transaction);
            setState("not-pending");
          }
          return;
        }
        if (cancelled) return;
        setTransaction(data.transaction);

        const payRes = await fetch("/api/payment/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ transactionId }),
        });
        const payData = await payRes.json();
        if (!payRes.ok) {
          if (!cancelled) setState("error");
          return;
        }
        if (cancelled) return;
        setSnapToken(payData.token);
        setMock(Boolean(payData.mock));
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [transactionId]);

  function goToSuccess() {
    router.push(`/order/success/${transactionId}`);
  }

  async function handleMockPay() {
    if (!transaction) return;
    setPaying(true);
    try {
      const res = await fetch("/api/payment/webhook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: transaction.midtransOrderId ?? transaction.id,
          status_code: "200",
          gross_amount: String(transaction.price),
          signature_key: "mock",
          transaction_status: "settlement",
          fraud_status: "accept",
          payment_type: "mock_qris",
        }),
      });
      if (!res.ok) {
        toast.error("Gagal mensimulasikan pembayaran.");
        return;
      }
      goToSuccess();
    } catch {
      toast.error("Gagal mensimulasikan pembayaran.");
    } finally {
      setPaying(false);
    }
  }

  function handleRealPay() {
    if (!snapToken || !window.snap) return;
    setPaying(true);
    window.snap.pay(snapToken, {
      onSuccess: goToSuccess,
      onPending: goToSuccess,
      onError: () => {
        toast.error("Pembayaran gagal. Silakan coba lagi.");
        setPaying(false);
      },
      onClose: () => setPaying(false),
    });
  }

  if (state === "loading") {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <Skeleton className="h-14 w-full rounded-2xl" />
        <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_300px]">
          <Skeleton className="h-72 w-full rounded-2xl" />
          <Skeleton className="h-60 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <Image src="/cat-face.png" alt="" width={72} height={72} className="size-[72px] opacity-85" />
        <p className="font-display text-lg font-extrabold text-ink">Gagal memuat checkout</p>
        <p className="text-[12.5px] text-[#8c7d75]">
          Transaksi tidak ditemukan atau terjadi kesalahan.
        </p>
        <Link
          href="/"
          className="ink drop-ink-sm press mt-1 rounded-full bg-bell px-5 py-2.5 font-display text-[13px] font-bold text-background"
        >
          Kembali ke Beranda
        </Link>
      </div>
    );
  }

  if (state === "not-pending" && transaction) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-20 text-center">
        <Image src="/cat-face.png" alt="" width={72} height={72} className="size-[72px] opacity-85" />
        <StatusBadge status={transaction.status} />
        <p className="font-display text-lg font-extrabold text-ink">
          Transaksi ini sudah tidak menunggu pembayaran
        </p>
        <Link
          href={`/status/${transactionId}`}
          className="ink drop-ink-sm press mt-1 rounded-full bg-bell px-5 py-2.5 font-display text-[13px] font-bold text-background"
        >
          Lihat Status Transaksi
        </Link>
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <div>
      {!mock && (
        <Script src={SNAP_SRC} data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} />
      )}

      <div className="flex flex-wrap items-center gap-x-3.5 gap-y-2 border-b border-[#ede4dc] bg-card px-4 py-3.5 sm:px-6">
        <Image
          src="/cat-face.png"
          alt=""
          width={30}
          height={30}
          className="size-[30px] rounded-lg bg-sakura object-cover"
        />
        <span className="font-display text-[15px] font-bold text-ink">Pembayaran</span>
        <span className="font-mono text-xs text-[#a99a92]">Order {transaction.id}</span>
        <div className="ml-auto">
          {transaction.expiredAt && <Countdown expiredAt={transaction.expiredAt} />}
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl items-start gap-5 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_300px]">
        <div className="flex flex-col gap-3">
          <div className="text-[13px] font-bold tracking-[0.06em] text-[#6b5c55]">
            CARA MENYELESAIKAN PEMBAYARAN
          </div>

          <div className="ink drop-ink rounded-[20px] bg-card p-4 sm:p-5">
            <ol className="m-0 list-decimal space-y-1.5 pl-5 text-[12.5px] leading-[1.85] text-[#6b5c55] marker:font-bold marker:text-ink">
              {STEPS.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>

            <div className="mt-3.5 flex items-center gap-2.5 rounded-xl border-[1.5px] border-collar-line bg-collar-soft px-3 py-2.5">
              <span className="animate-halo size-2 shrink-0 rounded-full bg-collar" />
              <span className="text-xs font-medium text-collar-ink">
                Menunggu pembayaran — status pesanan diperbarui otomatis, tak perlu refresh.
              </span>
            </div>

            <button
              type="button"
              disabled={paying}
              onClick={mock ? handleMockPay : handleRealPay}
              className="ink drop-ink press mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-koban px-6 py-3.5 font-display text-[15px] font-extrabold text-ink disabled:cursor-not-allowed disabled:opacity-50"
            >
              {paying ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              {mock ? "Simulasikan Pembayaran Berhasil" : "Bayar sekarang 🐾"}
            </button>

            {mock && (
              <p className="mt-2.5 text-center text-[11px] leading-relaxed text-[#8c7d75]">
                Mode simulasi aktif — belum terhubung ke Midtrans asli. Tombol ini langsung menandai
                pembayaran sebagai berhasil untuk keperluan demo.
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2.5 text-[11.5px] font-medium text-[#6b5c55]">
            <span className="rounded-full border-[1.5px] border-sakura-line bg-sakura-soft px-3 py-1.5">
              ⟡ Distributor resmi
            </span>
            <span className="rounded-full border-[1.5px] border-sakura-line bg-sakura-soft px-3 py-1.5">
              ⟡ Refund kalau item gagal masuk
            </span>
            <span className="rounded-full border-[1.5px] border-sakura-line bg-sakura-soft px-3 py-1.5">
              ⟡ Tanpa akun, cukup simpan Order ID
            </span>
          </div>
        </div>

        <OrderSummary
          title="STRUK PESANAN"
          gameName={transaction.gameName}
          productName={transaction.productName}
          price={transaction.price}
          rows={[
            { label: "User ID", value: transaction.accountUserId },
            ...(transaction.accountServerId
              ? [{ label: "Server ID", value: transaction.accountServerId }]
              : []),
          ]}
        />
      </div>
    </div>
  );
}
