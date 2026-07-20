"use client";
import { useEffect, useState } from 'react';
import { getSemuaReservasi, hapusReservasi, updateStatusReservasi, getDaftarLapangan, buatReservasiDB } from '../../lib/db';
import { X, Loader2, Printer, ChevronDown } from 'lucide-react';

export default function ReservationsView() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [lapanganList, setLapanganList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('Semua Status');
  const [filterDate, setFilterDate] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    lapangan_id: '',
    pelanggan_nama: '',
    tanggal: '',
    jam_mulai: '',
    jam_selesai: ''
  });

  const loadData = async () => {
    setLoading(true);
    try {
      const [resData, lapData] = await Promise.all([
        getSemuaReservasi(),
        getDaftarLapangan()
      ]);
      setReservations(resData);
      setLapanganList(lapData);
      
      if (lapData.length > 0 && !formData.lapangan_id) {
         setFormData(prev => ({ ...prev, lapangan_id: lapData[0].id.toString() }));
      }
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleDelete = async (id: number) => {
    if (window.confirm('Yakin ingin menghapus reservasi ini? Tindakan ini tidak dapat dibatalkan.')) {
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
      await buatReservasiDB(
        formData.pelanggan_nama, 
        parseInt(formData.lapangan_id), 
        formData.tanggal, 
        formData.jam_mulai, 
        formData.jam_selesai
      );
      
      alert('Reservasi manual berhasil ditambahkan!');
      setShowModal(false);
      setFormData(prev => ({ ...prev, pelanggan_nama: '', tanggal: '', jam_mulai: '', jam_selesai: '' }));
      await loadData(); // Refresh table
    } catch (err: any) {
      alert(err.message || 'Gagal menyimpan reservasi');
    } finally {
      setFormLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'text-emerald-600 bg-emerald-50 border border-emerald-500/30';
      case 'Sudah DP 50%': return 'text-blue-600 bg-blue-50 border border-blue-500/30';
      case 'Menunggu Pembayaran': return 'text-orange-500 bg-orange-50 border border-yellow-500/30';
      case 'Dibatalkan': return 'text-red-600 bg-red-50 border border-red-500/30';
      default: return 'text-slate-500 bg-slate-400/10 border border-slate-500/30';
    }
  };

  const formatTanggal = (date: any) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatUang = (harga: number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(harga);
  };

  const hitungTotalHarga = (jamMulai: string, jamSelesai: string, hargaPerJam: number) => {
    if (!jamMulai || !jamSelesai) return hargaPerJam;
    const [h1, m1] = jamMulai.split(':').map(Number);
    const [h2, m2] = jamSelesai.split(':').map(Number);
    const totalMenit = (h2 * 60 + m2) - (h1 * 60 + m1);
    return (totalMenit / 60) * hargaPerJam;
  };

  const filtered = reservations.filter(r => {
    if (filterStatus !== 'Semua Status' && r.status !== filterStatus) return false;
    if (filterDate) {
      if (formatTanggal(r.tanggal) !== formatTanggal(filterDate)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 relative print:space-y-2">
      <div className="hidden print:block text-center mb-6">
        <h2 className="text-2xl font-bold text-black">Laporan Penggunaan Lapangan</h2>
        <p className="text-gray-600">SM Sport Center - {new Date().toLocaleDateString('id-ID')}</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between gap-4 print:hidden">
         <div className="flex gap-4">
            <select 
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="bg-white border border-slate-200 rounded-lg px-4 py-2 text-slate-600 focus:outline-none focus:border-emerald-500"
            >
              <option>Semua Status</option>
              <option value="Menunggu Pembayaran">Menunggu Pembayaran</option>
              <option value="Sudah DP 50%">Sudah DP 50%</option>
              <option value="Selesai">Selesai</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
            <div className="relative inline-flex items-center min-w-[160px]">
              <input 
                type="date" 
                value={filterDate}
                onChange={e => setFilterDate(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg pl-4 pr-10 py-2 text-slate-600 focus:outline-none focus:border-emerald-500 relative z-10 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer" 
              />
              <ChevronDown size={18} className="absolute right-3 text-slate-500 z-20 pointer-events-none" />
            </div>
            {filterDate && (
              <button onClick={() => setFilterDate('')} className="text-sm text-slate-500 hover:text-slate-900">Clear Date</button>
            )}
         </div>
         <div className="flex gap-3">
           <button 
             onClick={() => window.print()}
             className="bg-white text-slate-900 font-bold px-4 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2"
           >
             <Printer size={18} /> Cetak Laporan
           </button>
           <button 
             onClick={() => setShowModal(true)}
             className="bg-emerald-500 text-slate-950 font-bold px-4 py-2 rounded-lg hover:bg-emerald-400 transition-colors text-center inline-block"
           >
             + Reservasi Manual
           </button>
         </div>
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden print:bg-white print:border-none print:shadow-none">
        <div className="overflow-x-auto print:overflow-visible">
          <table className="w-full text-left border-collapse min-w-[800px] print:min-w-full print:text-black">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-sm print:bg-gray-100 print:text-black print:border-b-2 print:border-gray-800">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Pelanggan</th>
                <th className="p-4 font-medium">Lapangan</th>
                <th className="p-4 font-medium">Waktu</th>
                <th className="p-4 font-medium">Harga</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium text-center print:hidden">Aksi</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Memuat data dari Neon DB...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="p-8 text-center text-slate-500">Tidak ada data yang sesuai filter</td></tr>
              ) : filtered.map((row) => (
                <tr key={row.id} className="border-b border-slate-200/50 hover:bg-white/20 transition-colors print:border-gray-300 print:hover:bg-transparent">
                  <td className="p-4 text-slate-500 print:text-black">#{row.id}</td>
                  <td className="p-4 text-slate-900 font-medium print:text-black">{row.pelanggan_nama}</td>
                  <td className="p-4 text-emerald-600 print:text-black">{row.lapangan_nama}</td>
                  <td className="p-4 text-slate-600 print:text-black">
                    {formatTanggal(row.tanggal)}<br/>
                    <span className="text-xs text-slate-500 print:text-black">{row.jam_mulai.substring(0,5)} - {row.jam_selesai.substring(0,5)}</span>
                  </td>
                  <td className="p-4 text-slate-600 print:text-black">{formatUang(hitungTotalHarga(row.jam_mulai, row.jam_selesai, row.harga_per_jam))}</td>
                  <td className="p-4 print:text-black">
                    {editingId === row.id ? (
                      <select 
                        autoFocus
                        defaultValue={row.status}
                        onChange={(e) => handleUpdateStatus(row.id, e.target.value)}
                        onBlur={() => setEditingId(null)}
                        className="bg-white border border-emerald-500 text-emerald-600 rounded px-2 py-1 text-xs font-bold outline-none"
                      >
                        <option value="Menunggu">Menunggu</option>
                        <option value="Selesai">Selesai</option>
                        <option value="Dibatalkan">Dibatalkan</option>
                      </select>
                    ) : (
                      <button 
                        onClick={() => setEditingId(row.id)}
                        className={`px-3 py-1 rounded-full text-xs font-bold hover:opacity-80 transition-opacity ${getStatusColor(row.status)}`}
                        title="Klik untuk ubah status"
                      >
                        {row.status}
                      </button>
                    )}
                  </td>
                  <td className="p-4 text-center print:hidden">
                    <button onClick={() => setEditingId(row.id)} className="text-blue-600 hover:text-blue-300 mx-2 transition-colors font-medium">Edit</button>
                    <button onClick={() => handleDelete(row.id)} className="text-red-600 hover:text-red-300 mx-2 transition-colors font-medium">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-200 flex justify-between items-center text-sm text-slate-500 print:hidden">
           <span>Menampilkan {filtered.length} data</span>
        </div>
      </div>

      {/* Modal Popup Reservasi Manual */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white border border-slate-300 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl relative">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
               <h3 className="text-xl font-bold text-slate-900">Buat Reservasi Manual</h3>
               <button onClick={() => setShowModal(false)} className="text-slate-500 hover:text-slate-900 transition-colors">
                 <X size={24} />
               </button>
            </div>
            
            <form onSubmit={handleCreateManual} className="p-6 space-y-4">
               <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Nama Pemesan</label>
                  <input 
                    type="text" required
                    value={formData.pelanggan_nama}
                    onChange={e => setFormData({...formData, pelanggan_nama: e.target.value})}
                    placeholder="Masukkan nama lengkap"
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  />
               </div>
               
               <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Pilih Lapangan</label>
                  <select 
                    required
                    value={formData.lapangan_id}
                    onChange={e => setFormData({...formData, lapangan_id: e.target.value})}
                    className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                  >
                    {lapanganList.map(lap => (
                      <option key={lap.id} value={lap.id}>
                        {lap.nama} - Rp {lap.harga_per_jam.toLocaleString('id-ID')} / jam
                      </option>
                    ))}
                  </select>
               </div>
               
               <div>
                  <label className="text-sm font-medium text-slate-600 block mb-1">Tanggal Main</label>
                  <div className="relative">
                    <input 
                      type="date" required
                      value={formData.tanggal}
                      onChange={e => setFormData({...formData, tanggal: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-4 pr-10 py-2 text-slate-900 focus:outline-none focus:border-emerald-500 relative z-10 appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:inset-0 [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                    />
                    <ChevronDown size={18} className="absolute right-3 top-3 text-slate-500 z-20 pointer-events-none" />
                  </div>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Jam Mulai</label>
                    <select 
                      required
                      value={formData.jam_mulai}
                      onChange={e => setFormData({...formData, jam_mulai: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Pilih Jam</option>
                      {Array.from({length: 16}).map((_, i) => {
                        const hour = (i + 8).toString().padStart(2, '0');
                        return <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-600 block mb-1">Jam Selesai</label>
                    <select 
                      required
                      value={formData.jam_selesai}
                      onChange={e => setFormData({...formData, jam_selesai: e.target.value})}
                      className="w-full bg-white border border-slate-300 rounded-lg px-4 py-2 text-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      <option value="">Pilih Jam</option>
                      {Array.from({length: 16}).map((_, i) => {
                        const hour = (i + 8).toString().padStart(2, '0');
                        return <option key={hour} value={`${hour}:00`}>{hour}:00</option>
                      })}
                    </select>
                  </div>
               </div>

               <div className="pt-4 flex justify-end gap-3">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="px-4 py-2 rounded-lg text-slate-600 hover:bg-white transition-colors"
                  >
                    Batal
                  </button>
                  <button 
                    type="submit" 
                    disabled={formLoading}
                    className="bg-emerald-500 text-slate-950 font-bold px-6 py-2 rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {formLoading ? <><Loader2 size={18} className="animate-spin" /> Menyimpan...</> : 'Simpan Reservasi'}
                  </button>
               </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
