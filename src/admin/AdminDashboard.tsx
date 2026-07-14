import { useState } from 'react';
import AdminSidebar from './components/AdminSidebar';
import AdminHeader from './components/AdminHeader';
import DashboardView from './views/DashboardView';
import ReservationsView from './views/ReservationsView';
import UsersView from './views/UsersView';
import SettingsView from './views/SettingsView';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-950 flex text-slate-50 font-sans w-full">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader activeTab={activeTab} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
          {activeTab === 'dashboard' && <DashboardView setActiveTab={setActiveTab} />}
          {activeTab === 'reservations' && <ReservationsView />}
          {activeTab === 'users' && <UsersView />}
          {activeTab === 'settings' && <SettingsView />}
        </main>
      </div>
    </div>
  );
}
