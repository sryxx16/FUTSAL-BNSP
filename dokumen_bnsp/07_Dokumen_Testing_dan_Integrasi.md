# Dokumen 7: Hasil Pengujian Perangkat Lunak (Testing)

**Mata Uji Kompetensi:** 
- J.620100.033.02 Melaksanakan Pengujian Unit Program
- J.620100.034.02 Melaksanakan Pengujian Integrasi Program
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Matriks Pengujian Unit Program (Unit Testing)

Tabel berikut menunjukkan uji teknis satu-per-satu fungsionalitas (modul) secara terisolasi.

| No | Modul yang Diuji | Skenario Uji | Hasil yang Diharapkan | Hasil Aktual | Status |
|:---:|:---|:---|:---|:---|:---:|
| 1 | **Modul Autentikasi** | Memasukkan *email* dan *password* yang belum terdaftar di *database*. | Sistem menolak *login*, dan memunculkan *alert* warna merah "Email atau password salah". | Sesuai Harapan | **PASS** ✔️ |
| 2 | **Modul Autentikasi** | Melakukan *login* menggunakan *email* admin: `admin@smsport.com` | *Login* sukses, menu navigasi "Admin Panel" muncul secara dinamis di Navbar. | Sesuai Harapan | **PASS** ✔️ |
| 3 | **Modul Proteksi *Route*** | Mengakses URL `/admin` secara paksa namun status belum *login*. | Sistem menendang pengguna keluar dan otomatis me-_redirect_ ke halaman Beranda/Login. | Sesuai Harapan | **PASS** ✔️ |
| 4 | **Modul Pemesanan (Normal)** | Membuat reservasi lapangan Futsal di tanggal 25 Desember jam 09:00 - 11:00. | Data sukses tersimpan di Neon DB dan muncul di Riwayat Pengguna (*My Bookings*). | Sesuai Harapan | **PASS** ✔️ |
| 5 | **Modul Pemesanan (Bentrok)**| Membuat reservasi lapangan Futsal di tanggal 25 Desember jam 10:00 - 12:00. | Sistem menolak proses *submit*, mengeluarkan pesan *error* "Jadwal Bentrok". *Database* tetap steril. | Sesuai Harapan | **PASS** ✔️ |
| 6 | **Modul Auto-Cancel**| Menunggu 20 menit tanpa membayar DP QRIS. | Sistem membatalkan pesanan secara otomatis (*Cron Job / Database Evaluation*). | Sesuai Harapan | **PASS** ✔️ |
| 7 | **Modul CRUD Pelanggan**| Admin menambahkan, mengedit, dan melihat detail profil pelanggan (LTV). | Data tersimpan, *Total Spent* terkalkulasi otomatis berdasarkan riwayat booking. | Sesuai Harapan | **PASS** ✔️ |

---

## 2. Pengujian Integrasi Program (Integration Testing)

Pengujian ini memastikan seluruh komponen, modul *frontend*, modul *backend*, dan sistem basis data (Neon) mampu bekerja berdampingan secara berurutan.

**Skenario Alur *End-to-End*:**
`Registrasi Member Baru` ──> `Pilih Lapangan` ──> `Simpan Ke Database` ──> `Login Admin` ──> `Tampil di Laporan Admin`

### Evaluasi Hasil Uji Coba Integrasi:
1. **Langkah 1 (Registrasi):** Asesor / Penguji mendaftarkan akun baru (`andi@gmail.com`). Sistem mengirimkan data *query* `INSERT` ke PostgreSQL, data sukses terkam di tabel `pelanggan`. Form berhasil merespons dengan menggeser UI ke mode Login.
2. **Langkah 2 (Transaksi):** Andi melakukan *login*, masuk ke menu `/book`. Input nama otomatis terkunci dan terisi menjadi "Andi". Penguji memilih Lapangan Futsal 2 pada tanggal besok.
3. **Langkah 3 (Intervensi Database):** Sistem bereaksi dengan menghubungkan komponen `ReservationPage.tsx` dengan _Controller_ API Vercel ke Neon DB. Sistem mengecek *overlap*, tidak ada *overlap*, lalu eksekusi `INSERT` ke tabel `reservasi`. Alert *success* muncul.
4. **Langkah 4 (Pelaporan):** Asesor membuka *browser* lain, _login_ sebagai `admin@smsport.com`.
5. **Langkah 5 (Validasi Akhir):** Di halaman *Dashboard Admin*, angka "Total Reservasi Hari Ini" bertambah 1. Pada tab *Data Reservasi*, baris pesanan milik "Andi" muncul di urutan teratas (karena pengurutan terbaru). Admin bisa mengeklik ikon sampah (Hapus) dan data Andi terhapus dari *database* secara *real-time*.

**Kesimpulan Pengujian Integrasi:**
Seluruh relasi dan transisi data dari awal hingga akhir (*End-to-End*) berjalan lancar, cepat, dan 100% terekam sinkron. Sistem Dinyatakan **BERHASIL**.
