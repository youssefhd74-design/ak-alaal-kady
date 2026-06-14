'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingBag, Calendar,
  Settings, LogOut, Wrench, ExternalLink, Search,
  HeartPulse, Menu, X
} from 'lucide-react';

const navItems = [
  { href: '/admin', label: 'الرئيسية', icon: LayoutDashboard, exact: true },
  { href: '/admin/products', label: 'المنتجات', icon: Package },
  { href: '/admin/orders', label: 'الطلبات', icon: ShoppingBag },
  { href: '/admin/appointments', label: 'المواعيد', icon: Calendar },
  { href: '/admin/requests', label: 'طلبات المنتجات', icon: Search },
  { href: '/admin/health-cards', label: 'بطاقات السيارات', icon: HeartPulse },
  { href: '/admin/settings', label: 'الإعدادات', icon: Settings },
];

function SidebarContent({ onClose }: { onClose?: () => void }) {
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
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-5 border-b border-gray-700 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 rounded-lg p-1.5">
            <Wrench size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-sm text-white">AK Admin</p>
            <p className="text-xs text-gray-400">علاء القاضي</p>
          </div>
        </div>
        {/* Close button — mobile only */}
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-white md:hidden">
            <X size={20} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon, exact }) => (
            <Link
              key={href}
              href={href}
              onClick={onClose}
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

      {/* Bottom */}
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
    </div>
  );
}

export default function AdminSidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── MOBILE TOP BAR ── */}
      <div className="md:hidden fixed top-0 inset-x-0 z-40 bg-gray-900 border-b border-gray-700 flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-2">
          <div className="bg-brand-600 rounded-lg p-1.5">
            <Wrench size={16} className="text-white" />
          </div>
          <span className="font-bold text-sm text-white">AK Admin</span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="text-gray-300 hover:text-white p-1"
        >
          <Menu size={22} />
        </button>
      </div>

      {/* ── MOBILE DRAWER OVERLAY ── */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          {/* Drawer — slides in from right (RTL) */}
          <div className="relative ms-auto w-72 bg-gray-900 h-full shadow-2xl flex flex-col">
            <SidebarContent onClose={() => setMobileOpen(false)} />
          </div>
        </div>
      )}

      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden md:flex w-60 bg-gray-900 text-white flex-col min-h-screen shrink-0">
        <SidebarContent />
      </aside>
    </>
  );
}
