import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  iconChevronLeft, iconChevronRight,
  iconCircleAlert, iconArrowUpRight,
  iconEllipsis,
} from '../assets/icons';
import { computeStatus, badgeMap, fmtTgl, sharedOrders } from '../utils/orderStatus';

// bar colours match Figma exactly
// green #327a52, amber #a66a17, red #b74b40
const days = [
  { label: 'Min, 11 Okt', load: 640, capacity: 800, pct: 80,  today: true,  barColor: '#a66a17' },
  { label: 'Sen, 12 Okt', load: 400, capacity: 800, pct: 50,  barColor: '#a66a17' },
  { label: 'Sel, 13 Okt', load: 560, capacity: 800, pct: 70,  barColor: '#a66a17' },
  { label: 'Rab, 14 Okt', load: 760, capacity: 800, pct: 95,  barColor: '#b74b40', danger: true },
  { label: 'Kam, 15 Okt', load: 320, capacity: 800, pct: 40,  barColor: '#327a52' },
  { label: 'Jum, 16 Okt', load: 720, capacity: 800, pct: 90,  barColor: '#a66a17' },
  { label: 'Sab, 17 Okt', load: 480, capacity: 800, pct: 60,  barColor: '#327a52' },
];

// Pesanan terbaru — pakai data bersama dengan status otomatis
// Tampilkan hanya pesanan non-Dibatalkan, maksimal 6, diurutkan produksi terdekat
const recentOrders = sharedOrders
  .filter(o => o.statusPesanan !== 'Dibatalkan')
  .map(o => ({ ...o, statusOtomatis: computeStatus(o) }))
  .sort((a, b) => new Date(a.tanggalProduksi) - new Date(b.tanggalProduksi))
  .slice(0, 6);

