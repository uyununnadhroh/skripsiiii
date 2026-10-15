import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const sectionLabels = {
  '/dashboard':       'Dashboard Admin',
  '/input-pesanan':   'Input Pesanan',
  '/daftar-pesanan':  'Daftar Pesanan',
  '/jadwal-produksi': 'Jadwal Produksi',
  '/kelola-produk':   'Kelola Produk',
  '/pengaturan':      'Pengaturan',
};

export default function AppLayout() {
  const { pathname } = useLocation();
  const section = sectionLabels[pathname] ?? 'Dashboard Admin';

  return (
    <div className="flex h-screen overflow-hidden bg-[#faf6ee]">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar section={section} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
