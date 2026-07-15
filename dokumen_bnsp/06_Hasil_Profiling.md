# Dokumen 6: Hasil Profiling Program

**Mata Uji Kompetensi:** 
- J.620100.031.01 Melakukan Profiling Program
- J.620100.032.01 Melaksanakan Code Review
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Menjalankan Profiling Performa
Aplikasi dijalankan dalam mode pengembangan (*development*) di lingkungan *localhost*. Alat ukur yang digunakan adalah **React Developer Tools (Tab Profiler)** pada peramban web (Google Chrome).

Pengukuran performa (*Record Profiling*) dilakukan pada aksi transisi halaman dari Halaman Utama ke Halaman **Dasbor Admin**, serta simulasi memuat data (_fetching_) dari *database*.

## 2. Identifikasi Bagian yang Lambat
Berdasarkan pembacaan grafik _Flamegraph_ pada React Profiler, terdeteksi satu fungsi yang berpotensi memiliki waktu beban lambat (potensi _bottleneck UI_):
- **Komponen**: `<ReservationsView />` di halaman Admin.
- **Waktu Render Rata-rata**: 85 milidetik (relatif normal saat ini, namun bisa meningkat jika baris tabel melebihi ribuan).
- **Penyebab**: Proses pemfilteran (*filtering*) dan pengurutan (*sorting*) array state yang menyimpan ratusan daftar transaksi dilakukan secara berulang-ulang (*re-rendering*) setiap kali pengguna mengetik di kotak pencarian atau mengubah opsi *dropdown* (Status). 
Algoritma filter biasa akan me-*looping* kembali seluruh elemen *array* secara destruktif yang memakan beban *thread* utama (*main thread execution*).

## 3. Rekomendasi Perbaikan (Code Review)

### A. Penggunaan *Memoization* (`useMemo`)
Untuk mencegah *array* tabel dievaluasi dan disaring ulang dari awal jika pengguna hanya sekadar mengeklik tombol atau merender ulang komponen tanpa mengubah input filter, direkomendasikan mengimplementasikan **React `useMemo` hook**. 

`useMemo` akan "mengingat" (*cache*) hasil akhir pemfilteran, dan hanya akan melakukan kalkulasi penyaringan ulang **jika** dan **hanya jika** variabel `filterText` atau *array* aslinya (data transaksi) berubah nilainya.

**Rekomendasi Pembaruan Kode:**
```typescript
import { useState, useMemo } from 'react';

// Sebelumnnya (Lambat)
// const filteredReservations = reservations.filter(res => res.nama.includes(search));

// Sesudahnya (Optimal)
const filteredReservations = useMemo(() => {
  return reservations.filter(res => 
    res.nama.toLowerCase().includes(search.toLowerCase())
  );
}, [reservations, search]); // Tergantung pada dua dependensi ini saja
```

### B. Menerapkan *Pagination* (Penomoran Halaman)
Memuat puluhan ribu baris reservasi sekaligus ke dalam satu halaman antarmuka (UI) akan membuat peramban (browser) kehabisan memori. Sangat disarankan untuk menerapkan **Server-Side Pagination** atau *Virtual Scrolling*, di mana aplikasi hanya meminta dan merender 20 - 50 transaksi setiap kali komponen dimuat, dan memuat sisanya jika admin menekan tombol "Halaman 2".
