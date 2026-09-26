"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Search } from "lucide-react";

const TRUST = ["Proses instan 24/7", "1,4 juta pesanan", "Harga resmi distributor"];

export function HeroSection() {
  const router = useRouter();
  const [query, setQuery] = useState("");

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/?q=${encodeURIComponent(q)}#games` : "/#games");
  }

  return (
    <section className="sakura-dots relative overflow-hidden">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-4 py-12 sm:px-6 md:flex-row md:gap-5 md:py-14">
        <div className="min-w-0 flex-1">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink px-3.5 py-1.5 text-[11px] font-bold tracking-[0.06em] text-koban-pale">
            TANPA DAFTAR · NO SIGN-UP
          </span>

          <h1 className="mt-3.5 mb-2 text-balance font-display text-[42px] font-extrabold leading-[1.02] tracking-[-0.02em] text-ink sm:text-[54px] lg:text-[62px]">
            Top up kilat,
            <br />
            hoki tiap hari.
          </h1>

          <p className="mb-5 max-w-[430px] text-[15px] font-medium leading-[1.6] text-hero-ink">
            Pilih game, isi User ID, bayar QRIS. Diamond masuk otomatis dalam hitungan menit.
            <br />
            <span className="text-[13px] text-hero-ink/70">
              Pick a game, enter your ID, pay. Delivered in minutes.
            </span>
          </p>

          <form
            onSubmit={handleSearch}
            className="ink flex max-w-[470px] items-center gap-2 rounded-full bg-card py-[7px] pl-[18px] pr-2 shadow-[3px_3px_0_var(--ink)]"
          >
            <Search className="size-4 shrink-0 text-[#b4a49c]" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari game, voucher, atau Order ID…"
              aria-label="Cari game"
              className="min-w-0 flex-1 bg-transparent text-sm font-medium text-ink outline-none placeholder:text-[#9c8c84]"
            />
            <button
              type="submit"
              className="ink press shrink-0 rounded-full bg-koban px-5 py-2 font-display text-[13px] font-bold text-ink"
            >
              Cari
            </button>
          </form>

          <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-[12.5px] font-medium text-hero-ink">
            {TRUST.map((item) => (
              <span key={item}>⟡ {item}</span>
            ))}
          </div>
        </div>

        <div className="relative flex size-[260px] shrink-0 items-end justify-center sm:size-[330px]">
          <div className="animate-halo absolute inset-x-4 bottom-3 top-6 rounded-full bg-white/40" />
          <Image
            src="/cat-full.png"
            alt="Maskot Lucky Cat membawa koban emas"
            width={296}
            height={403}
            priority
            className="animate-bob relative h-auto w-[230px] drop-shadow-[0_12px_14px_rgba(150,70,70,0.28)] sm:w-[296px]"
          />
          <span className="ink animate-bob absolute left-0.5 top-2 flex size-[46px] items-center justify-center rounded-full bg-koban text-[19px] font-bold text-[#6b4a16]">
            福
          </span>
          <span className="ink animate-bob absolute right-[-4px] top-24 flex size-8 items-center justify-center rounded-full bg-koban-pale text-[13px] font-bold text-[#6b4a16] [animation-duration:6.2s]">
            運
          </span>
        </div>
      </div>
    </section>
  );
}
