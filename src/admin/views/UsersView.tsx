import { useEffect, useState } from 'react';
import { getDaftarPelanggan, tambahPelangganAdmin, updatePelanggan, hapusPelanggan, getRiwayatBooking } from '../../lib/db';
import { Plus, Edit2, Trash2, X, Eye } from 'lucide-react';

export default function UsersView() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [formData, setFormData] = useState({ id: 0, nama: '', email: '' });
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
      alert("Belum ada data pelanggan untuk diekspor!");
      return;
    }
    const headers = ['Nama Lengkap', 'Email', 'Tanggal Daftar', 'Total Booking'];
    const csvData = users.map(u => `"${u.nama}","${u.email}","${u.tgl_daftar}","${u.total_booking}"`);
    const csvContent = [headers.join(','), ...csvData].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Data_Pelanggan_SMSport_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const openTambahModal = () => {
    setModalMode('tambah');
    setFormData({ id: 0, nama: '', email: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (u: any) => {
    setModalMode('edit');
    setFormData({ id: u.id, nama: u.nama, email: u.email });
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
        await tambahPelangganAdmin(formData.nama, formData.email);
        alert('Berhasil menambah pelanggan baru!');
      } else {
        await updatePelanggan(formData.id, formData.nama, formData.email);
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
    if (confirm(`Apakah Anda yakin ingin menghapus pelanggan ${nama}? Semua riwayat reservasinya juga akan ikut terhapus.`)) {
      try {
        await hapusPelanggan(id);
        alert('Pelanggan berhasil dihapus!');
        loadData();
      } catch (err) {
        alert('Gagal menghapus pelanggan.');
      }
    }
  };

  // Hitung total pengeluaran
  const totalSpent = userBookings.reduce((sum, b) => {
    if (b.status === 'Selesai' || b.status === 'Sudah DP 50%') {
      // Hitung durasi jam
      const start = new Date(`1970-01-01T${b.jam_mulai}Z`).getTime();
      const end = new Date(`1970-01-01T${b.jam_selesai}Z`).getTime();
      const hours = (end - start) / (1000 * 60 * 60);
      return sum + (b.harga_per_jam * hours);
    }
    return sum;
  }, 0);

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(harga);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
         <h2 className="text-2xl font-bold text-white">Manajemen Pelanggan</h2>
         <div className="flex items-center gap-3">
           <button 
             onClick={handleExportCSV}
             className="bg-slate-800 text-white font-bold px-4 py-2 rounded-lg border border-slate-700 hover:bg-slate-700 transition-colors"
           >
             Ekspor (CSV)
           </button>
           <button 
             onClick={openTambahModal}
             className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-2"
           >
             <Plus size={18} /> Tambah Pelanggan
           </button>
         </div>
      </div>
      
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-slate-950/50 text-slate-400 text-sm">
                <th className="p-4 font-medium">Nama / Email</th>
                <th className="p-4 font-medium">Tgl Daftar</th>
                <th className="p-4 font-medium text-center">Total Booking</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Memuat pelanggan...</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="p-8 text-center text-slate-400">Belum ada pelanggan</td></tr>
              ) : users.map((row) => (
                <tr key={row.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-medium text-white">{row.nama}</div>
                    <div className="text-xs text-slate-500">{row.email}</div>
                  </td>
                  <td className="p-4 text-slate-400">{row.tgl_daftar}</td>
                  <td className="p-4 text-center text-emerald-400 font-bold">{row.total_booking}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openDetailModal(row)} className="p-2 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors" title="Lihat Detail Riwayat">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => openEditModal(row)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors" title="Edit">
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(row.id, row.nama)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors" title="Hapus">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD Pelanggan */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white mb-6">
              {modalMode === 'tambah' ? 'Tambah Pelanggan Baru' : 'Edit Pelanggan'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.nama}
                  onChange={e => setFormData({...formData, nama: e.target.value})}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Alamat Email</label>
                <input 
                  type="email" 
                  value={formData.email}
                  onChange={e => setFormData({...formData, email: e.target.value})}
                  required
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button 
                type="submit" 
                disabled={processing}
                className="w-full bg-emerald-500 text-slate-950 font-bold py-3 rounded-lg hover:bg-emerald-400 transition-colors mt-4 disabled:opacity-50"
              >
                {processing ? 'Menyimpan...' : 'Simpan Data'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail Riwayat */}
      {isDetailModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl w-full max-w-2xl shadow-2xl relative max-h-[90vh] flex flex-col">
            <button 
              onClick={() => setIsDetailModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X size={24} />
            </button>
            <h3 className="text-xl font-bold text-white mb-2">
              Detail Riwayat: {selectedUser.nama}
            </h3>
            <p className="text-sm text-slate-400 mb-4">{selectedUser.email} &bull; Bergabung sejak {selectedUser.tgl_daftar}</p>
            
            <div className="bg-slate-950/50 rounded-xl p-4 mb-6 border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs text-slate-400 mb-1">Total Reservasi (Sukses)</p>
                <p className="text-lg font-bold text-white">{userBookings.filter(b => b.status === 'Selesai' || b.status === 'Sudah DP 50%').length} Kali</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-400 mb-1">Total Uang Dihabiskan (LTV)</p>
                <p className="text-xl font-bold text-emerald-400">{formatUang(totalSpent)}</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-2">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 text-slate-400 text-sm">
                    <th className="p-3 font-medium">Tanggal</th>
                    <th className="p-3 font-medium">Lapangan</th>
                    <th className="p-3 font-medium">Jam</th>
                    <th className="p-3 font-medium">Biaya</th>
                    <th className="p-3 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {loadingBookings ? (
                    <tr><td colSpan={5} className="p-4 text-center text-slate-400">Memuat riwayat...</td></tr>
                  ) : userBookings.length === 0 ? (
                    <tr><td colSpan={5} className="p-4 text-center text-slate-400">Belum ada riwayat booking</td></tr>
                  ) : userBookings.map((b) => (
                    <tr key={b.id} className="border-b border-slate-800/50 hover:bg-slate-800/20">
                      <td className="p-3 text-slate-300">{new Date(b.tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</td>
                      <td className="p-3 text-emerald-400">{b.lapangan_nama}</td>
                      <td className="p-3 text-slate-300">{b.jam_mulai.substring(0,5)} - {b.jam_selesai.substring(0,5)}</td>
                      <td className="p-3 text-emerald-400 font-bold">
                        {formatUang(b.harga_per_jam * ((new Date(`1970-01-01T${b.jam_selesai}Z`).getTime() - new Date(`1970-01-01T${b.jam_mulai}Z`).getTime()) / (1000*60*60)))}
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'Selesai' ? 'text-emerald-400 bg-emerald-400/10' :
                          b.status === 'Sudah DP 50%' ? 'text-blue-400 bg-blue-400/10' :
                          b.status === 'Dibatalkan' ? 'text-red-400 bg-red-400/10' :
                          'text-yellow-400 bg-yellow-400/10'
                        }`}>
                          {b.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
