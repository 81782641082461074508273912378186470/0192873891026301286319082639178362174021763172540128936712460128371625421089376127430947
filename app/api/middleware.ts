import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const authData = request.cookies.get('authData')?.value;
  //console.log('authData in middleware:', authData);

  if (!authData) {
    //console.log('No authData found, redirecting to /auth...');
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  //console.log('Valid authData, allowing access');
  return NextResponse.next(); // Let the request proceed
}

export const config = {
  matcher: ['/dashboard/:path*'], // Apply middleware only to dashboard routes
};
