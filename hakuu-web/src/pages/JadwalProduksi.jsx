import { useState } from 'react';

const TODAY_LABEL = '11 Oktober 2026';
const TODAY_DAY   = 'Minggu • jam kerja 06.00–18.00';

// Sesi H-1: produksi hari ini untuk kirim besok (sebelum 11.00)
const sesiH1 = [
  { id: 1, orderId: 'HB-0012', pembeli: 'Sari Wulandari',  jamKirim: '12 Okt · 09.00', qty: 100, waktuMasuk: '10 Okt, 08.10', skor: 92 },
  { id: 2, orderId: 'HB-0013', pembeli: 'Budi Santoso',    jamKirim: '12 Okt · 10.00', qty: 160, waktuMasuk: '10 Okt, 09.25', skor: 86 },
  { id: 3, orderId: 'HB-0014', pembeli: 'Rina Handayani',  jamKirim: '12 Okt · 10.30', qty: 100, waktuMasuk: '10 Okt, 11.40', skor: 80 },
];

// Sesi Hari H: produksi dan kirim hari ini
const sesiHariH = [
  { id: 4, orderId: 'HB-0015', pembeli: 'Dewi Lestari',    jamKirim: '11 Okt · 14.00', qty: 94,  waktuMasuk: '10 Okt, 13.05', skor: 75 },
  { id: 5, orderId: 'HB-0016', pembeli: 'Andi Saputra',    jamKirim: '11 Okt · 15.00', qty: 80,  waktuMasuk: '10 Okt, 14.30', skor: 68 },
  { id: 6, orderId: 'HB-0017', pembeli: 'Nur Aisyah',      jamKirim: '11 Okt · 16.00', qty: 60,  waktuMasuk: '10 Okt, 15.10', skor: 62 },
];

