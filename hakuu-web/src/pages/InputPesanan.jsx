import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iconIkonPengecekan } from '../assets/icons';

const CAPACITY_DAILY = 800;
const CAPACITY_USED  = 640;

const menuHemat = [
  { id: 1,  name: 'Roti Sobek Abon',  jenis: 'Bertopping',    price: 18000, bobotMultiplier: 1.23 },
  { id: 2,  name: 'Roti Sobek Meses', jenis: 'Bertopping',    price: 18000, bobotMultiplier: 1.23 },
  { id: 3,  name: 'Roti Kepang',      jenis: 'Tanpa topping', price: 22000, bobotMultiplier: 1.00 },
  { id: 4,  name: 'Roti Sobek',       jenis: 'Tanpa topping', price: 16000, bobotMultiplier: 1.00 },
  { id: 5,  name: 'Roti Kepang Mini', jenis: 'Tanpa topping', price: 6000,  bobotMultiplier: 1.00 },
];

const menuPaket = [
  { id: 10, name: 'Paket Hemat A', jenis: 'Campuran', price: 55000, bobotMultiplier: 1.10 },
];

function CapacitySidebar({ items }) {
  const totalBox   = items.reduce((s, i) => s + i.qty, 0);
  const totalBobot = items.reduce((s, i) => s + i.qty * i.bobotMultiplier, 0);
  const totalUsed  = CAPACITY_USED + totalBobot;
  const pct        = Math.round((totalUsed / CAPACITY_DAILY) * 100);
  const remaining  = CAPACITY_DAILY - totalUsed;

  const barColor = pct >= 100 ? '#b74b40' : pct >= 90 ? '#a66a17' : '#327a52';
  const label    = pct >= 100 ? 'Kapasitas penuh' : pct >= 90 ? 'Mendekati penuh' : 'Kapasitas cukup';
  const labelColor = pct >= 100 ? 'text-[#b74b40]' : pct >= 90 ? 'text-[#a66a17]' : 'text-[#327a52]';

  return (
    <div className="flex flex-col gap-4 w-[280px] shrink-0">
      {/* Capacity card */}
      <div className="card p-5 flex flex-col gap-4">
        <div className="flex items-start justify-between">
          <p className="text-[#2b1d16] text-sm font-semibold">Pengecekan kapasitas</p>
          <img src={iconIkonPengecekan} alt="" className="size-5" />
        </div>

        <div>
          <div className="flex justify-between mb-1.5">
            <span className="text-[#8a7768] text-xs">Kapasitas terpakai</span>
            <span className={`text-xs font-semibold ${labelColor}`}>{label}</span>
          </div>
          <div className="bg-[#eadfd0] rounded-full h-2 overflow-hidden">
            <div className="h-full rounded-full transition-all"
              style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: barColor }} />
          </div>
          <div className="flex justify-between mt-1.5">
            <span className="text-[#8a7768] text-xs">{Math.round(totalUsed)} / {CAPACITY_DAILY} box</span>
            <span className={`text-xs font-semibold ${labelColor}`}>{pct}%</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#faf6ee] rounded-xl p-3">
            <p className="text-[#8a7768] text-xs">Pesanan ini</p>
            <p className="text-[#2b1d16] text-base font-semibold mt-0.5">{totalBox} box</p>
            <p className="text-[#8a7768] text-[10px]">{totalBobot.toFixed(0)} box kapasitas</p>
          </div>
          <div className="bg-[#faf6ee] rounded-xl p-3">
            <p className="text-[#8a7768] text-xs">Sisa kapasitas</p>
            <p className={`text-base font-semibold mt-0.5 ${remaining < 0 ? 'text-[#b74b40]' : 'text-[#2b1d16]'}`}>
              {Math.max(0, Math.round(remaining))} box
            </p>
            <p className="text-[#8a7768] text-[10px]">setelah pesanan ini</p>
          </div>
        </div>

        {pct >= 90 && pct < 100 && (
          <div className="bg-[#fdf6ec] border border-[#e8c98a] rounded-xl p-3 text-xs text-[#7e4722]">
            ⚠ Kapasitas hampir penuh. Pertimbangkan membagi produksi ke H-2.
          </div>
        )}
        {pct >= 100 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-[#b74b40]">
            ✕ Kapasitas penuh. Pesanan perlu dibagi ke tanggal lain.
          </div>
        )}
      </div>

      {/* Order summary */}
      {items.length > 0 && (
        <div className="card p-5 flex flex-col gap-3">
          <p className="text-[#2b1d16] text-sm font-semibold">Ringkasan pesanan</p>
          {items.map(item => (
            <div key={item.id} className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <p className="text-[#2b1d16] text-xs font-medium truncate">{item.name}</p>
                <p className="text-[#8a7768] text-xs">×{item.qty} box</p>
              </div>
              <p className="text-[#2b1d16] text-xs font-semibold shrink-0">
                Rp {(item.price * item.qty).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
          <div className="border-t border-[#eadfd0] pt-3 flex justify-between">
            <span className="text-[#2b1d16] text-sm font-semibold">Total</span>
            <span className="text-[#4c0c13] text-sm font-bold">
              Rp {items.reduce((s, i) => s + i.price * i.qty, 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

export default function InputPesanan() {
  const navigate = useNavigate();
  const [step, setStep]               = useState(1);
  const [pembeli, setPembeli]         = useState('');
  const [telepon, setTelepon]         = useState('');
  const [alamat, setAlamat]           = useState('');
  const [tanggalKirim, setTanggalKirim] = useState('');
  const [jamKirim, setJamKirim]       = useState('');
  const [catatan, setCatatan]         = useState('');
  const [activeMenuTab, setMenuTab]   = useState('hemat');
  const [orderItems, setOrderItems]   = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const allProducts = activeMenuTab === 'hemat' ? menuHemat : menuPaket;

  function addItem(p) {
    const ex = orderItems.find(i => i.id === p.id);
    if (ex) setOrderItems(orderItems.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
    else    setOrderItems([...orderItems, { ...p, qty: 1 }]);
  }
  function updateQty(id, qty) {
    if (qty <= 0) setOrderItems(orderItems.filter(i => i.id !== id));
    else          setOrderItems(orderItems.map(i => i.id === id ? { ...i, qty } : i));
  }

  function handleSimpan() {
    setShowSuccess(true);
    setTimeout(() => navigate('/daftar-pesanan'), 2000);
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="card p-12 text-center max-w-sm">
          <div className="bg-green-100 rounded-full size-16 flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-3xl">✓</span>
          </div>
          <h2 className="text-[#2b1d16] text-xl font-semibold mb-2">Pesanan Tersimpan!</h2>
          <p className="text-[#8a7768] text-sm">Mengalihkan ke daftar pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-9">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-[#2b1d16] text-[30px] font-normal">Input Pesanan</h1>
          <p className="text-[#8a7768] text-sm mt-1">
            Catat pesanan baru dan cek ruang produksi sebelum menyepakati pengiriman.
          </p>
        </div>
        <div className="bg-[#faf6ee] border border-[#eadfd0] px-3 py-1.5 rounded-full">
          <span className="text-[#4c0c13] text-xs font-medium">Draf HB-0018</span>
        </div>
      </div>

      {/* Step indicator */}
      <div className="bg-[#faf6ee] border border-[#eadfd0] rounded-xl px-5 py-3.5 flex items-center gap-7">
        {[
          { n: 1, label: '1  Detail pesanan' },
          { n: 2, label: '2  Pengecekan kapasitas' },
          { n: 3, label: '3  Simpan pesanan' },
        ].map((s, i) => (
          <div key={s.n} className="flex items-center gap-7">
            <button
              onClick={() => setStep(s.n)}
              className={`text-sm font-semibold whitespace-pre transition-colors ${
                step >= s.n ? 'text-[#4c0c13]' : 'text-[#8a7768] font-normal'
              }`}
            >
              {s.label}
            </button>
            {i < 2 && <span className="text-[#8a7768] text-base">›</span>}
          </div>
        ))}
      </div>

      {/* Two-column layout */}
      <div className="flex gap-6 items-start">
        {/* Left: main form */}
        <div className="flex flex-col gap-5 flex-1 min-w-0">

          {/* Step 1: pembeli info */}
          {(step === 1 || step === 2 || step === 3) && (
            <div className="card p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <p className="text-[#2b1d16] text-lg font-semibold">Informasi pembeli & pengiriman</p>
                {step > 1 && (
                  <button onClick={() => setStep(1)} className="text-[#4c0c13] text-xs font-semibold hover:underline">
                    Edit
                  </button>
                )}
              </div>

              {step === 1 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#2b1d16] text-sm">Nama pembeli *</label>
                      <input className="input-field" value={pembeli}
                        onChange={e => setPembeli(e.target.value)} placeholder="Nurul Hidayah" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#2b1d16] text-sm">Nomor telepon *</label>
                      <input className="input-field" value={telepon}
                        onChange={e => setTelepon(e.target.value)} placeholder="+62 812-3456-7890" />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#2b1d16] text-sm">Alamat pengiriman *</label>
                    <input className="input-field" value={alamat}
                      onChange={e => setAlamat(e.target.value)}
                      placeholder="Jl. Raya Pajajaran No. 12, Kota Bogor" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[#2b1d16] text-sm">Tanggal kirim *</label>
                      <input type="date" className="input-field" value={tanggalKirim}
                        onChange={e => setTanggalKirim(e.target.value)} />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[#2b1d16] text-sm">Jam kirim *</label>
                      <input
                        type="text"
                        className={`input-field font-mono tracking-wider ${
                          jamKirim && !/^([01]\d|2[0-3]):[0-5]\d$/.test(jamKirim)
                            ? 'border-[#dc2626] focus:border-[#dc2626]'
                            : ''
                        }`}
                        value={jamKirim}
                        onChange={e => {
                          // auto-insert colon after 2 digits
                          let v = e.target.value.replace(/[^0-9:]/g, '');
                          if (v.length === 2 && !v.includes(':') && jamKirim.length < 2) {
                            v = v + ':';
                          }
                          if (v.length <= 5) setJamKirim(v);
                        }}
                        onBlur={e => {
                          const v = e.target.value;
                          // normalise single-digit hour: "9:30" → "09:30"
                          const match = v.match(/^(\d):(\d{2})$/);
                          if (match) setJamKirim(`0${match[1]}:${match[2]}`);
                        }}
                        placeholder="09:00"
                        maxLength={5}
                      />
                      {jamKirim && !/^([01]\d|2[0-3]):[0-5]\d$/.test(jamKirim) && (
                        <p className="text-[#dc2626] text-xs">
                          Format 24 jam: 00:00 – 23:59
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-[#2b1d16] text-sm">Catatan (opsional)</label>
                    <textarea className="input-field min-h-[80px] resize-none" value={catatan}
                      onChange={e => setCatatan(e.target.value)}
                      placeholder="Permintaan khusus, alergi, dll." />
                  </div>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!pembeli || !tanggalKirim || !/^([01]\d|2[0-3]):[0-5]\d$/.test(jamKirim)}
                    className="btn-primary self-end disabled:opacity-50 disabled:cursor-not-allowed">
                    Lanjut ke Pilih Produk →
                  </button>
                </>
              )}

              {step > 1 && (
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-[#8a7768]">Pembeli</span> <span className="text-[#2b1d16] ml-2 font-medium">{pembeli}</span></div>
                  <div><span className="text-[#8a7768]">Telepon</span> <span className="text-[#2b1d16] ml-2">{telepon}</span></div>
                  <div><span className="text-[#8a7768]">Kirim</span> <span className="text-[#2b1d16] ml-2">{tanggalKirim} · {jamKirim}</span></div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: choose products */}
          {step >= 2 && (
            <div className="card p-6 flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <p className="text-[#2b1d16] text-lg font-semibold">Pilih produk</p>
                {step > 2 && (
                  <button onClick={() => setStep(2)} className="text-[#4c0c13] text-xs font-semibold hover:underline">Edit</button>
                )}
              </div>

              {step === 2 && (
                <>
                  {/* Menu tabs */}
                  <div className="flex gap-3">
                    {[['hemat','Menu Hemat'], ['paket','Menu Paket']].map(([key, label]) => (
                      <button key={key} onClick={() => setMenuTab(key)}
                        className={`px-4 h-9 rounded-lg text-sm font-semibold transition-colors ${
                          activeMenuTab === key
                            ? 'bg-[#4c0c13] text-white'
                            : 'bg-white border border-[#eadfd0] text-[#2b1d16] hover:bg-[#faf6ee]'
                        }`}>
                        {label}
                      </button>
                    ))}
                  </div>

                  {/* Product list */}
                  <div className="flex flex-col gap-0">
                    {/* Table header */}
                    <div className="bg-[#faf6ee] flex items-center px-4 h-10 gap-4 rounded-t-xl border border-[#eadfd0]">
                      <p className="flex-1 min-w-0 text-xs font-medium text-[#7e4722]">Nama produk</p>
                      <p className="w-[120px] text-xs font-medium text-[#7e4722]">Harga / box</p>
                      <p className="w-[120px] text-xs font-medium text-[#7e4722]">Jenis</p>
                      <p className="w-[120px] text-xs font-medium text-[#7e4722] text-center">Jumlah</p>
                    </div>
                    {allProducts.map((p, idx) => {
                      const inOrder = orderItems.find(i => i.id === p.id);
                      return (
                        <div key={p.id}
                          className={`flex items-center px-4 h-14 gap-4 border-l border-r border-b border-[#eadfd0] ${
                            idx === allProducts.length - 1 ? 'rounded-b-xl' : ''
                          } hover:bg-[#faf6ee]/50 transition-colors`}>
                          <p className="flex-1 min-w-0 text-sm font-semibold text-[#2b1d16]">{p.name}</p>
                          <p className="w-[120px] text-sm text-[#2b1d16]">
                            Rp {p.price.toLocaleString('id-ID')}
                          </p>
                          <p className="w-[120px] text-sm text-[#78685c]">{p.jenis}</p>
                          <div className="w-[120px] flex items-center justify-center">
                            {inOrder ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => updateQty(p.id, inOrder.qty - 1)}
                                  className="size-7 rounded-full border border-[#eadfd0] text-[#4c0c13] font-bold text-lg leading-none hover:bg-[#faf6ee] shrink-0"
                                >
                                  −
                                </button>
                                <input
                                  type="number"
                                  min="1"
                                  value={inOrder.qty}
                                  onChange={e => {
                                    const val = parseInt(e.target.value, 10);
                                    if (!isNaN(val) && val > 0) updateQty(p.id, val);
                                  }}
                                  onBlur={e => {
                                    const val = parseInt(e.target.value, 10);
                                    if (isNaN(val) || val < 1) updateQty(p.id, 1);
                                  }}
                                  className="w-12 text-center text-sm font-semibold text-[#2b1d16] border border-[#eadfd0] rounded-lg py-1 focus:outline-none focus:border-[#4c0c13] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <button
                                  onClick={() => updateQty(p.id, inOrder.qty + 1)}
                                  className="size-7 rounded-full bg-[#4c0c13] text-white font-bold text-lg leading-none hover:bg-[#3a0a0f] shrink-0"
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button onClick={() => addItem(p)}
                                className="size-7 rounded-full bg-[#4c0c13] text-white font-bold text-lg leading-none hover:bg-[#3a0a0f]">
                                +
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button onClick={() => setStep(1)} className="btn-secondary">← Kembali</button>
                    <button onClick={() => setStep(3)} disabled={orderItems.length === 0}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                      Lanjut ke Konfirmasi →
                    </button>
                  </div>
                </>
              )}

              {step === 3 && orderItems.length > 0 && (
                <div className="flex flex-col gap-2 text-sm">
                  {orderItems.map(i => (
                    <div key={i.id} className="flex justify-between">
                      <span className="text-[#2b1d16]">{i.name} ×{i.qty}</span>
                      <span className="text-[#2b1d16] font-medium">
                        Rp {(i.price * i.qty).toLocaleString('id-ID')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 3: confirm & save */}
          {step === 3 && (
            <div className="card p-6 flex flex-col gap-4">
              <p className="text-[#2b1d16] text-lg font-semibold">Simpan pesanan</p>
              <p className="text-[#8a7768] text-sm">
                Periksa kembali detail pesanan sebelum disimpan.
              </p>
              <div className="flex gap-3 pt-2">
                <button onClick={() => setStep(2)} className="btn-secondary">← Kembali</button>
                <button onClick={handleSimpan} className="btn-primary flex-1 justify-center">
                  Simpan Pesanan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: capacity sidebar */}
        <CapacitySidebar items={orderItems} />
      </div>
    </div>
  );
}
