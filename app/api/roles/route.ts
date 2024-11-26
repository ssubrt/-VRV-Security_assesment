import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
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

    const roles = await db.role.findMany({
      include: {
        _count: {
          select: { users: true }
        },
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    return NextResponse.json(roles);
  } catch (error) {
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

    const { name, description, permissions } = await req.json();

    const role = await db.role.create({
      data: {
        name,
        description,
        permissions: {
          create: permissions.map((permissionId: string) => ({
            permission: {
              connect: { id: permissionId }
            }
          }))
        }
      },
      include: {
        permissions: {
          include: {
            permission: true
          }
        }
      }
    });

    await db.activity.create({
      data: {
        userId: authUser.id as string,
        action: 'created new role',
        target: role.name
      }
    });

    return NextResponse.json(role);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}