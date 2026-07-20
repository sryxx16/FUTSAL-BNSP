# Hasil Profiling Program

**Sistem Reservasi SM Sport Center**
**Unit Kompetensi:** 
- J.620100.031.01 Melakukan Profiling Program
- J.620100.032.01 Melaksanakan Code Review

| Keterangan | Detail |
|---|---|
| **Skema Sertifikasi (KKNI/Okupasi/Klaster)** | Analis Program |
| **Nomor** | SKM-2019-62010-002 |
| **TUK** | Sewaktu/Tempat Kerja/Mandiri** |
| **Nama Asesor** | Irmawati Carolina |
| **Nama Asesi** | Surya Daffa Fauzi Khoerudin |

---

## 1. Menjalankan Profiling Performa
Aplikasi dijalankan dalam mode pengembangan (*development*) di lingkungan *localhost* (Next.js server). Alat ukur yang digunakan adalah **React Developer Tools (Tab Profiler)** pada peramban web (Google Chrome).

Pengukuran performa (*Record Profiling*) dilakukan pada aksi transisi halaman dari Halaman Utama ke Halaman **Dasbor Admin**, serta simulasi memuat data (_fetching_) dari *database* PostgreSQL.

## 2. Identifikasi Bagian yang Lambat
Berdasarkan pembacaan grafik _Flamegraph_ pada React Profiler, terdeteksi satu fungsi yang berpotensi memiliki beban waktu yang relatif lambat (potensi _bottleneck UI_):
- **Komponen**: `<ReservationsView />` di halaman Dasbor Admin.
- **Waktu Render Rata-rata**: 85 milidetik (relatif normal saat ini, namun berisiko meningkat pesat jika baris tabel data menembus ribuan).
- **Penyebab**: Proses pemfilteran (*filtering*) dan pengurutan (*sorting*) _array state_ yang menyimpan ratusan daftar transaksi dilakukan secara berulang-ulang (*re-rendering*) setiap kali pengguna mengetik satu huruf di kotak pencarian atau mengubah opsi *dropdown*. 
Algoritma filter biasa akan me-*looping* ulang seluruh elemen *array* secara destruktif, yang pada akhirnya memakan beban *thread* utama (*main thread execution*) pada *browser*.

## 3. Rekomendasi Perbaikan (Code Review)

### A. Penggunaan *Memoization* (`useMemo`)
Untuk mencegah *array* tabel dievaluasi dan disaring ulang dari awal jika pengguna hanya sekadar mengeklik tombol lain atau sistem merender ulang komponen tanpa mengubah *input* filter, direkomendasikan untuk mengimplementasikan **React `useMemo` hook**. 

`useMemo` akan "mengingat" (*cache*) hasil akhir pemfilteran sebelumnya, dan hanya akan melakukan kalkulasi penyaringan ulang **jika dan hanya jika** variabel pencarian atau *array* data transaksi aslinya mengalami perubahan nilai.

**Rekomendasi Pembaruan Kode:**
```typescript
import { useState, useMemo } from 'react';

// Sebelumnnya (Sangat Lambat pada Data Besar)
// const filteredReservations = reservations.filter(res => res.nama.includes(search));

// Sesudahnya (Optimal & Memiliki Cache)
const filteredReservations = useMemo(() => {
  return reservations.filter(res => 
    res.nama.toLowerCase().includes(search.toLowerCase())
  );
}, [reservations, search]); // Proses ini hanya dipicu jika 2 dependensi ini berubah
```

### B. Menerapkan *Pagination* (Penomoran Halaman)
Memuat puluhan ribu baris reservasi sekaligus ke dalam satu halaman antarmuka (UI) Dasbor Admin akan membuat *browser* kehabisan memori (*Out of Memory*). Sangat disarankan untuk menerapkan pola **Server-Side Pagination**, di mana aplikasi (melalui koneksi *Next.js Server Actions*) hanya meminta dan merender maksimal 50 transaksi pertama setiap kali komponen dimuat, dan memuat sisanya secara efisien hanya jika Admin menekan tombol halaman selanjutnya.
