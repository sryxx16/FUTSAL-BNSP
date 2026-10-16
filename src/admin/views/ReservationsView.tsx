"use client";
import { useEffect, useState } from 'react';
import {
  getSemuaReservasi,
  hapusReservasi,
  updateStatusReservasi,
  getDaftarLapangan,
  buatReservasiDB,
} from '../../lib/db';
import {
  X,
  Loader2,
  Printer,
  Search,
  Plus,
  Clock,
  Trash2,
  CheckCircle,
  RotateCcw,
  CreditCard,
} from 'lucide-react';

export default function ReservationsView() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [lapanganList, setLapanganList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterDate, setFilterDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [pelunasanData, setPelunasanData] = useState<any>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    lapangan_id: '',
    pelanggan_nama: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: '',
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, lapData] = await Promise.all([
        getSemuaReservasi(),
        getDaftarLapangan(),
      ]);
      setReservations(resData);
      setLapanganList(lapData);

      if (lapData.length > 0 && !formData.lapangan_id) {
        setFormData((prev) => ({ ...prev, lapangan_id: lapData[0].id.toString() }));
      }
    } catch (error) {
      console.error('Gagal mengambil data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: number, nama: string) => {
    if (confirm(`Yakin ingin menghapus reservasi #${id} atas nama "${nama}"? Data yang dihapus tidak dapat dipulihkan.`)) {
      try {
        await hapusReservasi(id);
        await loadData();
      } catch (e) {
        alert('Gagal menghapus data.');
      }
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await updateStatusReservasi(id, status);
      setEditingId(null);
      await loadData();
    } catch (e) {
      alert('Gagal mengubah status.');
    }
  };

  const handleCreateManual = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.jam_mulai >= formData.jam_selesai) {
      alert('Waktu mulai harus lebih awal dari waktu selesai.');
      return;
    }

    const startHour = parseInt(formData.jam_mulai.split(':')[0]);
    const endHour = parseInt(formData.jam_selesai.split(':')[0]);

    if (startHour < 8 || endHour > 23 || (endHour === 23 && parseInt(formData.jam_selesai.split(':')[1]) > 0)) {
      alert('Maaf, jam operasional kami adalah 08:00 - 23:00');
      return;
    }

    setFormLoading(true);
    try {
      const result = await buatReservasiDB(
        formData.pelanggan_nama,
        parseInt(formData.lapangan_id),
        formData.tanggal,
        formData.jam_mulai,
        formData.jam_selesai
      );

      if (!result.success) {
        alert(result.error || 'Gagal menyimpan reservasi');
        return;
      }

      alert('Reservasi manual berhasil ditambahkan!');
      setShowModal(false);
      setFormData((prev) => ({
        ...prev,
        pelanggan_nama: '',
        tanggal: '',
        jam_mulai: '',
        jam_selesai: '',
      }));
      await loadData();
    } catch (err: any) {
      alert('Gagal menyimpan reservasi. Terjadi kesalahan sistem.');
    } finally {
      setFormLoading(false);
    }
  };

  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const hitungTotalHarga = (jamMulai: string, jamSelesai: string, hargaPerJam: number) => {
    if (!jamMulai || !jamSelesai) return hargaPerJam;
    const [h1, m1] = jamMulai.split(':').map(Number);
    const [h2, m2] = jamSelesai.split(':').map(Number);
    const totalMenit = h2 * 60 + m2 - (h1 * 60 + m1);
    return (totalMenit / 60) * hargaPerJam;
  };

  const filtered = reservations.filter((r) => {
    if (filterStatus !== 'Semua Status' && r.status !== filterStatus) return false;
    if (filterDate) {
      if (formatTanggal(r.tanggal) !== formatTanggal(filterDate)) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.pelanggan_nama?.toLowerCase().includes(q);
      const matchCourt = r.lapangan_nama?.toLowerCase().includes(q);
      const matchId = r.id?.toString().includes(q);
      if (!matchName && !matchCourt && !matchId) return false;
    }
    return true;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Selesai':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            Selesai (Lunas)
          </span>
        );
      case 'Sudah DP 50%':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Sudah DP 50%
          </span>
        );
      case 'Menunggu Pembayaran':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
            Menunggu
          </span>
        );
      case 'Dibatalkan':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            Dibatalkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 relative print:space-y-2">
      {/* Header Print Only */}
      <div className="hidden print:block text-center mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Laporan Jadwal & Reservasi Lapangan</h2>
        <p className="text-slate-600">SM Sport Center - {new Date().toLocaleDateString('id-ID', { dateStyle: 'full' })}</p>
      </div>

      {/* Control Bar: Search & Action Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4 print:hidden bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search Input */}
          <div className="relative min-w-[220px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari pelanggan / ID..."
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
          >
            <option>Semua Status</option>
            <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
            <option value="Sudah DP 50%">Sudah DP 50%</option>
            <option value="Selesai">Selesai (Lunas)</option>
            <option value="Dibatalkan">Dibatalkan</option>
          </select>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-700 font-medium focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
            />
            {filterDate && (
              <button
                onClick={() => setFilterDate('')}
                title="Reset Tanggal"
                className="text-xs text-slate-500 hover:text-slate-800 p-2 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <RotateCcw size={14} />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center gap-2"
          >
            <Printer size={16} className="text-slate-500" />
            <span>Cetak Rekap</span>
          </button>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Reservasi Manual</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs print:border-none print:shadow-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse min-w-[850px] print:min-w-full print:text-black">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-xs font-semibold uppercase tracking-wider print:bg-slate-100 print:text-black">
                <th className="py-3.5 px-5">ID</th>
                <th className="py-3.5 px-5">Pelanggan</th>
                <th className="py-3.5 px-5">Lapangan</th>
                <th className="py-3.5 px-5">Jadwal Main</th>
                <th className="py-3.5 px-5">Total Biaya</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <Loader2 size={28} className="animate-spin mx-auto text-emerald-600 mb-2 opacity-80" />
                    <span>Memuat data reservasi...</span>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-500">
                    <p className="font-medium text-slate-700">Tidak ada data reservasi</p>
                    <p className="text-xs text-slate-400 mt-1">Coba sesuaikan filter status atau kata kunci pencarian Anda.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-slate-50/80 transition-colors print:hover:bg-transparent"
                  >
                    <td className="py-4 px-5 text-slate-400 font-mono text-xs">
                      #{row.id}
                    </td>

                    <td className="py-4 px-5">
                      <div className="font-semibold text-slate-900">{row.pelanggan_nama}</div>
                    </td>

                    <td className="py-4 px-5">
                      <span className="font-medium text-slate-800">
                        {row.lapangan_nama}
                      </span>
                    </td>

                    <td className="py-4 px-5">
                      <div className="text-slate-900 font-medium">
                        {formatTanggal(row.tanggal)}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock size={12} className="text-slate-400" />
                        <span>{row.jam_mulai.substring(0, 5)} - {row.jam_selesai.substring(0, 5)}</span>
                      </div>
                    </td>

                    <td className="py-4 px-5 font-semibold text-slate-900">
                      {formatUang(
                        hitungTotalHarga(row.jam_mulai, row.jam_selesai, row.harga_per_jam)
                      )}
                    </td>

                    <td className="py-4 px-5">
                      {editingId === row.id ? (
                        <select
                          autoFocus
                          defaultValue={row.status}
                          onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                          onBlur={() => setEditingId(null)}
                          className="bg-white border-2 border-emerald-500 text-slate-900 rounded-lg px-2.5 py-1 text-xs font-semibold shadow-xs outline-none cursor-pointer"
                        >
                          <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
                          <option value="Sudah DP 50%">Sudah DP 50%</option>
                          <option value="Selesai">Selesai (Lunas)</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                      ) : (
                        <button
                          onClick={() => setEditingId(row.id)}
                          className="cursor-pointer hover:opacity-85 transition-opacity"
                          title="Klik untuk mengubah status secara langsung"
                        >
                          {getStatusBadge(row.status)}
                        </button>
                      )}
                    </td>

                    <td className="py-4 px-5 text-center print:hidden">
                      <div className="flex items-center justify-center gap-1.5">
                        {row.status === 'Sudah DP 50%' && (
                          <button
                            onClick={() => setPelunasanData(row)}
                            className="px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/80 transition-colors flex items-center gap-1"
                            title="Konfirmasi Pelunasan Sisa 50%"
                          >
                            <CreditCard size={13} />
                            <span>Pelunasan</span>
                          </button>
                        )}

                        <button
                          onClick={() => setEditingId(row.id)}
                          className="px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-slate-200/60"
                        >
                          Ubah
                        </button>

                        <button
                          onClick={() => handleDelete(row.id, row.pelanggan_nama)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Reservasi"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="py-3.5 px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50 print:hidden">
          <span>
            Menampilkan <strong className="text-slate-700 font-semibold">{filtered.length}</strong> dari{' '}
            <strong className="text-slate-700 font-semibold">{reservations.length}</strong> total reservasi
          </span>
          <span className="text-[11px] text-slate-400">
            * Klik badge status untuk mengubah status reservasi secara cepat
          </span>
        </div>
      </div>

      {/* Modal Popup Reservasi Manual */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">Buat Reservasi Manual</h3>
                <p className="text-xs text-slate-500 mt-0.5">Input pemesanan lapangan langsung dari kasir/admin</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateManual} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Nama Pelanggan <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.pelanggan_nama}
                  onChange={(e) =>
                    setFormData({ ...formData, pelanggan_nama: e.target.value })
                  }
                  placeholder="Contoh: Budi Santoso / Tim Rajawali"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Pilih Lapangan <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.lapangan_id}
                  onChange={(e) =>
                    setFormData({ ...formData, lapangan_id: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                >
                  {lapanganList.map((lap) => (
                    <option key={lap.id} value={lap.id}>
                      {lap.nama} ({formatUang(lap.harga_per_jam)} / jam)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Tanggal Main <span className="text-rose-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  value={formData.tanggal}
                  onChange={(e) =>
                    setFormData({ ...formData, tanggal: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Jam Mulai <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.jam_mulai}
                    onChange={(e) =>
                      setFormData({ ...formData, jam_mulai: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Pilih Jam</option>
                    {Array.from({ length: 16 }).map((_, i) => {
                      const hour = (i + 8).toString().padStart(2, '0');
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                    Jam Selesai <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.jam_selesai}
                    onChange={(e) =>
                      setFormData({ ...formData, jam_selesai: e.target.value })
                    }
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="">Pilih Jam</option>
                    {Array.from({ length: 16 }).map((_, i) => {
                      const hour = (i + 8).toString().padStart(2, '0');
                      return (
                        <option key={hour} value={`${hour}:00`}>
                          {hour}:00
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-xl shadow-xs shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {formLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Reservasi'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Popup Konfirmasi Pelunasan */}
      {pelunasanData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">Konfirmasi Pelunasan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Selesaikan sisa pembayaran uang sewa lapangan</p>
              </div>
              <button
                onClick={() => setPelunasanData(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/70 space-y-2.5 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Pelanggan</span>
                  <span className="font-semibold text-slate-900">
                    {pelunasanData.pelanggan_nama}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Lapangan</span>
                  <span className="font-medium text-slate-800">
                    {pelunasanData.lapangan_nama}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 text-xs">Jadwal</span>
                  <span className="text-slate-700 text-xs">
                    {formatTanggal(pelunasanData.tanggal)} ({pelunasanData.jam_mulai.substring(0, 5)} - {pelunasanData.jam_selesai.substring(0, 5)})
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1 text-sm">
                <div className="flex justify-between text-slate-600 text-xs">
                  <span>Total Biaya Sewa</span>
                  <span className="font-medium text-slate-800">
                    {formatUang(
                      hitungTotalHarga(
                        pelunasanData.jam_mulai,
                        pelunasanData.jam_selesai,
                        pelunasanData.harga_per_jam
                      )
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-blue-700">
                  <span>DP Dibayar (50%)</span>
                  <span className="font-semibold">
                    -{' '}
                    {formatUang(
                      hitungTotalHarga(
                        pelunasanData.jam_mulai,
                        pelunasanData.jam_selesai,
                        pelunasanData.harga_per_jam
                      ) / 2
                    )}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-3 border-t border-slate-200 bg-rose-50/80 p-3.5 rounded-xl border border-rose-200/70">
                  <span className="font-semibold text-slate-900 text-sm">Sisa Pelunasan</span>
                  <span className="font-bold text-xl text-rose-600">
                    {formatUang(
                      hitungTotalHarga(
                        pelunasanData.jam_mulai,
                        pelunasanData.jam_selesai,
                        pelunasanData.harga_per_jam
                      ) / 2
                    )}
                  </span>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  onClick={() => setPelunasanData(null)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(pelunasanData.id, 'Selesai');
                    setPelunasanData(null);
                  }}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-xl shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-1.5"
                >
                  <CheckCircle size={16} />
                  <span>Konfirmasi Lunas</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
