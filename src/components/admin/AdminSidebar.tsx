'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Calendar, Settings, LogOut, Wrench, ExternalLink, Search, HeartPulse } from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
  { href: '/admin/appointments', label: 'المواعيد', icon: Calendar },
  { href: '/admin/requests', label: 'طلبات المنتجات', icon: Search },
  { href: '/admin/health-cards', label: 'بطاقات السيارات', icon: HeartPulse },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact = false) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  async function handleLogout() {
    await fetch('/api/admin-auth', { method: 'DELETE' });
    window.location.href = '/admin-login';
  }

  return (
    <aside className="w-60 bg-gray-900 text-white flex flex-col min-h-screen">
      <div className="p-5 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 rounded-lg p-1.5">
            <Wrench size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm">AK Admin</p>
            <p className="text-xs text-gray-400">علاء القاضي</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-3">
        <div className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(href, exact)
                  ? 'bg-brand-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
        </div>
      </nav>

      <div className="p-3 border-t border-gray-700 flex flex-col gap-1">
        <a
          href="/ar"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ExternalLink size={18} />
          عرض الموقع
        </a>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors w-full text-start"
        >
          <LogOut size={18} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
