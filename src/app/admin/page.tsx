import { requireAdmin } from '@/lib/require-admin';
import { createAdminClient } from '@/lib/supabase';
import { Package, ShoppingBag, Calendar, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
  requireAdmin();
  const supabase = createAdminClient();
  const today = new Date().toISOString().split('T')[0];

  const [
    { count: totalProducts },
    { count: totalOrders },
    { count: pendingOrders },
    { count: todayAppointments },
    { data: recentOrders },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('preferred_date', today),
    supabase.from('orders').select('*').order('created_at', { ascending: false }).limit(5),
  ]);

  const statusColor: Record<string, string> = {
    pending: 'badge-pending',
    confirmed: 'badge-confirmed',
    delivered: 'badge-delivered',
    cancelled: 'badge-cancelled',
  };
  const statusLabel: Record<string, string> = {
    pending: 'معلق', confirmed: 'مؤكد', delivered: 'تم التوصيل', cancelled: 'ملغي',
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">لوحة التحكم</h1>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'إجمالي المنتجات', value: totalProducts || 0, icon: Package, color: 'bg-blue-50 text-blue-600', href: '/admin/products' },
          { label: 'إجمالي الطلبات', value: totalOrders || 0, icon: ShoppingBag, color: 'bg-brand-50 text-brand-600', href: '/admin/orders' },
          { label: 'طلبات معلقة', value: pendingOrders || 0, icon: AlertCircle, color: 'bg-yellow-50 text-yellow-600', href: '/admin/orders?status=pending' },
          { label: 'مواعيد اليوم', value: todayAppointments || 0, icon: Calendar, color: 'bg-green-50 text-green-600', href: '/admin/appointments' },
        ].map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="card p-5 hover:shadow-md transition-shadow">
            <div className={`inline-flex p-2.5 rounded-lg mb-3 ${color}`}>
              <Icon size={22} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      {/* Recent orders */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="font-bold text-gray-800">آخر الطلبات</h2>
          <Link href="/admin/orders" className="text-brand-600 text-sm hover:underline">عرض الكل</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="px-5 py-3 text-start font-medium">المرجع</th>
                <th className="px-5 py-3 text-start font-medium">العميل</th>
                <th className="px-5 py-3 text-start font-medium">المنطقة</th>
                <th className="px-5 py-3 text-start font-medium">الإجمالي</th>
                <th className="px-5 py-3 text-start font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {(recentOrders || []).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-5 py-3 font-mono text-xs text-gray-500">{order.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-5 py-3 font-medium text-gray-800">{order.customer_name}</td>
                  <td className="px-5 py-3 text-gray-500">{order.customer_area}</td>
                  <td className="px-5 py-3 font-bold text-brand-600">{order.total_price.toLocaleString()} ج.م</td>
                  <td className="px-5 py-3">
                    <span className={statusColor[order.status] || 'badge-pending'}>
                      {statusLabel[order.status] || order.status}
                    </span>
                  </td>
                </tr>
              ))}
              {(!recentOrders || recentOrders.length === 0) && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-gray-400">لا توجد طلبات بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
