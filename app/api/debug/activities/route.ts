import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import Activity from '@/models/Activity';
import { getUserFromRequest } from '@/lib/AuthUtils';

interface ValidationError {
  id: string;
  action: string;
  timestamp: Date;
  issue: string;
}

interface Stats {
  total: number;
  byAction: Record<string, number>;
  byPlatform: Record<string, number>;
  withoutAdminId: number;
  withoutLicenseId: number;
  validationErrors: ValidationError[];
}

export async function GET(request: NextRequest) {
  try {
    await mongooseConnect();

    // Authenticate user (only admin can access debug info)
    const user = await getUserFromRequest(request);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all activities for this admin
    const activities = await Activity.aggregate([
      {
        $lookup: {
          from: 'licenses',
          localField: 'licenseId',
          foreignField: '_id',
          as: 'license'
        }
      },
      {
        $match: {
          $or: [
            { adminId: user._id },
            { 'license.adminId': user._id }
          ]
        }
      },
      {
        $sort: { timestamp: -1 }
      },
      {
        $limit: 50
      }
    ]);

    // Analyze the activities
    const stats: Stats = {
      total: activities.length,
      byAction: {},
      byPlatform: {},
      withoutAdminId: 0,
      withoutLicenseId: 0,
      validationErrors: []
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    activities.forEach((activity: any) => {
      // Count by action
      stats.byAction[activity.action] = (stats.byAction[activity.action] || 0) + 1;
      
      // Count by platform
      stats.byPlatform[activity.platform] = (stats.byPlatform[activity.platform] || 0) + 1;
      
      // Count missing fields
      if (!activity.adminId) stats.withoutAdminId++;
      if (!activity.licenseId) stats.withoutLicenseId++;
      
      // Check for validation errors
      const validActions = [
        'Account_Login',
        'Account_Logout',
        'License_Login',
        'License_Logout',
        'Scraping_Start',
        'Scraping_Stop',
        'Searching_Product_Start',
        'Searching_Product_Stop',
        'Summarizing_Product',
      ];
      
      if (!validActions.includes(activity.action)) {
        stats.validationErrors.push({
          id: activity._id.toString(),
          action: activity.action,
          timestamp: activity.timestamp,
          issue: 'Invalid action name'
        });
      }
    });

    // Sample activities for inspection
    const sampleActivities = activities.slice(0, 10).map(activity => ({
      id: activity._id,
      action: activity.action,
      platform: activity.platform,
      timestamp: activity.timestamp,
      hasAdminId: !!activity.adminId,
      hasLicenseId: !!activity.licenseId,
      licenseName: activity.license?.[0]?.name || 'Unknown',
      details: activity.details
    }));

    return NextResponse.json({
      stats,
      sampleActivities,
      totalInDatabase: await Activity.countDocuments(),
      recommendation: stats.validationErrors.length > 0 ? 
        'Run migration to fix action names and populate adminId fields' : 
        'Activities look good, run migration to populate missing adminId fields'
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Debug failed' },
      { status: 500 }
    );
  }
} 