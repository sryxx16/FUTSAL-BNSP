"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Check, Sparkles, Layers, Shield } from 'lucide-react';
import Link from 'next/link';
import { getDaftarLapangan } from '../../lib/db';

interface CourtItem {
  id: number;
  nama: string;
  jenis: string;
  harga_per_jam: number;
}

export default function CourtsSection() {
  const [courts, setCourts] = useState<CourtItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'futsal' | 'badminton'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCourts() {
      try {
        const data = await getDaftarLapangan();
        setCourts(data as CourtItem[]);
      } catch (err) {
        console.error("Gagal memuat daftar lapangan:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCourts();
  }, []);

  const filteredCourts = courts.filter(court => {
    if (activeTab === 'futsal') return court.nama.toLowerCase().includes('futsal');
    if (activeTab === 'badminton') return court.nama.toLowerCase().includes('badminton');
    return true;
  });

  return (
    <section id="lapangan" className="py-20 lg:py-28 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-12">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-4"
          >
            <Sparkles size={14} />
            DAFTAR LAPANGAN KAMI
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight"
          >
            Pilihan Lapangan <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-300">Berstandar Turnamen</span>
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-slate-400 text-base sm:text-lg max-w-2xl"
          >
            Pilih lapangan sesuai kebutuhan tim Anda. Dirawat rutin setiap hari untuk menjamin kebersihan dan daya cengkeram optimal.
          </motion.p>

          {/* Sport Filter Tabs */}
          <div className="mt-8 flex items-center p-1 bg-slate-900/90 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Semua ({courts.length})
            </button>
            <button
              onClick={() => setActiveTab('futsal')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'futsal'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              ⚽ Futsal ({courts.filter(c => c.nama.toLowerCase().includes('futsal')).length})
            </button>
            <button
              onClick={() => setActiveTab('badminton')}
              className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                activeTab === 'badminton'
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏸 Badminton ({courts.filter(c => c.nama.toLowerCase().includes('badminton')).length})
            </button>
          </div>
        </div>

        {/* Courts Grid */}
        {loading ? (
          <div className="text-center py-16 text-slate-400">
            <div className="inline-block w-8 h-8 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm">Memuat katalog lapangan...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourts.map((court, i) => {
              const isFutsal = court.nama.toLowerCase().includes('futsal');
              const imageSrc = isFutsal ? '/futsal_new.jpg' : '/badminton_new.jpg';

              const specs = isFutsal
                ? [
                    'Lantai Vinyl Interlock FIFA',
                    'Ukuran Standar 26 x 16 Meter',
                    'Lampu LED Sorot 600 Lux',
                    'Jaring Pembatas Keliling 6m'
                  ]
                : [
                    'Karpet Vinyl Li-Ning BWF',
                    'Tiang & Jaring Standard Turnamen',
                    'Ceiling Tinggi 9 Meter',
                    'Pencahayaan LED 500 Lux Anti Silau'
                  ];

              return (
                <motion.div
                  key={court.id}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="group bg-slate-900/70 hover:bg-slate-900/95 backdrop-blur-md border border-slate-800/90 hover:border-emerald-500/40 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_35px_rgba(16,185,129,0.15)] flex flex-col justify-between"
                >
                  {/* Image Container with Badges */}
                  <div>
                    <div className="relative h-56 overflow-hidden">
                      <img 
                        src={imageSrc} 
                        alt={court.nama} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      {/* Top Badges */}
                      <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border backdrop-blur-md ${
                          isFutsal 
                            ? 'bg-slate-950/80 text-emerald-300 border-emerald-500/30' 
                            : 'bg-slate-950/80 text-teal-300 border-teal-500/30'
                        }`}>
                          {isFutsal ? '⚽ Futsal Pro' : '🏸 Badminton Pro'}
                        </span>

                        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/90 text-white shadow-md flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                          Buka 08-24
                        </span>
                      </div>

                      {/* Bottom Image Info */}
                      <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
                        <h3 className="text-xl font-extrabold text-white drop-shadow-md">
                          {court.nama}
                        </h3>
                        <div className="text-right">
                          <div className="text-lg font-bold text-emerald-400 drop-shadow">
                            Rp {court.harga_per_jam.toLocaleString('id-ID')}
                          </div>
                          <div className="text-[11px] text-slate-300">/ jam main</div>
                        </div>
                      </div>
                    </div>

                    {/* Court Specs List */}
                    <div className="p-6 space-y-2.5">
                      <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                        Spesifikasi Lapangan
                      </div>
                      {specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2 text-xs sm:text-sm text-slate-300">
                          <Check size={14} className="text-emerald-400 shrink-0" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Booking CTA Button */}
                  <div className="p-6 pt-0">
                    <Link 
                      href={`/book?court=${court.id}`}
                      className="w-full py-3.5 px-4 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-white font-bold text-sm shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center gap-2 group/btn"
                    >
                      <span>Booking {court.nama}</span>
                      <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
