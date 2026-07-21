import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    // Kalau user sudah login, lanjutkan
    if (req.nextauth.token) {
      return NextResponse.next();
    }

    // Kalau belum login, redirect ke login
    return NextResponse.redirect(new URL('/login', req.url));
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token, // true kalau ada token (sudah login)
    },
  }
);

// Route yang dilindungi (hanya bisa diakses kalau login)
export const config = {
  matcher: [
    '/dashboard/:path*',  // Semua halaman di bawah /dashboard
    '/bots/:path*',       // Semua halaman di bawah /bots
    '/api/bots/:path*',   // API bot (biar nggak bisa diakses sembarangan)
  ],
};
