'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Search, ShoppingCart, Plus, Minus, X, Package } from 'lucide-react';
import toast from 'react-hot-toast';

interface Props {
  initialProducts: any[];
  categories: any[];
}

export default function ProductsClient({ initialProducts, categories }: Props) {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [cart, setCart] = useState<Map<string, number>>(new Map());
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', area: '', address: '' });
  const [submitting, setSubmitting] = useState(false);

  const isAr = locale === 'ar';

  const filtered = initialProducts.filter((p) => {
    const name = isAr ? p.name_ar : p.name_en;
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()));
    const matchCat = !selectedCategory || p.category_id === selectedCategory;
    return matchSearch && matchCat;
  });

  function addToCart(productId: string) {
    setCart((prev) => new Map(prev).set(productId, (prev.get(productId) || 0) + 1));
    toast.success(isAr ? 'تمت الإضافة للسلة' : 'Added to cart');
  }

  function updateQty(productId: string, delta: number) {
    setCart((prev) => {
      const next = new Map(prev);
      const current = next.get(productId) || 0;
      const newQty = current + delta;
      if (newQty <= 0) next.delete(productId);
      else next.set(productId, newQty);
      return next;
    });
  }

  const cartItems: (any & { product: any })[] = Array.from(cart.entries())
    .map(([id, qty]) => {
      const product = initialProducts.find((p) => p.id === id)!;
      if (!product) return null;
      return { product_id: id, name_ar: product.name_ar, name_en: product.name_en, price: product.price, quantity: qty, product };
    })
    .filter(Boolean) as any;

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = Array.from(cart.values()).reduce((a, b) => a + b, 0);

  async function handleOrder() {
    if (!form.name || !form.phone || !form.area || !form.address) {
      toast.error(isAr ? 'يرجى ملء جميع الحقول' : 'Please fill all fields');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: form.name,
          customer_phone: form.phone,
          customer_area: form.area,
          customer_address: form.address,
          items: cartItems.map(({ product_id, name_ar, name_en, price, quantity }) => ({
            product_id, name_ar, name_en, price, quantity,
          })),
          total_price: totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      // Get WhatsApp number from settings
      const settingsRes = await fetch('/api/settings?key=whatsapp_number');
      const settings = await settingsRes.json();
      const waNumber = settings.value || '';

      router.push(`/${locale}/booking/confirmation?ref=${data.id}&type=order&wa=${waNumber}`);
    } catch {
      toast.error(isAr ? 'حدث خطأ، حاول مجدداً' : 'Something went wrong, please try again');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{t('products.title')}</h1>
          <p className="text-gray-500 text-sm mt-1">{t('products.subtitle')}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search size={16} className="absolute top-3 start-3 text-gray-400" />
          <input
            type="text"
            placeholder={t('products.searchPlaceholder')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input-field ps-9"
          />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="input-field sm:w-52"
        >
          <option value="">{t('products.allCategories')}</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {isAr ? cat.name_ar : cat.name_en}
            </option>
          ))}
        </select>
      </div>

      {/* any grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Package size={48} className="mx-auto mb-3 opacity-40" />
          <p>{t('products.noProducts')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const qty = cart.get(product.id) || 0;
            const inStock = product.stock_quantity > 0;
            return (
              <div key={product.id} className="card overflow-hidden hover:shadow-md transition-shadow">
                {/* Image */}
                <div className="h-44 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                  {product.image_url ? (
                    <Image src={product.image_url} alt={isAr ? product.name_ar : product.name_en} width={160} height={160} className="object-contain h-36" />
                  ) : (
                    <Package size={48} className="text-gray-300" />
                  )}
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-gray-800 text-sm leading-tight">
                      {isAr ? product.name_ar : product.name_en}
                    </h3>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
                      {inStock ? t('common.inStock') : t('common.outOfStock')}
                    </span>
                  </div>

                  {product.sku && (
                    <p className="text-xs text-gray-400 mb-2">{t('products.sku')}: {product.sku}</p>
                  )}

                  <p className="text-brand-600 font-bold text-lg mb-3">
                    {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </p>

                  {qty === 0 ? (
                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={!inStock}
                      className="w-full btn-primary text-sm py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {t('products.addToOrder')}
                    </button>
                  ) : (
                    <div className="flex items-center justify-between border border-brand-200 rounded-lg p-1">
                      <button onClick={() => updateQty(product.id, -1)} className="p-1.5 hover:bg-brand-50 rounded text-brand-600">
                        <Minus size={14} />
                      </button>
                      <span className="font-bold text-brand-700 w-6 text-center">{qty}</span>
                      <button onClick={() => updateQty(product.id, 1)} disabled={qty >= product.stock_quantity} className="p-1.5 hover:bg-brand-50 rounded text-brand-600 disabled:opacity-40">
                        <Plus size={14} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Cart Button */}
      {cartCount > 0 && (
        <button
          onClick={() => setCartOpen(true)}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-bold px-6 py-3.5 rounded-full shadow-2xl transition-all"
          style={{ boxShadow: '0 8px 32px rgba(234,88,12,0.45)' }}
        >
          <ShoppingCart size={20} />
          <span>{isAr ? 'السلة' : 'Cart'}</span>
          <span className="bg-white text-brand-700 text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center">
            {cartCount}
          </span>
        </button>
      )}

      {/* Cart Sidebar */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={() => setCartOpen(false)} />
          <div className="w-full max-w-sm bg-white shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="font-bold text-lg">{isAr ? 'سلة الطلبات' : 'Your Cart'}</h2>
              <button onClick={() => setCartOpen(false)}><X size={20} /></button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-center text-gray-400 mt-10">{isAr ? 'السلة فارغة' : 'Cart is empty'}</p>
              ) : (
                <div className="flex flex-col gap-3">
                  {cartItems.map((item) => (
                    <div key={item.product_id} className="flex items-center gap-3 border-b pb-3">
                      <div className="flex-1">
                        <p className="text-sm font-medium">{isAr ? item.name_ar : item.name_en}</p>
                        <p className="text-xs text-gray-400">{item.price.toLocaleString()} × {item.quantity}</p>
                      </div>
                      <span className="font-bold text-brand-600 text-sm">
                        {(item.price * item.quantity).toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                      </span>
                      <button onClick={() => updateQty(item.product_id, -item.quantity)} className="text-red-400 hover:text-red-600">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cartItems.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between font-bold text-lg mb-4">
                  <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                  <span className="text-brand-600">{totalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
                </div>
                <button
                  onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  className="w-full btn-primary text-base py-3"
                >
                  {isAr ? 'إتمام الطلب' : 'Proceed to any'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="font-bold text-lg">{isAr ? 'بيانات التوصيل' : 'Delivery Details'}</h2>
              <button onClick={() => setCheckoutOpen(false)}><X size={20} /></button>
            </div>
            <div className="p-5 flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.name')}</label>
                <input type="text" className="input-field" placeholder={t('booking.namePlaceholder')} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.phone')}</label>
                <input type="tel" className="input-field" placeholder={t('booking.phonePlaceholder')} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.area')}</label>
                <input type="text" className="input-field" placeholder={t('booking.areaPlaceholder')} value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{t('booking.address')}</label>
                <textarea className="input-field resize-none" rows={2} placeholder={t('booking.addressPlaceholder')} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 text-sm text-brand-700">
                <strong>{t('orderConfirm.important')}:</strong> {t('orderConfirm.importantNote')}
              </div>

              <div className="flex justify-between font-bold text-base pt-2 border-t">
                <span>{isAr ? 'الإجمالي' : 'Total'}</span>
                <span className="text-brand-600">{totalPrice.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}</span>
              </div>

              <button onClick={handleOrder} disabled={submitting} className="w-full btn-primary py-3 text-base disabled:opacity-70">
                {submitting ? t('common.loading') : isAr ? 'تأكيد وإرسال الطلب' : 'Confirm & Submit any'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
