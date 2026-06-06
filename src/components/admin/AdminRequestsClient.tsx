'use client';

import { useState } from 'react';
import { Search, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'new', label: 'جديد', cls: 'badge-pending' },
  { value: 'seen', label: 'تمت المراجعة', cls: 'badge-confirmed' },
  { value: 'fulfilled', label: 'تم التوفير', cls: 'badge-delivered' },
];

export default function AdminRequestsClient({ initialRequests }: { initialRequests: any[] }) {
  const [requests, setRequests] = useState(initialRequests);
  const [view, setView] = useState<any>(null);
  const statusMap = Object.fromEntries(STATUSES.map((s) => [s.value, s]));
  const newCount = requests.filter((r) => r.status === 'new').length;

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/product-requests/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setRequests((prev) => prev.map((r) => r.id === id ? { ...r, status: data.status } : r));
      toast.success('تم تحديث الحالة');
    } catch {
      toast.error('حدث خطأ');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Search size={22} className="text-brand-600" />
        <div>
          <h1 className="text-2xl font-bold text-gray-800">طلبات المنتجات</h1>
          {newCount > 0 && (
            <p className="text-sm text-brand-600 font-medium">{newCount} طلب جديد بانتظار المراجعة</p>
          )}
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="px-4 py-3 text-start">القطعة المطلوبة</th>
                <th className="px-4 py-3 text-start">العميل</th>
                <th className="px-4 py-3 text-start">الهاتف</th>
                <th className="px-4 py-3 text-start">التاريخ</th>
                <th className="px-4 py-3 text-start">الحالة</th>
                <th className="px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {requests.map((req) => (
                <tr key={req.id} className={`hover:bg-gray-50 ${req.status === 'new' ? 'bg-orange-50/40' : ''}`}>
                  <td className="px-4 py-3 font-medium text-gray-800">{req.product_name}</td>
                  <td className="px-4 py-3 text-gray-600">{req.customer_name}</td>
                  <td className="px-4 py-3 text-gray-500">{req.customer_phone}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{new Date(req.created_at).toLocaleDateString('ar-EG')}</td>
                  <td className="px-4 py-3">
                    <span className={statusMap[req.status]?.cls || 'badge-pending'}>
                      {statusMap[req.status]?.label || req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setView(req)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={15} />
                      </button>
                      <select
                        value={req.status}
                        onChange={(e) => updateStatus(req.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-400"
                      >
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {requests.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <Search size={32} className="mx-auto mb-2 opacity-30" />
                  لا توجد طلبات بعد
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">تفاصيل الطلب</h2>
              <button onClick={() => setView(null)}><X size={20} /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'القطعة المطلوبة', value: view.product_name },
                { label: 'الحالة', value: statusMap[view.status]?.label },
                { label: 'العميل', value: view.customer_name },
                { label: 'الهاتف', value: view.customer_phone },
                { label: 'التاريخ', value: new Date(view.created_at).toLocaleString('ar-EG') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
              {view.notes && (
                <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 mb-1">ملاحظات</p>
                  <p>{view.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
