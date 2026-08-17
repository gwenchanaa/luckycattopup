# LuckyCat Topup

Website top up game tanpa login/daftar akun. User memilih game, membayar lewat Midtrans, lalu
melacak pesanannya lewat **Transaction ID** unik — tidak ada akun, tidak ada password.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS v4 + shadcn/ui
- Midtrans Snap untuk pembayaran
- VIP-Reseller (`game-feature` API) untuk data produk & proses top up
- Supabase (Postgres) untuk menyimpan transaksi

## Menjalankan secara lokal

```bash
pnpm install
pnpm dev
```

Buka [http://localhost:3000](http://localhost:3000).

### Mode Mock (default, tanpa API key apa pun)

Selama `VIP_RESELLER_API_ID`, `MIDTRANS_SERVER_KEY`, atau `SUPABASE_URL` belum diisi di `.env.local`,
komponen yang bersangkutan otomatis jatuh ke implementasi mock:

- **VIP-Reseller** → `lib/providers/vip-reseller.mock.ts`, berisi 6 game contoh dengan harga dummy.
- **Midtrans** → `lib/payment/midtrans.mock.ts`. Halaman checkout menampilkan tombol
  "Simulasikan Pembayaran Berhasil" yang memanggil `/api/payment/webhook` langsung (payload
  self-signed, hanya berfungsi karena mock provider selalu meloloskan signature check).
- **Database** → `lib/db/store.file.ts`, menyimpan transaksi ke `.data/transactions.json` (di-gitignore).

Ini artinya seluruh alur — pilih game → pilih nominal → isi ID → checkout → bayar (simulasi) →
halaman sukses → cek status — bisa dicoba end-to-end tanpa kredensial apa pun.

### Menyalakan API asli

1. Salin `.env.example` ke `.env.local` dan isi:
   - `VIP_RESELLER_API_ID`, `VIP_RESELLER_API_KEY` — dari akun VIP-Reseller kamu.
   - `MIDTRANS_SERVER_KEY`, `NEXT_PUBLIC_MIDTRANS_CLIENT_KEY` — dari dashboard Midtrans
     (sandbox atau production, sesuaikan `MIDTRANS_IS_PRODUCTION` /
     `NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION`).
   - `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` — dari project Supabase kamu.
2. Jalankan migration di `supabase/migrations/0001_init.sql` lewat Supabase SQL editor atau CLI.
3. Di dashboard Midtrans, arahkan **Payment Notification URL** ke
   `https://<domain-kamu>/api/payment/webhook`.
4. (Opsional) set `USE_MOCK_PROVIDERS=false` secara eksplisit untuk memaksa semua provider
   memakai implementasi asli meski salah satu kredensial belum lengkap.

Field metadata game (logo, deskripsi, tipe ID) dikurasi manual di
`lib/providers/game-catalog.ts` — sesuaikan `vipResellerBrand` di sana agar cocok dengan nilai
`filter_game` yang dipakai VIP-Reseller.

## Struktur Folder

```
app/            routes & pages (App Router)
components/     komponen UI custom + components/ui (shadcn)
lib/providers/  abstraksi VIP-Reseller (mock + real)
lib/payment/    abstraksi Midtrans (mock + real)
lib/db/         abstraksi penyimpanan transaksi (Supabase + file store lokal)
types/          tipe TypeScript bersama
supabase/       migration SQL
```

## Alur Status Transaksi

`PENDING_PAYMENT` → `PAID` → `PROCESSING` → `SUCCESS` / `FAILED` / `EXPIRED`

## Build

```bash
pnpm build
```
