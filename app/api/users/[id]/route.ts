import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';
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

    const { id } = params;
    const { name, email, password, roleId, status } = await req.json();

    const updateData: any = {
      name,
      email,
      roleId,
      status
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
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

    await db.activity.create({
      data: {
        userId: authUser.id as string,
        action: 'updated user',
        target: user.email
      }
    });

    return NextResponse.json(user);
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

    const user = await db.user.delete({
      where: { id }
    });

    await db.activity.create({
      data: {
        userId: authUser.id as string,
        action: 'deleted user',
        target: user.email
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}