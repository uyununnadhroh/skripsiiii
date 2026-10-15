import { useState } from 'react';

export default function Pengaturan() {
  const [capacity, setCapacity] = useState(800);
  const [shopName, setShopName] = useState('Hakuu Bakery');
  const [email, setEmail] = useState('admin@hakuubakery.com');
  const [saved, setSaved] = useState(false);

  function handleSave(e) {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-6 p-9 max-w-2xl">
      <div>
        <h1 className="text-[#2b1d16] text-3xl font-normal">Pengaturan</h1>
        <p className="text-[#8a7768] text-sm mt-1.5">Kelola konfigurasi toko dan sistem.</p>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6">
        {/* Shop info */}
        <div className="card p-6 flex flex-col gap-5">
          <h2 className="text-[#2b1d16] text-base font-semibold">Informasi Toko</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[#2b1d16] text-sm">Nama toko</label>
            <input
              className="input-field"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-[#2b1d16] text-sm">Email admin</label>
            <input
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        {/* Production settings */}
        <div className="card p-6 flex flex-col gap-5">
          <h2 className="text-[#2b1d16] text-base font-semibold">Kapasitas Produksi</h2>
          <div className="flex flex-col gap-2">
            <label className="text-[#2b1d16] text-sm">
              Kapasitas harian (satuan bobot)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="number"
                className="input-field max-w-[120px]"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                min={100}
                step={50}
              />
              <span className="text-[#8a7768] text-sm">unit per hari</span>
            </div>
            <p className="text-[#8a7768] text-xs">
              Kapasitas ini digunakan untuk menghitung persentase beban produksi.
            </p>
          </div>
          <div className="bg-[#faf6ee] border border-[#eadfd0] rounded-xl p-4">
            <div className="flex justify-between mb-2">
              <span className="text-[#2b1d16] text-sm">Kapasitas saat ini</span>
              <span className="text-[#4c0c13] text-sm font-semibold">{capacity} unit</span>
            </div>
            <div className="bg-[#eadfd0] rounded-full h-2 overflow-hidden">
              <div className="bg-[#4c0c13] h-full rounded-full" style={{ width: '80%' }} />
            </div>
            <p className="text-[#8a7768] text-xs mt-2">
              Hari ini: 640 / {capacity} unit ({Math.round(640 / capacity * 100)}% terpakai)
            </p>
          </div>
        </div>

        {/* Notification settings */}
        <div className="card p-6 flex flex-col gap-5">
          <h2 className="text-[#2b1d16] text-base font-semibold">Notifikasi</h2>
          {[
            { label: 'Peringatan kapasitas hampir penuh (≥80%)', defaultOn: true },
            { label: 'Pesanan baru masuk', defaultOn: true },
            { label: 'Pesanan menunggu konfirmasi > 2 jam', defaultOn: false },
          ].map((n) => {
            const [on, setOn] = useState(n.defaultOn);
            return (
              <div key={n.label} className="flex items-center justify-between">
                <span className="text-[#2b1d16] text-sm">{n.label}</span>
                <button
                  type="button"
                  onClick={() => setOn(!on)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    on ? 'bg-[#4c0c13]' : 'bg-[#eadfd0]'
                  }`}
                >
                  <span
                    className={`inline-block size-4 rounded-full bg-white shadow transition-transform ${
                      on ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            );
          })}
        </div>

        {/* Save */}
        <div className="flex items-center gap-4">
          <button type="submit" className="btn-primary px-8">
            Simpan Pengaturan
          </button>
          {saved && (
            <span className="text-[#16a34a] text-sm font-medium flex items-center gap-1">
              ✓ Tersimpan
            </span>
          )}
        </div>
      </form>
    </div>
  );
}
