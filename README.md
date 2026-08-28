# Nara & Raka — Undangan Pernikahan Digital

Website undangan pernikahan digital satu halaman dengan arah visual **Paper Tide**: editorial minimalism, coastal modern, tekstur kertas analog, biru tinta, krem hangat, dan aksen terracotta. Halaman ini dirancang agar data pasangan, acara, galeri, musik, dan tanda kasih dapat diganti dari satu konfigurasi terpusat.

> “Dua perjalanan, satu rumah yang kami pilih.”

## Website

| Jenis | URL |
|---|---|
| **Published website** | [undangandb-lks3dzjt.manus.space](https://undangandb-lks3dzjt.manus.space) |
| Undangan dengan nama tamu | [Contoh Keluarga Budi Santoso](https://undangandb-lks3dzjt.manus.space/?to=Keluarga%20Budi%20Santoso) |
| Preview | Buka panel **Preview** pada proyek Manus |

Untuk menampilkan nama tamu secara dinamis, gunakan parameter `to`:

```text
https://undangandb-lks3dzjt.manus.space/?to=Nama%20Tamu
```

Jika parameter tersebut tidak digunakan, website menampilkan `Tamu undangan` sebagai fallback.

## Fitur

Website mencakup cover fullscreen dengan transisi slide-up, nama tamu dari URL, musik latar yang dimulai setelah interaksi pengguna, header desktop, sticky navigation mobile, cerita pasangan, detail akad dan resepsi, countdown live, tautan Google Maps, tautan Google Calendar yang telah terisi, galeri masonry dengan lightbox, RSVP tanpa reload, buku tamu berbasis localStorage, QR code e-wallet, detail rekening bank, tombol salin, serta dukungan `prefers-reduced-motion`.

## Kustomisasi

Panduan lengkap tersedia di [CUSTOMIZATION.md](./CUSTOMIZATION.md). Secara ringkas, data utama dapat diganti pada objek `CONFIG` di `client/src/pages/Home.tsx`. Foto berada pada array `photos` di file yang sama, sedangkan warna, tipografi, tekstur, dan responsive layout berada di `client/src/index.css`.

Sebelum publikasi, pastikan seluruh placeholder data pembayaran dan data acara sudah diganti dengan informasi final. RSVP pada versi frontend-only ini disimpan lokal pada perangkat pengunjung dan belum dikirim ke server.

## Menjalankan secara lokal

Pastikan Node.js dan pnpm tersedia, lalu jalankan:

```bash
pnpm install
pnpm dev
```

Untuk pemeriksaan tipe dan build produksi:

```bash
pnpm check
pnpm build
```

## Struktur penting

| Path | Keterangan |
|---|---|
| `client/src/pages/Home.tsx` | Konfigurasi dan seluruh section undangan. |
| `client/src/index.css` | Sistem visual Paper Tide dan responsive behavior. |
| `client/index.html` | Metadata halaman dan bahasa dokumen. |
| `CUSTOMIZATION.md` | Dokumentasi kustomisasi langkah demi langkah. |
| `ideas.md` | Brainstorm dan keputusan arah desain. |

## Status teknis

Pemeriksaan TypeScript dan build produksi telah dijalankan tanpa error. Website bersifat frontend-only dan tidak menyimpan RSVP ke database. Untuk kebutuhan buku tamu lintas perangkat atau panel administrasi, integrasikan backend yang aman sebelum digunakan sebagai sistem RSVP utama.

## Lisensi dan aset

Pastikan setiap foto, musik, font, dan aset eksternal yang digunakan memiliki hak penggunaan yang sesuai untuk undangan dan publikasi Anda.
