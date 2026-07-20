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
