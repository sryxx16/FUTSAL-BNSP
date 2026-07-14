export type LapanganType = 'Futsal' | 'Badminton';

export interface Lapangan {
  id: string;
  nama: string;
  tipe: LapanganType;
  harga_per_jam: number;
}

export interface Reservasi {
  id: string;
  lapangan_id: string;
  pelanggan_nama: string;
  tanggal: string; // YYYY-MM-DD
  jam_mulai: string; // HH:mm
  jam_selesai: string; // HH:mm
}

// Mock Data untuk Frontend Statis
export const mockLapangan: Lapangan[] = [
  { id: 'F1', nama: 'Futsal Court A (Vinyl)', tipe: 'Futsal', harga_per_jam: 150000 },
  { id: 'F2', nama: 'Futsal Court B (Sintetis)', tipe: 'Futsal', harga_per_jam: 120000 },
  { id: 'B1', nama: 'Badminton Court 1', tipe: 'Badminton', harga_per_jam: 50000 },
  { id: 'B2', nama: 'Badminton Court 2', tipe: 'Badminton', harga_per_jam: 50000 },
  { id: 'B3', nama: 'Badminton Court 3', tipe: 'Badminton', harga_per_jam: 50000 },
];

// Mock database reservasi untuk simulasi (Contoh ada 1 jadwal terisi di F1)
export const mockReservasi: Reservasi[] = [
  {
    id: 'R1',
    lapangan_id: 'F1',
    pelanggan_nama: 'Budi',
    tanggal: '2026-07-15',
    jam_mulai: '19:00',
    jam_selesai: '21:00'
  }
];
