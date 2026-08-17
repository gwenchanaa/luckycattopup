"use client";

import { cn, formatRupiah } from "@/lib/utils";
import type { Product } from "@/types/product";

export function ProductList({
  products,
  selectedCode,
  onSelect,
}: {
  products: Product[];
  selectedCode: string | null;
  onSelect: (product: Product) => void;
}) {
  if (products.length === 0) {
    return (
      <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
        Belum ada produk tersedia untuk game ini.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {products.map((product) => {
        const selected = product.code === selectedCode;
        return (
          <button
            key={product.code}
            type="button"
            disabled={!product.isAvailable}
            onClick={() => onSelect(product)}
            className={cn(
              "rounded-xl border p-3 text-left transition-all disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "border-primary bg-primary/15 ring-2 ring-primary"
                : "border-border bg-card hover:border-primary/50 hover:bg-secondary/40"
            )}
          >
            <p className="text-sm font-semibold leading-snug">{product.name}</p>
            <p className="mt-1.5 text-sm font-bold text-foreground">
              {formatRupiah(product.price)}
            </p>
            {!product.isAvailable && (
              <p className="mt-1 text-xs text-destructive">Stok kosong</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
