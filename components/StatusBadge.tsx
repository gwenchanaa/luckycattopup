import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types/transaction";

const STATUS_CONFIG: Record<TransactionStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: {
    label: "Menunggu Pembayaran",
    className: "bg-amber-100 text-amber-800 border-amber-200",
  },
  PAID: {
    label: "Pembayaran Diterima",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  PROCESSING: {
    label: "Diproses",
    className: "bg-sky-100 text-sky-800 border-sky-200",
  },
  SUCCESS: {
    label: "Berhasil",
    className: "bg-emerald-100 text-emerald-800 border-emerald-200",
  },
  FAILED: {
    label: "Gagal",
    className: "bg-red-100 text-red-800 border-red-200",
  },
  EXPIRED: {
    label: "Kedaluwarsa",
    className: "bg-zinc-200 text-zinc-700 border-zinc-300",
  },
};

export function StatusBadge({ status }: { status: TransactionStatus }) {
  const config = STATUS_CONFIG[status];
  return (
    <Badge variant="outline" className={cn("font-medium", config.className)}>
      {config.label}
    </Badge>
  );
}
