import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const user = req.auth?.user;

  const isOnAuth = nextUrl.pathname.startsWith('/login') || nextUrl.pathname.startsWith('/register');
  const isOnDashboard = nextUrl.pathname.startsWith('/dashboard');
  const isOnOnboarding = nextUrl.pathname.startsWith('/onboarding');
  const isOnSettings = nextUrl.pathname.startsWith('/settings');
  const isOnBooking = nextUrl.pathname.startsWith('/booking');
  const isOnServices = nextUrl.pathname.startsWith('/services');

  const protectedRoutes = isOnDashboard || isOnOnboarding || isOnSettings || isOnBooking || isOnServices;

  // Redirect to login if accessing protected route without auth
  if (protectedRoutes && !isLoggedIn) {
    return NextResponse.redirect(new URL('/login', nextUrl));
  }

  // Redirect to dashboard if logged in and accessing auth pages
  if (isOnAuth && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Redirect to onboarding if not completed
  if (
    isLoggedIn &&
    !(user as any)?.onboardingCompleted &&
    !isOnOnboarding &&
    !isOnAuth
  ) {
    return NextResponse.redirect(new URL('/onboarding', nextUrl));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
};
