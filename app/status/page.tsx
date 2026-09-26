"use client";

import { useState, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
      <div className="mb-1.5 flex items-center gap-3">
        <Image
          src="/cat-face.png"
          alt=""
          width={34}
          height={34}
          className="size-[34px] rounded-[9px] bg-sakura object-cover"
        />
        <h1 className="font-display text-[26px] font-extrabold leading-none text-ink">
          Cek pesanan
        </h1>
        <span className="pt-1.5 text-xs text-[#a99a92]">Track your order</span>
      </div>

      <p className="mb-3.5 text-[12.5px] leading-[1.6] text-[#6b5c55]">
        Tanpa login. Masukkan Order ID yang kamu dapat setelah checkout.
      </p>

      <form onSubmit={handleSubmit} className="flex max-w-[520px] gap-2.5">
        <input
          id="transactionId"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          placeholder="TX-AB12CD34EF56"
          aria-label="Order ID"
          autoFocus
          className="ink-thin min-w-0 flex-1 rounded-[11px] bg-card px-3.5 py-3 font-mono text-[13.5px] font-bold uppercase text-ink outline-none placeholder:font-normal placeholder:text-[#c3b4ac] focus:ring-2 focus:ring-bell/30"
        />
        <button
          type="submit"
          className="press shrink-0 rounded-[11px] bg-bell px-6 py-3 text-[13px] font-bold text-white"
        >
          Lacak
        </button>
      </form>

      {error ? (
        <p className="mt-2.5 text-[11.5px] font-bold text-bell">{error}</p>
      ) : (
        <p className="mt-2.5 text-[11.5px] text-[#a99a92]">Contoh: TX-AB12CD34EF56</p>
      )}
    </div>
  );
}
