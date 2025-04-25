import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  const hostname = req.headers.get('host')?.toLowerCase();
  const path = req.nextUrl.pathname;

  if (
    path.startsWith('/favicon') ||
    path.startsWith('/manifest') ||
    path.startsWith('/images') ||
    path.startsWith('/icons') ||
    path.startsWith('/_next/static') ||
    path.startsWith('/_next/image')
  ) {
    return NextResponse.next();
  }
  if (!hostname?.includes('localhost') && path.startsWith('/app')) {
    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  }
  if (
    hostname !== 'app.autolaku.com' &&
    !hostname?.includes('localhost') &&
    hostname?.endsWith('autolaku.com') &&
    path.startsWith('/app')
  ) {
    return new Response(null, { status: 403, headers: { 'Content-Type': 'text/html' } });
  }

  if (hostname === 'app.autolaku.com') {
    return NextResponse.rewrite(new URL(`/app${path}`, req.url));
  }

  if (hostname?.includes('localhost') && path.startsWith('/app')) {
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',
};
