import LoginForm from '@/components/admin/LoginForm';
import '@/app/globals.css';

export default function LoginPage() {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <LoginForm />
      </body>
    </html>
  );
}
