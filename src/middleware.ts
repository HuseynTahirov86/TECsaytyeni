
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Bu funksiya hər sorğuda işə düşəcək
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Admin səhifələrini qorumaq
  const isAdminProtected = path.startsWith('/ndutecnaxcivan19692025tec');
  if (isAdminProtected) {
    const adminSessionCookie = request.cookies.get('__admin_session');
    
    if (!adminSessionCookie?.value) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(loginUrl);
    }
    
    try {
        const sessionData = JSON.parse(adminSessionCookie.value);
        if (sessionData?.role !== 'admin') {
             const loginUrl = new URL('/admin/login', request.url);
             return NextResponse.redirect(loginUrl);
        }
    } catch {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
    }
  }

  // Təlim və hesab səhifələrini qorumaq
  const isTrainingProtected = path.startsWith('/account') || path.startsWith('/trainings');
  if (isTrainingProtected) {
    const sessionCookie = request.cookies.get('__session');
    if (!sessionCookie?.value) {
      const loginUrl = new URL('/training-login', request.url);
      loginUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(loginUrl);
    }
    // Burada dərhal yoxlamaq olar, amma səhifənin özündəki yoxlama daha dəqiqdir.
  }
  
  // TETİ hesab səhifəsini qorumaq
  const isTetiProtected = path.startsWith('/teti-account');
  if (isTetiProtected) {
    const sessionCookie = request.cookies.get('__session');
     if (!sessionCookie?.value) {
      const loginUrl = new URL('/teti-login', request.url);
      loginUrl.searchParams.set('redirectTo', path);
      return NextResponse.redirect(loginUrl);
    }
  }


  return NextResponse.next()
}

// Middleware-in hansı path-lərdə işləyəcəyini təyin edirik
export const config = {
  matcher: ['/ndutecnaxcivan19692025tec/:path*', '/account/:path*', '/trainings/:path*', '/teti-account/:path*'],
}

    