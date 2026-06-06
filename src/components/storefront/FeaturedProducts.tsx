'use client';

import { useLocale } from 'next-intl';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Star } from 'lucide-react';

export default function FeaturedProducts({ products }: { products: any[] }) {
  const locale = useLocale();
  const isAr = locale === 'ar';

  return (
    <section className="py-14 px-4 bg-gray-50 border-b border-gray-100">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Star size={18} className="text-brand-500 fill-brand-500" />
              <h2 className="text-2xl font-bold text-gray-800">
                {isAr ? 'منتجات مميزة' : 'Featured Products'}
              </h2>
            </div>
            <p className="text-gray-500 text-sm">
              {isAr ? 'أكثر قطع الغيار طلباً لسيارات رينو' : 'Most requested Renault spare parts'}
            </p>
          </div>
          <Link
            href={`/${locale}/products`}
            className="text-brand-600 text-sm font-medium hover:underline"
          >
            {isAr ? 'عرض الكل' : 'View all'}
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {products.map((product) => {
            const inStock = product.stock_quantity > 0;
            return (
              <Link
                key={product.id}
                href={`/${locale}/products`}
                className="card hover:shadow-md transition-shadow overflow-hidden group"
              >
                {/* Image */}
                <div className="h-32 bg-gray-50 flex items-center justify-center border-b border-gray-100">
                  {product.image_url ? (
                    <Image
                      src={product.image_url}
                      alt={isAr ? product.name_ar : product.name_en}
                      width={100}
                      height={100}
                      className="object-contain h-24"
                    />
                  ) : (
                    <Package size={36} className="text-gray-300" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-800 leading-tight mb-1 line-clamp-2">
                    {isAr ? product.name_ar : product.name_en}
                  </p>
                  <p className="text-brand-600 font-bold text-sm">
                    {product.price.toLocaleString()} {isAr ? 'ج.م' : 'EGP'}
                  </p>
                  <span className={`inline-block mt-1.5 text-xs px-1.5 py-0.5 rounded-full font-medium ${
                    inStock ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                  }`}>
                    {inStock ? (isAr ? 'متوفر' : 'In Stock') : (isAr ? 'غير متوفر' : 'Out of Stock')}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
