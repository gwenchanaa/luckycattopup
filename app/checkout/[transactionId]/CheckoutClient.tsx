"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AlertTriangle, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
      <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="mt-6 h-52 w-full" />
        <Skeleton className="mt-4 h-12 w-full" />
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-semibold">Gagal memuat checkout</p>
        <p className="text-sm text-muted-foreground">
          Transaksi tidak ditemukan atau terjadi kesalahan.
        </p>
        <Button className="mt-2" onClick={() => router.push("/")}>
          Kembali ke Beranda
        </Button>
      </div>
    );
  }

  if (state === "not-pending" && transaction) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <StatusBadge status={transaction.status} />
        <p className="text-lg font-semibold">Transaksi ini sudah tidak menunggu pembayaran</p>
        <Button className="mt-2" onClick={() => router.push(`/status/${transactionId}`)}>
          Lihat Status Transaksi
        </Button>
      </div>
    );
  }

  if (!transaction) return null;

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      {!mock && (
        <Script src={SNAP_SRC} data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY} />
      )}

      <h1 className="text-2xl font-bold">Checkout</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Periksa kembali pesanan kamu sebelum melanjutkan pembayaran.
      </p>

      <div className="mt-6">
        <OrderSummary
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

      <Button
        size="lg"
        className="mt-6 w-full gap-2"
        disabled={paying}
        onClick={mock ? handleMockPay : handleRealPay}
      >
        {paying ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
        {mock ? "Simulasikan Pembayaran Berhasil" : "Bayar Sekarang"}
      </Button>

      {mock && (
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Mode simulasi aktif — belum terhubung ke Midtrans asli. Tombol ini langsung menandai
          pembayaran sebagai berhasil untuk keperluan demo.
        </p>
      )}
    </div>
  );
}
