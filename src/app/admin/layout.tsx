import '@/app/globals.css';
import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        <div className="min-h-screen flex bg-gray-100">
          <AdminSidebar />
          {/* pt-14 on mobile to clear the fixed top bar, no padding on desktop */}
          <main className="flex-1 overflow-y-auto pt-14 md:pt-0 min-w-0">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
