export const runtime = 'edge';

/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import mongooseConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';

export async function GET(request: Request) {
  await mongooseConnect();

  const query = request.url.includes('?') ? new URL(request.url).searchParams : null;

  const filters: Record<string, any> = {};
  if (query?.get('role')) filters.role = query.get('role');
  if (query?.get('isActive')) filters.isActive = query.get('isActive') === 'true';

  const users = await User.find(filters).populate(['ownerId', 'adminId']);
  return NextResponse.json(users);
}

export async function POST(request: Request) {
  await mongooseConnect();

  try {
    const data = await request.json();
    const { username, password, role, ownerId, adminId, name, email, whatsappNumber } = data;

    if (!username || !password || !role || !name) {
      return NextResponse.json(
        {
          error: 'Missing required fields: username, password, role, or name.',
        },
        { status: 400 }
      );
    }

    if (!['owner', 'admin', 'user'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role provided. Must be one of: owner, admin, user.' },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    if (ownerId) {
      const owner = await User.findById(ownerId);
      if (!owner) {
        return NextResponse.json({ error: 'Owner ID provided does not exist.' }, { status: 400 });
      }
    }

    if (adminId) {
      const admin = await User.findById(adminId);
      if (!admin) {
        return NextResponse.json({ error: 'Admin ID provided does not exist.' }, { status: 400 });
      }
    }

    let expireDate = data.expireDate;
    if (role === 'user' && !expireDate) {
      const now = new Date();
      expireDate = new Date(now.setFullYear(now.getFullYear() + 1));
    }

    const newUser = await User.create({
      username,
      password: hashedPassword,
      role,
      ownerId: ownerId || null,
      adminId: adminId || null,
      name,
      email: email || null,
      whatsappNumber: whatsappNumber || null,
      expireDate: expireDate || null,
    });

    return NextResponse.json(newUser, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create user.' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  await mongooseConnect();

  const data = await request.json();
  const { id, ...updates } = data;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
  }

  try {
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(id, updates, {
      new: true,
    }).populate(['ownerId', 'adminId']);

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to update user.' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  await mongooseConnect();

  const { id } = await request.json();

  if (!id) {
    return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
  }

  try {
    const user = await User.findByIdAndUpdate(id, { isActive: false }, { new: true });

    if (!user) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User soft-deleted successfully.' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to delete user.' }, { status: 500 });
  }
}
