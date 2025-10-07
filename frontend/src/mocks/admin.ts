import dayjs from 'dayjs';
import type {
  AdminAlert,
  AdminMetric,
  AuditLogEntry,
  PlanInsight,
  UserAccount
} from '@types/index';

const now = dayjs();

export const mockAdminMetrics: AdminMetric[] = [
  {
    id: 'metric-mrr',
    label: 'MRR',
    value: '₽ 1 240 000',
    trend: 12.4,
    description: 'Среднемесячный повторяющийся доход'
  },
  {
    id: 'metric-active',
    label: 'Активные пользователи',
    value: '4 812',
    trend: 8.1,
    description: 'Пользователи с активностью за 7 дней'
  },
  {
    id: 'metric-conv',
    label: 'Конверсия онбординга',
    value: '63%',
    trend: 5.6,
    description: 'Доля завершивших настройку кошельков'
  },
  {
    id: 'metric-churn',
    label: 'Отток',
    value: '2.8%',
    trend: -1.3,
    description: 'Месячный churn платных подписок'
  }
];

export const mockUserAccounts: UserAccount[] = [
  {
    id: 'usr-001',
    name: 'Анна Иванова',
    email: 'anna@minify.ai',
    role: 'owner',
    status: 'active',
    mrr: 1290,
    createdAt: now.subtract(15, 'month').toISOString(),
    lastActiveAt: now.subtract(2, 'minute').toISOString()
  },
  {
    id: 'usr-002',
    name: 'Игорь Смирнов',
    email: 'igor@producthub.io',
    role: 'admin',
    status: 'active',
    mrr: 990,
    createdAt: now.subtract(7, 'month').toISOString(),
    lastActiveAt: now.subtract(18, 'minute').toISOString()
  },
  {
    id: 'usr-003',
    name: 'Мария Коваль',
    email: 'maria@analytics.pro',
    role: 'analyst',
    status: 'invited',
    mrr: 0,
    createdAt: now.subtract(2, 'day').toISOString(),
    lastActiveAt: now.subtract(2, 'day').toISOString()
  },
  {
    id: 'usr-004',
    name: 'Сергей Ли',
    email: 's.lee@finops.app',
    role: 'member',
    status: 'active',
    mrr: 490,
    createdAt: now.subtract(4, 'month').toISOString(),
    lastActiveAt: now.subtract(3, 'hour').toISOString()
  }
];

export const mockAdminAlerts: AdminAlert[] = [
  {
    id: 'alert-001',
    severity: 'warning',
    message: '3 подписки скоро превысят бюджет команды «Growth».',
    createdAt: now.subtract(25, 'minute').toISOString(),
    actionLabel: 'Посмотреть прогноз'
  },
  {
    id: 'alert-002',
    severity: 'critical',
    message: 'Платёж по карте VISA-4210 отклонён. Требуется повторная попытка.',
    createdAt: now.subtract(1, 'hour').toISOString(),
    actionLabel: 'Отправить напоминание'
  },
  {
    id: 'alert-003',
    severity: 'info',
    message: 'Готов отчёт по подпискам за прошедший квартал.',
    createdAt: now.subtract(3, 'hour').toISOString()
  }
];

export const mockAuditLog: AuditLogEntry[] = [
  {
    id: 'log-001',
    actor: 'Анна Иванова',
    action: 'обновила лимит бюджета',
    target: 'Команда Growth',
    channel: 'web',
    timestamp: now.subtract(12, 'minute').toISOString()
  },
  {
    id: 'log-002',
    actor: 'Игорь Смирнов',
    action: 'назначил роль',
    target: 'Мария Коваль → Analyst',
    channel: 'mobile',
    timestamp: now.subtract(48, 'minute').toISOString()
  },
  {
    id: 'log-003',
    actor: 'Сергей Ли',
    action: 'создал автоматизацию',
    target: 'Алгоритм автокатегоризации',
    channel: 'web',
    timestamp: now.subtract(3, 'hour').toISOString()
  }
];

export const mockPlanInsights: PlanInsight[] = [
  {
    id: 'plan-001',
    plan: 'Starter',
    customers: 1820,
    churnRate: 3.4,
    arpa: 390,
    trend: 4.1
  },
  {
    id: 'plan-002',
    plan: 'Growth',
    customers: 640,
    churnRate: 2.2,
    arpa: 890,
    trend: 6.3
  },
  {
    id: 'plan-003',
    plan: 'Enterprise',
    customers: 96,
    churnRate: 1.1,
    arpa: 3290,
    trend: 2.7
  }
];
