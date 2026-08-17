"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function StatusLookupPage() {
  const router = useRouter();
  const [transactionId, setTransactionId] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = transactionId.trim().toUpperCase();
    if (!/^TX-[A-Z0-9]{12}$/.test(trimmed)) {
      setError("Format Transaction ID tidak valid. Contoh: TX-AB12CD34EF56");
      return;
    }
    setError(null);
    router.push(`/status/${trimmed}`);
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16 sm:px-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold">Cek Status Transaksi</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Masukkan Transaction ID yang kamu dapat setelah checkout.
        </p>
      </div>

      <Card className="mt-6">
        <CardContent className="p-5 sm:p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="transactionId">Transaction ID</Label>
              <Input
                id="transactionId"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                placeholder="TX-AB12CD34EF56"
                className="font-mono uppercase"
                autoFocus
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
            <Button type="submit" size="lg" className="w-full gap-2">
              <Search className="h-4 w-4" />
              Cek Status
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
