const STEPS = [
  {
    n: 1,
    tone: "bg-bell text-white",
    title: "Isi User ID",
    description: "Nickname kamu langsung kami cek — tanpa login, tanpa password.",
  },
  {
    n: 2,
    tone: "bg-koban text-ink",
    title: "Bayar QRIS / e-wallet",
    description: "QRIS, GoPay, OVO, DANA, ShopeePay, atau VA bank.",
  },
  {
    n: 3,
    tone: "bg-collar text-white",
    title: "Item masuk otomatis",
    description: "Rata-rata 48 detik. Resi dikirim ke WhatsApp.",
  },
];

export function FeatureSection() {
  return (
    <section className="mx-auto grid max-w-6xl gap-5 px-4 py-8 sm:px-6 md:grid-cols-3">
      {STEPS.map((step) => (
        <div
          key={step.n}
          className="flex items-start gap-3.5 rounded-2xl border-[1.5px] border-sakura-line bg-sakura-soft px-4 py-4"
        >
          <span
            className={`ink flex size-[34px] shrink-0 items-center justify-center rounded-full font-display text-base font-extrabold ${step.tone}`}
          >
            {step.n}
          </span>
          <div>
            <div className="font-display text-sm font-bold text-ink">{step.title}</div>
            <div className="mt-0.5 text-[11.5px] leading-[1.5] text-[#6b5c55]">
              {step.description}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}
