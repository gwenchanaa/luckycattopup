import Link from "next/link";
import { PawPrint } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <PawPrint className="h-5 w-5" />
          </span>
          LuckyCat Topup
        </Link>
        <nav className="flex items-center gap-4 text-sm font-medium">
          <Link href="/status" className="text-foreground/80 transition-colors hover:text-foreground">
            Cek Status Transaksi
          </Link>
        </nav>
      </div>
    </header>
  );
}
