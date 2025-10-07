import { PrismaClient, UserRole } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

const TEST_USERS = [
  {
    email: 'admin@minify.ai',
    password: 'Admin123!',
    fullName: 'Администратор Системы',
    role: UserRole.ADMIN
  },
  {
    email: 'user@minify.ai',
    password: 'User123!',
    fullName: 'Пользователь Профиль',
    role: UserRole.USER
  }
] as const;

async function seedUsers() {
  for (const user of TEST_USERS) {
    const passwordHash = await argon2.hash(user.password);
    await prisma.user.upsert({
      where: { email: user.email },
      update: {
        fullName: user.fullName,
        role: user.role,
        passwordHash
      },
      create: {
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        passwordHash
      }
    });
  }
}

async function main() {
  await seedUsers();
  console.log('Seed data applied successfully');
}

main()
  .catch((error) => {
    console.error('Failed to seed database', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
