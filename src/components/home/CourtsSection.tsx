"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

import { useState, useEffect } from 'react';
import { getDaftarLapangan } from '../../lib/db';

export default function CourtsSection() {
  const [courts, setCourts] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCourts() {
      try {
        const data = await getDaftarLapangan();
        setCourts(data);
      } catch (err) {
        console.error("Gagal memuat daftar lapangan:", err);
      }
    }
    fetchCourts();
  }, []);
  return (
      <section className="py-20 bg-slate-900/50 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-6">Pilihan <span className="text-emerald-400">Lapangan</span></h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Kami menyediakan lapangan berstandar internasional yang dirawat secara berkala untuk performa maksimal.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courts.length === 0 ? (
               <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center text-slate-500 py-10">
                 Memuat daftar lapangan...
               </div>
            ) : courts.map((court, i) => (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
                <img src={court.nama.toLowerCase().includes('futsal') ? '/futsal_new.jpg' : '/badminton_new.jpg'} alt={court.nama} className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{court.nama}</h3>
                  <p className="text-emerald-400 font-medium mb-3 text-sm">Rp {court.harga_per_jam.toLocaleString('id-ID')} / Jam</p>
                  <Link href="/book" className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-emerald-400 transition-colors">
                    Booking Lapangan {court.nama.toLowerCase().includes('futsal') ? 'Futsal' : 'Badminton'} <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}
