# Dokumen 4: Dokumentasi Kode Program

**Mata Uji Kompetensi:** J.620100.023.02 Membuat Dokumen Kode Program
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Struktur Database PostgreSQL
Sistem terhubung dengan *serverless database* PostgreSQL (Neon) yang terdiri dari 3 entitas utama:
- **`pelanggan`**: Menyimpan kredensial (`nama`, `email`, `password`) sebagai identitas aktor.
- **`lapangan`**: Data master (`nama`, `jenis`, `harga_per_jam`) yang nilainya bersifat konstan namun dapat di-_update_ harga sewanya oleh admin.
- **`reservasi`**: Merupakan *pivot table* (transaksi) yang mengikat `pelanggan` dan `lapangan` berdasarkan rentang waktu (`tanggal`, `jam_mulai`, `jam_selesai`) dan memiliki status (Menunggu / Selesai / Dibatalkan).

---

## 2. Penjelasan Modul Interaksi (State Management)
Arsitektur Front-end pada proyek ini memanfaatkan **React Functional Components** dengan *Hooks*.

### A. Manajemen *State* Lokal (`useState`)
Digunakan secara ekstensif pada form pengisian reservasi (`ReservationPage.tsx`). Variabel `formData` mengikat nilai *input user* (tanggal, jam, id lapangan) menggunakan pendekatan *Controlled Components*, sehingga setiap ketikan *user* terekam secara *real-time*.

### B. Manajemen Siklus Hidup (`useEffect`)
Digunakan untuk mengambil data (_fetching_) dari *database* secara asinkron (misalnya di modul `MyBookingsPage.tsx`). Fungsi *fetch* akan dieksekusi secara otomatis saat komponen pertama kali di-_render_ (ditandai dengan array dependensi kosong `[]`).

### C. Manajemen Sesi Pengguna
Autentikasi dikelola melalui `localStorage` di *browser*. Objek *session* memuat ID pengguna dan level akses (`role: admin | user`). Modul navigasi (Navbar) akan membaca `localStorage` ini guna merender UI secara dinamis (menyembunyikan tombol panel admin bagi pengguna biasa).

---

## 3. Deskripsi Fungsi Utama (Backend Controller - `db.ts`)

File `src/lib/db.ts` bertindak sebagai lapisan jembatan (*controller*) antara antarmuka React dengan PostgreSQL.

1. **`loginUser(email, password)`**: 
   Mengeksekusi *query* `SELECT` ke tabel pelanggan. Modul ini bertanggung jawab memberikan atribut `role='admin'` jika email yang *login* cocok dengan *email master* perusahaan (`admin@smsport.com`).
   
2. **`buatReservasiDB(pelangganNama, lapanganId, tanggal, jamMulai, jamSelesai)`**: 
   Merupakan fungsi transaksional yang paling krusial. Sebelum mengeksekusi `INSERT`, ia memanggil fungsi `cekKetersediaanDB()`. Jika ditemukan bentrokan, ia akan melempar *Error Exception* dan memblokir injeksi data.

3. **`getStatistikDashboard()` & `getLaporanPendapatan()`**: 
   Fungsi agregasi untuk Dasbor Admin. Menjalankan *query* hitung cepat (`COUNT`, `SUM`, `GROUP BY`) guna mendapatkan matrik pendapatan bulanan, harian, dan jumlah *booking*. Fungsi ini menghitung *Total Revenue* murni secara asinkron tanpa memerlukan tabel laporan khusus.

4. **`hapusReservasi(id)` & *Auto-Cancel System***:
   Fitur lanjutan di mana sistem akan secara otomatis mengubah status reservasi menjadi "Dibatalkan" jika pelanggan tidak membayar DP QRIS dalam kurun waktu 20 menit (dievaluasi melalui parameter `created_at` pada PostgreSQL).

5. **`tambahPelangganAdmin()` & `getRiwayatBooking(pelangganId)`**:
   Mendukung fitur CRUD lengkap di Admin Panel. Memanfaatkan relasi *One-to-Many* untuk merangkum dan menghitung nilai LTV (*Lifetime Value* / Total Uang Dihabiskan) per pelanggan.
