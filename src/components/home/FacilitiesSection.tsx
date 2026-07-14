import { motion } from 'framer-motion';
import { Coffee, Wifi, Store, Car } from 'lucide-react';

export default function FacilitiesSection() {
  return (
      <section id="fasilitas" className="py-20 bg-slate-950 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">Fasilitas <span className="text-emerald-400">Terbaik</span></h2>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Kenyamanan Anda adalah prioritas kami. Nikmati berbagai fasilitas penunjang yang akan membuat pengalaman berolahraga Anda semakin maksimal.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Wifi, title: "Wi-Fi Gratis", desc: "Akses internet berkecepatan tinggi di area tunggu." },
              { icon: Coffee, title: "Kantin & Lounge", desc: "Tempat bersantai menikmati minuman & makanan ringan." },
              { icon: Store, title: "Sewa Perlengkapan", desc: "Menyediakan penyewaan raket, bola, hingga sepatu." },
              { icon: Car, title: "Area Parkir Luas", desc: "Kapasitas parkir besar yang aman untuk mobil & motor." }
            ].map((item, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="bg-slate-900 border border-slate-800 p-8 rounded-3xl flex flex-col items-center text-center group hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center mb-6 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(16,185,129,0.5)]">
                  <item.icon size={32} className="text-emerald-400 group-hover:text-slate-950 transition-colors" />
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-slate-400 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
  );
}
