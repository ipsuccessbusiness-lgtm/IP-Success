import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Protect /admin routes (except /admin/login)
  if (request.nextUrl.pathname.startsWith('/admin') && 
      !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', request.nextUrl.pathname);
      const redirectResponse = NextResponse.redirect(loginUrl);
      // Copy cookies from supabaseResponse to the redirect response
      supabaseResponse.cookies.getAll().forEach(cookie => {
        redirectResponse.cookies.set(cookie.name, cookie.value);
      });
      return redirectResponse;
    }
  }

  // Redirect logged-in users away from login page
  if (request.nextUrl.pathname === '/admin/login' && user) {
    const redirectResponse = NextResponse.redirect(new URL('/admin', request.url));
    supabaseResponse.cookies.getAll().forEach(cookie => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/admin/:path*'],
};