function CapacityCard({ day }) {
  return (
    <div className={`flex flex-col gap-3 p-4 rounded-xl border ${
      day.today ? 'border-[#4c0c13]' : 'border-[#eadfd0]'
    } bg-white`}>
      {/* label */}
      <p className={`text-xs font-medium ${day.today ? 'text-[#4c0c13]' : 'text-[#8a7768]'}`}>
        {day.label}
      </p>
      {/* numbers row */}
      <div className="flex items-center justify-between">
        <span className={`text-base font-semibold ${day.danger ? 'text-[#b74b40]' : 'text-[#2b1d16]'}`}>
          {day.load}
        </span>
        <span className={`text-xs font-semibold ${day.danger ? 'text-[#b74b40]' : 'text-[#8a7768]'}`}>
          {day.pct}%
        </span>
      </div>
      {/* bar */}
      <div className="bg-[#eadfd0] rounded-full h-2 overflow-hidden">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${day.pct}%`, backgroundColor: day.barColor }}
        />
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col gap-6 p-9 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[#2b1d16] text-[30px] font-normal leading-tight">
              Selamat pagi, Hakuu Bakery
            </h1>
            <p className="text-[#8a7768] text-sm mt-1.5">
              Pantau kapasitas dan pesanan agar produksi hari ini berjalan lancar.
            </p>
          </div>
          <button onClick={() => navigate('/input-pesanan')} className="btn-primary">
            + Input Pesanan
          </button>
        </div>

        {/* 7-day capacity widget */}
        <div className="card p-6">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[#2b1d16] text-sm font-semibold">Kapasitas produksi 7 hari</p>
            <div className="flex gap-4 items-center">
              <button className="hover:opacity-60 transition-opacity">
                <img src={iconChevronLeft} alt="Prev" className="size-4" />
              </button>
              <span className="text-[#2b1d16] text-sm font-medium">11–17 Oktober 2026</span>
              <button className="hover:opacity-60 transition-opacity">
                <img src={iconChevronRight} alt="Next" className="size-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-3">
            {days.map((d) => <CapacityCard key={d.label} day={d} />)}
          </div>

          {/* legend */}
          <div className="flex gap-5 mt-4 items-center">
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-[#327a52]" />
              <span className="text-[#8a7768] text-xs">&lt;70% · Tersedia</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-[#a66a17]" />
              <span className="text-[#8a7768] text-xs">70–90% · Mendekati penuh</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="size-2 rounded-full bg-[#b74b40]" />
              <span className="text-[#8a7768] text-xs">&gt;90% · Perlu perhatian</span>
            </div>
            <span className="text-[#8a7768] text-xs ml-2">Beban tertimbang dalam box kapasitas</span>
          </div>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Kapasitas hari ini */}
          <div className="card p-6 flex flex-col gap-2">
            <p className="text-[#8a7768] text-xs">Kapasitas hari ini</p>
            <p className="text-[#2b1d16] text-[30px] font-normal leading-tight">640 / 800</p>
            <p className="text-[#8a7768] text-xs">box kapasitas · 80% terpakai</p>
            <div className="bg-[#eadfd0] rounded-full h-2 mt-1 overflow-hidden">
              <div className="h-full rounded-full bg-[#a66a17]" style={{ width: '80%' }} />
            </div>
          </div>
          {/* Sisa kapasitas */}
          <div className="card p-6 flex flex-col gap-2">
            <p className="text-[#8a7768] text-xs">Sisa kapasitas</p>
            <p className="text-[#2b1d16] text-[30px] font-normal leading-tight">160 box</p>
            <p className="text-[#8a7768] text-xs">Ruang produksi yang masih tersedia</p>
          </div>
          {/* Total pesanan */}
          <div className="card p-6 flex flex-col gap-2">
            <p className="text-[#8a7768] text-xs">Total pesanan</p>
            <p className="text-[#2b1d16] text-[30px] font-normal leading-tight">6 pesanan</p>
            <p className="text-[#8a7768] text-xs">594 box produk · produksi hari ini</p>
          </div>
          {/* Pesanan perlu perhatian */}
          <div className="card p-6 flex flex-col gap-2">
            <p className="text-[#8a7768] text-xs">Pesanan perlu perhatian</p>
            <p className="text-[#2b1d16] text-[30px] font-normal leading-tight">2 pesanan</p>
            <p className="text-[#8a7768] text-xs">Perlu konfirmasi jam kirim</p>
          </div>
        </div>

        {/* Alert banner */}
        <div className="bg-[#fdf6ec] border border-[#e8c98a] rounded-xl px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={iconCircleAlert} alt="" className="size-5 shrink-0" style={{ filter: 'hue-rotate(20deg) saturate(1.5)' }} />
            <p className="text-[#7e4722] text-sm">
              HB-0012 dan HB-0014: konfirmasi jam kirim sebelum memulai produksi.
            </p>
          </div>
          <button
            onClick={() => navigate('/daftar-pesanan')}
            className="text-[#7e4722] text-sm font-semibold whitespace-nowrap hover:underline flex items-center gap-1"
          >
            Periksa pesanan →
          </button>
        </div>

        {/* Recent orders table */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#eadfd0]">
            <div>
              <p className="text-[#2b1d16] text-lg font-semibold">Pesanan terbaru</p>
              <p className="text-[#7e4722] text-xs mt-0.5">6 pesanan · produksi 11 Oktober 2026</p>
            </div>
            <button
              onClick={() => navigate('/daftar-pesanan')}
              className="flex gap-2 items-center border border-[#eadfd0] rounded-lg px-3 h-9 text-sm text-[#2b1d16] hover:bg-[#faf6ee] transition-colors"
            >
              <img src={iconArrowUpRight} alt="" className="size-4" />
              <span>Lihat semua pesanan</span>
            </button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-[#faf6ee] border-b border-[#eadfd0]">
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Kode</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Pembeli / sumber</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Produk</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Qty box</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Kirim / produksi</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#7e4722]">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o) => (
                <tr key={o.id} className="border-b border-[#eadfd0] last:border-0 hover:bg-[#faf6ee]/60 transition-colors">
                  <td className="px-6 py-4 text-sm font-semibold text-[#2b1d16]">{o.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#2b1d16]">{o.pembeli}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-[#4c0c13]">{o.produk}</td>
                  <td className="px-6 py-4 text-sm text-[#2b1d16]">{o.qty}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-[#2b1d16]">
                      {fmtTgl(o.tanggalKirim)} · {o.jamKirim}
                    </p>
                    <p className="text-xs text-[#8a7768]">{fmtTgl(o.tanggalProduksi)}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={badgeMap[o.statusOtomatis] ?? badgeMap['Diterima']}>
                      {o.statusOtomatis}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-[#8a7768] hover:text-[#2b1d16]">
                      <img src={iconEllipsis} alt="" className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#eadfd0]">
            <p className="text-[#7e4722] text-sm">Menampilkan 1–6 dari 6 pesanan</p>
            <div className="flex gap-2">
              <button className="border border-[#eadfd0] px-4 h-9 rounded-lg text-sm text-[#2b1d16] font-semibold hover:bg-[#faf6ee]">Sebelumnya</button>
              <button className="border border-[#eadfd0] bg-white px-4 h-9 rounded-lg text-sm text-[#2b1d16] font-semibold hover:bg-[#faf6ee]">1</button>
              <button className="border border-[#eadfd0] px-4 h-9 rounded-lg text-sm text-[#2b1d16] font-semibold hover:bg-[#faf6ee]">Berikutnya</button>
            </div>
          </div>
        </div>
      </div>

      {/* Page footer */}
      <footer className="border-t border-[#eadfd0] bg-white px-9 py-3 flex items-center justify-between">
        <p className="text-[#8a7768] text-xs">Hakuu Bakery · Operasional usaha, bukan etalase pelanggan</p>
        <p className="text-[#8a7768] text-xs">Waktu Indonesia Barat</p>
      </footer>
    </div>
  );
}
