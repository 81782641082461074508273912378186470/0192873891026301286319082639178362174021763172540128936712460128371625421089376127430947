import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';
import User from '@/models/User';
import mongooseConnect from './mongoose';

const JWT_SECRET = process.env.JWT_SECRET || 'perspicacity';

interface DecodedToken {
  id: string;
  role: string;
  iat: number;
  exp: number;
}

export async function getUserFromRequest(req: NextRequest) {
  try {
    await mongooseConnect();
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token provided');
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as DecodedToken;
    if (!decoded || !decoded.id) {
      throw new Error('Invalid token');
    }
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  } catch (error) {
    console.error('Authentication error:', error);
    throw new Error('Authentication failed');
  }
}
