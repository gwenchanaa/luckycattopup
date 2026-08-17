"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AlertTriangle, Loader2, RefreshCw, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionStatusCard } from "@/components/TransactionStatusCard";
import type { Transaction } from "@/types/transaction";

type LoadState = "loading" | "not-found" | "error" | "ready";

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

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-bold">Status Transaksi</h1>
      </div>

      {state === "loading" && <Skeleton className="h-80 w-full" />}

      {state === "not-found" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-muted-foreground" />
          <p className="font-medium">Transaction ID tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">Periksa kembali ID yang kamu masukkan.</p>
          <Button asChild variant="outline" className="mt-2 gap-2">
            <Link href="/status">
              <Search className="h-4 w-4" />
              Cari Lagi
            </Link>
          </Button>
        </div>
      )}

      {state === "error" && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-destructive/40 py-16 text-center">
          <AlertTriangle className="h-10 w-10 text-destructive" />
          <p className="font-medium">Gagal memuat status</p>
          <Button variant="outline" onClick={load} className="mt-2 gap-2">
            <RefreshCw className="h-4 w-4" />
            Coba Lagi
          </Button>
        </div>
      )}

      {state === "ready" && transaction && (
        <div className="space-y-4">
          <TransactionStatusCard transaction={transaction} />
          {transaction.status === "PROCESSING" && (
            <Button
              variant="outline"
              className="w-full gap-2"
              disabled={syncing}
              onClick={handleSync}
            >
              {syncing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              Sync Ulang
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
