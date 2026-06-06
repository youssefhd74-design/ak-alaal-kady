import { useTranslations, useLocale } from 'next-intl';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer';
import ProductsClient from '@/components/storefront/ProductsClient';

export default async function ProductsPage() {
  // Fetch products and categories server-side
  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from('products').select('*, categories(*)').eq('is_active', true).order('created_at', { ascending: false }),
    supabase.from('categories').select('*').order('name_ar'),
  ]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <ProductsClient
            initialProducts={products || []}
            categories={categories || []}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
