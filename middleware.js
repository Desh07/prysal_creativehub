import { NextResponse } from 'next/server';

export function middleware(request) {
  // We only want to protect /admin (excluding /admin/login) and mutating /api routes
  const path = request.nextUrl.pathname;
  
  const isProtectedApi = (path === '/api/content' || path === '/api/upload') && request.method === 'POST';
  const isProtectedAdmin = path.startsWith('/admin') && path !== '/admin/login';

  if (isProtectedAdmin || isProtectedApi) {
    const token = request.cookies.get('auth_token')?.value;
    
    // In production/edge, we must verify the token matches the env variable
    // If running in development without env, we might want to fallback, but let's be strict
    if (!token || token !== process.env.ADMIN_TOKEN) {
      if (isProtectedApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      } else {
        // Redirect to login page for browser requests
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin',
    '/admin/:path*',
    '/api/:path*'
  ],
};
