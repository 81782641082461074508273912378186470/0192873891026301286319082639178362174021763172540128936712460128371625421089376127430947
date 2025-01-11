import mongooseConnect from '@/lib/mongoose';
import User from '@/models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key';

export async function POST(request: Request) {
  await mongooseConnect(); // Connect to the database

  const { username, password } = await request.json();
  console.log('Username received:', username); // Log received username

  // Find user in the database
  const user = await User.findOne({
    username: { $regex: `^${username}$`, $options: 'i' },
  });

  if (!user) {
    console.log('User not found');
    return new Response(JSON.stringify({ error: 'User not found' }), {
      status: 404,
    });
  }

  console.log('User found in database:', user); // Log user details (if found)

  // Check if the password matches
  try {
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Password provided:', password);
    console.log('Password stored in database:', user.password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401,
      });
    }
  } catch (error) {
    console.error('Error during password comparison:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
    });
  }

  // Generate JWT token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: '7d',
  });
  console.log('JWT Token generated:', token); // Log the generated token
  // console.log('USERRR:', user); // Log the generated token

  return new Response(
    JSON.stringify({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        email: user.email,
        name: user.name,
        whatsappNumber: user.whatsappNumber,
        isActive: user.isActive,
      },
    }),
    { status: 200 }
  );
}
