import { cn } from "@/lib/utils";
import type { Transaction, TransactionStatus } from "@/types/transaction";

const NODES = [
  { key: "created", label: "Pesanan dibuat" },
  { key: "paid", label: "Pembayaran diterima" },
  { key: "processing", label: "Diproses ke publisher" },
  { key: "delivered", label: "Item terkirim" },
] as const;

// How many of the four nodes this status has cleared.
const REACHED: Record<TransactionStatus, number> = {
  PENDING_PAYMENT: 1,
  PAID: 2,
  PROCESSING: 3,
  SUCCESS: 4,
  FAILED: 1,
  EXPIRED: 1,
};

function formatTime(iso: string) {
  return new Intl.DateTimeFormat("id-ID", { timeStyle: "medium" }).format(new Date(iso));
}

export function OrderTimeline({ transaction }: { transaction: Transaction }) {
  const reached = REACHED[transaction.status];
  const halted = transaction.status === "FAILED" || transaction.status === "EXPIRED";

  return (
    <div className="grid grid-cols-4 items-start px-2 pb-2 pt-5">
      {NODES.map((node, i) => {
        const done = i < reached;
        const isLast = i === NODES.length - 1;
        const final = isLast && done;
        // Only the segment between two cleared nodes is drawn in green.
        const lineBefore = i > 0 && i < reached;
        const lineAfter = i < reached - 1;

        return (
          <div key={node.key} className="relative flex flex-col items-center text-center">
            {i > 0 && (
              <span
                className={cn(
                  "absolute right-1/2 top-[13px] left-[-50%] h-[2.5px]",
                  lineBefore ? "bg-collar" : "bg-[#e3d3cb]"
                )}
              />
            )}
            {!isLast && (
              <span
                className={cn(
                  "absolute left-1/2 top-[13px] right-[-50%] h-[2.5px]",
                  lineAfter ? "bg-collar" : "bg-[#e3d3cb]"
                )}
              />
            )}

            <span
              className={cn(
                "relative z-10 flex size-7 items-center justify-center rounded-full text-xs font-bold",
                final
                  ? "bg-ink text-koban shadow-[0_0_0_5px_rgba(47,39,35,0.1)]"
                  : done
                    ? "bg-collar text-white"
                    : halted
                      ? "border-2 border-[#e3d3cb] bg-card text-[#c3b4ac]"
                      : "border-2 border-[#e3d3cb] bg-card text-[#c3b4ac]"
              )}
            >
              {final ? "福" : done ? "✓" : i + 1}
            </span>

            <span
              className={cn(
                "mt-2 px-1 text-[11px] font-bold leading-tight sm:text-[12.5px]",
                done ? "text-ink" : "text-[#a99a92]"
              )}
            >
              {node.label}
            </span>

            {i === 0 && (
              <span className="text-[10px] text-[#a99a92] sm:text-[11px]">
                {formatTime(transaction.createdAt)}
              </span>
            )}
            {isLast && transaction.status === "SUCCESS" && (
              <span className="text-[10px] text-[#a99a92] sm:text-[11px]">
                {formatTime(transaction.updatedAt)}
              </span>
            )}
            {i === 1 && transaction.paymentMethod && reached >= 2 && (
              <span className="truncate px-1 text-[10px] text-[#a99a92] sm:text-[11px]">
                {transaction.paymentMethod}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
