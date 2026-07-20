"use client";
import { useEffect, useState } from 'react';
import { getDaftarLapangan, updateHargaLapangan } from '../../lib/db';

export default function SettingsView() {
  const [lapangan, setLapangan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getDaftarLapangan();
        setLapangan(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleHargaChange = (id: number, newHarga: string) => {
    setLapangan(prev => prev.map(lap => lap.id === id ? { ...lap, harga_per_jam: parseInt(newHarga) || 0 } : lap));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update all prices
      await Promise.all(lapangan.map(lap => updateHargaLapangan(lap.id, lap.harga_per_jam)));
      alert('Perubahan harga berhasil disimpan ke Database!');
    } catch (e) {
      alert('Gagal menyimpan perubahan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
         <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Pengaturan Harga Lapangan</h3>
         <div className="space-y-6">
            {loading ? (
              <p className="text-slate-500">Memuat data dari database...</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 {lapangan.map(lap => (
                   <div key={lap.id}>
                     <label className="text-sm font-medium text-slate-500 block mb-2">{lap.nama} (Rp)</label>
                     <input 
                       type="number" 
                       value={lap.harga_per_jam} 
                       onChange={(e) => handleHargaChange(lap.id, e.target.value)}
                       className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" 
                     />
                   </div>
                 ))}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
               <div>
                 <label className="text-sm font-medium text-slate-500 block mb-2">Jam Buka Operasional</label>
                 <input type="time" defaultValue="08:00" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" style={{ colorScheme: 'dark' }} />
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-500 block mb-2">Jam Tutup Operasional</label>
                 <input type="time" defaultValue="23:00" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" style={{ colorScheme: 'dark' }} />
               </div>
            </div>
            <button 
              onClick={handleSave} 
              disabled={saving}
              className="bg-emerald-500 text-slate-950 font-bold px-6 py-3 rounded-lg hover:bg-emerald-400 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.2)] disabled:opacity-50"
            >
              {saving ? 'Menyimpan...' : 'Simpan Perubahan Lapangan'}
            </button>
         </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
         <h3 className="text-xl font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Profil Admin</h3>
         <div className="flex flex-col sm:flex-row gap-8 items-center sm:items-start">
            <div className="w-32 h-32 rounded-full bg-white border-4 border-slate-300 flex items-center justify-center relative overflow-hidden flex-shrink-0">
               <span className="text-4xl font-bold text-slate-500">AD</span>
            </div>
            <div className="flex-1 space-y-4 w-full">
               <div>
                 <label className="text-sm font-medium text-slate-500 block mb-2">Nama Tampilan</label>
                 <input type="text" defaultValue="Super Admin" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
               </div>
               <div>
                 <label className="text-sm font-medium text-slate-500 block mb-2">Email Admin</label>
                 <input type="email" defaultValue="admin@smsport.com" className="w-full bg-white border border-slate-200 rounded-lg px-4 py-3 text-slate-900 focus:outline-none focus:border-emerald-500 transition-colors" />
               </div>
               <button className="bg-white border border-slate-300 text-slate-900 font-bold px-6 py-3 rounded-lg hover:bg-slate-100 transition-colors">Update Profil</button>
            </div>
         </div>
      </div>
    </div>
  );
}
