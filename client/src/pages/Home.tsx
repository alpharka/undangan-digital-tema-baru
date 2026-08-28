/**
 * Paper Tide / editorial minimalism: asymmetric composition, indigo ink, paper cream,
 * terracotta accents, tactile imagery, and calm motion. This page is intentionally not
 * a generic card grid; sections behave like a long-form wedding editorial.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowDown, ArrowLeft, ArrowRight, CalendarDays, Check, ChevronRight, Copy,
  ExternalLink, Heart, MapPin, Menu, Music2, Pause, Play, Quote, X, ZoomIn,
} from "lucide-react";
import { toast } from "sonner";

const CONFIG = {
  couple: "Nara & Raka",
  nicknames: "Nara & Raka",
  parents: "Putri dari Bapak Arman & Ibu Lestari · Putra dari Bapak Hendra & Ibu Sari",
  eventDate: "2027-06-12T10:00:00+07:00",
  dateLabel: "12 Juni 2027",
  dayLabel: "Sabtu",
  akadTime: "10.00 WIB",
  receptionTime: "18.30–21.00 WIB",
  akadVenue: "Pendopo Taman Langit",
  receptionVenue: "Rumah Aksara",
  address: "Jl. Kemuning No. 18, Yogyakarta",
  mapsUrl: "https://maps.google.com/?q=Rumah+Aksara+Yogyakarta",
  musicUrl: "https://cdn.pixabay.com/audio/2022/10/25/audio_9464f3c0cc.mp3",
  ewalletProvider: "DANA",
  ewalletNumber: "0812 3456 7890",
  bank: "Bank BCA",
  accountNumber: "1234567890",
  recipient: "Nara Prameswari",
};

const photos = [
  { src: "/manus-storage/gallery-portrait-garden_d4e79dce.jpg", alt: "Nara dan Raka di antara rumput tinggi", caption: "Rumput tinggi, langkah yang sama." },
  { src: "/manus-storage/gallery-table-detail_bb8d345c.jpg", alt: "Detail cincin dan bunga kering di atas meja", caption: "Hal-hal kecil yang kami simpan." },
  { src: "/manus-storage/gallery-coastal_fb99485b.jpg", alt: "Pasangan berdiri di tepi pantai saat senja", caption: "Ke mana pun angin membawa." },
  { src: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1100&q=85", alt: "Tangan pasangan dengan buket bunga putih", caption: "Satu janji, banyak musim." },
  { src: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=85", alt: "Pasangan berjalan di jalan setapak", caption: "Pulang, dalam bentuk yang baru." },
  { src: "https://images.unsplash.com/photo-1520854221256-17451cc331bf?auto=format&fit=crop&w=1000&q=85", alt: "Dekorasi meja pernikahan bernuansa hangat", caption: "Ruang kecil untuk rasa syukur." },
];

function guestName() {
  const params = new URLSearchParams(window.location.search);
  const value = (params.get("to") || "Tamu undangan").replace(/\s+/g, " ").trim();
  return value.slice(0, 80) || "Tamu undangan";
}

function calendarUrl() {
  const start = "20270612T030000Z";
  const end = "20270612T140000Z";
  const params = new URLSearchParams({ action: "TEMPLATE", text: `Pernikahan ${CONFIG.couple}`, dates: `${start}/${end}`, details: "Hari bahagia Nara & Raka. Sampai jumpa di Yogyakarta.", location: `${CONFIG.receptionVenue}, ${CONFIG.address}`, ctz: "Asia/Jakarta" });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function useReveal() {
  useEffect(() => {
    const items = document.querySelectorAll("[data-reveal]");
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add("is-visible"); observer.unobserve(entry.target); }
    }), { threshold: 0.14 });
    items.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

export default function Home() {
  const [opened, setOpened] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(false);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const [rsvp, setRsvp] = useState(() => JSON.parse(localStorage.getItem("paper-tide-rsvp") || "[]"));
  const [form, setForm] = useState({ name: "", attendance: "Hadir", message: "" });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const audioRef = useRef<HTMLAudioElement>(null);
  const guest = useMemo(guestName, []);
  useReveal();

  useEffect(() => {
    const tick = () => { const distance = Math.max(0, new Date(CONFIG.eventDate).getTime() - Date.now()); setCountdown({ days: Math.floor(distance / 86400000), hours: Math.floor(distance / 3600000) % 24, minutes: Math.floor(distance / 60000) % 60, seconds: Math.floor(distance / 1000) % 60 }); };
    tick(); const timer = window.setInterval(tick, 1000); return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    document.body.style.overflow = lightbox !== null ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    const key = (event: KeyboardEvent) => { if (lightbox === null) return; if (event.key === "Escape") setLightbox(null); if (event.key === "ArrowRight") setLightbox((lightbox + 1) % photos.length); if (event.key === "ArrowLeft") setLightbox((lightbox - 1 + photos.length) % photos.length); };
    window.addEventListener("keydown", key); return () => window.removeEventListener("keydown", key);
  }, [lightbox]);

  const openInvitation = async () => { setOpened(true); try { await audioRef.current?.play(); setMusicPlaying(true); } catch { toast("Musik siap diputar dari tombol di pojok layar."); } };
  const toggleMusic = async () => { if (!audioRef.current) return; if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false); } else { try { await audioRef.current.play(); setMusicPlaying(true); } catch { toast("Browser belum mengizinkan musik diputar."); } } };
  const copy = async (value: string, label: string) => { try { await navigator.clipboard.writeText(value); } catch { const area = document.createElement("textarea"); area.value = value; document.body.appendChild(area); area.select(); document.execCommand("copy"); area.remove(); } toast(`${label} tersalin`); };
  const submitRsvp = (event: React.FormEvent) => { event.preventDefault(); if (!form.name.trim() || !form.message.trim()) { toast("Nama dan pesan ucapan perlu diisi."); return; } const next = [{ ...form, name: form.name.trim(), message: form.message.trim(), id: Date.now() }, ...rsvp]; setRsvp(next); localStorage.setItem("paper-tide-rsvp", JSON.stringify(next)); setForm({ name: "", attendance: "Hadir", message: "" }); toast("Konfirmasi tersimpan di perangkat ini."); };

  return <div className="paper-site">
    <audio ref={audioRef} src={CONFIG.musicUrl} loop preload="none" />
    <div className={`cover ${opened ? "cover--opened" : ""}`} aria-hidden={opened}>
      <div className="cover__wash" />
      <div className="cover__content">
        <div className="eyebrow">Sebuah undangan untuk</div>
        <img className="emblem emblem--large" src="/manus-storage/emblem-indigo_d5353f8e.png" alt="Emblem Nara dan Raka" />
        <p className="cover__guest">{guest}</p>
        <h1>Nara <i>&</i> Raka</h1>
        <p className="cover__date">12 · 06 · 2027 <span>Yogyakarta</span></p>
        <button className="button button--paper" onClick={openInvitation}>Buka Undangan <ArrowDown size={16} /></button>
      </div>
      <span className="cover__edge">Scroll untuk membuka cerita kami</span>
    </div>

    <header className={`site-header ${opened ? "site-header--visible" : ""}`}>
      <a href="#top" className="brand"><img src="/manus-storage/emblem-indigo_d5353f8e.png" alt="" /><span>N<span>&</span>R</span></a>
      <nav aria-label="Navigasi utama"><a href="#story">Cerita</a><a href="#details">Acara</a><a href="#gallery">Galeri</a><a href="#rsvp">RSVP</a><a href="#gift">Tanda kasih</a></nav>
      <span className="header-date">12.06.27</span>
    </header>

    <main id="top">
      <section className="hero section-dark">
        <div className="hero__grain" />
        <div className="hero__copy" data-reveal><p className="eyebrow eyebrow--light">The beginning of always</p><h2>Dua perjalanan,<br /><em>satu rumah</em><br />yang kami pilih.</h2><p className="hero__intro">Dengan segala kerendahan hati, kami mengundang Anda untuk hadir dan menjadi bagian dari hari yang kami nantikan.</p><a className="text-link text-link--light" href="#story">Baca cerita kami <ChevronRight size={16} /></a></div>
        <div className="hero__stamp">N <span>×</span> R<br /><small>Est. 2027</small></div>
      </section>

      <section id="story" className="story section-paper"><div className="section-number">01 <span>—</span> cerita</div><div className="story__heading" data-reveal><div className="stamp-mark"><img src="/manus-storage/emblem-indigo_d5353f8e.png" alt="" /><span>our little<br />archive</span></div><p className="eyebrow">A little note from us</p><h2>Yang berawal dari<br /><em>percakapan kecil.</em></h2></div><div className="story__body" data-reveal><p>Barangkali cinta memang tidak selalu datang dengan suara besar. Kadang ia hadir sebagai pesan singkat, kopi yang tertunda, atau seseorang yang tetap tinggal ketika hari terasa panjang.</p><p>Kami bertemu di sela riuhnya kota, lalu perlahan belajar bahwa rumah bukan hanya tempat untuk pulang—melainkan seseorang yang membuat perjalanan terasa layak diulang.</p><div className="signature">Dengan hangat,<br /><strong>Nara & Raka</strong></div></div><div className="story__line" /></section>

      <section id="details" className="details section-sand"><div className="section-number">02 <span>—</span> hari kami <b className="terracotta-label">catat baik-baik</b></div><div className="details__intro" data-reveal><div className="ledger-seal">12<br /><small>JUN</small></div><p className="eyebrow">Mark your calendar</p><h2>12 <em>Juni</em><br />2027</h2><p>Sabtu, di antara doa dan bunga-bunga yang mekar.</p></div><div className="event-list"><article className="event-row" data-reveal><span className="event-time">10.00 <small>WIB</small></span><div><p className="eyebrow">Akad nikah</p><h3>{CONFIG.akadVenue}</h3><p>{CONFIG.address}</p></div><MapPin size={20} /></article><article className="event-row" data-reveal><span className="event-time">18.30 <small>WIB</small></span><div><p className="eyebrow">Resepsi</p><h3>{CONFIG.receptionVenue}</h3><p>{CONFIG.address}</p></div><MapPin size={20} /></article><div className="event-actions"><a className="button button--ink" href={CONFIG.mapsUrl} target="_blank" rel="noreferrer">Lihat lokasi <ExternalLink size={15} /></a><a className="button button--outline" href={calendarUrl()} target="_blank" rel="noreferrer"><CalendarDays size={15} /> Simpan tanggal</a></div></div><div className="countdown" data-reveal><p className="eyebrow">Menuju hari bahagia</p><div className="countdown__grid">{Object.entries(countdown).map(([key, value]) => <div key={key}><strong>{String(value).padStart(2, "0")}</strong><span>{key === "days" ? "hari" : key === "hours" ? "jam" : key === "minutes" ? "menit" : "detik"}</span></div>)}</div></div></section>

      <section id="gallery" className="gallery section-paper"><div className="section-number">03 <span>—</span> potret</div><div className="gallery__heading" data-reveal><p className="eyebrow">Frames from our days</p><h2>Beberapa <em>fragmen</em><br />yang ingin kami bagi.</h2></div><div className="gallery-grid">{photos.map((photo, index) => <button className={`gallery-item gallery-item--${index + 1}`} key={photo.src} onClick={() => setLightbox(index)} aria-label={`Lihat foto ${index + 1}: ${photo.alt}`} data-reveal><img src={photo.src} alt={photo.alt} loading="lazy" /><span><ZoomIn size={15} /> Lihat foto</span></button>)}</div></section>

      <section id="rsvp" className="rsvp section-dark"><div className="section-number section-number--light">04 <span>—</span> kabar <b className="terracotta-label terracotta-label--dark">tinggalkan jejak</b></div><div className="rsvp__layout"><div data-reveal><p className="eyebrow eyebrow--light">Let us know</p><h2>Apakah kamu<br /><em>akan hadir?</em></h2><p className="rsvp__note">Satu baris pesan dari kamu akan menjadi bagian dari halaman hari kami.</p></div><form className="rsvp-form" onSubmit={submitRsvp} data-reveal><label>Nama lengkap<input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Tulis namamu" /></label><fieldset><legend>Konfirmasi kehadiran</legend><label className="radio"><input type="radio" name="attendance" checked={form.attendance === "Hadir"} onChange={() => setForm({ ...form, attendance: "Hadir" })} /> Saya akan hadir</label><label className="radio"><input type="radio" name="attendance" checked={form.attendance === "Belum pasti"} onChange={() => setForm({ ...form, attendance: "Belum pasti" })} /> Belum bisa memastikan</label><label className="radio"><input type="radio" name="attendance" checked={form.attendance === "Tidak hadir"} onChange={() => setForm({ ...form, attendance: "Tidak hadir" })} /> Tidak dapat hadir</label></fieldset><label>Pesan ucapan<textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Tulis doa dan harapanmu..." rows={4} /></label><button className="button button--paper" type="submit">Kirim konfirmasi <ArrowRight size={16} /></button></form></div><div className="guestbook" data-reveal><div><p className="eyebrow eyebrow--light">Buku tamu</p><h3>Pesan yang ditinggalkan</h3></div>{rsvp.length === 0 ? <p className="guestbook__empty">Pesan ucapanmu akan muncul di sini setelah dikirim.</p> : <div className="guestbook__list">{rsvp.map((item: { id: number; name: string; attendance: string; message: string }) => <article key={item.id}><Quote size={16} /><div><strong>{item.name}</strong><span>{item.attendance}</span><p>{item.message}</p></div></article>)}</div>}</div></section>

      <section id="gift" className="gift section-sand"><div className="section-number">05 <span>—</span> tanda kasih <b className="terracotta-label">dengan terima kasih</b></div><div className="gift__layout"><div data-reveal><p className="eyebrow">A small gesture</p><h2>Doa adalah<br /><em>hadiah pertama.</em></h2><p>Jika berkenan memberi tanda kasih, kami menyiapkan beberapa pilihan yang dapat digunakan dengan mudah.</p></div><div className="gift-card" data-reveal><img src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`${CONFIG.ewalletProvider}:${CONFIG.ewalletNumber}`)}`} alt="QR code e-wallet DANA" /><div><p className="eyebrow">{CONFIG.ewalletProvider}</p><h3>{CONFIG.ewalletNumber}</h3><p>a.n. {CONFIG.recipient}</p><button onClick={() => copy(CONFIG.ewalletNumber, "Nomor e-wallet")}><Copy size={14} /> Salin nomor</button></div></div><div className="gift-bank" data-reveal><p className="eyebrow">Rekening bank</p><h3>{CONFIG.bank} · {CONFIG.accountNumber}</h3><p>a.n. {CONFIG.recipient}</p><button className="text-link" onClick={() => copy(CONFIG.accountNumber, "Nomor rekening")}>Salin nomor rekening <Copy size={14} /></button></div></div></section>

      <footer className="footer section-dark"><img className="emblem" src="/manus-storage/emblem-indigo_d5353f8e.png" alt="" /><p className="eyebrow eyebrow--light">Thank you for being part of our story</p><h2>Nara <i>&</i> Raka</h2><p>12 · 06 · 2027</p><span className="footer__line" /></footer>
    </main>
    <button className="music-control" onClick={toggleMusic} aria-label={musicPlaying ? "Jeda musik" : "Putar musik"}>{musicPlaying ? <Pause size={16} /> : <Play size={16} />}<span>{musicPlaying ? "Jeda musik" : "Putar musik"}</span></button>
    <nav className="mobile-nav" aria-label="Navigasi cepat"><a href="#story"><Heart size={16} />Cerita</a><a href="#details"><CalendarDays size={16} />Acara</a><a href="#gallery"><Menu size={16} />Galeri</a><a href="#rsvp"><Quote size={16} />RSVP</a></nav>
    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Galeri foto" onClick={() => setLightbox(null)}><button className="lightbox__close" onClick={() => setLightbox(null)} aria-label="Tutup"><X /></button><button className="lightbox__prev" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + photos.length) % photos.length); }} aria-label="Foto sebelumnya"><ArrowLeft /></button><figure onClick={(e) => e.stopPropagation()}><img src={photos[lightbox].src} alt={photos[lightbox].alt} /><figcaption>{String(lightbox + 1).padStart(2, "0")} / 06 · {photos[lightbox].caption}</figcaption></figure><button className="lightbox__next" onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % photos.length); }} aria-label="Foto berikutnya"><ArrowRight /></button></div>}
  </div>;
}
