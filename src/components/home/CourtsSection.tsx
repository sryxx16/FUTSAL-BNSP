import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
              <img src="/futsal_court.png" alt="Lapangan Futsal" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-3xl font-bold text-white mb-2">Futsal Pro Court</h3>
                <p className="text-emerald-400 font-medium mb-4">Rp 150.000 / Jam</p>
                <Link to="/book" className="inline-flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors">
                  Booking Lapangan Futsal <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="group relative overflow-hidden rounded-3xl"
            >
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent z-10"></div>
              <img src="/badminton_court.png" alt="Lapangan Badminton" className="w-full h-[400px] object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
                <h3 className="text-3xl font-bold text-white mb-2">Badminton BWF Standard</h3>
                <p className="text-emerald-400 font-medium mb-4">Rp 50.000 / Jam</p>
                <Link to="/book" className="inline-flex items-center gap-2 text-white font-medium hover:text-emerald-400 transition-colors">
                  Booking Lapangan Badminton <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
  );
}
