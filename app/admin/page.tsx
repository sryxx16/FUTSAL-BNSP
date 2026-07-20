"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import AdminSidebar from '../../src/admin/components/AdminSidebar';
import AdminHeader from '../../src/admin/components/AdminHeader';
import DashboardView from '../../src/admin/views/DashboardView';
import ReservationsView from '../../src/admin/views/ReservationsView';
import UsersView from '../../src/admin/views/UsersView';
import ReportsView from '../../src/admin/views/ReportsView';
import SettingsView from '../../src/admin/views/SettingsView';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const router = useRouter();

  useEffect(() => {
    const sessionStr = typeof window !== 'undefined' ? localStorage.getItem('sm_session') : null;
    if (!sessionStr) {
      router.push('/login');
      return;
    }
    const user = JSON.parse(sessionStr);
    if (user.role !== 'admin') {
      router.push('/');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans w-full">
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader activeTab={activeTab} setActiveTab={setActiveTab} />

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-50">
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
