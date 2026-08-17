import { ShieldCheck, Zap, Clock, KeyRound } from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Proses Cepat",
    description: "Top up diproses otomatis begitu pembayaran dikonfirmasi.",
  },
  {
    icon: ShieldCheck,
    title: "Aman & Terpercaya",
    description: "Pembayaran diproses lewat Midtrans, mendukung berbagai metode.",
  },
  {
    icon: Clock,
    title: "Buka 24 Jam",
    description: "Top up kapan saja, sistem berjalan otomatis tanpa henti.",
  },
  {
    icon: KeyRound,
    title: "Tanpa Akun",
    description: "Tidak perlu daftar. Cukup simpan Transaction ID kamu.",
  },
];

export function FeatureSection() {
  return (
    <section className="bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {FEATURES.map((feature) => (
            <div key={feature.title} className="flex flex-col items-center gap-3 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/20 text-foreground">
                <feature.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="font-semibold">{feature.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
