import { motion } from 'framer-motion';
import { CalendarCheck, ShieldCheck, Trophy, ArrowRight, Droplets, Coffee, CarFront, Lock, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <main className="pt-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center">
        {/* Background Decorative Elements */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-600/20 rounded-full blur-[120px] -z-10 animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-emerald-900/40 rounded-full blur-[120px] -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-center md:w-4/5 mx-auto"
          >
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            >
              Elevate Your Game. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600 drop-shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                Pesan Lapangan Lebih Cepat.
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Sistem reservasi lapangan futsal dan badminton real-time tanpa takut bentrok jadwal. Rasakan pengalaman booking yang mulus dengan visual interaktif modern.
            </motion.p>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/book" className="flex items-center gap-2 px-8 py-4 bg-emerald-500 text-slate-950 text-lg font-bold rounded-full shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] hover:bg-emerald-400 transition-all duration-300 transform hover:-translate-y-1">
                Booking Sekarang <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-4 bg-slate-800 text-white text-lg font-bold rounded-full border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700 transition-all duration-300">
                Lihat Jadwal
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-slate-900/50 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Kenapa Memilih Kami?</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:bg-slate-800/80 transition-all duration-500 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-emerald-400 border border-slate-700 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <CalendarCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Real-time Availability</h3>
              <p className="text-slate-400 leading-relaxed">Cek ketersediaan lapangan secara langsung. Bebas dari risiko double-booking dengan sinkronisasi data instan.</p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:bg-slate-800/80 transition-all duration-500 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-emerald-400 border border-slate-700 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure Booking</h3>
              <p className="text-slate-400 leading-relaxed">Sistem terintegrasi dengan backend yang aman. Data reservasi dan privasi Anda tervalidasi dengan sistem autentikasi tangguh.</p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] hover:bg-slate-800/80 transition-all duration-500 group">
              <div className="w-14 h-14 bg-slate-900 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 text-emerald-400 border border-slate-700 group-hover:border-emerald-500/50 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.4)]">
                <Trophy size={28} />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Premium Courts</h3>
              <p className="text-slate-400 leading-relaxed">Nikmati fasilitas 2 Lapangan Futsal dan 3 Lapangan Badminton berstandar tinggi untuk performa bermain yang optimal.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Our Courts Section */}
      <section className="py-20 bg-slate-950 relative z-10 border-t border-slate-900 overflow-hidden">
        {/* Background glow for this section */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50rem] h-[20rem] bg-emerald-600/10 rounded-[100%] blur-[120px] -z-10 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Pilihan Lapangan Kami</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Futsal Court Card */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] group relative">
              <div className="absolute top-0 right-0 p-6 z-20">
                 <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm">Tersedia 2 Lapangan</span>
              </div>
              <div className="h-64 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 z-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/40 via-slate-900 to-slate-900"></div>
                
                {/* Abstract Court Representation */}
                <div className="relative z-20 w-48 h-32 border-2 border-emerald-500/30 rounded-lg flex items-center justify-center group-hover:border-emerald-400/60 transition-colors">
                   <div className="w-full h-[2px] bg-emerald-500/30 absolute top-1/2 -translate-y-1/2 group-hover:bg-emerald-400/60 transition-colors"></div>
                   <div className="w-12 h-12 rounded-full border-2 border-emerald-500/30 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 group-hover:border-emerald-400/60 transition-colors"></div>
                   <div className="w-8 h-16 border-2 border-l-0 border-emerald-500/30 absolute left-0 top-1/2 -translate-y-1/2 group-hover:border-emerald-400/60 transition-colors"></div>
                   <div className="w-8 h-16 border-2 border-r-0 border-emerald-500/30 absolute right-0 top-1/2 -translate-y-1/2 group-hover:border-emerald-400/60 transition-colors"></div>
                </div>

                <div className="absolute bottom-4 left-6 z-20">
                  <h3 className="text-3xl font-bold text-white drop-shadow-md">Futsal Court</h3>
                  <p className="text-emerald-400 font-medium tracking-wide">Vinyl & Sintetis</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-400 mb-6 leading-relaxed">Lantai standar turnamen, dilengkapi pencahayaan optimal untuk permainan malam hari yang nyaman dan bebas cedera.</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-slate-300">Mulai dari <strong className="text-2xl text-white ml-1">Rp 120k</strong><span className="text-sm">/jam</span></span>
                  <Link to="/book" className="px-5 py-2.5 bg-slate-800 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-colors duration-300">Pilih</Link>
                </div>
              </div>
            </div>

            {/* Badminton Court Card */}
            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-800 hover:border-emerald-500/50 transition-all duration-500 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] group relative">
              <div className="absolute top-0 right-0 p-6 z-20">
                 <span className="bg-emerald-500/20 text-emerald-400 text-xs font-bold px-3 py-1 rounded-full border border-emerald-500/30 backdrop-blur-sm">Tersedia 3 Lapangan</span>
              </div>
              <div className="h-64 bg-slate-800 relative overflow-hidden flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/40 to-slate-900 z-10 mix-blend-overlay"></div>
                <div className="absolute inset-0 opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-600/40 via-slate-900 to-slate-900"></div>
                
                {/* Abstract Court Representation */}
                <div className="relative z-20 w-32 h-48 border-2 border-emerald-500/30 flex flex-col group-hover:border-emerald-400/60 transition-colors">
                   <div className="w-full h-full border-x-8 border-transparent relative">
                      <div className="w-full h-[2px] bg-emerald-500/30 absolute top-1/2 -translate-y-1/2 group-hover:bg-emerald-400/60 transition-colors"></div>
                      <div className="w-full h-8 border-b-2 border-emerald-500/30 absolute top-0 group-hover:border-emerald-400/60 transition-colors"></div>
                      <div className="w-full h-8 border-t-2 border-emerald-500/30 absolute bottom-0 group-hover:border-emerald-400/60 transition-colors"></div>
                   </div>
                </div>

                <div className="absolute bottom-4 left-6 z-20">
                  <h3 className="text-3xl font-bold text-white drop-shadow-md">Badminton</h3>
                  <p className="text-emerald-400 font-medium tracking-wide">Karpet BWF Standard</p>
                </div>
              </div>
              <div className="p-8">
                <p className="text-slate-400 mb-6 leading-relaxed">Karpet antislip berkualitas premium untuk mencegah cedera, dengan sirkulasi udara baik untuk stamina maksimal.</p>
                <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                  <span className="text-slate-300">Mulai dari <strong className="text-2xl text-white ml-1">Rp 50k</strong><span className="text-sm">/jam</span></span>
                  <Link to="/book" className="px-5 py-2.5 bg-slate-800 text-emerald-400 font-semibold rounded-lg hover:bg-emerald-500 hover:text-slate-950 transition-colors duration-300">Pilih</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fasilitas Tambahan Section */}
      <section id="fasilitas" className="py-24 bg-slate-900/80 relative z-10 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fasilitas Tambahan</h2>
            <div className="w-20 h-1 bg-emerald-500 mx-auto rounded-full drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] mb-6"></div>
            <p className="text-slate-400 max-w-2xl mx-auto">Kami tidak hanya menyediakan lapangan terbaik, tapi juga fasilitas pendukung kelas satu untuk kenyamanan Anda sebelum dan sesudah bertanding.</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {/* Fasilitas 1 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Droplets size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Shower & Toilet Bersih</h3>
            </div>
            
            {/* Fasilitas 2 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Coffee size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Sport Cafe & Wi-Fi</h3>
            </div>

            {/* Fasilitas 3 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <CarFront size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Parkir Luas & Aman</h3>
            </div>

            {/* Fasilitas 4 */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-center hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)] transition-all duration-300 group">
              <div className="w-16 h-16 mx-auto bg-slate-800 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform text-emerald-400 group-hover:shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                <Lock size={32} />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Loker Pemain</h3>
            </div>
          </div>
        </div>
      </section>

      {/* Kontak Section */}
      <section id="kontak" className="py-24 bg-slate-950 relative z-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Info Kontak */}
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Hubungi Kami</h2>
              <div className="w-20 h-1 bg-emerald-500 rounded-full drop-shadow-[0_0_8px_rgba(16,185,129,0.5)] mb-8"></div>
              <p className="text-slate-400 mb-10 leading-relaxed">Punya pertanyaan, kendala reservasi, atau ingin menyewa lapangan untuk turnamen besar? Jangan ragu untuk menghubungi kami.</p>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Alamat</h4>
                    <p className="text-slate-400 mt-1">Jl. Olahraga No. 88, Kawasan Bisnis Terpadu, Jakarta Selatan, 12345</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Telepon / WhatsApp</h4>
                    <p className="text-slate-400 mt-1">+62 812 3456 7890</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-lg border border-slate-800 flex items-center justify-center text-emerald-400 flex-shrink-0 shadow-[0_0_10px_rgba(16,185,129,0.1)]">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-white">Email</h4>
                    <p className="text-slate-400 mt-1">hello@smsportcenter.com</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Form Pesan Cepat */}
            <div className="bg-slate-900/50 backdrop-blur-sm p-8 rounded-2xl border border-slate-800 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
              <h3 className="text-2xl font-bold text-white mb-6">Kirim Pesan</h3>
              <form className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-2">Nama Lengkap</label>
                  <input type="text" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="Cth: Budi Santoso" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-2">Email</label>
                  <input type="email" className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="Cth: budi@email.com" />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-400 block mb-2">Pesan Anda</label>
                  <textarea rows={4} className="w-full bg-slate-950/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors" placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."></textarea>
                </div>
                <button type="button" className="w-full bg-emerald-500 text-slate-950 font-bold py-3 px-4 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all duration-300">
                  Kirim Pesan
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
