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

async function seedCategories() {
  const adminUser = await prisma.user.findUnique({ where: { email: 'admin@minify.ai' } });
  if (!adminUser) return;

  const categories = [
    { id: 'cat-expense-food', name: 'Еда и напитки' },
    { id: 'cat-expense-transport', name: 'Транспорт' },
    { id: 'cat-expense-entertainment', name: 'Развлечения' },
    { id: 'cat-expense-shopping', name: 'Покупки' },
    { id: 'cat-expense-health', name: 'Здоровье' },
    { id: 'cat-income-salary', name: 'Зарплата' },
    { id: 'cat-income-freelance', name: 'Фриланс' },
    { id: 'cat-income-other', name: 'Прочие доходы' }
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { id: category.id },
      update: { name: category.name },
      create: {
        id: category.id,
        name: category.name,
        userId: adminUser.id
      }
    });
  }
}

async function main() {
  await seedUsers();
  await seedCategories();
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
