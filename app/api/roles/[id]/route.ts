import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getUser } from '@/lib/auth';

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getUser(req as any);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { name, description, permissions } = await req.json();
    const { id } = params;

    const role = await db.role.update({
      where: { id },
      data: {
        name,
        description,
        permissions: {
          deleteMany: {},
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
        action: 'updated role',
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

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authUser = await getUser(req as any);
    if (!authUser) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { id } = params;

    const role = await db.role.delete({
      where: { id }
    });

    await db.activity.create({
      data: {
        userId: authUser.id as string,
        action: 'deleted role',
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