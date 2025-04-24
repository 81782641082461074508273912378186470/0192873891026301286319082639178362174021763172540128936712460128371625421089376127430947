// import { NextRequest, NextResponse } from 'next/server';

// export async function middleware(request: NextRequest) {
//   const authData = request.cookies.get('authData')?.value;

//   if (!authData) {
//     return NextResponse.redirect(new URL('/auth', request.url));
//   }

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ['/dashboard/:path*'],
// };
