import { motion } from 'framer-motion';
import { ArrowRight, Calendar, Grip } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
      <section 
        className="relative pt-32 pb-32 px-4 sm:px-6 lg:px-12 min-h-[90vh] flex flex-col justify-center border-b border-slate-800"
        style={{
          backgroundImage: 'url("/futsal_new.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Dark overlay with gradient for better text readability */}
        <div className="absolute inset-0 bg-slate-950/80 bg-gradient-to-r from-slate-950/90 to-transparent z-0"></div>

        <div className="flex flex-col items-start justify-center max-w-7xl mx-auto w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl space-y-8"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-[1.1]">
              Tingkatkan <br />
              <span className="text-emerald-500">
                Performa
              </span> Anda
            </h1>
            <p className="text-lg md:text-xl text-slate-300 leading-relaxed">
              Booking lapangan futsal dan badminton premium dengan mudah. 
              Fasilitas standar internasional untuk pengalaman bermain tak terlupakan.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/book" className="px-6 py-3.5 bg-emerald-500 text-white font-semibold rounded-xl hover:bg-emerald-600 transition-colors flex items-center justify-center gap-2 group">
                <Calendar className="w-5 h-5" />
                Booking Sekarang
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#fasilitas" className="px-6 py-3.5 bg-transparent border border-slate-400 text-white font-semibold rounded-xl hover:bg-slate-800/50 hover:border-slate-300 transition-colors flex items-center justify-center gap-2">
                <Grip className="w-5 h-5" />
                Lihat Fasilitas
              </a>
            </div>
          </motion.div>
        </div>
      </section>
  );
}
