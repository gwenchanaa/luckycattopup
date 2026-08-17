import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="bg-gradient-to-b from-secondary/60 to-background">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-16 text-center sm:px-6 sm:py-24">
        <span className="rounded-full bg-primary/20 px-4 py-1.5 text-sm font-medium text-foreground">
          Tanpa daftar akun, tanpa ribet
        </span>
        <h1 className="max-w-2xl text-balance text-4xl font-bold tracking-tight sm:text-5xl">
          Top Up Game Favoritmu, Selesai dalam Hitungan Menit
        </h1>
        <p className="max-w-xl text-balance text-muted-foreground sm:text-lg">
          Pilih game, isi ID akun, bayar — selesai. Lacak transaksimu kapan saja cukup dengan
          Transaction ID, tanpa perlu login.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="gap-2 text-base">
            <a href="#games">
              Top Up Sekarang
              <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2 text-base">
            <Link href="/status">
              <Search className="h-4 w-4" />
              Cek Status Transaksi
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
