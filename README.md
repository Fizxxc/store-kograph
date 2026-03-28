# KOGRAPH STUDIO.ID — Supabase Edition

Versi rebuild ini mengganti Firebase menjadi **Supabase**, menghapus sistem JWT manual, menyembunyikan shortcut admin dari publik, dan merapikan UI desktop + mobile.

## Fitur utama

- Landing page modern ala pricelist premium.
- Auth pakai **Supabase Auth** (email/password).
- Role **admin / user** di tabel `profiles`.
- Bottom navbar khusus mobile di dashboard user.
- Hidden admin console di route `/{NEXT_PUBLIC_ADMIN_ROUTE}`.
- Payment QRIS via **Cashify** menggunakan route internal.
- **Webhook Cashify** + polling manual untuk status realtime.
- **Web push** custom via service worker + route `/api/web-push/*`.
- Import produk dari Excel/CSV.
- Override harga manual dari admin.
- Order code otomatis `KGR-XXXXXX`.
- SQL lengkap `supabase-schema.sql` + RLS production-ready.

## Setup cepat

1. `npm install`
2. Copy `.env.example` ke `.env.local`
3. Isi semua environment variable.
4. Di Supabase SQL Editor, jalankan `supabase-schema.sql`
5. Register user admin terlebih dulu lewat `/auth`
6. Setelah akun admin tercipta, jalankan query:

```sql
update public.profiles set role = 'admin' where email = 'EMAIL_ADMIN_KAMU';
```

7. Jalankan project:

```bash
npm run dev
```

## Environment variables

Lihat `.env.example`.

## Catatan penting

- Route admin tidak muncul di navbar publik. Keamanan tetap **bukan** dari kerahasiaan route saja, tetapi dari **role admin + RLS + validasi server route**.
- Webhook Cashify di project ini menerima secret dari header `x-webhook-secret` atau `Authorization: Bearer ...`. Jika panel Cashify kamu memakai nama header lain, sesuaikan di `app/api/cashify/webhook/route.ts`.
- Package default GoPay sudah di-set ke `com.gojek.gopay`.
- Setelah payment `paid`, user diarahkan untuk menghubungi admin WhatsApp dengan detail order.

## Struktur penting

- `app/studio-console-9xk2/page.tsx` → hidden admin console
- `app/dashboard/page.tsx` → dashboard user
- `app/api/payment/*` → create/check payment
- `app/api/cashify/webhook/route.ts` → webhook payment
- `app/api/web-push/*` → subscription + broadcast
- `supabase-schema.sql` → schema + RLS + seed product


## Maintenance lock

Website ini saat ini dikunci ke mode maintenance penuh. Semua route selain `/` akan diarahkan ke halaman maintenance, dan seluruh endpoint `/api/*` diblokir oleh middleware. Setelah 7 hari melewati tanggal maintenance selesai (30 Maret 2026 10.00 WIB), sistem mengembalikan status nonaktif otomatis.
