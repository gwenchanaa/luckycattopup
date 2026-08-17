import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { StatusBadge } from "@/components/StatusBadge";
import { CopyButton } from "@/components/CopyButton";
import { formatRupiah } from "@/lib/utils";
import type { Transaction } from "@/types/transaction";

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
}

export function TransactionStatusCard({ transaction }: { transaction: Transaction }) {
  return (
    <Card>
      <CardContent className="space-y-5 p-5 sm:p-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <p className="text-sm text-muted-foreground">Transaction ID</p>
          <p className="break-all font-mono text-xl font-bold tracking-wide sm:text-2xl">
            {transaction.id}
          </p>
          <CopyButton value={transaction.id} />
        </div>

        <div className="flex justify-center">
          <StatusBadge status={transaction.status} />
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Game</span>
            <span className="font-medium">{transaction.gameName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Produk</span>
            <span className="font-medium">{transaction.productName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">User ID</span>
            <span className="font-medium">
              {transaction.accountUserId}
              {transaction.accountServerId ? ` (${transaction.accountServerId})` : ""}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Total Bayar</span>
            <span className="font-semibold">{formatRupiah(transaction.price)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Waktu Transaksi</span>
            <span className="font-medium">{formatDate(transaction.createdAt)}</span>
          </div>
          {transaction.providerNote && (
            <div className="flex justify-between gap-4">
              <span className="text-muted-foreground">Catatan</span>
              <span className="text-right font-medium">{transaction.providerNote}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
