import dayjs from 'dayjs';
import type {
  CategoryDefinition,
  CategorySummary,
  ChatMessage,
  DailySummary,
  ExchangeRate,
  Subscription,
  SubscriptionForecastItem,
  Transaction,
  TransactionPreset
} from '@types/index';

const now = dayjs();
const monthStart = now.startOf('month');

export const mockCategories: CategoryDefinition[] = [
  { id: 'cat-income-salary', name: 'Зарплата', kind: 'income', color: '#34d399', icon: 'briefcase' },
  { id: 'cat-expense-food', name: 'Еда', kind: 'expense', color: '#f97316', icon: 'utensils' },
  { id: 'cat-expense-transport', name: 'Транспорт', kind: 'expense', color: '#60a5fa', icon: 'car' },
  { id: 'cat-expense-subscriptions', name: 'Подписки', kind: 'expense', color: '#a855f7', icon: 'badge-check' },
  { id: 'cat-expense-housing', name: 'Жильё', kind: 'expense', color: '#fbbf24', icon: 'home' },
  { id: 'cat-expense-entertainment', name: 'Развлечения', kind: 'expense', color: '#f472b6', icon: 'sparkles' },
  { id: 'cat-transfer', name: 'Переводы', kind: 'transfer', color: '#22d3ee', icon: 'shuffle' }
];

export const mockTransactions: Transaction[] = [
  {
    id: 'trx-001',
    type: 'expense',
    categoryId: 'cat-expense-food',
    category: 'Еда',
    merchant: 'Яндекс Лавка',
    tags: ['ежедневные'],
    date: monthStart.add(1, 'day').toISOString(),
    description: 'Продукты',
    amount: { currency: 'RUB', amount: 2450 }
  },
  {
    id: 'trx-002',
    type: 'expense',
    categoryId: 'cat-expense-transport',
    category: 'Транспорт',
    merchant: 'Яндекс Go',
    tags: ['такси'],
    date: monthStart.add(2, 'day').toISOString(),
    description: 'Поездка в офис',
    amount: { currency: 'RUB', amount: 610 }
  },
  {
    id: 'trx-003',
    type: 'income',
    categoryId: 'cat-income-salary',
    category: 'Зарплата',
    merchant: 'ООО Минити',
    tags: ['повтор'],
    date: monthStart.add(3, 'day').toISOString(),
    description: 'Аванс',
    amount: { currency: 'RUB', amount: 120000 }
  },
  {
    id: 'trx-004',
    type: 'expense',
    categoryId: 'cat-expense-subscriptions',
    category: 'Подписки',
    merchant: 'Spotify',
    tags: ['музыка'],
    date: monthStart.add(5, 'day').toISOString(),
    description: 'Spotify Premium',
    amount: { currency: 'USD', amount: 9.99 }
  }
];

export const mockSubscriptions: Subscription[] = [
  {
    id: 'sub-001',
    name: 'Netflix',
    categoryId: 'cat-expense-subscriptions',
    merchant: 'Netflix',
    cadence: 'monthly',
    nextPaymentDate: monthStart.add(12, 'day').toISOString(),
    amount: { currency: 'USD', amount: 11.99 },
    status: 'active',
    reminderDaysBefore: 2,
    tags: ['развлечения'],
    notes: 'Смотреть совместно'
  },
  {
    id: 'sub-002',
    name: 'Яндекс Плюс',
    categoryId: 'cat-expense-subscriptions',
    merchant: 'Яндекс',
    cadence: 'monthly',
    nextPaymentDate: monthStart.add(3, 'day').toISOString(),
    amount: { currency: 'RUB', amount: 299 },
    status: 'active',
    reminderDaysBefore: 1
  }
];

export const mockPresets: TransactionPreset[] = [
  {
    id: 'preset-coffee',
    label: 'Кофе to-go',
    description: 'Средний чек кофейни',
    type: 'expense',
    categoryId: 'cat-expense-food',
    merchant: 'Surf Coffee',
    tags: ['кофе', 'утро'],
    amount: { currency: 'RUB', amount: 280 }
  },
  {
    id: 'preset-gym',
    label: 'Абонемент в зал',
    description: 'Месячная подписка',
    type: 'expense',
    categoryId: 'cat-expense-entertainment',
    merchant: 'World Class',
    tags: ['спорт'],
    note: 'Отслеживать эффективность',
    amount: { currency: 'RUB', amount: 4500 }
  },
  {
    id: 'preset-salary',
    label: 'Зарплата',
    description: 'Чистыми на руки',
    type: 'income',
    categoryId: 'cat-income-salary',
    merchant: 'ООО Минити',
    tags: ['повтор'],
    amount: { currency: 'RUB', amount: 240000 }
  }
];

export const mockDailySummaries: DailySummary[] = Array.from({ length: now.daysInMonth() }, (_, idx) => {
  const date = monthStart.add(idx, 'day');
  const transactions = mockTransactions.filter((trx) => dayjs(trx.date).isSame(date, 'day'));
  const totalRub = transactions
    .map((trx) => (trx.amount.currency === 'RUB' ? trx.amount.amount : trx.amount.amount * 92.3))
    .reduce((sum, value) => sum + value, 0);
  return {
    date: date.toISOString(),
    total: {
      currency: 'RUB',
      amount: Number(totalRub.toFixed(2))
    }
  };
});

export const mockCategorySummaries: CategorySummary[] = mockCategories
  .filter((category) => category.kind === 'expense')
  .map((category) => ({
    category: category.name,
    total: {
      currency: 'RUB',
      amount: Math.round(Math.random() * 20000 + 1500)
    }
  }));

export const mockSubscriptionForecast: SubscriptionForecastItem[] = mockSubscriptions.map((subscription) => ({
  id: `forecast-${subscription.id}`,
  subscriptionId: subscription.id,
  name: subscription.name,
  scheduledDate: dayjs(subscription.nextPaymentDate).add(1, 'month').toISOString(),
  amount: subscription.amount,
  status: 'scheduled'
}));

export const mockChatHistory: ChatMessage[] = [
  {
    id: 'msg-001',
    role: 'assistant',
    createdAt: now.subtract(2, 'hour').toISOString(),
    content: 'Привет! Я помогу контролировать бюджет и подскажу, куда уходят деньги.'
  },
  {
    id: 'msg-002',
    role: 'user',
    createdAt: now.subtract(1, 'hour').toISOString(),
    content: 'Покажи подписки, которые можно отменить.'
  }
];

export const mockExchangeRates: ExchangeRate[] = [
  { base: 'USD', quote: 'RUB', date: monthStart.toISOString(), rate: 92.3 },
  { base: 'EUR', quote: 'RUB', date: monthStart.toISOString(), rate: 98.1 },
  { base: 'USD', quote: 'RUB', date: monthStart.add(1, 'day').toISOString(), rate: 92.5 },
  { base: 'RUB', quote: 'USD', date: monthStart.add(1, 'day').toISOString(), rate: 0.0108 },
  { base: 'RUB', quote: 'EUR', date: monthStart.add(1, 'day').toISOString(), rate: 0.0102 }
];
