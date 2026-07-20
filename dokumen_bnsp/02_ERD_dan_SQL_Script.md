# Dokumen 2: ERD dan SQL Script

**Mata Uji Kompetensi:** 
- J.620100.020.02 Menggunakan SQL
- J.620100.021.02 Menerapkan Akses Basis Data
**Proyek:** Sistem Reservasi Lapangan Olahraga SM Sport Center

---

## 1. Entity Relationship Diagram (ERD)

Desain basis data terdiri dari tiga tabel utama dengan relasi sebagai berikut:
- **Tabel `pelanggan`** memiliki relasi *One-to-Many* (1:N) terhadap tabel `reservasi` (Seorang pelanggan dapat membuat banyak reservasi).
- **Tabel `lapangan`** memiliki relasi *One-to-Many* (1:N) terhadap tabel `reservasi` (Satu lapangan dapat memiliki banyak reservasi).

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : "membuat"
    COURT ||--o{ BOOKINGS : "dipesan dalam"

    USERS {
        serial id PK
        varchar name
        varchar email
        varchar phone
        varchar password
        timestamp created_at
    }

    COURT {
        serial id PK
        varchar name
        varchar type
        decimal price_per_hour
    }

    BOOKINGS {
        serial id PK
        int user_id FK
        int court_id FK
        date date
        time start_time
        time end_time
        varchar status
        decimal dp_amount
        timestamp created_at
    }
```

---

## 2. Implementasi SQL Script

Skrip SQL (_Data Definition Language_ dan _Data Manipulation Language_) yang digunakan untuk merancang skema *database* PostgreSQL melalui koneksi _Cloud_ (Neon DB):

```sql
-- ==========================================
-- DDL: PEMBUATAN TABEL DAN STRUKTUR DATABASE
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

-- 2. Membuat tabel Court
CREATE TABLE IF NOT EXISTS court (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(50) NOT NULL, 
  price_per_hour DECIMAL(10,2) NOT NULL
);

-- 3. Membuat tabel Bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  court_id INTEGER NOT NULL REFERENCES court(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Menunggu Pembayaran',
  dp_amount DECIMAL(10,2) DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

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
```
