import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { createToken, setUserCookie } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password, loginAs } = await req.json();

    const user = await db.user.findUnique({
      where: { email },
      include: {
        role: {
          include: {
            permissions: {
              include: {
                permission: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Check if user is active
    if (user.status !== 'active') {
      return NextResponse.json(
        { error: 'Account is inactive' },
        { status: 403 }
      );
    }

    // Check if user has appropriate role for login type
    if (loginAs === 'admin' && user.role.name !== 'Administrator') {
      return NextResponse.json(
        { error: 'Unauthorized access' },
        { status: 403 }
      );
    }

    const token = await createToken({
      id: user.id,
      email: user.email,
      role: user.role.name,
      loginType: loginAs,
      permissions: user.role.permissions.map(p => p.permission.name)
    });

    await setUserCookie(token);

    await db.activity.create({
      data: {
        userId: user.id,
        action: 'logged in',
        target: `as ${loginAs}`
      }
    });

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}