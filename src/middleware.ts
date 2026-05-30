import type { NextRequest } from 'next/server';

import { NextResponse } from 'next/server';
import { fetchAuthSession } from 'aws-amplify/auth/server';

import { paths } from 'src/routes/paths';
import { runWithAmplifyServerContext } from 'src/lib/auth/amplify-server';

// Routes that are only accessible to unauthenticated users
const AUTH_ROUTES = [
  paths.auth.signIn,
  paths.auth.signUp,
  paths.auth.resetPassword,
  paths.auth.updatePassword,
  paths.auth.verify,
];

// Routes that require authentication — extend as the app grows
const PROTECTED_ROUTES = [
  '/dashboard',
  '/settings',
  '/profile',
];

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const { pathname } = request.nextUrl;

  const isAuthenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (context) => {
      try {
        const session = await fetchAuthSession(context);
        return session.tokens !== undefined;
      } catch {
        return false;
      }
    },
  });

  const isAuthRoute = AUTH_ROUTES.some((r) => pathname === r || pathname.startsWith(r + '/'));
  const isProtectedRoute = PROTECTED_ROUTES.some((r) => pathname.startsWith(r));

  // Logged-in user hitting an auth page → send to home
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Unauthenticated user hitting a protected page → send to sign-in
  if (!isAuthenticated && isProtectedRoute) {
    const signInUrl = new URL(paths.auth.signIn, request.url);
    signInUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return response;
}

export const config = {
  matcher: [
    // Skip Next.js internals, static files, and API routes
    '/((?!_next/static|_next/image|favicon.ico|brand/|assets/).*)',
  ],
};
