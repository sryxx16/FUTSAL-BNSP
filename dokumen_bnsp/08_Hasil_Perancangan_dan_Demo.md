# Dokumen 8: Hasil Perancangan dan Demonstrasi Sistem

**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center
**Posisi Pekerjaan:** Analis Program

---

## 1. Kesimpulan Akhir
Seluruh tahapan Analisis, Perancangan Database, Pemrograman UI/UX, Debugging, hingga Pengujian Telah **SELESAI** dikerjakan dan memenuhi seluruh unit kompetensi sertifikasi BNSP. 

Sistem dibangun menggunakan ekosistem pengembangan modern *(React, TypeScript, Tailwind, Neon PostgreSQL)* yang menjamin performa cepat, aman dari serangan injeksi dasar, dan sangat ramah pengguna (*mobile-responsive*).

## 2. Bukti Live Demonstrasi (Link Aplikasi)
Agar Asesor dapat meninjau hasil pengembangan secara langsung tanpa harus menjalankan aplikasi di komputer lokal (localhost), proyek ini telah di-*deploy* ke publik melalui *platform cloud* Vercel.

🔗 **Link Akses Website (Live Demo):** 
`https://futsal-bnsp-bch3me3fb-sryxx16s-projects.vercel.app/` 
*(Atau URL Vercel terbaru Anda)*

🔗 **Link Akses Kode Sumber (Repository):** 
`https://github.com/sryxx16/FUTSAL-BNSP`

### Instruksi untuk Asesor (Saat Demonstrasi)
1. **Untuk menguji peran Pelanggan:** Silakan klik menu "Login / Register" di pojok kanan atas, pilih *tab* *Register*, dan daftarkan email sembarang. Anda akan dapat menggunakan fitur pemesanan dan riwayat pribadi.
2. **Untuk menguji peran Admin:** Lakukan registrasi menggunakan akun *master email* yaitu `admin@smsport.com`. Sistem akan langsung membaca Anda sebagai Manajer, dan tombol Dasbor Rahasia Admin akan terbuka di menu Navigasi Anda.
3. **Untuk menguji Fitur Pembayaran:** Setelah melakukan reservasi sebagai pelanggan, lakukan Checkout. Sistem akan mengeluarkan QRIS secara dinamis beserta potongan Harga DP 50%.
4. **Untuk menguji Auto-Cancel:** Abaikan pembayaran selama 20 menit, dan sistem cron database akan otomatis membatalkan reservasi tersebut (mengubah status ke "Dibatalkan").

---
*Dokumen ini merupakan bagian terpadu dari portofolio uji kompetensi.*
