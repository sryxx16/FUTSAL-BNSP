import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto space-y-8 relative z-20"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight">
              Tingkatkan <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                Performa
              </span> Anda
            </h1>
            <p className="text-xl md:text-2xl text-slate-400 leading-relaxed max-w-3xl mx-auto">
              Booking lapangan futsal dan badminton premium dengan mudah. 
              Fasilitas standar internasional untuk pengalaman bermain tak terlupakan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link to="/book" className="px-8 py-4 bg-emerald-500 text-slate-950 font-bold rounded-full hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all duration-300 flex items-center justify-center gap-2 group">
                Booking Sekarang
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#fasilitas" className="px-8 py-4 bg-slate-800 text-white font-bold rounded-full hover:bg-slate-700 transition-colors flex items-center justify-center">
                Lihat Fasilitas
              </a>
            </div>
          </motion.div>
        </div>
      </section>
  );
}
