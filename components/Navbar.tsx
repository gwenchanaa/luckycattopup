"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "Beranda", match: (p: string) => p === "/" },
  { href: "/#games", label: "Semua Game", match: () => false },
  { href: "/status", label: "Cek Pesanan", match: (p: string) => p.startsWith("/status") },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b-[1.5px] border-sakura-line bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-[74px] max-w-6xl items-center gap-4 px-4 sm:gap-6 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3">
          <Image
            src="/cat-face.png"
            alt="Lucky Cat"
            width={46}
            height={46}
            priority
            className="ink drop-ink-sm size-[42px] rounded-full bg-sakura object-cover sm:size-[46px]"
          />
          <span className="flex flex-col leading-none">
            <span className="font-display text-[19px] font-extrabold text-ink">Lucky Cat</span>
            <span className="mt-1 text-[9px] font-bold tracking-[0.24em] text-bell">
              TOP UP · 招福
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-[13.5px] font-medium md:flex">
          {NAV.map((item) => {
            const active = item.match(pathname);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "pb-[3px] transition-colors",
                  active
                    ? "border-b-[2.5px] border-bell font-bold text-ink"
                    : "text-[#5c4e48] hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex-1" />

        <div className="hidden items-center gap-2 rounded-full border-[1.5px] border-sakura-line bg-card px-3 py-2 text-xs font-medium text-[#6b5c55] lg:flex">
          <span className="size-[7px] rounded-full bg-collar shadow-[0_0_0_3px_rgba(121,156,89,0.22)]" />
          Semua server normal
        </div>

        <Link
          href="/status"
          className="ink drop-ink-sm press rounded-full bg-bell px-4 py-2.5 font-display text-[13px] font-bold text-background"
        >
          Lacak Pesanan
        </Link>
      </div>
    </header>
  );
}
