export function LuckyCoinBar() {
  return (
    <div className="relative flex items-center gap-4 overflow-hidden border-y-2 border-ink bg-koban px-4 py-2.5 sm:px-6">
      <div className="animate-shine absolute inset-y-0 left-0 w-[90px] bg-gradient-to-r from-transparent via-white/65 to-transparent" />
      <div className="relative flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-sm font-bold text-ink">
          Tiap Rp 10.000 = 1 Koin Hoki
        </span>
        <span className="text-xs font-medium text-[#6b4a16]">
          Tukar 30 koin jadi voucher Rp 25.000 · no account needed, koin nempel di nomor WhatsApp
          kamu
        </span>
      </div>
      <div className="relative ml-auto hidden shrink-0 sm:flex">
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className="ink flex size-[26px] items-center justify-center rounded-full bg-koban-pale text-[11px] font-bold text-[#6b4a16]"
            style={{ marginLeft: i === 0 ? 0 : -8 }}
          >
            福
          </span>
        ))}
      </div>
    </div>
  );
}
