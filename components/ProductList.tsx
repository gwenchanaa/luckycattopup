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
      <p className="rounded-xl border-2 border-dashed border-ink/30 bg-sakura-soft p-6 text-center text-[12.5px] text-[#8c7d75]">
        Belum ada produk tersedia untuk game ini.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
      {products.map((product) => {
        const selected = product.code === selectedCode;
        return (
          <button
            key={product.code}
            type="button"
            disabled={!product.isAvailable}
            onClick={() => onSelect(product)}
            className={cn(
              "relative rounded-[14px] border-2 p-2.5 text-center transition-all disabled:cursor-not-allowed disabled:opacity-45",
              selected
                ? "border-ink bg-koban shadow-[2px_2px_0_var(--ink)]"
                : "border-[#e3d3cb] bg-card hover:border-ink"
            )}
          >
            {selected && (
              <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-bell px-2 py-[3px] text-[9px] font-bold text-white">
                PILIHANMU
              </span>
            )}
            <div className="truncate font-display text-base font-extrabold text-ink">
              {product.name}
            </div>
            <div
              className={cn(
                "mt-0.5 text-[10.5px] font-medium",
                selected ? "font-bold text-[#6b4a16]" : "text-[#8c7d75]"
              )}
            >
              {formatRupiah(product.price)}
            </div>
            {!product.isAvailable && (
              <div className="mt-1 text-[10px] font-bold text-bell">Stok kosong</div>
            )}
          </button>
        );
      })}
    </div>
  );
}
