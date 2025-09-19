/* eslint-disable @typescript-eslint/no-explicit-any */
export const runtime = 'nodejs';
import mongooseConnect from '@/lib/mongoose';
import License from '@/models/License';
import { NextResponse, NextRequest } from 'next/server';
import { getUserFromRequest } from '@/lib/AuthUtils';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    // Establish database connection
    await mongooseConnect();

    // Authenticate user
    const user = await getUserFromRequest(request);
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Authorize user based on role
    if (user.role !== 'admin' && user.role !== 'owner') {
      return NextResponse.json({ error: 'Forbidden: Insufficient permissions' }, { status: 403 });
    }

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const include = searchParams.get('include');
    const activityLimit = parseInt(searchParams.get('activityLimit') || '10');
    const activitySkip = parseInt(searchParams.get('activitySkip') || '0');
    const licenseKey = searchParams.get('licenseKey'); // For loading more activities for specific license

    let licenses;

    if (include === 'activities') {
      // Build match condition for licenses
      const licenseMatch: any = { adminId: user._id };
      if (licenseKey) {
        licenseMatch.key = licenseKey;
      }

      // Use aggregation pipeline to join licenses with activities
      licenses = await License.aggregate([
        // Match licenses for this admin (optionally filtered by specific license key)
        { $match: licenseMatch },
        
        // Join with activities using both licenseId and adminId for better filtering
        // Also include activities that don't have adminId but belong to this license (fallback for existing data)
        { 
          $lookup: {
            from: 'activities',
            let: { licenseId: '$_id', adminId: new mongoose.Types.ObjectId(user._id) },
            pipeline: [
              { 
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$licenseId', '$$licenseId'] },
                      {
                        $or: [
                          { $eq: ['$adminId', '$$adminId'] },
                          { $eq: ['$adminId', null] },
                          { $not: { $ifNull: ['$adminId', false] } }
                        ]
                      }
                    ]
                  }
                }
              },
              { $sort: { timestamp: -1 } },
              { $skip: activitySkip },
              { $limit: activityLimit }
            ],
            as: 'recentActivities'
          }
        },
        
        // Get total activity count for pagination
        {
          $lookup: {
            from: 'activities',
            let: { licenseId: '$_id', adminId: new mongoose.Types.ObjectId(user._id) },
            pipeline: [
              { 
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$licenseId', '$$licenseId'] },
                      {
                        $or: [
                          { $eq: ['$adminId', '$$adminId'] },
                          { $eq: ['$adminId', null] },
                          { $not: { $ifNull: ['$adminId', false] } }
                        ]
                      }
                    ]
                  }
                }
              },
              { $count: 'count' }
            ],
            as: 'activityCountData'
          }
        },
        
        // Add activity count and hasMore flag
        {
          $addFields: {
            activityCount: { 
              $ifNull: [
                { $arrayElemAt: ['$activityCountData.count', 0] },
                0
              ]
            },
            hasMoreActivities: {
              $gt: [
                { $ifNull: [{ $arrayElemAt: ['$activityCountData.count', 0] }, 0] },
                { $add: [activitySkip, activityLimit] }
              ]
            }
          }
        },
        
        // Remove temporary field
        { $unset: 'activityCountData' },
        
        // Sort by name for consistent ordering
        { $sort: { name: 1 } }
      ]);
    } else {
      // Simple query for backward compatibility
      licenses = await License.find({ adminId: user._id }).exec();
    }

    // Return success response
    return NextResponse.json(
      {
        message: 'Licenses retrieved successfully',
        licenses,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Error fetching licenses:', error.message || error);

    // Handle specific error cases
    if (error.message === 'Authentication failed') {
      return NextResponse.json({ error: 'Authentication failed' }, { status: 401 });
    }

    // Generic server error
    return NextResponse.json({ error: 'Failed to fetch licenses' }, { status: 500 });
  }
}
