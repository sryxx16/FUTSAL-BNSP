import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardView from './views/DashboardView';
import ReservationsView from './views/ReservationsView';
import UsersView from './views/UsersView';
import ReportsView from './views/ReportsView';
import SettingsView from './views/SettingsView';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  useEffect(() => {
    const sessionStr = localStorage.getItem('sm_session');
    if (!sessionStr) {
      navigate('/login');
      return;
    }
    const user = JSON.parse(sessionStr);
    if (user.role !== 'admin') {
      navigate('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50 font-sans w-full">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader activeTab={activeTab} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'reservations' && <ReservationsView />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'reports' && <ReportsView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
