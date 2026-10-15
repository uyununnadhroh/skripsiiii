import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconArrowUpRight, iconClipboardList } from '../assets/icons';
import { computeStatus, infoKirim, badgeMap, fmtTgl, isoDate } from '../utils/orderStatus';
import { orderService } from '../services/order.service';

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
  const [orders, setOrders] = useState([]);
  const [activeTab, setTab] = useState('Semua');
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch orders dari backend
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError('');
      const data = await orderService.getAllOrders();
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Gagal memuat data pesanan');
      console.error('Error fetching orders:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle update status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await orderService.updateOrderStatus(orderId, newStatus);
      // Refresh data setelah update
      await fetchOrders();
      setMenuOpen(null);
    } catch (err) {
      alert('Gagal mengubah status: ' + err.message);
    }
  };

  // Handle delete order
  const handleDeleteOrder = async (orderId) => {
    if (!confirm('Yakin ingin menghapus pesanan ini?')) return;
    
    try {
      await orderService.deleteOrder(orderId);
      await fetchOrders();
    } catch (err) {
      alert('Gagal menghapus pesanan: ' + err.message);
    }
  };

  // Hitung status otomatis pakai waktu nyata (useMemo agar efisien)
  const withStatus = useMemo(() =>
    orders.map(o => ({ ...o, statusOtomatis: computeStatus(o) })),
    [orders]
  );

  const totalBox = orders.filter(o => o.statusPesanan !== 'Dibatalkan').reduce((s, o) => s + o.qty, 0);
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
      .sort((a, b) => new Date(b.tanggalPesan) - new Date(a.tanggalPesan)),
    [withStatus, activeTab, search]
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-[#8a7768]">Memuat data pesanan...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-red-600">{error}</p>
        <button onClick={fetchOrders} className="btn-primary">
          Coba Lagi
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-[#2b1d16] text-3xl font-bold">Daftar Pesanan</h1>
          <p className="text-[#8a7768] text-sm">
            {totalBox}/{totalKapasitas} box ({Math.round((totalBox / totalKapasitas) * 100)}% kapasitas)
          </p>
        </div>
        <button
          className="btn-primary gap-2"
          onClick={() => navigate('/input-pesanan')}
        >
          <img src={iconClipboardList} alt="" className="size-5" />
          <span>Input Pesanan</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto">
        {STATUS_TABS.map(tab => (
          <button
            key={tab}
            className={`tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setTab(tab)}
          >
            {tab}
            <span className="badge">{tabCounts[tab] || 0}</span>
          </button>
        ))}
      </div>

      {/* Search */}
      <input
        type="text"
        placeholder="Cari ID atau nama pembeli..."
        className="input-field max-w-md"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {filtered.length === 0 ? (
          <div className="card p-12 text-center">
            <p className="text-[#8a7768]">Tidak ada pesanan</p>
          </div>
        ) : (
          filtered.map(order => {
            const st = order.statusOtomatis;
            const badge = badgeMap[st] || badgeMap['Diterima'];
            const actions = manualActions[st] || [];
            const info = infoKirim(order);

            return (
              <div key={order.id} className="card p-6 flex gap-4">
                <div className="flex-1 flex flex-col gap-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-[#2b1d16] font-semibold">{order.id}</p>
                        <span className={`badge ${badge}`}>{st}</span>
                      </div>
                      <p className="text-[#8a7768] text-sm mt-1">{order.pembeli}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {actions.length > 0 && (
                        <div className="relative">
                          <button
                            className="text-[#8a7768] text-sm hover:text-[#2b1d16]"
                            onClick={() => setMenuOpen(menuOpen === order.id ? null : order.id)}
                          >
                            •••
                          </button>
                          {menuOpen === order.id && (
                            <div className="absolute right-0 mt-2 bg-white rounded-lg shadow-lg border border-[#eadfd0] py-1 z-10 min-w-[120px]">
                              {actions.map(action => (
                                <button
                                  key={action}
                                  className="block w-full text-left px-4 py-2 text-sm hover:bg-[#faf6ee]"
                                  onClick={() => handleUpdateStatus(order.id, action === 'Batalkan' ? 'Dibatalkan' : action)}
                                >
                                  {action}
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-[#8a7768]">Produk</p>
                      <p className="text-[#2b1d16] font-medium">{order.namaProduk}</p>
                    </div>
                    <div>
                      <p className="text-[#8a7768]">Qty</p>
                      <p className="text-[#2b1d16] font-medium">{order.qty} box</p>
                    </div>
                    <div>
                      <p className="text-[#8a7768]">Tgl Pesan</p>
                      <p className="text-[#2b1d16] font-medium">{fmtTgl(order.tanggalPesan)}</p>
                    </div>
                    <div>
                      <p className="text-[#8a7768]">Tgl Kirim</p>
                      <p className="text-[#2b1d16] font-medium">{fmtTgl(order.tanggalKirim)}</p>
                    </div>
                  </div>

                  {info && (
                    <div className="bg-[#faf6ee] rounded-lg p-3">
                      <p className="text-[#8a7768] text-xs">{info}</p>
                    </div>
                  )}
                </div>

                <button
                  className="btn-secondary gap-2 self-start"
                  onClick={() => navigate(`/pesanan/${order.id}`)}
                >
                  <span>Detail</span>
                  <img src={iconArrowUpRight} alt="" className="size-4" />
                </button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
