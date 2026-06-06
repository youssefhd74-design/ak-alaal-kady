'use client';

import { useState } from 'react';
import { Eye, X, Wrench, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const STATUSES = [
  { value: 'pending', label: 'معلق', cls: 'badge-pending' },
  { value: 'confirmed', label: 'مؤكد', cls: 'badge-confirmed' },
  { value: 'completed', label: 'مكتمل', cls: 'badge-completed' },
  { value: 'cancelled', label: 'ملغي', cls: 'badge-cancelled' },
];

export default function AdminAppointmentsClient({ initialAppointments }: { initialAppointments: any[] }) {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [filter, setFilter] = useState('');
  const [view, setView] = useState<any>(null);

  const filtered = filter ? appointments.filter((a) => a.status === filter) : appointments;
  const statusMap = Object.fromEntries(STATUSES.map((s) => [s.value, s]));

  async function updateStatus(id: string, status: string) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status: data.status } : a));
      toast.success('تم تحديث الحالة');
    } catch {
      toast.error('حدث خطأ');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المواعيد</h1>
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
                <th className="px-4 py-3 text-start">العميل</th>
                <th className="px-4 py-3 text-start">الهاتف</th>
                <th className="px-4 py-3 text-start">نوع الخدمة</th>
                <th className="px-4 py-3 text-start">السيارة</th>
                <th className="px-4 py-3 text-start">الموعد</th>
                <th className="px-4 py-3 text-start">الحالة</th>
                <th className="px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((appt) => (
                <tr key={appt.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-800">{appt.customer_name}</td>
                  <td className="px-4 py-3 text-gray-500">{appt.customer_phone}</td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1">
                      {appt.service_type === 'maintenance'
                        ? <><Wrench size={13} className="text-brand-500" /> صيانة دورية</>
                        : <><AlertTriangle size={13} className="text-yellow-500" /> عطل</>}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{appt.car_model} {appt.car_year}</td>
                  <td className="px-4 py-3">
                    <p className="text-gray-700">{new Date(appt.preferred_date).toLocaleDateString('ar-EG')}</p>
                    {appt.preferred_time && <p className="text-xs text-gray-400">{appt.preferred_time}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={statusMap[appt.status]?.cls || 'badge-pending'}>
                      {statusMap[appt.status]?.label || appt.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setView(appt)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Eye size={15} />
                      </button>
                      <select
                        value={appt.status}
                        onChange={(e) => updateStatus(appt.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white cursor-pointer focus:outline-none focus:ring-1 focus:ring-brand-400"
                      >
                        {STATUSES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">لا توجد مواعيد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail modal */}
      {view && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">تفاصيل الموعد</h2>
              <button onClick={() => setView(null)}><X size={20} /></button>
            </div>
            <div className="p-5 grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'العميل', value: view.customer_name },
                { label: 'الهاتف', value: view.customer_phone },
                { label: 'المنطقة', value: view.customer_area },
                { label: 'العنوان', value: view.customer_address },
                { label: 'السيارة', value: `${view.car_model} ${view.car_year || ''}` },
                { label: 'نوع الخدمة', value: view.service_type === 'maintenance' ? 'صيانة دورية' : 'عطل / مشكلة' },
                { label: 'التاريخ المفضل', value: new Date(view.preferred_date).toLocaleDateString('ar-EG') },
                { label: 'الوقت', value: view.preferred_time || 'أي وقت' },
                { label: 'الحالة', value: statusMap[view.status]?.label },
                { label: 'تاريخ الحجز', value: new Date(view.created_at).toLocaleString('ar-EG') },
              ].map(({ label, value }) => (
                <div key={label} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-xs text-gray-400">{label}</p>
                  <p className="font-medium text-gray-800 mt-0.5">{value}</p>
                </div>
              ))}
              {view.notes && (
                <div className="col-span-2 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                  <p className="text-xs text-yellow-600 mb-1">ملاحظات العميل</p>
                  <p className="text-sm">{view.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
