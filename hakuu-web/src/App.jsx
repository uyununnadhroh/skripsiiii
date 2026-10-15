import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/Layout/AppLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import InputPesanan from './pages/InputPesanan';
import DaftarPesanan from './pages/DaftarPesanan';
import JadwalProduksi from './pages/JadwalProduksi';
import KelolaProduk from './pages/KelolaProduk';
import Pengaturan from './pages/Pengaturan';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login / public */}
        <Route path="/" element={<Login />} />

        {/* App shell */}
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/input-pesanan" element={<InputPesanan />} />
          <Route path="/daftar-pesanan" element={<DaftarPesanan />} />
          <Route path="/jadwal-produksi" element={<JadwalProduksi />} />
          <Route path="/kelola-produk" element={<KelolaProduk />} />
          <Route path="/pengaturan" element={<Pengaturan />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
