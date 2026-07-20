"use client";
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';


export default function CourtsSection() {
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
            {[
              { id: 1, name: 'Lapangan Futsal 1', price: 'Rp 150.000 / Jam', img: '/futsal_new.jpg', link: 'Futsal' },
              { id: 2, name: 'Lapangan Futsal 2', price: 'Rp 150.000 / Jam', img: '/futsal_new.jpg', link: 'Futsal' },
              { id: 3, name: 'Lapangan Badminton 1', price: 'Rp 50.000 / Jam', img: '/badminton_new.jpg', link: 'Badminton' },
              { id: 4, name: 'Lapangan Badminton 2', price: 'Rp 50.000 / Jam', img: '/badminton_new.jpg', link: 'Badminton' },
              { id: 5, name: 'Lapangan Badminton 3', price: 'Rp 50.000 / Jam', img: '/badminton_new.jpg', link: 'Badminton' },
            ].map((court, i) => (
              <motion.div
                key={court.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-3xl"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
                <img src={court.img} alt={court.name} className="w-full h-[300px] object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-6 z-20">
                  <h3 className="text-xl font-bold text-white mb-1">{court.name}</h3>
                  <p className="text-emerald-400 font-medium mb-3 text-sm">{court.price}</p>
                  <Link href="/book" className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-emerald-400 transition-colors">
                    Booking Lapangan {court.link} <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}
