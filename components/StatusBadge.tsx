import { cn } from "@/lib/utils";
import type { TransactionStatus } from "@/types/transaction";

const STATUS_CONFIG: Record<TransactionStatus, { label: string; className: string }> = {
  PENDING_PAYMENT: {
    label: "Menunggu bayar",
    className: "bg-sakura-soft text-bell border-[#f3cfc9]",
  },
  PAID: {
    label: "Pembayaran diterima",
    className: "bg-koban-soft text-[#6b4a16] border-koban-line",
  },
  PROCESSING: {
    label: "Diproses",
    className: "bg-koban-soft text-[#6b4a16] border-koban-line",
  },
  SUCCESS: {
    label: "Selesai",
    className: "bg-collar text-white border-collar",
  },
  FAILED: {
    label: "Gagal",
    className: "bg-sakura-soft text-bell border-[#f3cfc9]",
  },
  EXPIRED: {
    label: "Kedaluwarsa",
    className: "bg-[#f1ece7] text-[#8c7d75] border-[#e3d3cb]",
  },
};

export function StatusBadge({ status, className }: { status: TransactionStatus; className?: string }) {
  const config = STATUS_CONFIG[status];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3.5 py-1.5 text-[11.5px] font-bold",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
