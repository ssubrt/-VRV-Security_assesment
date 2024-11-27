import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create or update default permissions
  const permissionData = [
    { name: 'users:read', description: 'View users' },
    { name: 'users:write', description: 'Manage users' },
    { name: 'roles:read', description: 'View roles' },
    { name: 'roles:write', description: 'Manage roles' }
  ];

  const permissions = await Promise.all(
    permissionData.map(async (data) => {
      return prisma.permission.upsert({
        where: { name: data.name },
        update: { description: data.description },
        create: {
          name: data.name,
          description: data.description
        }
      });
    })
  );

  // Create or update admin role
  const adminRole = await prisma.role.upsert({
    where: { name: 'Administrator' },
    update: {
      description: 'Full system access',
      permissions: {
        deleteMany: {},
        create: permissions.map(permission => ({
          permission: {
            connect: { id: permission.id }
          }
        }))
      }
    },
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

  // Create or update user role
  const userRole = await prisma.role.upsert({
    where: { name: 'User' },
    update: {
      description: 'Regular user access',
      permissions: {
        deleteMany: {},
        create: [
          {
            permission: {
              connect: { id: permissions[0].id } // users:read
            }
          },
          {
            permission: {
              connect: { id: permissions[2].id } // roles:read
            }
          }
        ]
      }
    },
    create: {
      name: 'User',
      description: 'Regular user access',
      permissions: {
        create: [
          {
            permission: {
              connect: { id: permissions[0].id } // users:read
            }
          },
          {
            permission: {
              connect: { id: permissions[2].id } // roles:read
            }
          }
        ]
      }
    }
  });

  // Create or update admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {
      name: 'System Admin',
      password: adminPassword,
      roleId: adminRole.id,
      status: 'active'
    },
    create: {
      email: 'admin@example.com',
      name: 'System Admin',
      password: adminPassword,
      roleId: adminRole.id,
      status: 'active'
    }
  });

  // Create or update regular user
  const userPassword = await bcrypt.hash('user123', 10);
  await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {
      name: 'Regular User',
      password: userPassword,
      roleId: userRole.id,
      status: 'active'
    },
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: userPassword,
      roleId: userRole.id,
      status: 'active'
    }
  });

  console.log('Seed completed successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });