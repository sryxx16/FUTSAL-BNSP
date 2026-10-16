"use client";
import { useEffect, useState } from 'react';
import { getDaftarLapangan, updateHargaLapangan } from '../../lib/db';
import {
  Save,
  Clock,
  DollarSign,
  ShieldCheck,
  User,
  Mail,
  CheckCircle2,
  Loader2,
  Sparkles,
} from 'lucide-react';

export default function SettingsView() {
  const [lapangan, setLapangan] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

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
    setLapangan((prev) =>
      prev.map((lap) =>
        lap.id === id ? { ...lap, harga_per_jam: parseInt(newHarga) || 0 } : lap
      )
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveSuccess(false);
    try {
      await Promise.all(
        lapangan.map((lap) => updateHargaLapangan(lap.id, lap.harga_per_jam))
      );
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (e) {
      alert('Gagal menyimpan perubahan pengaturan.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* Pengaturan Harga Lapangan */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Tarif Sewa Lapangan</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kelola harga sewa per jam untuk setiap lapangan futsal dan badminton
            </p>
          </div>
          <span className="text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200/60">
            Per Jam (IDR)
          </span>
        </div>

        <div className="space-y-6">
          {loading ? (
            <div className="py-8 text-center text-slate-400">
              <Loader2 size={24} className="animate-spin mx-auto text-emerald-600 mb-2" />
              <span>Memuat data lapangan...</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {lapangan.map((lap) => (
                <div
                  key={lap.id}
                  className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-4 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900 text-sm">{lap.nama}</span>
                    <span className="text-[11px] text-slate-500 font-medium uppercase px-2 py-0.5 rounded bg-white border border-slate-200">
                      ID #{lap.id}
                    </span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Rp
                    </span>
                    <input
                      type="number"
                      value={lap.harga_per_jam}
                      onChange={(e) => handleHargaChange(lap.id, e.target.value)}
                      className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-emerald-500 transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Jam Operasional */}
          <div className="pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Jam Buka & Operasional Lapangan
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Jam Buka Operasional
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    defaultValue="08:00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">
                  Jam Tutup Operasional
                </label>
                <div className="relative">
                  <Clock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <input
                    type="time"
                    defaultValue="23:00"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="pt-2 flex items-center gap-3">
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] rounded-xl shadow-xs shadow-emerald-600/20 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Menyimpan Perubahan...</span>
                </>
              ) : (
                <>
                  <Save size={16} />
                  <span>Simpan Tarif & Jam Operasional</span>
                </>
              )}
            </button>

            {saveSuccess && (
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 flex items-center gap-1.5 animate-in fade-in">
                <CheckCircle2 size={14} />
                <span>Berhasil disimpan ke Database!</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Profil Administrator */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Profil Administrator</h3>
            <p className="text-xs text-slate-500 mt-0.5">Informasi akun pengelola sistem SM Sport</p>
          </div>
          <span className="text-xs text-blue-700 font-semibold bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-200/60 flex items-center gap-1">
            <ShieldCheck size={13} />
            <span>Hak Akses Penuh</span>
          </span>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 items-start">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-extrabold text-2xl shrink-0 shadow-md shadow-emerald-500/20">
            AD
          </div>

          <div className="flex-1 space-y-4 w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Nama Akun</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    defaultValue="Super Administrator"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-600 block mb-1.5">Email Administrator</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    defaultValue="admin@smsport.com"
                    readOnly
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm font-medium text-slate-600 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => alert('Profil administrator aktif.')}
                className="px-4 py-2.5 text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
              >
                Perbarui Informasi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