function ScoreBadge({ score }) {
  const color = score >= 85 ? 'bg-[#eaf5ed] text-[#327a52]'
              : score >= 70 ? 'bg-[#fdf6ec] text-[#a66a17]'
              :               'bg-[#fef2f2] text-[#b74b40]';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium ${color}`}>
      {score}
    </span>
  );
}

function SesiTable({ title, subtitle, rows, kapasitas, onLihatSkor, onUbahUrutan, isManual }) {
  const [localRows, setLocalRows] = useState(rows);
  const [dragging, setDragging]   = useState(null);
  const [dragOver, setDragOver]   = useState(null);

  function handleDrop(targetId) {
    if (dragging === targetId) return;
    const from = localRows.findIndex(r => r.id === dragging);
    const to   = localRows.findIndex(r => r.id === targetId);
    const updated = [...localRows];
    const [item] = updated.splice(from, 1);
    updated.splice(to, 0, item);
    setLocalRows(updated);
    setDragging(null);
    setDragOver(null);
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#eadfd0]">
        <div>
          <p className="text-[#2b1d16] text-lg font-normal">{title}</p>
          <p className="text-[#7e4722] text-xs mt-0.5">{subtitle}</p>
        </div>
      </div>

      {/* Table header */}
      <div className="bg-[#faf6ee] flex items-center px-6 h-10 gap-4 border-b border-[#eadfd0]">
        {isManual && <div className="w-5" />}
        <p className="w-[96px] text-xs font-medium text-[#7e4722]">Urutan</p>
        <p className="flex-1 min-w-0 text-xs font-medium text-[#7e4722]">Pesanan / pembeli</p>
        <p className="w-[180px] text-xs font-medium text-[#7e4722]">Jam kirim</p>
        <p className="w-[64px] text-xs font-medium text-[#7e4722]">Qty box</p>
        <p className="flex-1 min-w-0 text-xs font-medium text-[#7e4722]">Waktu masuk</p>
        <p className="flex-1 min-w-0 text-xs font-medium text-[#7e4722]">Skor</p>
        <p className="w-[36px] text-xs font-medium text-[#7e4722]">Aksi</p>
      </div>

      {localRows.map((row, idx) => (
        <div
          key={row.id}
          className={`flex items-center px-6 h-16 gap-4 border-b border-[#eadfd0] last:border-0 transition-colors ${
            dragOver === row.id ? 'bg-[#fcebc8]/30' : 'hover:bg-[#faf6ee]/50'
          }`}
          draggable={isManual}
          onDragStart={() => setDragging(row.id)}
          onDragOver={e => { e.preventDefault(); setDragOver(row.id); }}
          onDrop={() => handleDrop(row.id)}
          onDragEnd={() => { setDragging(null); setDragOver(null); }}
        >
          {isManual && (
            <div className="w-5 cursor-grab text-[#8a7768] text-lg leading-none">⠿</div>
          )}
          <p className="w-[96px] text-sm text-[#2b1d16]">{idx + 1}</p>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-[#2b1d16]">{row.orderId}</p>
            <p className="text-xs text-[#8a7768]">{row.pembeli}</p>
          </div>
          <p className="w-[180px] text-sm text-[#7e4722]">{row.jamKirim}</p>
          <p className="w-[64px] text-sm text-[#2b1d16]">{row.qty}</p>
          <p className="flex-1 min-w-0 text-sm text-[#2b1d16]">{row.waktuMasuk}</p>
          <div className="flex-1 min-w-0">
            <ScoreBadge score={row.skor} />
          </div>
          <div className="w-[36px] text-[#8a7768] hover:text-[#2b1d16] cursor-pointer text-sm">
            ···
          </div>
        </div>
      ))}
    </div>
  );
}

// Modal ubah urutan manual
function UbahUrutanModal({ sesi, rows, onClose, onSave }) {
  const [localRows, setLocalRows] = useState([...rows]);
  const [alasan, setAlasan]       = useState('');
  const [dragIdx, setDragIdx]     = useState(null);
  const [overIdx, setOverIdx]     = useState(null);

  function moveUp(i) {
    if (i === 0) return;
    const r = [...localRows];
    [r[i - 1], r[i]] = [r[i], r[i - 1]];
    setLocalRows(r);
  }
  function moveDown(i) {
    if (i === localRows.length - 1) return;
    const r = [...localRows];
    [r[i], r[i + 1]] = [r[i + 1], r[i]];
    setLocalRows(r);
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-[0_8px_40px_rgba(89,56,33,0.16)] w-[560px] flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#eadfd0]">
          <div>
            <h2 className="text-[#2b1d16] text-lg font-semibold">Ubah urutan manual</h2>
            <p className="text-[#8a7768] text-sm mt-0.5">
              {sesi} • {TODAY_LABEL}. Perubahan hanya berlaku untuk sesi ini.
            </p>
          </div>
          <button onClick={onClose} className="text-[#8a7768] hover:text-[#2b1d16] text-xl leading-none">×</button>
        </div>

        {/* Warning */}
        <div className="mx-6 mt-5 bg-[#fdf6ec] border border-[#e8c98a] rounded-xl p-4 flex gap-3">
          <span className="text-[#a66a17] text-sm shrink-0 mt-0.5">ℹ</span>
          <div>
            <p className="text-[#7e4722] text-sm font-semibold">Urutan otomatis akan diganti</p>
            <p className="text-[#7e4722] text-xs mt-0.5">Catat alasan agar perubahan dapat ditinjau kembali oleh admin.</p>
          </div>
        </div>

        {/* Drag list */}
        <div className="flex flex-col gap-2 px-6 py-4 overflow-y-auto">
          {localRows.map((row, i) => (
            <div key={row.id}
              className="flex items-center gap-3 border border-[#eadfd0] rounded-xl px-4 py-3 bg-white">
              <span className="text-[#8a7768] text-lg cursor-grab">⠿</span>
              <div className="flex items-center gap-2 shrink-0">
                <div className="size-6 rounded-full bg-[#faf6ee] flex items-center justify-center text-xs font-semibold text-[#4c0c13]">
                  {i + 1}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-[#2b1d16]">{row.orderId} · {row.pembeli}</p>
                <p className="text-xs text-[#8a7768]">Kirim {row.jamKirim} · {row.qty} box · skor {row.skor}</p>
              </div>
              <div className="flex flex-col gap-0.5">
                <button onClick={() => moveUp(i)}
                  className="text-[#8a7768] hover:text-[#4c0c13] text-xs leading-none px-1">↑</button>
                <button onClick={() => moveDown(i)}
                  className="text-[#8a7768] hover:text-[#4c0c13] text-xs leading-none px-1">↓</button>
              </div>
            </div>
          ))}
        </div>

        {/* Alasan */}
        <div className="px-6 pb-4 flex flex-col gap-2">
          <label className="text-[#2b1d16] text-sm font-medium">Alasan *</label>
          <textarea
            className={`input-field min-h-[80px] resize-none ${
              alasan === '' ? '' : 'border-[#4c0c13]'
            }`}
            placeholder="Tuliskan alasan perubahan urutan"
            value={alasan}
            onChange={e => setAlasan(e.target.value)}
          />
          {alasan === '' && (
            <p className="text-[#dc2626] text-xs">Alasan wajib diisi sebelum urutan dapat disimpan.</p>
          )}
          <p className="text-[#8a7768] text-xs">
            Perubahan dicatat atas nama Hakuu Bakery. Jumlah box dan kapasitas sesi tidak berubah.
          </p>
        </div>

        {/* Footer */}
        <div className="flex gap-3 px-6 py-4 border-t border-[#eadfd0]">
          <button onClick={onClose} className="btn-secondary flex-1 justify-center">Batal</button>
          <button
            onClick={() => alasan.trim() && onSave(localRows)}
            className={`flex-1 h-11 rounded-xl text-sm font-medium flex items-center justify-center transition-colors ${
              alasan.trim()
                ? 'bg-[#4c0c13] text-white hover:bg-[#3a0a0f]'
                : 'bg-[#c9a9a9] text-white cursor-not-allowed'
            }`}
          >
            Simpan urutan
          </button>
        </div>
      </div>
    </div>
  );
}

export default function JadwalProduksi() {
  const [showModal, setShowModal]       = useState(false);
  const [modalSesi, setModalSesi]       = useState('Sesi H-1');
  const [modalRows, setModalRows]       = useState(sesiH1);
  const [h1Rows, setH1Rows]             = useState(sesiH1);
  const [hariHRows, setHariHRows]       = useState(sesiHariH);
  const [tanggal, setTanggal]           = useState('2026-10-11');

  const totalKapasitas = 800;
  const h1Kapasitas    = 406; // 360 box produk * 1.13 rata-rata
  const hariHKapasitas = 234;
  const used           = h1Kapasitas + hariHKapasitas;
  const pct            = Math.round((used / totalKapasitas) * 100);

  function openModal(sesi, rows) {
    setModalSesi(sesi);
    setModalRows(rows);
    setShowModal(true);
  }

  function handleSaveOrder(newRows) {
    if (modalSesi === 'Sesi H-1') setH1Rows(newRows);
    else setHariHRows(newRows);
    setShowModal(false);
  }

  const h1BoxProduk    = h1Rows.reduce((s, r) => s + r.qty, 0);
  const hariHBoxProduk = hariHRows.reduce((s, r) => s + r.qty, 0);

  return (
    <div className="flex flex-col min-h-full">
      <div className="flex flex-col gap-6 p-9 flex-1">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-[#2b1d16] text-[30px] font-normal">Jadwal Produksi</h1>
            <p className="text-[#8a7768] text-sm mt-1.5">
              Susun pekerjaan berdasarkan sesi dan prioritas, bukan urutan pesan masuk saja.
            </p>
          </div>
          <button onClick={() => openModal('Sesi H-1', h1Rows)} className="btn-secondary text-[#4c0c13]">
            Ubah urutan manual
          </button>
        </div>

        {/* Date + Capacity row */}
        <div className="flex gap-6 items-stretch">
          {/* Date picker card */}
          <div className="card p-5 flex flex-col gap-2 w-[328px] shrink-0">
            <div className="flex flex-col gap-2">
              <label className="text-[#2b1d16] text-sm">Tanggal produksi</label>
              <div className="input-field flex items-center justify-between cursor-pointer">
                <span className="text-[#2b1d16] text-sm">
                  {new Date(tanggal).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                </span>
                <span className="text-[#8a7768] text-xs">📅</span>
              </div>
            </div>
            <p className="text-[#8a7768] text-xs">{TODAY_DAY}</p>
          </div>

          {/* Capacity indicator card */}
          <div className="card p-6 flex flex-col gap-3 flex-1">
            <p className="text-[#2b1d16] text-sm">Total kapasitas produksi hari ini</p>
            <div className="flex items-center justify-between">
              <span className="text-[#2b1d16] text-lg font-normal">{used} / {totalKapasitas} box</span>
              <span className="text-[#a66a17] text-sm font-semibold">{pct}%</span>
            </div>
            <div className="bg-[#eadfd0] rounded-full h-2 overflow-hidden">
              <div className="bg-[#a66a17] h-full rounded-full" style={{ width: `${pct}%` }} />
            </div>
            <p className="text-[#8a7768] text-xs">
              {h1Kapasitas} box H-1 + {hariHKapasitas} box hari H • sisa harian {totalKapasitas - used} box
            </p>
          </div>
        </div>

        {/* Sesi H-1 */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#2b1d16] text-lg font-semibold">Sesi H-1</h2>
              <p className="text-[#8a7768] text-xs mt-0.5">
                Produksi 11 Okt untuk kirim 12 Okt sebelum 11.00 • {h1Rows.length} pesanan, {h1BoxProduk} box produk
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="bg-[#eaf5ed] text-[#327a52] text-xs font-medium px-3 py-1.5 rounded-full">
                {h1Kapasitas} box kapasitas
              </span>
              <button className="btn-secondary text-[#4c0c13] text-xs h-9 px-3">
                Lihat rincian skor
              </button>
            </div>
          </div>

          <SesiTable
            title="Prioritas sesi H-1"
            subtitle="Urutan otomatis • skor tertinggi lebih dahulu"
            rows={h1Rows}
            isManual={false}
          />

          <p className="text-[#7e4722] text-xs">
            Sesi H-1 menggunakan {h1Kapasitas} dari {totalKapasitas} box kapasitas harian.{' '}
            <span className="text-[#327a52]">Sisa setelah H-1: {totalKapasitas - h1Kapasitas} box</span>
          </p>
        </div>

        {/* Sesi Hari H */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-[#2b1d16] text-lg font-semibold">Sesi Hari H</h2>
              <p className="text-[#8a7768] text-xs mt-0.5">
                Produksi dan kirim 11 Okt • {hariHRows.length} pesanan, {hariHBoxProduk} box produk
              </p>
            </div>
            <span className="bg-[#eaf5ed] text-[#327a52] text-xs font-medium px-3 py-1.5 rounded-full">
              {hariHKapasitas} box kapasitas
            </span>
          </div>

          <SesiTable
            title="Prioritas sesi Hari H"
            subtitle="Urutan otomatis • skor tertinggi lebih dahulu"
            rows={hariHRows}
            isManual={false}
          />

          <p className="text-[#7e4722] text-xs">
            Sesi H menggunakan {hariHKapasitas} dari {totalKapasitas - h1Kapasitas} box kapasitas tersisa (
            {Math.round((hariHKapasitas / (totalKapasitas - h1Kapasitas)) * 100)}%).{' '}
            <span className="text-[#327a52]">Sisa akhir harian: {totalKapasitas - used} box</span>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#eadfd0] bg-white px-9 py-3 flex items-center justify-between">
        <p className="text-[#8a7768] text-xs">Hakuu Bakery • Operasional usaha, bukan etalase pelanggan</p>
        <p className="text-[#8a7768] text-xs">Waktu Indonesia Barat</p>
      </footer>

      {/* Modal */}
      {showModal && (
        <UbahUrutanModal
          sesi={modalSesi}
          rows={modalRows}
          onClose={() => setShowModal(false)}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
}
