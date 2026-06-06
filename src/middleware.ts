import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  locales: ['ar', 'en'],
  defaultLocale: 'ar',
  localePrefix: 'always',
});

export const config = {
  matcher: ['/((?!api|admin|admin-login|_next|_vercel|.*\\..*).*)'],
};
