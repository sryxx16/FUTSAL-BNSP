# Studi Kasus Analis Program - Sistem Reservasi Lapangan SM Sport Center

**Sistem Reservasi SM Sport Center**
**Unit Kompetensi:** J.620100.020.02 Menggunakan SQL

| Keterangan | Detail |
|---|---|
| **Skema Sertifikasi (KKNI/Okupasi/Klaster)** | Analis Program |
| **Nomor** | SKM-2019-62010-002 |
| **TUK** | Sewaktu/Tempat Kerja/Mandiri** |
| **Nama Asesor** | Irmawati Carolina |
| **Nama Asesi** | Surya Daffa Fauzi Khoerudin |

### PERMASALAHAN
SM Sport Center memiliki 2 lapangan futsal dan 3 lapangan badminton. Saat ini proses reservasi masih dilakukan melalui telepon dan WhatsApp sehingga sering terjadi:
a. Jadwal bentrok (double booking)
b. Kesalahan pencatatan transaksi
c. Sulit membuat laporan penggunaan lapangan
d. Sulit mengetahui lapangan yang masih tersedia 
Manajemen menginginkan sistem reservasi SM Sport Center berbasis web yang dapat digunakan pelanggan dan admin.

<br>

**Program Studi Teknologi Informasi Fakultas Teknik dan Informatika**
**Universitas Bina Sarana Informatika**
**Jakarta**
**2026**

---

## 1. ERD (ENTITY RELATIONSHIP DIAGRAM)

*(Diagram ERD)*

### 1. Tabel Users (Pelanggan)
| Nama Atribut | Tipe Data | Batasan (Constraint) | Keterangan |
|---|---|---|---|
| id | INT (SERIAL) | Primary Key (PK) | Kode unik identitas otomatis untuk setiap pengguna. |
| name | VARCHAR(100) | NOT NULL | Nama lengkap pengguna. |
| email | VARCHAR(100) | UNIQUE, NOT NULL | Alamat surel unik untuk autentikasi login dan komunikasi. |
| phone | VARCHAR(20) | DEFAULT '' | Nomor telepon atau kontak WhatsApp pengguna. |
| password | VARCHAR(255) | NOT NULL | Kata sandi akun yang telah diamankan (ter-hash). |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Catatan waktu otomatis saat akun pertama kali didaftarkan. |

### 2. Tabel Court (Lapangan Olahraga)
| Nama Atribut | Tipe Data | Batasan (Constraint) | Keterangan |
|---|---|---|---|
| id | INT (SERIAL) | Primary Key (PK) | Kode unik identitas otomatis untuk data lapangan. |
| name | VARCHAR(100) | NOT NULL | Nama identitas lapangan (misal: Futsal A, Badminton 1). |
| type | VARCHAR(50) | NOT NULL | Jenis cabang olahraga lapangan (Futsal / Badminton). |
| price_per_hour | DECIMAL(10,2) | NOT NULL | Nominal tarif sewa lapangan per jam. |

### 3. Tabel Bookings (Transaksi Reservasi)
| Nama Atribut | Tipe Data | Batasan (Constraint) | Keterangan |
|---|---|---|---|
| id | INT (SERIAL) | Primary Key (PK) | Kode unik nomor transaksi reservasi otomatis. |
| user_id | INTEGER | Foreign Key (FK) REFERENCES users(id) ON DELETE CASCADE | Relasi ke tabel pengguna yang melakukan penyewaan. |
| court_id | INTEGER | Foreign Key (FK) REFERENCES court(id) ON DELETE CASCADE | Relasi ke tabel lapangan yang dipilih untuk dipesan. |
| date | DATE | NOT NULL | Tanggal jadwal pelaksanaan reservasi lapangan. |
| start_time | TIME | NOT NULL | Jam operasional dimulainya penyewaan lapangan. |
| end_time | TIME | NOT NULL | Jam operasional selesainya penyewaan lapangan. |
| status | VARCHAR(50) | NOT NULL, DEFAULT 'Menunggu Pembayaran' | Status transaksi (Menunggu Pembayaran / Terjadwal / Dibatalkan). |
| dp_amount | DECIMAL(10,2) | DEFAULT 0 | Nominal uang muka yang dibayarkan (Opsi DP 50%). |
| total_price | DECIMAL(10,2) | DEFAULT 0 | Total kalkulasi biaya sewa yang harus dilunasi pelanggan. |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Catatan waktu saat pesanan pertama kali dibuat di sistem. |

---

## 2. SQL SCRIPT

```sql
-- ==========================================
-- DATABASE SCRIPT: SISTEM RESERVASI LAPANGAN
-- ==========================================

-- 1. Membuat tabel Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20) DEFAULT '',
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Membuat tabel Court (Lapangan)
CREATE TABLE IF NOT EXISTS court (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, 
  price_per_hour DECIMAL(10,2) NOT NULL
);

-- 3. Membuat tabel Bookings (Reservasi)
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  court_id INTEGER NOT NULL REFERENCES court(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Pembayaran',
  dp_amount DECIMAL(10,2) DEFAULT 0,
  total_price DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_end_after_start CHECK (end_time > start_time),
  CONSTRAINT chk_valid_dp CHECK (dp_amount >= 0 AND dp_amount <= total_price)
);

-- 4. Membuat Index untuk Optimalisasi Pencarian (Performa Tinggi)
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_court_id_idx ON bookings(court_id);
CREATE UNIQUE INDEX IF NOT EXISTS users_email_idx ON users(email);

-- ==========================================
-- DML: PENGISIAN DATA AWAL (SEEDING)
-- ==========================================

-- A. Memasukkan data master Lapangan (2 Futsal, 3 Badminton)
INSERT INTO court (name, type, price_per_hour) VALUES
('Lapangan Futsal 1', 'Futsal', 150000),
('Lapangan Futsal 2', 'Futsal', 150000),
('Lapangan Badminton 1', 'Badminton', 50000),
('Lapangan Badminton 2', 'Badminton', 50000),
('Lapangan Badminton 3', 'Badminton', 50000)
ON CONFLICT DO NOTHING;

-- B. Memasukkan akun Administrator
INSERT INTO users (name, email, password) VALUES
('Super Admin', 'admin@smsport.com', 'admin123')
ON CONFLICT (email) DO NOTHING;

-- C. Memasukkan sampel data Pelanggan reguler
INSERT INTO users (name, email, password) VALUES
('Surya', 'surya@example.com', 'rahasia123'),
('Budi Santoso', 'budi.santoso@example.com', 'password123')
ON CONFLICT (email) DO NOTHING;

-- D. Memasukkan sampel data Reservasi (Booking)
INSERT INTO bookings (user_id, court_id, date, start_time, end_time, status, total_price) VALUES
(2, 1, CURRENT_DATE + INTERVAL '1 day', '19:00:00', '21:00:00', 'Sudah DP 50%', 300000),
(3, 3, CURRENT_DATE + INTERVAL '2 days', '15:00:00', '17:00:00', 'Menunggu Pembayaran', 100000)
ON CONFLICT DO NOTHING;
```
