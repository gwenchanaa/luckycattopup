import { Separator } from "@/components/ui/separator";
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
}: {
  gameName: string;
  productName: string;
  price: number;
  rows?: Row[];
}) {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <h3 className="font-semibold">Ringkasan Pesanan</h3>
      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-muted-foreground">Game</span>
          <span className="font-medium">{gameName}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Produk</span>
          <span className="font-medium">{productName}</span>
        </div>
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between">
            <span className="text-muted-foreground">{row.label}</span>
            <span className="font-medium">{row.value}</span>
          </div>
        ))}
      </div>
      <Separator className="my-3" />
      <div className="flex justify-between text-base font-bold">
        <span>Total</span>
        <span>{formatRupiah(price)}</span>
      </div>
    </div>
  );
}
