import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  logoHakuuBakeryLogin,
  iconClipboardListLogin,
  iconGauge,
  iconCalendarCheck,
  iconCheck,
} from '../assets/icons';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@hakuubakery.com');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    navigate('/dashboard');
  }

  return (
    <div className="flex items-stretch min-h-screen bg-[#faf6ee]">
      {/* Left panel */}
      <div className="bg-[#4c0c13] flex flex-col items-start justify-between p-16 w-[600px] shrink-0">
        {/* Logo */}
        <div>
          <img src={logoHakuuBakeryLogin} alt="Hakuu Bakery" className="h-[50px] w-[183px] object-contain" />
        </div>

        {/* Benefits */}
        <div className="flex flex-col gap-8 w-full">
          <div>
            <p className="text-white text-5xl font-semibold leading-[1.2]">Pesanan tertata.</p>
            <p className="text-white text-5xl font-semibold leading-[1.2]">Produksi lebih tenang.</p>
          </div>
          <p className="text-[#fcebc8] text-base leading-relaxed">
            Satu ruang kerja untuk mencatat pesanan, menjaga kapasitas, dan menyiapkan roti tepat waktu.
          </p>
          <div className="flex flex-col gap-5">
            {[
              {
                icon: iconClipboardListLogin,
                title: 'Catat semua pesanan',
                desc: 'WhatsApp dan pesanan langsung, satu tempat.',
              },
              {
                icon: iconGauge,
                title: 'Cek kapasitas sebelum menerima',
                desc: 'Hitung beban produksi, bukan sekadar jumlah box.',
              },
              {
                icon: iconCalendarCheck,
                title: 'Susun prioritas produksi',
                desc: 'Jadwal H-1 dan hari H yang mudah dipantau.',
              },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 items-center">
                <div className="bg-white/10 flex items-center justify-center rounded-xl size-11 shrink-0">
                  <img src={item.icon} alt="" className="size-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-white text-sm font-semibold">{item.title}</p>
                  <p className="text-[#fcebc8] text-xs">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="text-[#daa278] text-xs">Dibuat untuk operasional UMKM Hakuu Bakery.</p>
      </div>

      {/* Right panel */}
      <div className="flex flex-1 flex-col items-center justify-center gap-6 p-20">
        <div className="card p-10 w-[460px] flex flex-col gap-7">
          {/* Header */}
          <div className="flex flex-col gap-2.5">
            <h1 className="text-[#2b1d16] text-3xl font-bold">Selamat datang kembali</h1>
            <p className="text-[#8a7768] text-sm">Masuk untuk menyiapkan hari produksi Anda.</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-7">
            {/* Email */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2b1d16] text-sm">Email</label>
              <input
                type="email"
                className="input-field"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@hakuubakery.com"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-2">
              <label className="text-[#2b1d16] text-sm">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input-field pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7768] text-xs"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? 'Sembunyikan' : 'Tampilkan'}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <button
                type="button"
                className="flex gap-2 items-center"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div
                  className={`flex items-center justify-center rounded size-4 ${
                    rememberMe ? 'bg-[#4c0c13]' : 'border border-[#eadfd0]'
                  }`}
                >
                  {rememberMe && <img src={iconCheck} alt="" className="size-3" />}
                </div>
                <span className="text-[#2b1d16] text-xs">Ingat saya</span>
              </button>
              <button type="button" className="text-[#4c0c13] text-xs font-semibold hover:underline">
                Lupa password?
              </button>
            </div>

            <button type="submit" className="btn-primary justify-center h-11 w-full rounded-xl">
              Masuk
            </button>
          </form>
        </div>

        <p className="text-[#8a7768] text-xs">©2026 Hakuu Bakery</p>
      </div>
    </div>
  );
}
