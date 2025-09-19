import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import mongooseConnect from '@/lib/mongoose';
import Report from '@/models/Report';

const createReportSchema = z.object({
  reportId: z.string().min(1),
  type: z.enum(['bug', 'feature', 'support']),
  description: z.string().min(10).max(5000),
  systemInfo: z.object({
    platform: z.string(),
    userAgent: z.string(),
    appVersion: z.string(),
    timestamp: z.string(),
  }),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
});

const updateReportSchema = z.object({
  status: z.enum(['pending', 'in_progress', 'resolved', 'closed']).optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).optional(),
  adminNotes: z.string().max(2000).optional(),
  resolvedAt: z.string().optional(),
});

interface ReportFilter {
  type?: string;
  status?: string;
  priority?: string;
}

export async function POST(req: NextRequest) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const validatedData = createReportSchema.parse(body);

    // Check if report with this ID already exists
    const existingReport = await Report.findOne({ reportId: validatedData.reportId });
    if (existingReport) {
      return NextResponse.json({ error: 'Report with this ID already exists' }, { status: 409 });
    }

    // Set priority based on type if not provided
    let priority = validatedData.priority;
    if (!priority) {
      switch (validatedData.type) {
        case 'bug':
          priority = 'high';
          break;
        case 'feature':
          priority = 'medium';
          break;
        case 'support':
          priority = 'medium';
          break;
        default:
          priority = 'medium';
      }
    }

    const report = new Report({
      reportId: validatedData.reportId,
      type: validatedData.type,
      description: validatedData.description,
      systemInfo: {
        platform: validatedData.systemInfo.platform,
        userAgent: validatedData.systemInfo.userAgent,
        appVersion: validatedData.systemInfo.appVersion,
        timestamp: new Date(validatedData.systemInfo.timestamp),
      },
      priority,
      status: 'pending',
    });

    await report.save();

    return NextResponse.json(
      {
        message: 'Report submitted successfully',
        reportId: report.reportId,
        status: report.status,
        priority: report.priority,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await mongooseConnect();
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query filter
    const filter: ReportFilter = {};
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .select('-systemInfo.userAgent'); // Don't return sensitive user agent info

    const total = await Report.countDocuments(filter);

    return NextResponse.json({
      reports,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    });
  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const { reportId, ...updateData } = body;

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const validatedData = updateReportSchema.parse(updateData);

    // If resolving the report, set resolvedAt timestamp
    if (validatedData.status === 'resolved' && !validatedData.resolvedAt) {
      validatedData.resolvedAt = new Date().toISOString();
    }

    const report = await Report.findOneAndUpdate(
      { reportId },
      {
        ...validatedData,
        resolvedAt: validatedData.resolvedAt ? new Date(validatedData.resolvedAt) : undefined,
      },
      { new: true }
    );

    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Report updated successfully', report }, { status: 200 });
  } catch (error) {
    console.error('Error updating report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 400 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await mongooseConnect();
    const body = await req.json();
    const { reportId } = body;

    if (!reportId) {
      return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
    }

    const report = await Report.findOneAndDelete({ reportId });
    if (!report) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Report deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting report:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
