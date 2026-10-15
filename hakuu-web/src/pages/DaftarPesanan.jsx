import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconArrowUpRight, iconClipboardList } from '../assets/icons';
import { computeStatus, infoKirim, badgeMap, fmtTgl, isoDate, sharedOrders } from '../utils/orderStatus';

const manualActions = {
  'Diterima':    ['Batalkan'],
  'Dijadwalkan': ['Batalkan'],
  'Diproduksi':  [],
  'Selesai':     [],
  'Dibatalkan':  [],
};

const STATUS_TABS = ['Semua', 'Diterima', 'Dijadwalkan', 'Diproduksi', 'Selesai', 'Dibatalkan'];

export default function DaftarPesanan() {
  const navigate = useNavigate();
  const [orders, setOrders]     = useState(sharedOrders);
  const [activeTab, setTab]     = useState('Semua');
  const [search, setSearch]     = useState('');
  const [menuOpen, setMenuOpen] = useState(null);

  // Hitung status otomatis pakai waktu nyata (useMemo agar efisien)
  const withStatus = useMemo(() =>
    orders.map(o => ({ ...o, statusOtomatis: computeStatus(o) })),
    [orders]
  );

  const totalBox       = orders.filter(o => o.statusPesanan !== 'Dibatalkan').reduce((s, o) => s + o.qty, 0);
  const totalKapasitas = 640;

  const tabCounts = useMemo(() => {
    const c = { Semua: withStatus.filter(o => o.statusOtomatis !== 'Dibatalkan').length };
    STATUS_TABS.slice(1).forEach(k => {
      c[k] = withStatus.filter(o => o.statusOtomatis === k).length;
    });
    return c;
  }, [withStatus]);

  const filtered = useMemo(() =>
    withStatus
      .filter(o => {
        const matchTab = activeTab === 'Semua'
          ? o.statusOtomatis !== 'Dibatalkan'
          : o.statusOtomatis === activeTab;
        const matchSearch =
          o.id.toLowerCase().includes(search.toLowerCase()) ||
          o.pembeli.toLowerCase().includes(search.toLowerCase());
        return matchTab && matchSearch;
      })
      .sort((a, b) => {
        const d = new Date(a.tanggalProduksi) - new Date(b.tanggalProduksi);
        return d !== 0 ? d : a.jamKirim.localeCompare(b.jamKirim);
      }),
    [withStatus, activeTab, search]
  );

  function batalkan(id) {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, statusPesanan: 'Dibatalkan' } : o));
    setMenuOpen(null);
  }

  const nowLabel = new Date().toLocaleDateString('id-ID', {
    day: 'numeric', month: 'long', year: 'numeric',
  }) + ' ' + new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit', minute: '2-digit',
  }) + ' WIB';

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col gap-6 p-9 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[#2b1d16] text-[30px] font-normal">Daftar Pesanan</h1>
            <p className="text-[#8a7768] text-sm mt-1.5">
              Semua pesanan dari WhatsApp dan pembeli langsung, dalam satu catatan.
            </p>
          </div>
          <button onClick={() => navigate('/input-pesanan')} className="btn-primary">
            + Input Pesanan
          </button>
        </div>

        {/* Summary bar */}
        <div className="card p-5 flex items-center gap-6">
          <img src={iconClipboardList} alt="" className="size-5 shrink-0" />
          <p className="flex-1 text-sm font-semibold text-[#2b1d16]">
            {orders.filter(o => o.statusPesanan !== 'Dibatalkan').length} pesanan terdaftar
          </p>
          <p className="flex-1 text-sm text-[#2b1d16]">{totalBox} box produk</p>
          <p className="flex-1 text-sm font-medium text-[#4c0c13]">{totalKapasitas} box beban kapasitas</p>
          <span className="bg-[#faf6ee] text-[#4c0c13] text-xs font-medium px-3 py-1.5 rounded-full whitespace-nowrap">
            Produksi {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}
          </span>
        </div>

        {/* Filter card */}
        <div className="card p-6 flex flex-col gap-5">
          <div className="flex gap-4 items-end">
            <div className="flex flex-col gap-2 flex-1 min-w-0">
              <label className="text-[#2b1d16] text-sm">Cari pesanan</label>
              <input className="input-field" placeholder="Cari kode atau nama pembeli"
                value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div className="flex flex-col gap-2 w-[220px]">
              <label className="text-[#2b1d16] text-sm">Tanggal kirim</label>
              <div className="input-field flex items-center justify-between cursor-pointer">
                <span className="text-[#2b1d16] text-sm">
                  {fmtTgl(isoDate(0))} – {fmtTgl(isoDate(1))}
                </span>
                <span className="text-[#8a7768] text-xs">📅</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 w-[180px]">
              <label className="text-[#2b1d16] text-sm">Status</label>
              <select className="input-field" onChange={e => setTab(e.target.value)} value={activeTab}>
                {STATUS_TABS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <button className="btn-primary h-11">Terapkan</button>
            <button className="btn-secondary h-11 text-[#4c0c13]" onClick={() => { setSearch(''); setTab('Semua'); }}>
              Atur ulang
            </button>
          </div>

          {/* Quick status tabs */}
          <div className="flex gap-3 flex-wrap">
            {STATUS_TABS.map(s => (
              <button key={s} onClick={() => setTab(s)}
                className={`px-3 py-2 rounded-xl text-sm transition-colors ${
                  activeTab === s
                    ? 'bg-[#4c0c13] text-white font-semibold'
                    : 'bg-[#faf6ee] text-[#8a7768] hover:bg-[#eadfd0]'
                }`}>
                {s} {tabCounts[s] ?? 0}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="card">
          <div className="flex items-center justify-between px-6 py-5 border-b border-[#eadfd0]">
            <div>
              <p className="text-[#2b1d16] text-lg font-normal">Semua pesanan</p>
              <p className="text-[#7e4722] text-xs mt-0.5">
                Status dihitung otomatis · {nowLabel}
              </p>
            </div>
            <button className="flex gap-2 items-center border border-[#eadfd0] rounded-lg px-3 h-9 text-sm text-[#2b1d16] font-semibold hover:bg-[#faf6ee]">
              <img src={iconArrowUpRight} alt="" className="size-4" />
              <span>Lihat semua pesanan</span>
            </button>
          </div>

          {/* Header row */}
          <div className="bg-[#faf6ee] flex items-center px-6 h-10 gap-4 border-b border-[#eadfd0]">
            <p className="w-[96px]  text-xs font-medium text-[#7e4722]">Kode</p>
            <p className="flex-1 min-w-0 text-xs font-medium text-[#7e4722]">Pembeli</p>
            <p className="w-[150px] text-xs font-medium text-[#7e4722]">Produk</p>
            <p className="w-[60px]  text-xs font-medium text-[#7e4722]">Qty box</p>
            <p className="w-[140px] text-xs font-medium text-[#7e4722] flex items-center gap-1">
              Kirim / produksi <span className="text-[#4c0c13] text-[10px]">↑</span>
            </p>
            <p className="w-[120px] text-xs font-medium text-[#7e4722]">Status</p>
            <p className="w-[36px]  text-xs font-medium text-[#7e4722]">Aksi</p>
          </div>

          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-[#8a7768] text-sm">
              Tidak ada pesanan untuk filter ini.
            </div>
          )}

          {filtered.map(o => (
            <div key={o.id}
              className="flex items-center px-6 h-16 gap-4 border-b border-[#eadfd0] last:border-0 hover:bg-[#faf6ee]/50 transition-colors relative">
              <p className="w-[96px] text-sm font-semibold text-[#2b1d16]">{o.id}</p>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#2b1d16] truncate">{o.pembeli}</p>
              </div>
              <p className="w-[150px] text-sm font-medium text-[#4c0c13] truncate">{o.produk}</p>
              <p className="w-[60px] text-sm text-[#2b1d16]">{o.qty}</p>
              <div className="w-[140px]">
                <p className="text-sm text-[#2b1d16]">{fmtTgl(o.tanggalKirim)} · {o.jamKirim}</p>
                <p className="text-xs text-[#8a7768]">{fmtTgl(o.tanggalProduksi)} · {infoKirim(o)}</p>
              </div>
              <div className="w-[120px]">
                <span className={badgeMap[o.statusOtomatis] ?? badgeMap['Diterima']}>
                  {o.statusOtomatis}
                </span>
              </div>
              <div className="w-[36px] relative">
                <button onClick={() => setMenuOpen(menuOpen === o.id ? null : o.id)}
                  className="text-[#8a7768] hover:text-[#2b1d16]">
                  <span className="text-base leading-none">···</span>
                </button>
                {menuOpen === o.id && (
                  <div className="absolute right-0 top-7 bg-white border border-[#eadfd0] rounded-xl shadow-[0_8px_32px_rgba(89,56,33,0.12)] z-10 min-w-[160px]">
                    {(manualActions[o.statusOtomatis] || []).map(action => (
                      <button key={action} onClick={() => batalkan(o.id)}
                        className="block w-full text-left px-4 py-2.5 text-sm hover:bg-[#faf6ee] rounded-t-xl text-[#dc2626]">
                        {action}
                      </button>
                    ))}
                    <button onClick={() => setMenuOpen(null)}
                      className="block w-full text-left px-4 py-2.5 text-sm text-[#8a7768] hover:bg-[#faf6ee] rounded-b-xl border-t border-[#eadfd0]">
                      Lihat Detail
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Pagination */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-[#eadfd0]">
            <p className="text-[#7e4722] text-sm">
              Menampilkan 1–{filtered.length} dari {filtered.length} pesanan
            </p>
            <div className="flex gap-2">
              <button className="border border-[#eadfd0] px-4 h-9 rounded-lg text-sm font-semibold text-[#2b1d16] hover:bg-[#faf6ee]">Sebelumnya</button>
              <button className="border border-[#eadfd0] px-4 h-9 rounded-lg text-sm font-semibold text-[#2b1d16] hover:bg-[#faf6ee]">1</button>
              <button className="border border-[#eadfd0] px-4 h-9 rounded-lg text-sm font-semibold text-[#2b1d16] hover:bg-[#faf6ee]">Berikutnya</button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#eadfd0] bg-white px-9 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[#8a7768] text-xs">ℹ</span>
          <p className="text-[#8a7768] text-xs">
            Status berubah otomatis berdasarkan waktu. ≥72 jam → Diterima · &lt;72 jam → Dijadwalkan · Hari produksi tiba → Diproduksi · Kirim +2 jam → Selesai
          </p>
        </div>
      </footer>
      <div className="bg-white border-t border-[#eadfd0] px-9 py-2 flex items-center justify-between">
        <p className="text-[#8a7768] text-xs">Hakuu Bakery • Operasional usaha, bukan etalase pelanggan</p>
        <p className="text-[#8a7768] text-xs">Waktu Indonesia Barat</p>
      </div>
    </div>
  );
}
