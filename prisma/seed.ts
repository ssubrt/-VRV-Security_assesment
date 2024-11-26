import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Connect to the database
  await prisma.$connect();

  // Create permissions
  const permissions = await Promise.all([
    prisma.permission.upsert({
      where: { name: 'users:read' },
      update: {},
      create: {
        name: 'users:read',
        description: 'View users'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'users:write' },
      update: {},
      create: {
        name: 'users:write',
        description: 'Manage users'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'roles:read' },
      update: {},
      create: {
        name: 'roles:read',
        description: 'View roles'
      }
    }),
    prisma.permission.upsert({
      where: { name: 'roles:write' },
      update: {},
      create: {
        name: 'roles:write',
        description: 'Manage roles'
      }
    })
  ]);

  // Create admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {},
    create: {
      name: 'Administrator',
      description: 'Full system access',
      permissions: {
        create: permissions.map(permission => ({
          permission: {
            connect: { id: permission.id }
          }
        }))
      }
    }
  });

  // Create admin user
  const hashedPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashedPassword,
      role: {
        connect: { id: adminRole.id }
      }
    }
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });