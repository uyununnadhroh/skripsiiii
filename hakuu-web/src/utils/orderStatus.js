// ─── Shared order status logic ────────────────────────────────────────────
// Dipakai oleh Dashboard dan DaftarPesanan.

export function toDateTime(tanggalIso, jamStr) {
  return new Date(`${tanggalIso}T${jamStr}:00`);
}

export function diffHours(a, b) {
  return (a - b) / (1000 * 60 * 60);
}

export function fmtTgl(iso) {
  return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export function isoDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

export function padHour(h) {
  return String(Math.max(0, Math.min(23, h))).padStart(2, '0');
}

/**
 * Hitung status otomatis berdasarkan waktu nyata (new Date()):
 *
 * 1. Dibatalkan              → tetap Dibatalkan
 * 2. waktuKirim + 2 jam lewat → Selesai
 * 3. tanggalProduksi ≤ hari ini → Diproduksi
 * 4. waktuKirim < 72 jam dari sekarang → Dijadwalkan (H-3, masuk antrian)
 * 5. waktuKirim ≥ 72 jam → Diterima
 */
export function computeStatus(order) {
  if (order.statusPesanan === 'Dibatalkan') return 'Dibatalkan';

  const now          = new Date();
  const waktuKirim   = toDateTime(order.tanggalKirim, order.jamKirim);
  const waktuSelesai = new Date(waktuKirim.getTime() + 2 * 3600 * 1000);
  const hrsToKirim   = diffHours(waktuKirim, now);

  if (now >= waktuSelesai) return 'Selesai';

  const produksiDate = new Date(order.tanggalProduksi + 'T00:00:00');
  const todayDate    = new Date(new Date().toDateString());
  if (produksiDate <= todayDate) return 'Diproduksi';

  if (hrsToKirim < 72) return 'Dijadwalkan';

  return 'Diterima';
}

export function infoKirim(order) {
  const now   = new Date();
  const wk    = toDateTime(order.tanggalKirim, order.jamKirim);
  const ws    = new Date(wk.getTime() + 2 * 3600 * 1000);
  const prod  = new Date(order.tanggalProduksi + 'T00:00:00');
  const today = new Date(new Date().toDateString());
  if (now >= ws)               return 'H';
  if (prod <= today)           return 'H';
  if (diffHours(wk, now) < 72) return 'H-1';
  const daysOut = Math.ceil(diffHours(wk, now) / 24);
  return `H-${daysOut}`;
}

// Badge CSS classes matching Figma
export const badgeMap = {
  'Dijadwalkan': 'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium border border-[#4c0c13] text-[#4c0c13] bg-white',
  'Diterima':    'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#fcebc8] text-[#7e4722]',
  'Diproduksi':  'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#fff0e0] text-[#c2410c]',
  'Selesai':     'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#dcfce7] text-[#166534]',
  'Dibatalkan':  'inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-[#fee2e2] text-[#991b1b]',
};

// Data pesanan bersama (single source of truth)
// Tanggal relatif dari hari ini agar selalu relevan
const nowHour = new Date().getHours();

export const sharedOrders = [
  { id: 'HB-0012', pembeli: 'Sari Wulandari',  produk: 'Roti Sobek Abon',  qty: 100,
    tanggalKirim: isoDate(1), jamKirim: '09:00', tanggalProduksi: isoDate(0), statusPesanan: 'aktif' },
  { id: 'HB-0013', pembeli: 'Budi Santoso',     produk: 'Roti Kepang',      qty: 160,
    tanggalKirim: isoDate(1), jamKirim: '10:00', tanggalProduksi: isoDate(0), statusPesanan: 'aktif' },
  { id: 'HB-0014', pembeli: 'Rina Handayani',   produk: 'Roti Sobek Meses', qty: 100,
    tanggalKirim: isoDate(1), jamKirim: '10:30', tanggalProduksi: isoDate(0), statusPesanan: 'aktif' },
  { id: 'HB-0015', pembeli: 'Dewi Lestari',     produk: 'Roti Kepang',      qty: 94,
    tanggalKirim: isoDate(0), jamKirim: `${padHour(nowHour + 5)}:00`, tanggalProduksi: isoDate(0), statusPesanan: 'aktif' },
  { id: 'HB-0016', pembeli: 'Andi Saputra',     produk: 'Roti Kepang',      qty: 80,
    tanggalKirim: isoDate(0), jamKirim: `${padHour(nowHour - 4)}:00`, tanggalProduksi: isoDate(0), statusPesanan: 'aktif' },
  { id: 'HB-0017', pembeli: 'Nur Aisyah',       produk: 'Roti Kepang',      qty: 60,
    tanggalKirim: isoDate(0), jamKirim: `${padHour(nowHour - 3)}:00`, tanggalProduksi: isoDate(0), statusPesanan: 'aktif' },
  { id: 'HB-0018', pembeli: 'Toko Roti Mawar',  produk: 'Roti Sobek Abon',  qty: 50,
    tanggalKirim: isoDate(4), jamKirim: '09:00', tanggalProduksi: isoDate(3), statusPesanan: 'aktif' },
  { id: 'HB-0019', pembeli: 'Warung Bu Sari',   produk: 'Roti Kepang Mini', qty: 30,
    tanggalKirim: isoDate(6), jamKirim: '11:00', tanggalProduksi: isoDate(5), statusPesanan: 'aktif' },
  { id: 'HB-0020', pembeli: 'Toko Sejahtera',   produk: 'Roti Kepang Mini', qty: 80,
    tanggalKirim: isoDate(2), jamKirim: '10:00', tanggalProduksi: isoDate(1), statusPesanan: 'Dibatalkan' },
];
