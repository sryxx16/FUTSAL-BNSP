import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingPage from './pages/LandingPage';
import ReservationPage from './pages/ReservationPage';
import AuthPage from './pages/AuthPage';
import AdminDashboard from './admin/AdminDashboard';

// Komponen penolong untuk menyembunyikan Navbar/Footer di halaman tertentu
const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login';
  const isAdminPage = location.pathname.startsWith('/admin');
  const hideNavAndFooter = isAuthPage || isAdminPage;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-emerald-500/30 overflow-x-hidden flex flex-col">
      {!hideNavAndFooter && <Navbar />}
      <div className="flex-grow flex flex-col">
        {children}
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <AppLayout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<ReservationPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </AppLayout>
    </Router>
  );
}

export default App;
