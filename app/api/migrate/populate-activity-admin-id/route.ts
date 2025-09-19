import { NextRequest, NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import Activity from '@/models/Activity';
import License from '@/models/License';
import { getUserFromRequest } from '@/lib/AuthUtils';

export async function POST(request: NextRequest) {
  try {
    await mongooseConnect();

    // Authenticate user (only admin/owner can run migrations)
    const user = await getUserFromRequest(request);
    if (!user || (user.role !== 'admin' && user.role !== 'owner')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    console.log('Starting activity adminId migration...');

    // Find all activities that have licenseId but no adminId
    const activitiesWithoutAdminId = await Activity.find({
      licenseId: { $exists: true, $ne: null },
      adminId: { $exists: false }
    });

    console.log(`Found ${activitiesWithoutAdminId.length} activities without adminId`);

    let updatedCount = 0;
    let errorCount = 0;
    let actionFixedCount = 0;

    // Process activities in batches to avoid memory issues
    for (const activity of activitiesWithoutAdminId) {
      try {
        // Get the license to find the adminId
        const license = await License.findById(activity.licenseId).select('adminId');
        
        if (license && license.adminId) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const updateData: { adminId: any; action?: string } = {
            adminId: license.adminId
          };

          // Fix invalid action names
          if (activity.action === 'Scraping_Complete') {
            updateData.action = 'Scraping_Stop';
            actionFixedCount++;
          } else if (activity.action === 'Scraping_Failed') {
            updateData.action = 'Scraping_Stop';
            actionFixedCount++;
          }

          // Update the activity with the adminId and fixed action
          await Activity.findByIdAndUpdate(activity._id, updateData);
          updatedCount++;
        } else {
          console.warn(`No license found or no adminId for activity: ${activity._id}`);
          errorCount++;
        }
      } catch (error) {
        console.error(`Error processing activity ${activity._id}:`, error);
        errorCount++;
      }
    }

    console.log(`Migration completed. Updated: ${updatedCount}, Errors: ${errorCount}, Action names fixed: ${actionFixedCount}`);

    return NextResponse.json({
      message: 'Migration completed successfully',
      stats: {
        totalActivities: activitiesWithoutAdminId.length,
        updated: updatedCount,
        errors: errorCount,
        actionNamesFixed: actionFixedCount
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Migration error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Migration failed' },
      { status: 500 }
    );
  }
} 