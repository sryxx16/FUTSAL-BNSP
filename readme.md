# 📋 Project Blueprint & Backlog: SM Sport Center Reservation

Proyek ini dibangun untuk memenuhi instrumen penilaian **FR.IA.04A Uji Kompetensi Sertifikasi BNSP Okupasi Analis Program**. Aplikasi ini mengimplementasikan sistem reservasi lapangan olahraga berbasis web yang dinamis, aman dari konflik jadwal, serta dilengkapi visual interaktif modern.

## 🛠️ Tech Stack & Architecture
- **Frontend Framework:** React.js (Vite) + TypeScript (`.tsx`)
- **Styling & Animation:** Tailwind CSS + Framer Motion (Efek Dark Mode & Neon Glowing ala CryptoHub)
- **Database & Backend:** Neon (Cloud PostgreSQL)
- **Deployment Platform:** Vercel

---

## 📅 KELOMPOK PEKERJAAN 1: ANALISIS ATAS KEBUTUHAN & SKALABILITAS
*Status: [🔄] In Progress*

### 1. Identifikasi Aktor & Kebutuhan Sistem
- **Aktor Utama:** 
  - **Pelanggan:** Melihat ketersediaan lapangan, melakukan reservasi secara *real-time*.
  - **Admin:** Mengelola data master (lapangan), memvalidasi reservasi, dan melihat laporan penggunaan.
- **Kebutuhan Fungsional:**
  - Autentikasi pengguna (Login/Register).
  - Formulir Reservasi Lapangan dengan validasi bentrok jadwal.
  - Dasbor manajemen reservasi (CRUD: Lihat, Tambah, Edit, Hapus).
  - Generator laporan penggunaan lapangan otomatis.
- **Kebutuhan Non-Fungsional:**
  - Desain responsif, tema gelap premium dengan aksen *emerald/green neon*.
  - Kecepatan transisi visual menggunakan komponen teranimasi (< 250ms).

### 2. Analisis Skalabilitas Perangkat Lunak (Output 1)
- **Potensi Bottleneck:** Query pengecekan ketersediaan jadwal yang tumpang tindih (*overlap*) saat diakses oleh banyak pengguna secara bersamaan.
- **Estimasi Pertumbuhan Data:** 
  - Aset: 2 Lapangan Futsal & 3 Lapangan Badminton.
  - Estimasi: 5 Lapangan × ~10 sesi/hari × 365 hari = ~18.250 baris data transaksi per tahun.
- **Rekomendasi Performa:** 
  - Menerapkan *Database Indexing* pada kolom `lapangan_id`, `tanggal`, `jam_mulai`, dan `jam_selesai`.
  - Menggunakan *Client-side State Optimization* untuk meminimalisir *re-rendering* grid jadwal.

---

## 💾 KELOMPOK PEKERJAAN 2: MENULIS KODE SUMBER & BASIS DATA
*Status: [🔄] In Progress*

### 1. Perancangan Basis Data (Output 2: ERD & SQL Script)
- [x] Desain relasi tabel (Pelanggan 1 ── 𝝝 Reservasi 𝝝 ── 1 Lapangan).
- [x] Migrasi skema database relasional ke PostgreSQL (Neon SQL Editor).

### 2. Implementasi UI & Source Code (Output 3)
- [x] Membuat definisi tipe data strict dengan TypeScript (`src/types/database.ts`).
- [x] Membuat logika client-side validation pencegah *double booking* (`src/utils/validation.ts`).
- [x] Integrasi SDK `@neondatabase/serverless` ke dalam komponen React.
- [x] Pembuatan visual antarmuka interaktif dengan komponen animasi Framer Motion.

### 3. Pembuatan Dokumen Kode Program (Output 4)
- [ ] Menyusun deskripsi fungsi komponen, struktur database PostgreSQL, dan penjelasan modul interaksi state.

### 4. Kasus Penanganan Debugging (Output 5: Laporan Debugging)
- **Masalah:** Terjadi duplikasi reservasi jadwal meskipun slot jam sudah terisi (*double booking*).
- **Solusi Perbaikan:** Mengintegrasikan fungsi validasi irisan waktu (*time overlap algorithm*) pada layer aplikasi sebelum melakukan mutasi data `INSERT` ke database.

---

## ⚡ KELOMPOK PEKERJAAN 3: ME-REVIEW KODE SUMBER (PROFILING)
*Status: [ ] Pending*

- [ ] Menjalankan aplikasi secara lokal dan mengukur performa komponen lewat React DevTools Profiler.
- [ ] Mengidentifikasi fungsi atau component rendering yang lambat (terutama pada grid kalender/jadwal).
- [ ] Menyusun dokumen rekomendasi perbaikan struktur rendering (memoization menggunakan `useMemo` / `useCallback`).

---

## 🧪 KELOMPOK PEKERJAAN 4: PENGUJIAN PERANGKAT LUNAK (TESTING)
*Status: [ ] Pending*

### 1. Matriks Pengujian Unit (Output 7: Dokumen Testing)
| No | Skenario Uji | Hasil yang Diharapkan | Status |
|----|--------------|-----------------------|--------|
| 1  | Login Kredensial Benar | Sistem mengizinkan masuk ke dasbor reservasi | [ ] |
| 2  | Login Kredensial Salah | Sistem menolak dan menampilkan pesan error | [ ] |
| 3  | Input Reservasi Valid | Data sukses terkirim dan disimpan ke PostgreSQL | [ ] |
| 4  | Input Reservasi Bentrok | Sistem melempar alert "Jadwal Terisi" & memblokir proses simpan | [ ] |

### 2. Pengujian Integrasi (Output 8)
- [ ] Pengujian alur menyeluruh (*End-to-End*): **Login ──> Pilih Lapangan ──> Reservasi ──> Simpan Ke Database ──> Tampil di Laporan Admin**.

---

## 📂 BUKTI FISIK YANG HARUS DIKUMPULKAN KE ASESOR
1. `[ ]` Dokumen Analisis Skalabilitas Perangkat Lunak
2. `[x]` ERD dan SQL Script (PostgreSQL)
3. `[x]` User Interface Screenshots & Source Code (.tsx)
4. `[ ]` Dokumentasi Kode Program
5. `[ ]` Laporan Debugging Sistem Reservasi
6. `[ ]` Hasil Profiling Program (React Profiler)
7. `[ ]` Hasil Unit Testing & Integration Testing Document
8. `[ ]` Link Live Demo Aplikasi (Vercel Deployment URL)
