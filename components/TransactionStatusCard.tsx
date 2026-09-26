import Link from "next/link";
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="shrink-0">{label}</span>
      <span className="text-right font-bold text-ink">{value}</span>
    </div>
  );
}

export function TransactionStatusCard({ transaction }: { transaction: Transaction }) {
  const done = transaction.status === "SUCCESS";

  return (
    <div className="ink drop-ink overflow-hidden rounded-[18px] bg-card">
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-2 border-b border-dashed border-[#e3d3cb] px-4 py-3.5">
        <span className="font-display text-[13px] font-bold text-ink">Struk pesanan</span>
        <StatusBadge status={transaction.status} className="ml-auto" />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 border-b border-dashed border-[#e3d3cb] bg-background px-4 py-3">
        <span className="min-w-0 break-all font-mono text-[13px] font-bold text-ink">
          {transaction.id}
        </span>
        <CopyButton value={transaction.id} className="ml-auto" />
      </div>

      <div className="flex flex-col gap-2.5 px-4 py-4 text-[12.5px] text-[#6b5c55]">
        <Row label="Game" value={transaction.gameName} />
        <Row label="Item" value={transaction.productName} />
        <Row
          label="Tujuan"
          value={`${transaction.accountUserId}${
            transaction.accountServerId ? ` (${transaction.accountServerId})` : ""
          }`}
        />
        {transaction.paymentMethod && <Row label="Metode" value={transaction.paymentMethod} />}
        <Row label="Waktu pesan" value={formatDate(transaction.createdAt)} />
        {done && <Row label="Waktu kirim" value={formatDate(transaction.updatedAt)} />}
        {transaction.providerNote && <Row label="Catatan" value={transaction.providerNote} />}

        <div className="my-0.5 h-px bg-[#f0e6dc]" />

        <div className="flex items-baseline justify-between gap-4">
          <span className="font-bold text-ink">Total dibayar</span>
          <span className="font-display text-xl font-extrabold text-ink">
            {formatRupiah(transaction.price)}
          </span>
        </div>
      </div>

      <div className="flex gap-2.5 px-4 pb-4">
        <Link
          href="/#games"
          className="ink drop-ink-sm press flex-1 rounded-full bg-koban px-4 py-2.5 text-center font-display text-[13px] font-bold text-ink"
        >
          Top up lagi
        </Link>
        <Link
          href={`/status/${transaction.id}`}
          className="ink press flex-1 rounded-full bg-card px-4 py-2.5 text-center font-display text-[13px] font-bold text-ink"
        >
          Lacak pesanan
        </Link>
      </div>
    </div>
  );
}
