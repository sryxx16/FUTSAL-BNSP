"use client";
import { useEffect, useState } from 'react';
import {
  getDaftarPelanggan,
  tambahPelangganAdmin,
  updatePelanggan,
  hapusPelanggan,
  getRiwayatBooking,
} from '../../lib/db';
import {
  Plus,
  Edit2,
  Trash2,
  X,
  Eye,
  Search,
  Download,
  Calendar,
  Phone,
  Mail,
  Loader2,
} from 'lucide-react';

export default function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [formData, setFormData] = useState({ id: 0, nama: '', email: '', no_hp: '' });
  const [processing, setProcessing] = useState(false);

  // Detail Modal states
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getDaftarPelanggan();
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleExportCSV = () => {
    if (users.length === 0) {
      alert('Belum ada data pelanggan untuk diekspor!');
      return;
    }
    const headers = ['Nama Lengkap', 'Email', 'No HP', 'Tanggal Daftar', 'Total Booking'];
    const csvData = users.map(
      (u) => `"${u.nama}","${u.email}","${u.no_hp || '-'}","${u.tgl_daftar}","${u.total_booking}"`
    );
    const csvContent = [headers.join(','), ...csvData].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Pelanggan_SMSport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openTambahModal = () => {
    setModalMode('tambah');
    setFormData({ id: 0, nama: '', email: '', no_hp: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setModalMode('edit');
    setFormData({ id: u.id, nama: u.nama, email: u.email, no_hp: u.no_hp || '' });
    setIsModalOpen(true);
  };

  const openDetailModal = async (u: any) => {
    setSelectedUser(u);
    setIsDetailModalOpen(true);
    setLoadingBookings(true);
    try {
      const bookings = await getRiwayatBooking(u.id);
      setUserBookings(bookings);
    } catch (e) {
      console.error(e);
      alert('Gagal mengambil riwayat booking');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    try {
      if (modalMode === 'tambah') {
        await tambahPelangganAdmin(formData.nama, formData.email, formData.no_hp);
        alert('Berhasil menambah pelanggan baru!');
      } else {
        await updatePelanggan(formData.id, formData.nama, formData.email, formData.no_hp);
        alert('Berhasil memperbarui data pelanggan!');
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Terjadi kesalahan');
    } finally {
      setProcessing(false);
    }
  };

  const handleDelete = async (id: number, nama: string) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pelanggan "${nama}"? Semua riwayat reservasinya juga akan ikut terhapus.`)) {
      try {
        await hapusPelanggan(id);
        alert('Pelanggan berhasil dihapus!');
        loadData();
      } catch (err) {
        alert('Gagal menghapus pelanggan.');
      }
    }
  };

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(harga);
  };

  const filteredUsers = users.filter((u) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      u.nama?.toLowerCase().includes(q) ||
      u.email?.toLowerCase().includes(q) ||
      u.no_hp?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Filter & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        {/* Search */}
        <div className="relative min-w-[260px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, email, no HP..."
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

        {/* Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all flex items-center gap-2"
          >
            <Download size={15} className="text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={openTambahModal}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] shadow-xs shadow-emerald-600/20 transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Tambah Pelanggan</span>
          </button>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-5">Profil Pelanggan</th>
                <th className="py-3.5 px-5">Kontak</th>
                <th className="py-3.5 px-5">Tgl Bergabung</th>
                <th className="py-3.5 px-5 text-center">Total Reservasi</th>
                <th className="py-3.5 px-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto text-emerald-600 mb-2 opacity-80" />
                    <span>Memuat daftar pelanggan...</span>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-500">
                    <p className="font-medium text-slate-700">Tidak ada pelanggan ditemukan</p>
                    <p className="text-xs text-slate-400 mt-1">Gunakan tombol tambah pelanggan untuk menambahkan member baru.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs shrink-0 border border-slate-200">
                          {row.nama?.substring(0, 2).toUpperCase() || 'PL'}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900 leading-snug">{row.nama}</div>
                          <div className="text-xs text-slate-400 font-mono">ID: #{row.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="text-slate-700 text-xs flex items-center gap-1.5">
                        <Mail size={13} className="text-slate-400" />
                        <span>{row.email}</span>
                      </div>
                      {row.no_hp && (
                        <div className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                          <Phone size={13} className="text-slate-400" />
                          <span>{row.no_hp}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 px-5 text-slate-600 text-xs font-medium">
                      {row.tgl_daftar}
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/80">
                        {row.total_booking} booking
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => openDetailModal(row)}
                          className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Lihat Riwayat Booking"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => openEditModal(row)}
                          className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit Pelanggan"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(row.id, row.nama)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Hapus Pelanggan"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="py-3.5 px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 bg-slate-50/50">
          <span>
            Menampilkan <strong className="text-slate-700 font-semibold">{filteredUsers.length}</strong> dari{' '}
            <strong className="text-slate-700 font-semibold">{users.length}</strong> total pelanggan
          </span>
        </div>
      </div>

      {/* Modal CRUD Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {modalMode === 'tambah' ? 'Tambah Pelanggan Baru' : 'Edit Data Pelanggan'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {modalMode === 'tambah'
                    ? 'Daftarkan akun member baru ke dalam sistem'
                    : 'Perbarui kontak atau nama pelanggan'}
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nama Lengkap <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  placeholder="Contoh: Surya Pratama"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Alamat Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Nomor HP / WhatsApp
                </label>
                <input
                  type="tel"
                  value={formData.no_hp}
                  onChange={(e) => setFormData({ ...formData, no_hp: e.target.value })}
                  placeholder="081234567890"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={processing}
                  className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-xl shadow-xs shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {processing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    'Simpan Data'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Riwayat Booking Pelanggan */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/70">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 font-bold flex items-center justify-center text-sm border border-emerald-200/60">
                  {selectedUser.nama?.substring(0, 2).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{selectedUser.nama}</h3>
                  <p className="text-xs text-slate-500">{selectedUser.email} • Bergabung: {selectedUser.tgl_daftar}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 space-y-4">
              <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Riwayat Reservasi Lapangan ({userBookings.length} booking)
              </h4>

              {loadingBookings ? (
                <div className="py-8 text-center text-slate-400">
                  <Loader2 size={24} className="animate-spin mx-auto text-emerald-600 mb-2" />
                  <span>Memuat riwayat booking...</span>
                </div>
              ) : userBookings.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <Calendar size={32} className="mx-auto mb-2 opacity-50 text-slate-400" />
                  <p className="text-sm font-medium text-slate-600">Belum ada riwayat pemesanan</p>
                  <p className="text-xs text-slate-400 mt-0.5">Pelanggan ini belum melakukan booking lapangan.</p>
                </div>
              ) : (
                <div className="divide-y divide-slate-100 border border-slate-200/70 rounded-xl overflow-hidden">
                  {userBookings.map((b, idx) => (
                    <div key={idx} className="p-3.5 hover:bg-slate-50/70 transition-colors flex items-center justify-between gap-4">
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{b.lapangan_nama}</div>
                        <div className="text-xs text-slate-500 mt-0.5">
                          {new Date(b.tanggal).toLocaleDateString('id-ID', { dateStyle: 'medium' })} • {b.jam_mulai.substring(0, 5)} - {b.jam_selesai.substring(0, 5)}
                        </div>
                      </div>

                      <div className="text-right">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            b.status === 'Selesai'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : b.status === 'Sudah DP 50%'
                              ? 'bg-blue-50 text-blue-700 border border-blue-200'
                              : b.status === 'Dibatalkan'
                              ? 'bg-rose-50 text-rose-700 border border-rose-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {b.status}
                        </span>
                        <div className="text-xs font-semibold text-slate-700 mt-1">
                          {formatUang(b.harga_per_jam)} / jam
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/70 flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-200/70 rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
