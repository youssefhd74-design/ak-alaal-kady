'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, Package, AlertTriangle, X, Check, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  initialProducts: any[];
  categories: any[];
}

const emptyForm = {
  name_ar: '', name_en: '', description_ar: '', description_en: '',
  price: '', stock_quantity: '', category_id: '', sku: '', image_url: '',
  is_active: true, is_featured: false,
};

export default function AdminProductsClient({ initialProducts, categories }: Props) {
  const [products, setProducts] = useState(initialProducts);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<typeof emptyForm>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const featuredCount = products.filter((p) => p.is_featured && p.is_active).length;

  function openAdd() {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(product: any) {
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
      image_url: product.image_url || '',
      is_active: product.is_active,
      is_featured: product.is_featured || false,
    });
    setModalOpen(true);
  }

  async function handleSave() {
    if (!form.name_ar || !form.price) {
      toast.error('يرجى ملء اسم المنتج والسعر على الأقل');
      return;
    }
    // Check featured limit
    if (form.is_featured && !editing?.is_featured && featuredCount >= 6) {
      toast.error('الحد الأقصى للمنتجات المميزة هو 6 منتجات');
      return;
    }
    setSaving(true);
    try {
      const body = {
        name_ar: form.name_ar,
        name_en: form.name_en || form.name_ar,
        description_ar: form.description_ar || null,
        description_en: form.description_en || null,
        price: parseFloat(form.price),
        stock_quantity: parseInt(form.stock_quantity) || 0,
        category_id: form.category_id || null,
        sku: form.sku || null,
        image_url: form.image_url || null,
        is_active: form.is_active,
        is_featured: form.is_featured,
      };
      const url = editing ? `/api/products/${editing.id}` : '/api/products';
      const method = editing ? 'PATCH' : 'POST';
      const res = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
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

  async function toggleField(product: any, field: 'is_active' | 'is_featured') {
    if (field === 'is_featured' && !product.is_featured && featuredCount >= 6) {
      toast.error('الحد الأقصى للمنتجات المميزة هو 6 منتجات');
      return;
    }
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ [field]: !product[field] }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, ...data } : p));
    } catch {
      toast.error('حدث خطأ');
    }
  }

  async function toggleStock(product: any) {
    const newQty = product.stock_quantity > 0 ? 0 : 1;
    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock_quantity: newQty }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error();
      setProducts((prev) => prev.map((p) => p.id === product.id ? { ...p, ...data } : p));
      toast.success(newQty > 0 ? 'تم تعيين المنتج كمتوفر' : 'تم تعيين المنتج كغير متوفر');
    } catch {
      toast.error('حدث خطأ');
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">المنتجات</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            المميزة: {featuredCount}/6
          </p>
        </div>
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
                <th className="px-4 py-3 text-start">السعر</th>
                <th className="px-4 py-3 text-start">المخزون</th>
                <th className="px-4 py-3 text-start">متوفر</th>
                <th className="px-4 py-3 text-start">ظاهر</th>
                <th className="px-4 py-3 text-start">مميز ⭐</th>
                <th className="px-4 py-3 text-start">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => {
                const inStock = product.stock_quantity > 0;
                return (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img src={product.image_url} alt="" className="w-10 h-10 object-contain rounded-lg border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Package size={16} className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-gray-800">{product.name_ar}</p>
                          <p className="text-xs text-gray-400">{product.sku || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 font-bold text-brand-600">{product.price?.toLocaleString()} ج.م</td>
                    <td className="px-4 py-3">
                      <span className={`font-medium ${!inStock ? 'text-red-600' : product.stock_quantity < 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stock_quantity}
                        {product.stock_quantity < 5 && inStock && <AlertTriangle size={12} className="inline ms-1" />}
                      </span>
                    </td>
                    {/* In-stock toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleStock(product)}
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${inStock ? 'bg-green-100 text-green-700 border-green-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                      >
                        {inStock ? '✓ متوفر' : '✗ نفد'}
                      </button>
                    </td>
                    {/* Visible toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleField(product, 'is_active')}
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${product.is_active ? 'bg-blue-100 text-blue-700 border-blue-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                      >
                        {product.is_active ? '✓ ظاهر' : '✗ مخفي'}
                      </button>
                    </td>
                    {/* Featured toggle */}
                    <td className="px-4 py-3">
                      <button
                        onClick={() => toggleField(product, 'is_featured')}
                        className={`text-xs font-medium px-3 py-1 rounded-full border ${product.is_featured ? 'bg-yellow-100 text-yellow-700 border-yellow-300' : 'bg-gray-100 text-gray-500 border-gray-300'}`}
                      >
                        {product.is_featured ? '⭐ مميز' : '— عادي'}
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
                );
              })}
              {products.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">
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
                { label: 'الاسم (إنجليزي) — اختياري', key: 'name_en' },
                { label: 'الوصف (عربي) — اختياري', key: 'description_ar', textarea: true },
                { label: 'الوصف (إنجليزي) — اختياري', key: 'description_en', textarea: true },
                { label: 'السعر (ج.م) *', key: 'price', type: 'number' },
                { label: 'الكمية المتاحة — اختياري', key: 'stock_quantity', type: 'number' },
                { label: 'رقم القطعة (SKU) — اختياري', key: 'sku' },
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

              {/* Image URL field */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">رابط صورة المنتج</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/image.jpg"
                  value={form.image_url}
                  onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                />
                {form.image_url && (
                  <img src={form.image_url} alt="preview" className="mt-2 h-20 object-contain rounded-lg border border-gray-200" onError={(e) => (e.currentTarget.style.display = 'none')} />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">الفئة</label>
                <select className="input-field" value={form.category_id} onChange={(e) => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">— بدون فئة —</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{cat.name_ar}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked })} className="w-4 h-4 accent-brand-600" />
                  <span className="text-sm font-medium text-gray-700">ظاهر للعملاء</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.is_featured} onChange={(e) => setForm({ ...form, is_featured: e.target.checked })} className="w-4 h-4 accent-yellow-500" />
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" /> منتج مميز (الصفحة الرئيسية)
                    <span className="text-xs text-gray-400">({featuredCount}/6)</span>
                  </span>
                </label>
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
              <button onClick={() => handleDelete(deleteId)} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium px-4 py-2.5 rounded-lg transition-colors">حذف</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
