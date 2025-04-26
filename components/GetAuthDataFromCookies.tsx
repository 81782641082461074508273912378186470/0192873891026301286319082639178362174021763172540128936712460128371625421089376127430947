/* eslint-disable @typescript-eslint/no-explicit-any */
import { cookies } from 'next/headers';

interface AuthData {
  role: string | null;
  user: any;
  license?: any;
  type: 'account' | 'license' | null;
  isAuthenticated: boolean;
  authDetails: any | null;
}

export async function getAuthDataFromCookie(): Promise<AuthData | null> {
  const cookieStore = await cookies();
  const authDataCookie = cookieStore.get('authData')?.value;
  if (!authDataCookie) {
    return null;
  }

  try {
    const parsedAuthData = JSON.parse(authDataCookie);

    // TODO: parsedAuthData Work, But not Work in /app/page.tsx
    // console.log(parsedAuthData);
    return parsedAuthData;
  } catch (error) {
    console.error('Failed to parse authData cookie:', error);
    return null;
  }
}
