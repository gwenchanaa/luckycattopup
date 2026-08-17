export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground sm:px-6">
        <p className="font-medium text-foreground">LuckyCat Topup</p>
        <p className="mt-1">
          Top up game cepat, aman, tanpa perlu daftar akun. Transaksi kamu cukup dilacak lewat
          Transaction ID.
        </p>
        <p className="mt-4">© {new Date().getFullYear()} LuckyCat Topup. Semua hak dilindungi.</p>
      </div>
    </footer>
  );
}
