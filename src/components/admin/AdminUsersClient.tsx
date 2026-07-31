'use client';

import { useState } from 'react';
import { Plus, X, Check, Shield, UserX, UserCheck, KeyRound, Trash2, Crown } from 'lucide-react';
import toast from 'react-hot-toast';

const TABS: { key: string; label: string }[] = [
  { key: 'products', label: 'المنتجات' },
  { key: 'orders', label: 'الطلبات' },
  { key: 'appointments', label: 'المواعيد' },
  { key: 'requests', label: 'طلبات المنتجات' },
  { key: 'health_cards', label: 'بطاقات السيارات' },
  { key: 'settings', label: 'الإعدادات' },
];

const emptyUser = {
  email: '', password: '', display_name: '',
  permissions: { products: true, orders: true, appointments: true, requests: true, health_cards: true, settings: false, can_delete: false } as Record<string, boolean>,
};

interface Viewer { id: string; role: 'owner' | 'staff'; superadmin: boolean }

export default function AdminUsersClient({ initialUsers, viewer }: { initialUsers: any[]; viewer: Viewer }) {
  const [users, setUsers] = useState(initialUsers);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState(emptyUser);
  const [saving, setSaving] = useState(false);
  const [resetFor, setResetFor] = useState<any>(null);
  const [newPass, setNewPass] = useState('');
  const [deleteFor, setDeleteFor] = useState<any>(null);

  async function createUser() {
    if (!form.email || !form.password || !form.display_name) {
      toast.error('البريد وكلمة المرور والاسم مطلوبة');
      return;
    }
    setSaving(true);
    try {
      const res = await fetch('/api/admin-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { toast.error(data.error || 'حدث خطأ'); return; }
      setUsers(prev => [...prev, data]);
      setModal(false);
      setForm(emptyUser);
      toast.success('تم إنشاء الحساب');
    } finally {
      setSaving(false);
    }
  }

  async function patchUser(id: string, patch: any, successMsg?: string) {
    const res = await fetch(`/api/admin-users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(patch),
    });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || 'حدث خطأ'); return null; }
    setUsers(prev => prev.map(u => u.id === id ? data : u));
    if (successMsg) toast.success(successMsg);
    return data;
  }

  function togglePerm(user: any, key: string) {
    const perms = { ...(user.permissions || {}), [key]: !user.permissions?.[key] };
    patchUser(user.id, { permissions: perms });
  }

  async function deleteUser(id: string) {
    const res = await fetch(`/api/admin-users/${id}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { toast.error(data.error || 'حدث خطأ'); return; }
    setUsers(prev => prev.filter(u => u.id !== id));
    setDeleteFor(null);
    toast.success('تم حذف الحساب');
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Shield size={22} className="text-brand-600" />
            صلاحيات المستخدمين
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">{users.length} حساب · حدد لكل مستخدم الأقسام المسموح بها{viewer.role !== 'owner' ? ' · (مشرف عام)' : ''}</p>
        </div>
        <button onClick={() => { setForm(emptyUser); setModal(true); }} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> حساب جديد
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {users.map(user => {
          const isOwner = user.role === 'owner';
          const isSuper = !!user.permissions?.superadmin;
          // Superadmins can manage plain staff only; owner manages everyone (except own destructive ops)
          const canManage = viewer.role === 'owner' ? !isOwner : (!isOwner && !isSuper);
          return (
            <div key={user.id} className={`card p-5 ${!user.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${isOwner ? 'bg-brand-600' : isSuper ? 'bg-purple-600' : 'bg-gray-900'}`}>
                    {isOwner ? <Crown size={20} className="text-white" /> : <Shield size={18} className={isSuper ? 'text-white' : 'text-gray-300'} />}
                  </div>
                  <div>
                    <p className="font-bold text-gray-800 flex items-center gap-2">
                      {user.display_name}
                      {isOwner && <span className="text-xs bg-brand-100 text-brand-700 px-2 py-0.5 rounded-full font-medium">المالك</span>}
                      {!isOwner && isSuper && <span className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full font-medium">مشرف عام</span>}
                      {!user.is_active && <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full font-medium">موقوف</span>}
                    </p>
                    <p className="text-sm text-gray-400" dir="ltr">{user.email}</p>
                  </div>
                </div>

                {canManage && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setResetFor(user); setNewPass(''); }}
                      className="text-xs py-1.5 px-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 flex items-center gap-1">
                      <KeyRound size={12} /> كلمة مرور جديدة
                    </button>
                    <button onClick={() => patchUser(user.id, { is_active: !user.is_active }, user.is_active ? 'تم إيقاف الحساب' : 'تم تفعيل الحساب')}
                      className={`text-xs py-1.5 px-3 rounded-lg border flex items-center gap-1 ${user.is_active ? 'border-yellow-300 text-yellow-700 hover:bg-yellow-50' : 'border-green-300 text-green-700 hover:bg-green-50'}`}>
                      {user.is_active ? <><UserX size={12} /> إيقاف</> : <><UserCheck size={12} /> تفعيل</>}
                    </button>
                    <button onClick={() => setDeleteFor(user)}
                      className="text-xs py-1.5 px-2 rounded-lg text-red-500 hover:bg-red-50">
                      <Trash2 size={13} />
                    </button>
                  </div>
                )}
              </div>

              {/* Permission checkboxes */}
              {isOwner ? (
                <p className="text-sm text-gray-400">صلاحية كاملة على كل الأقسام</p>
              ) : isSuper && viewer.role !== 'owner' ? (
                <p className="text-sm text-purple-500">مشرف عام — يديره المالك فقط</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {isSuper ? (
                    <span className="text-xs text-purple-500 py-1.5">صلاحية كاملة على كل الأقسام (مشرف عام)</span>
                  ) : (
                    <>
                      {TABS.map(tab => {
                        const on = !!user.permissions?.[tab.key];
                        return (
                          <button key={tab.key} onClick={() => canManage && togglePerm(user, tab.key)}
                            disabled={!canManage}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${on ? 'bg-brand-50 text-brand-700 border-brand-300' : 'bg-gray-50 text-gray-400 border-gray-200'} ${!canManage ? 'cursor-not-allowed' : ''}`}>
                            {on ? '✓ ' : ''}{tab.label}
                          </button>
                        );
                      })}
                      {/* Delete right — distinct color */}
                      <button onClick={() => canManage && togglePerm(user, 'can_delete')}
                        disabled={!canManage}
                        className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${user.permissions?.can_delete ? 'bg-red-50 text-red-600 border-red-300' : 'bg-gray-50 text-gray-400 border-gray-200'} ${!canManage ? 'cursor-not-allowed' : ''}`}>
                        {user.permissions?.can_delete ? '✓ ' : ''}صلاحية الحذف
                      </button>
                    </>
                  )}
                  {/* Superadmin tick — ONLY the owner sees and controls this */}
                  {viewer.role === 'owner' && (
                    <button onClick={() => togglePerm(user, 'superadmin')}
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${isSuper ? 'bg-purple-50 text-purple-700 border-purple-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                      {isSuper ? '✓ ' : ''}مشرف عام (إدارة المستخدمين)
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New user modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">حساب جديد</h2>
              <button onClick={() => setModal(false)}><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الاسم *</label>
                <input type="text" className="input-field" value={form.display_name}
                  onChange={e => setForm({ ...form, display_name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">البريد الإلكتروني *</label>
                <input type="email" dir="ltr" className="input-field text-left" value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">كلمة المرور *</label>
                <input type="text" dir="ltr" className="input-field text-left" value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })} />
                <p className="text-xs text-gray-400 mt-1">أنشئها هنا وسلّمها له — يمكنه استخدامها فوراً</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">الصلاحيات</label>
                <div className="flex flex-wrap gap-2">
                  {TABS.map(tab => {
                    const on = !!form.permissions[tab.key];
                    return (
                      <button key={tab.key}
                        onClick={() => setForm({ ...form, permissions: { ...form.permissions, [tab.key]: !on } })}
                        className={`text-xs font-medium px-3 py-1.5 rounded-full border ${on ? 'bg-brand-50 text-brand-700 border-brand-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                        {on ? '✓ ' : ''}{tab.label}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setForm({ ...form, permissions: { ...form.permissions, can_delete: !form.permissions.can_delete } })}
                    className={`text-xs font-bold px-3 py-1.5 rounded-full border ${form.permissions.can_delete ? 'bg-red-50 text-red-600 border-red-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>
                    {form.permissions.can_delete ? '✓ ' : ''}صلاحية الحذف
                  </button>
                </div>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setModal(false)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={createUser} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2">
                <Check size={16} /> {saving ? 'جاري الإنشاء...' : 'إنشاء'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset password modal */}
      {resetFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <h3 className="font-bold text-gray-800 mb-1">كلمة مرور جديدة</h3>
            <p className="text-gray-400 text-sm mb-4">{resetFor.display_name} · <span dir="ltr">{resetFor.email}</span></p>
            <input type="text" dir="ltr" className="input-field text-left mb-4" placeholder="اكتب كلمة المرور الجديدة"
              value={newPass} onChange={e => setNewPass(e.target.value)} />
            <div className="flex gap-3">
              <button onClick={() => setResetFor(null)} className="btn-secondary flex-1">إلغاء</button>
              <button
                onClick={async () => {
                  if (!newPass) { toast.error('اكتب كلمة المرور'); return; }
                  const ok = await patchUser(resetFor.id, { new_password: newPass }, 'تم تغيير كلمة المرور');
                  if (ok) setResetFor(null);
                }}
                className="btn-primary flex-1">حفظ</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete user confirm */}
      {deleteFor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <Trash2 size={40} className="text-red-500 mx-auto mb-3" />
            <h3 className="font-bold text-gray-800 mb-2">حذف حساب {deleteFor.display_name}؟</h3>
            <p className="text-gray-500 text-sm mb-5">سيفقد الوصول فوراً. لا يمكن التراجع.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteFor(null)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={() => deleteUser(deleteFor.id)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
