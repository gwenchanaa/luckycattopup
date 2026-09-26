import { formatRupiah } from "@/lib/utils";

interface Row {
  label: string;
  value: string;
}

export function OrderSummary({
  gameName,
  productName,
  price,
  rows = [],
  title = "STRUK SEMENTARA",
}: {
  gameName: string;
  productName: string;
  price: number;
  rows?: Row[];
  title?: string;
}) {
  // "Tiap Rp 10.000 = 1 Koin Hoki" — the loyalty rule shown on the home page.
  const coins = Math.floor(price / 10_000);

  return (
    <div className="rounded-[20px] border-2 border-dashed border-ink bg-background p-4">
      <div className="mb-3 text-[11px] font-bold tracking-[0.14em] text-bell">{title}</div>

      <div className="flex flex-col gap-2 text-xs text-[#6b5c55]">
        <div className="flex justify-between gap-3">
          <span>Game</span>
          <span className="text-right font-bold text-ink">{gameName}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Item</span>
          <span className="text-right font-bold text-ink">{productName}</span>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-3">
            <span>{row.label}</span>
            <span className="text-right font-bold text-ink">{row.value}</span>
          </div>
        ))}

        <div className="my-1 h-px bg-[#e3d3cb]" />

        <div className="flex items-baseline justify-between gap-3">
          <span className="font-bold text-ink">Total</span>
          <span className="font-display text-[21px] font-extrabold text-ink">
            {formatRupiah(price)}
          </span>
        </div>
      </div>

      {coins > 0 && (
        <div className="mt-3.5 rounded-[14px] border-[1.5px] border-koban-line bg-koban-soft p-2.5 text-[11.5px] font-medium leading-[1.5] text-[#6b4a16]">
          +{coins} Koin Hoki 福 — tiap Rp 10.000 dapat 1 koin, 30 koin jadi voucher Rp 25.000.
        </div>
      )}
    </div>
  );
}
