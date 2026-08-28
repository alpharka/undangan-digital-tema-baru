# Panduan Kustomisasi Undangan Digital

Dokumen ini menjelaskan cara mempersonalisasi website undangan **Paper Tide** untuk pasangan, acara, dan kebutuhan publikasi Anda. Website ini adalah frontend React statis; data RSVP disimpan sementara di browser pengunjung menggunakan `localStorage`, sehingga belum menjadi buku tamu lintas perangkat.

## Ringkasan struktur

| Lokasi | Fungsi |
|---|---|
| `client/src/pages/Home.tsx` | Halaman utama, konfigurasi data, section undangan, interaksi RSVP, countdown, musik, lightbox, dan salin rekening. |
| `client/src/index.css` | Palet warna, tipografi, layout editorial, tekstur kertas, responsive behavior, dan animasi. |
| `client/index.html` | Judul halaman, bahasa dokumen, dan metadata SEO. |
| `ideas.md` | Keputusan arah visual Paper Tide dan prinsip desain. |
| `client/public/` | Hanya untuk file konfigurasi kecil seperti favicon atau robots.txt. Jangan menyimpan foto besar di sini. |

## 1. Mengganti data pasangan dan acara

Buka `client/src/pages/Home.tsx`, kemudian edit objek `CONFIG` di bagian paling atas. Semua data utama sengaja disimpan dalam satu objek agar tidak perlu mencari-cari nilai yang tersebar di komponen.

```ts
const CONFIG = {
  couple: "Nama Mempelai 1 & Nama Mempelai 2",
  nicknames: "Panggilan 1 & Panggilan 2",
  parents: "Nama orang tua",
  eventDate: "2027-06-12T10:00:00+07:00",
  dateLabel: "12 Juni 2027",
  dayLabel: "Sabtu",
  akadTime: "10.00 WIB",
  receptionTime: "18.30–21.00 WIB",
  akadVenue: "Nama venue akad",
  receptionVenue: "Nama venue resepsi",
  address: "Alamat lengkap",
  mapsUrl: "https://maps.google.com/?q=...",
  musicUrl: "https://.../musik-instrumental.mp3",
  ewalletProvider: "DANA",
  ewalletNumber: "08xx xxxx xxxx",
  bank: "Bank ...",
  accountNumber: "Nomor rekening",
  recipient: "Nama penerima",
};
```

Gunakan format ISO dengan zona waktu `+07:00` pada `eventDate`. Countdown membaca nilai ini secara langsung. Fungsi `calendarUrl()` menggunakan tanggal Google Calendar dalam UTC dan dapat disesuaikan bila waktu acara berubah. Jika acara berlangsung pada tanggal berbeda, ubah nilai `start` dan `end` di fungsi tersebut bersama `CONFIG.eventDate`.

## 2. Nama tamu dari URL

Nama tamu dibaca dari parameter URL `to`. Contoh:

```text
https://undangandb-lks3dzjt.manus.space/?to=Keluarga%20Budi%20Santoso
```

Jika parameter tidak tersedia, halaman menampilkan `Tamu undangan`. Nilai dirapikan, dibatasi 80 karakter, dan hanya dirender sebagai teks biasa. Untuk menguji beberapa penerima, buka URL dengan nama yang berbeda setelah tanda `?to=`.

## 3. Mengganti foto

Array `photos` di `Home.tsx` berisi enam objek dengan properti `src`, `alt`, dan `caption`. Ganti setiap `src` dengan URL aset yang telah diunggah ke penyimpanan website atau URL gambar publik yang stabil. Jangan mengulang foto yang sama pada beberapa item.

Untuk aset lokal berukuran besar, simpan sumber aslinya di `/home/ubuntu/webdev-static-assets/`, lalu unggah menggunakan alur upload aset WebDev. Di dalam kode, gunakan URL penyimpanan yang dikembalikan, bukan path lokal. Pastikan setiap foto memiliki `alt` yang mendeskripsikan isi visualnya, bukan sekadar nama file.

## 4. Mengganti musik

Ubah `CONFIG.musicUrl` ke URL file audio instrumental yang Anda miliki hak penggunaannya. Browser biasanya melarang autoplay sebelum interaksi, sehingga website sengaja memulai musik setelah tombol **Buka Undangan** ditekan. Tombol floating di kanan bawah tetap tersedia bila browser menolak playback pertama.

