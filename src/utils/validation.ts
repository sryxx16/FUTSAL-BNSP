import type { Reservasi } from '../types/database';

/**
 * Validasi apakah ada jadwal bentrok (time overlap).
 * @param existingReservasi Daftar reservasi pada lapangan dan tanggal yang sama.
 * @param newMulai Jam mulai yang diajukan (HH:mm).
 * @param newSelesai Jam selesai yang diajukan (HH:mm).
 * @returns boolean True jika bentrok, False jika aman.
 */
export function checkTimeOverlap(
  existingReservasi: Reservasi[],
  newMulai: string,
  newSelesai: string
): boolean {
  // Convert HH:mm to minutes for easier comparison
  const timeToMinutes = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const newStart = timeToMinutes(newMulai);
  const newEnd = timeToMinutes(newSelesai);

  // Validasi durasi logis
  if (newStart >= newEnd) return true; 

  return existingReservasi.some((res) => {
    const existStart = timeToMinutes(res.jam_mulai);
    const existEnd = timeToMinutes(res.jam_selesai);

    // Rumus overlap: StartA < EndB AND EndA > StartB
    return newStart < existEnd && newEnd > existStart;
  });
}
