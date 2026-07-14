import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-slate-950/80 backdrop-blur-md border-b border-slate-800' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-emerald-600">
              SM Sport
            </Link>
          </div>
          <div className="hidden md:flex space-x-8 items-center">
            <Link to="/" className="text-slate-300 hover:text-emerald-400 transition-colors">Home</Link>
            <a href="/#fasilitas" className="text-slate-300 hover:text-emerald-400 transition-colors">Fasilitas</a>
            <a href="/#kontak" className="text-slate-300 hover:text-emerald-400 transition-colors">Kontak</a>
            <div className="flex items-center space-x-4 pl-4 border-l border-slate-800">
              <Link to="/book" className="text-emerald-400 font-bold hover:text-emerald-300 transition-colors">Booking Lapangan</Link>
              <Link to="/login" className="px-5 py-2 rounded-full border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10 hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition-all duration-300">
                Login / Register
              </Link>
            </div>
          </div>
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-slate-300 hover:text-emerald-400 transition-colors"
            >
              {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-slate-900 border-b border-slate-800 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-2">
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-md">Home</Link>
              <a href="/#fasilitas" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-md">Fasilitas</a>
              <a href="/#kontak" onClick={() => setIsMobileMenuOpen(false)} className="block px-3 py-2 text-slate-300 hover:text-emerald-400 hover:bg-slate-800 rounded-md">Kontak</a>
              <div className="mt-6 pt-6 border-t border-slate-800 space-y-3">
                <Link to="/book" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-5 py-3 text-center rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500 hover:text-slate-950 font-bold transition-colors">
                  Booking Lapangan
                </Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block w-full px-5 py-3 text-center rounded-full border border-slate-600 text-slate-300 hover:bg-slate-800 transition-colors">
                  Login / Register
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