Sebaiknya gunakan file MP3 yang ringan, instrumental, dan tidak terlalu keras. Volume default mengikuti file sumber; bila perlu, tambahkan `audioRef.current.volume = 0.25` sebelum pemutaran di fungsi `openInvitation()` dan `toggleMusic()`.

## 5. Mengganti rekening dan QR code

Ubah `ewalletProvider`, `ewalletNumber`, `bank`, `accountNumber`, dan `recipient` dalam `CONFIG`. QR code saat ini dibuat dari payload provider dan nomor e-wallet melalui layanan QR publik. Jika Anda memiliki URL pembayaran resmi, ubah payload pada atribut `src` QR code agar berisi URL tersebut.

Data pembayaran contoh harus selalu diganti sebelum publikasi. Tombol salin menggunakan Clipboard API dengan fallback untuk browser yang tidak menyediakan API tersebut, dan menampilkan notifikasi setelah berhasil.

## 6. Mengubah warna dan tipografi

Token desain berada di bagian awal `client/src/index.css`:

| Token | Nilai saat ini | Peran |
|---|---|---|
| `--ink` | `#183447` | Biru tinta utama dan latar gelap. |
| `--paper` | `#f4efe5` | Kertas krem untuk permukaan terang. |
| `--sand` | `#e8ddcc` | Bidang pasir untuk acara dan tanda kasih. |
| `--terra` | `#bd684c` | Aksen terracotta dan label cetak. |
| `--display` | Cormorant Garamond | Headline dan nama pasangan. |
| `--body` | DM Sans | Isi, form, navigasi, dan label. |

Jika mengganti font, perbarui juga URL Google Fonts pada baris `@import`. Pertahankan kontras teks, terutama untuk teks yang berada di atas gambar atau latar `--ink`. Jangan menghapus lapisan grain tanpa menggantinya dengan tekstur yang setara karena materialitas kertas merupakan bagian dari identitas Paper Tide.

## 7. Mengubah copy dan struktur section

Copy utama berada langsung di markup `Home.tsx`. Anda dapat mengganti paragraf cerita, headline hero, label section, dan footer tanpa mengubah logika interaktif. Anchor navigasi memakai ID `story`, `details`, `gallery`, `rsvp`, dan `gift`; bila ID diubah, ubah pula href pada header dan mobile navigation.

Untuk menambah section baru, gunakan pola section yang sama: berikan ID unik, gunakan `section-number`, tambahkan atribut `data-reveal` pada elemen yang ingin dianimasikan, dan pastikan section tersebut memiliki padding mobile yang cukup agar tidak tertutup navigasi bawah.

## 8. RSVP dan buku tamu

Form RSVP melakukan validasi nama dan pesan, kemudian menyimpan hasilnya ke key `paper-tide-rsvp` di `localStorage`. Data yang tersimpan hanya tersedia pada browser dan perangkat yang sama. Tidak ada data tamu palsu yang disediakan sebagai isi awal; keadaan pertama menampilkan empty state.

Untuk produksi dengan data terpusat, ganti fungsi `submitRsvp` dengan request ke backend yang aman. Tambahkan loading, error, dan success state, lalu ambil daftar pesan dari server. Jangan menaruh secret API atau kredensial database di file frontend.

## 9. Aksesibilitas dan motion

Galeri dapat diakses melalui keyboard dan lightbox mendukung `Escape`, `ArrowLeft`, serta `ArrowRight`. Form memiliki label, gambar memiliki alt text, dan scroll body dikunci saat lightbox aktif. Media query `prefers-reduced-motion: reduce` menonaktifkan motion non-esensial.

Setelah melakukan perubahan, uji halaman pada lebar sekitar 320 px, layar mobile, dan desktop. Pastikan tidak ada teks yang terpotong, tombol yang tertutup mobile navigation, atau kontras yang menurun.

## 10. Pemeriksaan lokal

Jalankan perintah berikut dari root repository:

```bash
pnpm check
pnpm build
```

Periksa setidaknya URL tanpa parameter dan URL dengan `?to=Nama%20Tamu`, pembukaan cover, musik, countdown, Google Calendar, lightbox, validasi RSVP kosong, RSVP berhasil, tombol salin, dan tampilan mobile.

## 11. Publikasi

Website yang tersedia saat ini:

- **Published URL:** https://undangandb-lks3dzjt.manus.space
- **Preview URL:** tersedia melalui panel Preview di Manus.

Setelah perubahan besar, buat checkpoint baru sebelum menggunakan tombol **Publish** di antarmuka pengelolaan proyek. Jika domain berubah, perbarui URL pada README dan contoh parameter `to` di dokumen ini.
