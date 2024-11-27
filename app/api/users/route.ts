import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { getUser } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authUser = await getUser(req as any);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const users = await db.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const authUser = await getUser(req as any);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, email, password, roleId } = await req.json();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        roleId,
        status: 'active'
      },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        role: {
          select: {
            name: true
          }
        }
      }
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: authUser.id as string,
        action: 'created new user',
        target: user.email
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}