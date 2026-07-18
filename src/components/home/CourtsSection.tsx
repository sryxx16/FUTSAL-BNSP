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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { id: 1, name: 'Futsal Pro Court', price: 'Rp 150.000 / Jam', img: '/empty_futsal.png', link: 'Futsal' },
              { id: 2, name: 'Badminton BWF Standard', price: 'Rp 50.000 / Jam', img: '/empty_badminton.png', link: 'Badminton' },
              { id: 3, name: 'Mini Soccer Premium', price: 'Rp 250.000 / Jam', img: '/empty_futsal.png', link: 'Mini Soccer' },
              { id: 4, name: 'Basketball Indoor Arena', price: 'Rp 120.000 / Jam', img: '/empty_futsal.png', link: 'Basketball' },
              { id: 5, name: 'Tennis Hard Court', price: 'Rp 100.000 / Jam', img: '/empty_badminton.png', link: 'Tennis' },
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
                  <Link to="/book" className="inline-flex items-center gap-2 text-white text-sm font-medium hover:text-emerald-400 transition-colors">
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
