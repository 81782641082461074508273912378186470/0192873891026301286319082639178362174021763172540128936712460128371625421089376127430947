export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import { licenseEvents, LicenseEvent } from '@/lib/LicenseEvents';
import { cookies } from 'next/headers';

interface AuthData {
  type: 'account' | 'license';
  role: string;
  user?: {
    id: string;
    username: string;
    role: string;
  };
}

export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();

    // Get auth data from cookies (EventSource cannot pass headers)
    const cookieStore = await cookies();
    const authDataCookie = cookieStore.get('authData')?.value;

    if (!authDataCookie) {
      return new Response('Authentication required', { status: 401 });
    }

    let authData: AuthData;
    try {
      authData = JSON.parse(authDataCookie);
    } catch {
      return new Response('Invalid authentication data', { status: 401 });
    }

    // Authorize admin
    if (!authData.user || (authData.user.role !== 'admin' && authData.user.role !== 'owner')) {
      return new Response('Forbidden: Insufficient permissions', { status: 403 });
    }

    const adminId = authData.user!.id;
    const username = authData.user!.username;

    // Create SSE response for admin
    const stream = new ReadableStream({
      start(controller) {
        // Send initial connection message
        const send = (data: LicenseEvent) => {
          controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
        };

        // Send connection established message
        send({ 
          type: 'connected', 
          timestamp: new Date().toISOString(),
          message: `Admin status stream connected for ${username}` 
        });

        // Subscribe to admin-specific events
        const eventHandler = (data: LicenseEvent) => {
          send(data);
        };

        // Subscribe to admin-specific channel
        licenseEvents.subscribe(`admin_${adminId}`, eventHandler);

        // Handle connection close
        const cleanup = () => {
          licenseEvents.unsubscribe(`admin_${adminId}`, eventHandler);
          console.log(`Admin SSE connection closed for: ${username}`);
        };

        // Cleanup on stream close
        request.signal.addEventListener('abort', cleanup);

        // Keep connection alive with periodic ping
        const pingInterval = setInterval(() => {
          if (request.signal.aborted) {
            clearInterval(pingInterval);
            cleanup();
            return;
          }
          send({ type: 'ping', timestamp: new Date().toISOString() });
        }, 30000); // Ping every 30 seconds

        console.log(`Admin SSE connection established for: ${username}`);
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    });
  } catch (error) {
    console.error('Error establishing admin SSE connection:', error);
    return new Response('Failed to establish connection', { status: 500 });
  }
} 