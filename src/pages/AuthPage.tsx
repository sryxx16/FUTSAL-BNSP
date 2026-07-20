import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../lib/db';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    nama: '',
    email: '',
    no_hp: '',
    password: ''
  });
  
  const [status, setStatus] = useState<{ type: 'idle' | 'loading' | 'error' | 'success', message: string }>({ type: 'idle', message: '' });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if(status.type !== 'loading') setStatus({ type: 'idle', message: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus({ type: 'loading', message: 'Memproses...' });
    
    try {
      if (isLogin) {
        const user = await loginUser(formData.email, formData.password);
        // Simpan session
        localStorage.setItem('sm_session', JSON.stringify(user));
        
        // Redirect
        if (user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      } else {
        await registerUser(formData.nama, formData.email, formData.password, formData.no_hp);
        // Jangan auto-login. Ubah ke form login dan tampilkan pesan sukses.
        setStatus({ type: 'success', message: 'Registrasi berhasil! Silakan login.' });
        setIsLogin(true);
        setFormData(prev => ({ ...prev, password: '' })); // Kosongkan password demi keamanan
      }
    } catch (err: any) {
      setStatus({ type: 'error', message: err.message || 'Terjadi kesalahan.' });
    }
  };

  return (
    <main className="min-h-screen bg-slate-950 flex flex-col md:flex-row relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-10%] w-[40rem] h-[40rem] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="md:w-1/2 p-8 md:p-16 flex flex-col justify-center relative z-10 border-b md:border-b-0 md:border-r border-slate-800 bg-slate-900/40">
        <div className="absolute top-8 left-8 md:top-12 md:left-12">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors group">
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>

        <div className="mt-16 md:mt-0 max-w-md mx-auto md:mx-0">
           <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
             {isLogin ? "Selamat Datang Kembali!" : "Mulai Perjalanan Anda."}
           </h1>
           <p className="text-slate-400 text-lg leading-relaxed mb-8">
             {isLogin 
               ? "Masuk ke akun Anda untuk melihat jadwal lapangan, melakukan reservasi baru, atau mengelola booking Anda sebelumnya." 
               : "Buat akun baru untuk menikmati kemudahan booking lapangan futsal dan badminton tanpa antre. Cepat, aman, dan real-time!"}
           </p>

           <div className="hidden md:block w-full h-48 border border-slate-700/50 rounded-2xl relative overflow-hidden bg-slate-900/50 p-6 backdrop-blur-sm">
             <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-bl-full"></div>
             <div className="absolute bottom-0 left-0 w-24 h-24 bg-emerald-500/10 rounded-tr-full"></div>
             <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="w-12 h-12 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <User size={20} />
                </div>
                <div>
                   <h4 className="text-white font-bold text-lg drop-shadow-sm">Akses Member</h4>
                   <p className="text-emerald-400/80 text-sm">Privilese Khusus Member SM Sport</p>
                </div>
             </div>
           </div>
        </div>
      </div>

      <div className="md:w-1/2 p-8 md:p-16 flex items-center justify-center relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]">
            
            <div className="flex bg-slate-950 p-1 rounded-xl mb-8 border border-slate-800">
              <button 
                type="button"
                onClick={() => { setIsLogin(true); setStatus({type:'idle', message:''}); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${isLogin ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Login
              </button>
              <button 
                type="button"
                onClick={() => { setIsLogin(false); setStatus({type:'idle', message:''}); }}
                className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-all duration-300 ${!isLogin ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'}`}
              >
                Register
              </button>
            </div>

            {status.type !== 'idle' && (
              <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                status.type === 'error' ? 'bg-red-500/10 border border-red-500/50 text-red-400' : 
                status.type === 'success' ? 'bg-emerald-500/10 border border-emerald-500/50 text-emerald-400' : 
                'bg-blue-500/10 border border-blue-500/50 text-blue-400'
              }`}>
                {status.type === 'error' ? <AlertCircle size={20} /> : <div className="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center"><div className="w-2 h-3 border-b-2 border-r-2 border-slate-950 transform rotate-45 mb-1" /></div>}
                <span className="text-sm font-medium">{status.message}</span>
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.form 
                key={isLogin ? 'login' : 'register'}
                initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
                transition={{ duration: 0.2 }}
                onSubmit={handleSubmit}
                className="space-y-5"
              >
                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nama Lengkap</label>
                    <div className="relative">
                      <User className="absolute left-4 top-3.5 text-slate-500" size={20} />
                      <input 
                        type="text" 
                        name="nama"
                        value={formData.nama}
                        onChange={handleChange}
                        required={!isLogin}
                        placeholder="John Doe"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-600"
                      />
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Nomor HP/WA</label>
                    <div className="relative">
                      <ArrowRight className="absolute left-4 top-3.5 text-slate-500" size={20} />
                      <input 
                        type="tel" 
                        name="no_hp"
                        value={formData.no_hp}
                        onChange={handleChange}
                        required={!isLogin}
                        placeholder="08123456789"
                        className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-600"
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">Alamat Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-3.5 text-slate-500" size={20} />
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="hello@example.com"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <label className="text-sm font-medium text-slate-300">Password</label>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-4 top-3.5 text-slate-500" size={20} />
                    <input 
                      type="password" 
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="w-full bg-slate-950/50 border border-slate-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors placeholder-slate-600"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={status.type === 'loading'}
                  className="w-full mt-6 flex items-center justify-center gap-2 bg-emerald-500 text-slate-950 text-lg font-bold py-4 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] hover:bg-emerald-400 transition-all duration-300 disabled:opacity-50"
                >
                  {status.type === 'loading' ? <Loader2 className="animate-spin" size={20} /> : (isLogin ? 'Masuk Sekarang' : 'Daftar Akun')} 
                  {status.type !== 'loading' && <ArrowRight size={20} />}
                </button>
              </motion.form>
            </AnimatePresence>

          </div>
        </div>
      </div>
    </main>
  );
}
