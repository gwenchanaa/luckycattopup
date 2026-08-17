"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatusCard } from "@/components/TransactionStatusCard";
import type { Transaction } from "@/types/transaction";

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
      <div className="mx-auto flex max-w-md flex-col items-center gap-3 px-4 py-24 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="text-lg font-semibold">Transaksi tidak ditemukan</p>
        <Button asChild className="mt-2">
          <Link href="/">Kembali ke Beranda</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="h-12 w-12 text-emerald-500" />
        <h1 className="text-2xl font-bold">Pesanan Dibuat!</h1>
        <p className="text-sm text-muted-foreground">
          Simpan Transaction ID ini untuk mengecek status transaksi kamu kapan saja.
        </p>
      </div>

      <div className="mt-6">
        {transaction ? (
          <TransactionStatusCard transaction={transaction} />
        ) : (
          <Skeleton className="h-72 w-full" />
        )}
      </div>

      <Button asChild size="lg" variant="outline" className="mt-6 w-full gap-2">
        <Link href={`/status/${transactionId}`}>
          <Search className="h-4 w-4" />
          Cek Status Transaksi
        </Link>
      </Button>
    </div>
  );
}
