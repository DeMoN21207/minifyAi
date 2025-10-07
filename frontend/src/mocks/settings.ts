import dayjs from 'dayjs';
import type { ManagedUser, RoleDefinition } from '@types/index';

export const mockRoles: RoleDefinition[] = [
  {
    id: 'role-owner',
    name: 'Владелец',
    description: 'Полный административный доступ ко всем разделам платформы.',
    permissions: [
      'transactions.read',
      'transactions.write',
      'subscriptions.manage',
      'settings.manage',
      'users.manage'
    ],
    isSystem: true
  },
  {
    id: 'role-controller',
    name: 'Финансовый контролёр',
    description: 'Контроль бюджета, подписок и подготовки отчетов без доступа к системным настройкам.',
    permissions: [
      'transactions.read',
      'transactions.write',
      'subscriptions.manage',
      'analytics.read',
      'exports.generate'
    ]
  },
  {
    id: 'role-employee',
    name: 'Сотрудник',
    description: 'Просмотр расходов своей команды и отслеживание состояния платежей.',
    permissions: ['transactions.read', 'subscriptions.read', 'analytics.read'],
    isDefault: true
  }
];

const now = dayjs();

export const mockManagedUsers: ManagedUser[] = [
  {
    id: 'managed-001',
    fullName: 'Анна Полякова',
    email: 'anna.polyakova@acme.co',
    username: 'anna.polyakova',
    roleId: 'role-owner',
    status: 'active',
    department: 'Финансы',
    phone: '+7 (912) 000-11-22',
    lastLoginAt: now.subtract(5, 'minute').toISOString(),
    createdAt: now.subtract(2, 'year').toISOString(),
    passwordUpdatedAt: now.subtract(1, 'month').toISOString(),
    requirePasswordReset: false
  },
  {
    id: 'managed-002',
    fullName: 'Дмитрий Журавлёв',
    email: 'dmitry.zh@acme.co',
    username: 'dmitry.zh',
    roleId: 'role-controller',
    status: 'active',
    department: 'Финконтроль',
    phone: '+7 (921) 555-44-33',
    lastLoginAt: now.subtract(2, 'hour').toISOString(),
    createdAt: now.subtract(9, 'month').toISOString(),
    passwordUpdatedAt: now.subtract(14, 'day').toISOString(),
    requirePasswordReset: false
  },
  {
    id: 'managed-003',
    fullName: 'Екатерина Соколова',
    email: 'e.sokolova@acme.co',
    username: 'ekaterina.s',
    roleId: 'role-employee',
    status: 'pending',
    department: 'Маркетинг',
    lastLoginAt: null,
    createdAt: now.subtract(4, 'day').toISOString(),
    passwordUpdatedAt: now.subtract(4, 'day').toISOString(),
    requirePasswordReset: true,
    temporaryPassword: 'Временный пароль отправлен'
  },
  {
    id: 'managed-004',
    fullName: 'Лев Громов',
    email: 'lev.gromov@acme.co',
    username: 'lev.gromov',
    roleId: 'role-employee',
    status: 'suspended',
    department: 'Продажи',
    lastLoginAt: now.subtract(45, 'day').toISOString(),
    createdAt: now.subtract(1, 'year').toISOString(),
    passwordUpdatedAt: now.subtract(2, 'month').toISOString(),
    requirePasswordReset: true
  }
];
