import { NavLink, useNavigate } from 'react-router-dom';
import {
  logoHakuuBakery,
  iconLayoutDashboard,
  iconClipboardList,
  iconCalendarDays,
  iconMessagesSquare,
  iconPackage,
  iconSettings,
  iconLogOut,
} from '../../assets/icons';

const navItems = [
  { path: '/dashboard',       label: 'Dashboard',       icon: iconLayoutDashboard },
  { path: '/input-pesanan',   label: 'Input Pesanan',   icon: iconClipboardList   },
  { path: '/daftar-pesanan',  label: 'Daftar Pesanan',  icon: iconCalendarDays    },
  { path: '/jadwal-produksi', label: 'Jadwal Produksi', icon: iconMessagesSquare  },
  { path: '/kelola-produk',   label: 'Kelola Produk',   icon: iconPackage         },
  { path: '/pengaturan',      label: 'Pengaturan',      icon: iconSettings        },
];

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <aside className="bg-[#4c0c13] flex flex-col gap-8 items-start p-4 h-screen w-60 shrink-0 sticky top-0">
      {/* Brand */}
      <div className="flex flex-col gap-4 items-start p-2 w-full">
        <img src={logoHakuuBakery} alt="Hakuu Bakery" className="h-[41px] w-[150px] object-contain" />
        <p className="text-[#fcebc8] text-xs">Penjadwalan Produksi Terpusat</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-2 w-full flex-1">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'nav-item-active' : 'nav-item-inactive'}`
            }
          >
            <img src={item.icon} alt="" className="size-4 shrink-0" />
            <span className="text-sm whitespace-nowrap">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User + logout — matches Figma: "Hakuu Bakery / Admin" */}
      <div className="border-t border-white/20 flex flex-col gap-4 items-start pt-4 w-full shrink-0">
        <div className="flex gap-3 items-center">
          <div className="bg-[#daa278] flex items-center justify-center rounded-lg size-8 shrink-0">
            <span className="text-[#4c0c13] text-xs font-semibold">HB</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white text-sm font-medium leading-5">Hakuu Bakery</span>
            <span className="text-[#fcebc8] text-xs leading-4">Admin</span>
          </div>
        </div>
        <button
          onClick={() => navigate('/')}
          className="border border-white/30 flex gap-3 h-10 items-center px-4 rounded-lg w-full text-white text-sm hover:bg-white/10 transition-colors"
        >
          <img src={iconLogOut} alt="" className="size-4 shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
