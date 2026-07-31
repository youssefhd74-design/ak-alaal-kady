'use client';

import { useState } from 'react';
import { ChevronDown, Eye, X, Trash2, Phone } from 'lucide-react';
import toast from 'react-hot-toast';
import { toWhatsAppNumber, toDisplayPhone } from '@/lib/phone';

const STATUSES = [
  { value: 'pending', label: 'معلق', cls: 'badge-pending' },
  { value: 'confirmed', label: 'مؤكد', cls: 'badge-confirmed' },
  { value: 'delivered', label: 'تم التوصيل', cls: 'badge-delivered' },
  { value: 'cancelled', label: 'ملغي', cls: 'badge-cancelled' },
];

export default function AdminOrdersClient({ initialOrders }: { initialOrders: any[] }) {
  const [orders, setOrders] = useState(initialOrders);
  const [filter, setFilter] = useState('');
  const [search, setSearch] = useState('');
  const [viewOrder, setViewOrder] = useState<any>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    if (filter && o.status !== filter) return false;
    if (search) {
      const s = search.trim().toLowerCase();
      const name = (o.customer_name || '').toLowerCase();
      const phone = (o.customer_phone || '').replace(/\D/g, '');
      const sPhone = s.replace(/\D/g, '');
      if (!name.includes(s) && !(sPhone && phone.includes(sPhone))) return false;
    }
    return true;
  });

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.map((o) => o.id === id ? { ...o, status: data.status } : o));
      toast.success('تم تحديث الحالة');
    } catch {
      toast.error('حدث خطأ');
    }
  }

  async function deleteOrder(id: string) {
    try {
      const res = await fetch(`/api/orders/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setOrders((prev) => prev.filter((o) => o.id !== id));
      setDeleteId(null);
      setViewOrder(null);
      toast.success('تم حذف الطلب نهائياً');
    } catch {
      toast.error('حدث خطأ عند الحذف');
    }
  }

  const statusMap = Object.fromEntries(STATUSES.map((s) => [s.value, s]));

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">الطلبات</h1>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالاسم أو الهاتف..."
          className="input-field w-56"
        />
        <select className="input-field w-40" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">جميع الحالات</option>
          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
        </select>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="px-4 py-3 text-start">المرجع</th>
                <th className="px-4 py-3 text-start">العميل</th>
                <th className="px-4 py-3 text-start">الهاتف</th>
                <th className="px-4 py-3 text-start">المنطقة</th>
                <th className="px-4 py-3 text-start">الإجمالي</th>
                <th className="px-4 py-3 text-start">التاريخ</th>
                <th className="px-4 py-3 text-start">الحالة</th>
                <th className="px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{order.id.split('-')[0].toUpperCase()}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{order.customer_name}</td>
                  <td className="px-4 py-3">
                    <a href={`https://wa.me/${toWhatsAppNumber(order.customer_phone)}`} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:underline flex items-center gap-1">
                      <Phone size={12} />{toDisplayPhone(order.customer_phone)}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.customer_area}</td>
                  <td className="px-4 py-3 font-bold text-brand-600">{order.total_price.toLocaleString()} ج.م</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(order.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="px-4 py-3">
                    <span className={statusMap[order.status]?.cls || 'badge-pending'}>
                      {statusMap[order.status]?.label || order.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setViewOrder(order)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={15} />
                      </button>
                      <div className="relative">
                        <select
                          value={order.status}
                          onChange={(e) => updateStatus(order.id, e.target.value)}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-400"
                        >
                          {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                        </select>
                      </div>
                      <button onClick={() => setDeleteId(order.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">لا توجد طلبات</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* any detail modal */}
      {viewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">تفاصيل الطلب</h2>
              <button onClick={() => setViewOrder(null)}><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'رقم الطلب', value: viewOrder.id.split('-')[0].toUpperCase() },
                  { label: 'الحالة', value: statusMap[viewOrder.status]?.label },
                  { label: 'العميل', value: viewOrder.customer_name },
                  { label: 'المنطقة', value: viewOrder.customer_area },
                  { label: 'العنوان', value: viewOrder.customer_address },
                  { label: 'التاريخ', value: new Date(viewOrder.created_at).toLocaleString('ar-EG') },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-400">{label}</p>
                    <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                  </div>
                ))}
              </div>

              <div>
                <h3 className="font-bold text-gray-700 mb-2">الأصناف المطلوبة</h3>
                <div className="border rounded-xl overflow-hidden">
                  {(viewOrder.items as any[]).map((item, i) => (
                    <div key={i} className="flex justify-between p-3 border-b last:border-0 text-sm">
                      <div>
                        <p className="font-medium">{item.name_ar}</p>
                        <p className="text-xs text-gray-400">× {item.quantity}</p>
                      </div>
                      <span className="font-bold text-brand-600">{(item.price * item.quantity).toLocaleString()} ج.م</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold text-base mt-3 pt-3 border-t">
                  <span>الإجمالي</span>
                  <span className="text-brand-600">{viewOrder.total_price.toLocaleString()} ج.م</span>
                </div>
              </div>

              {viewOrder.notes && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                  <p className="text-xs text-yellow-600 mb-1">ملاحظات</p>
                  <p>{viewOrder.notes}</p>
                </div>
              )}

              {/* Clickable WhatsApp phone */}
              <a href={`https://wa.me/${toWhatsAppNumber(viewOrder.customer_phone)}`} target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition-colors text-sm">
                <Phone size={15} /> {toDisplayPhone(viewOrder.customer_phone)}
              </a>

              {/* Delete order */}
              <button onClick={() => setDeleteId(viewOrder.id)}
                className="flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 font-medium py-2.5 rounded-lg transition-colors text-sm">
                <Trash2 size={15} /> حذف الطلب نهائياً
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">حذف الطلب نهائياً؟</h3>
            <p className="text-gray-500 text-sm mb-5">سيُحذف الطلب بالكامل من قاعدة البيانات ولا يمكن استرجاعه.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={() => deleteOrder(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
