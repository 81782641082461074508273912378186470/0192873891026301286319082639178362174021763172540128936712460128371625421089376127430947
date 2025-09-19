export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { licenseEvents, LicenseEvent } from '@/lib/LicenseEvents';

export async function GET(request: NextRequest) {
  await mongooseConnect();

  const { searchParams } = new URL(request.url);
  const licenseKey = searchParams.get('key');

  if (!licenseKey) {
    return new Response('License key is required', { status: 400 });
  }

  // Verify license exists
  const license = await License.findOne({ key: licenseKey });
  if (!license) {
    return new Response('License not found', { status: 404 });
  }

  // Create SSE response
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const send = (data: LicenseEvent) => {
        controller.enqueue(`data: ${JSON.stringify(data)}\n\n`);
      };

      // Set license as online when connection is established
      const setOnlineStatus = async () => {
        try {
          const now = new Date();
          
          // Check current status first to avoid unnecessary updates
          const currentLicense = await License.findOne({ key: licenseKey });
          if (currentLicense?.isOnline) {
            console.log(`License ${licenseKey.substring(0, 8)}... already online`);
            return;
          }
          
          const updatedLicense = await License.findOneAndUpdate(
            { key: licenseKey },
            { 
              isOnline: true, 
              connectionEstablishedAt: now,
              lastSeenAt: now 
            },
            { new: true }
          );
          
          // Notify specific admin that owns this license
          if (updatedLicense && updatedLicense.adminId) {
            licenseEvents.emit(`admin_${updatedLicense.adminId}`, {
              type: 'status_change',
              timestamp: now.toISOString(),
              message: 'License came online',
              licenseKey,
            });
          }
          
          console.log(`License ${licenseKey.substring(0, 8)}... is now online`);
        } catch (error) {
          console.error('Failed to update online status:', error);
        }
      };

      // Set license as offline when connection is closed
      const setOfflineStatus = async () => {
        try {
          const now = new Date();
          
          // Check current status first to avoid unnecessary updates
          const currentLicense = await License.findOne({ key: licenseKey });
          if (!currentLicense?.isOnline) {
            console.log(`License ${licenseKey.substring(0, 8)}... already offline`);
            return;
          }
          
          const updatedLicense = await License.findOneAndUpdate(
            { key: licenseKey },
            { 
              isOnline: false, 
              lastSeenAt: now,
              connectionEstablishedAt: null
            },
            { new: true }
          );
          
          // Notify specific admin that owns this license
          if (updatedLicense && updatedLicense.adminId) {
            licenseEvents.emit(`admin_${updatedLicense.adminId}`, {
              type: 'status_change',
              timestamp: now.toISOString(),
              message: 'License went offline',
              licenseKey,
            });
          }
          
          console.log(`License ${licenseKey.substring(0, 8)}... is now offline`);
        } catch (error) {
          console.error('Failed to update offline status:', error);
        }
      };

      // Set online status immediately
      setOnlineStatus();

      // Send connection established message
      send({ type: 'connected', licenseKey, timestamp: new Date().toISOString() });

      // Subscribe to license events
      const eventHandler = (data: LicenseEvent) => {
        send(data);
      };

      licenseEvents.subscribe(licenseKey, eventHandler);

      // Handle connection close
      const cleanup = () => {
        licenseEvents.unsubscribe(licenseKey, eventHandler);
        setOfflineStatus(); // Set offline status when connection closes
        console.log(`SSE connection closed for license: ${licenseKey.substring(0, 8)}...`);
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

      console.log(`SSE connection established for license: ${licenseKey.substring(0, 8)}...`);
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
} 