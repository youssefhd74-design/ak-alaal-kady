'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Package, AlertTriangle, X, Check } from 'lucide-react';
import type { Product, Category } from '@/lib/database.types';
import toast from 'react-hot-toast';

interface Props {
  initialProducts: (Product & { categories?: Category | null })[];
  categories: Category[];
}

const emptyForm = {
  name_ar: '', name_en: '', description_ar: '', description_en: '',
  price: '', stock_quantity: '', category_id: '', sku: '', is_active: true,
};

export default function AdminProductsClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(product: Product) {
    setEditing(product);
    setForm({
      name_ar: product.name_ar,
      name_en: product.name_en,
      description_ar: product.description_ar || '',
      description_en: product.description_en || '',
      price: String(product.price),
      stock_quantity: String(product.stock_quantity),
      category_id: product.category_id || '',
      sku: product.sku || '',
      is_active: product.is_active,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name_ar || !form.name_en || !form.price) {
      toast.error('يرجى ملء الحقول المطلوبة');
      return;
    }
    setSaving(true);
    try {
      const body = {
        name_ar: form.name_ar,
        name_en: form.name_en,
        description_ar: form.description_ar || null,
        description_en: form.description_en || null,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        category_id: form.category_id || null,
        sku: form.sku || null,
        is_active: form.is_active,
      };
      const url = editing ? `/api/products/${editing.id}` : '/api/products';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (editing) {
        setProducts((prev) => prev.map((p) => p.id === editing.id ? { ...p, ...data } : p));
        toast.success('تم تحديث المنتج');
      } else {
        setProducts((prev) => [data, ...prev]);
        toast.success('تمت إضافة المنتج');
      }
      setModalOpen(false);
    } catch {
      toast.error('حدث خطأ');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.filter((p) => p.id !== id));
      setDeleteId(null);
      toast.success('تم حذف المنتج');
    } catch {
      toast.error('حدث خطأ عند الحذف');
    }
  }

  async function toggleActive(product: Product) {
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !product.is_active }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, ...data } : p));
    } catch {
      toast.error('حدث خطأ');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
        <button onClick={openAdd} className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          إضافة منتج
        </button>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs">
                <th className="px-4 py-3 text-start">المنتج</th>
                <th className="px-4 py-3 text-start">رقم القطعة</th>
                <th className="px-4 py-3 text-start">السعر</th>
                <th className="px-4 py-3 text-start">المخزون</th>
                <th className="px-4 py-3 text-start">الحالة</th>
                <th className="px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-gray-800">{product.name_ar}</p>
                    <p className="text-xs text-gray-400">{product.name_en}</p>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{product.sku || '—'}</td>
                  <td className="px-4 py-3 font-bold text-brand-600">{product.price.toLocaleString()} ج.م</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${product.stock_quantity === 0 ? 'text-red-600' : product.stock_quantity < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                      {product.stock_quantity}
                      {product.stock_quantity < 5 && product.stock_quantity > 0 && (
                        <AlertTriangle size={12} className="inline ms-1 text-yellow-500" />
                      )}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(product)} className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                      {product.is_active ? <><Eye size={12} /> ظاهر</> : <><EyeOff size={12} /> مخفي</>}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEdit(product)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                        <Pencil size={15} />
                      </button>
                      <button onClick={() => setDeleteId(product.id)} className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-gray-400">
                  <Package size={32} className="mx-auto mb-2 opacity-30" />
                  لا توجد منتجات
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{editing ? 'تعديل المنتج' : 'إضافة منتج'}</h2>
              <button onClick={() => setModalOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { label: 'الاسم (عربي) *', key: 'name_ar' },
                { label: 'الاسم (إنجليزي) *', key: 'name_en' },
                { label: 'الوصف (عربي)', key: 'description_ar', textarea: true },
                { label: 'الوصف (إنجليزي)', key: 'description_en', textarea: true },
                { label: 'السعر (ج.م) *', key: 'price', type: 'number' },
                { label: 'الكمية المتاحة', key: 'stock_quantity', type: 'number' },
                { label: 'رقم القطعة (SKU)', key: 'sku' },
              ].map(({ label, key, textarea, type }) => (
                <div key={key} className={textarea ? 'sm:col-span-2' : ''}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                  {textarea ? (
                    <textarea className="input-field resize-none" rows={2} value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  ) : (
                    <input type={type || 'text'} className="input-field" value={(form as any)[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
                  )}
                </div>
              ))}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">— بدون فئة —</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name_ar}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-brand-600" />
                <label htmlFor="is_active" className="text-sm font-medium text-gray-700">ظاهر للعملاء</label>
              </div>
            </div>
            <div className="p-5 pt-0 flex gap-3">
              <button onClick={() => setModalOpen(false)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={handleSave} disabled={saving} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-70">
                <Check size={16} /> {saving ? 'جاري الحفظ...' : 'حفظ'}
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
            <h3 className="font-bold text-gray-800 mb-2">هل تريد الحذف؟</h3>
            <p className="text-gray-500 text-sm mb-5">لا يمكن التراجع عن هذا الإجراء</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="btn-secondary flex-1">إلغاء</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors">
                حذف
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
