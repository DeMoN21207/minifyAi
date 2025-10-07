import { create } from 'zustand';
import dayjs from 'dayjs';
import type {
  CurrencyCode,
  DashboardState,
  MoneyAmount,
  Subscription,
  SubscriptionForecastItem,
  Transaction
} from '@types/index';
import {
  mockCategories,
  mockChatHistory,
  mockExchangeRates,
  mockPresets,
  mockSubscriptions,
  mockTransactions
} from '@mocks/dashboard';

type TransactionDraft = Omit<Transaction, 'id' | 'category'> & { category?: string };

interface DashboardActions {
  setCurrency: (currency: CurrencyCode) => void;
  setMonth: (month: string) => void;
  createTransaction: (transaction: TransactionDraft) => Transaction;
  updateTransaction: (id: string, updates: Partial<TransactionDraft>) => void;
  deleteTransaction: (id: string) => void;
  applyPreset: (presetId: string) => Transaction | undefined;
  upsertSubscription: (subscription: Subscription) => void;
  toggleSubscriptionStatus: (subscriptionId: string) => void;
  deleteSubscription: (subscriptionId: string) => void;
  sendChatPrompt: (prompt: string) => void;
  getSubscriptionForecast: (monthsAhead: number) => SubscriptionForecastItem[];
  convertToSelectedCurrency: (amount: MoneyAmount) => MoneyAmount;
}

const getLatestRate = (
  exchangeRates: DashboardState['exchangeRates'],
  base: CurrencyCode,
  quote: CurrencyCode
) => {
  if (base === quote) return 1;
  const candidates = exchangeRates
    .filter((rate) => rate.base === base && rate.quote === quote)
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  if (candidates.length > 0) {
    return candidates[0].rate;
  }
  const inverseCandidates = exchangeRates
    .filter((rate) => rate.base === quote && rate.quote === base)
    .sort((a, b) => dayjs(b.date).valueOf() - dayjs(a.date).valueOf());
  if (inverseCandidates.length > 0) {
    return 1 / inverseCandidates[0].rate;
  }
  return 1;
};

const convertAmount = (
  amount: MoneyAmount,
  targetCurrency: CurrencyCode,
  exchangeRates: DashboardState['exchangeRates']
): MoneyAmount => {
  if (amount.currency === targetCurrency) {
    return amount;
  }
  const rate = getLatestRate(exchangeRates, amount.currency, targetCurrency);
  return {
    currency: targetCurrency,
    amount: Number((amount.amount * rate).toFixed(2))
  };
};

const shiftByCadence = (date: dayjs.Dayjs, cadence: Subscription['cadence']) => {
  switch (cadence) {
    case 'weekly':
      return date.add(1, 'week');
    case 'monthly':
      return date.add(1, 'month');
    case 'quarterly':
      return date.add(1, 'quarter');
    case 'yearly':
      return date.add(1, 'year');
    default:
      return date;
  }
};

const recalculateAnalytics = (
  transactions: Transaction[],
  subscriptions: Subscription[],
  selectedMonth: string,
  selectedCurrency: CurrencyCode,
  exchangeRates: DashboardState['exchangeRates'],
  categories = mockCategories
) => {
  const month = dayjs(selectedMonth);
  const startOfMonth = month.startOf('month');
  const daysInMonth = month.daysInMonth();

  const dailySummaries = Array.from({ length: daysInMonth }, (_, idx) => {
    const currentDate = startOfMonth.add(idx, 'day');
    const dayTransactions = transactions.filter((trx) => dayjs(trx.date).isSame(currentDate, 'day'));
    const upcomingSubscriptions = subscriptions.filter(
      (subscription) =>
        subscription.status === 'active' && dayjs(subscription.nextPaymentDate).isSame(currentDate, 'day')
    );
    const totalAmount = [...dayTransactions, ...upcomingSubscriptions].reduce((sum, entry) => {
      const amount = 'amount' in entry ? entry.amount : entry.amount;
      const converted = convertAmount(amount, selectedCurrency, exchangeRates);
      return sum + converted.amount;
    }, 0);
    return {
      date: currentDate.toISOString(),
      total: {
        currency: selectedCurrency,
        amount: Number(totalAmount.toFixed(2))
      }
    };
  });

  const monthTransactions = transactions.filter((trx) => dayjs(trx.date).isSame(month, 'month'));
  const monthSubscriptions = subscriptions.filter((subscription) =>
    dayjs(subscription.nextPaymentDate).isSame(month, 'month')
  );

  const categoryMap = new Map<string, number>();

  monthTransactions.forEach((transaction) => {
    const converted = convertAmount(transaction.amount, selectedCurrency, exchangeRates);
    const key = transaction.category ??
      categories.find((category) => category.id === transaction.categoryId)?.name ??
      'Не задано';
    const previous = categoryMap.get(key) ?? 0;
    categoryMap.set(key, Number((previous + converted.amount).toFixed(2)));
  });

  monthSubscriptions.forEach((subscription) => {
    const converted = convertAmount(subscription.amount, selectedCurrency, exchangeRates);
    const key =
      categories.find((category) => category.id === subscription.categoryId)?.name ?? 'Подписки';
    const previous = categoryMap.get(key) ?? 0;
    categoryMap.set(key, Number((previous + converted.amount).toFixed(2)));
  });

  const categorySummaries = Array.from(categoryMap.entries()).map(([category, amount]) => ({
    category,
    total: {
      currency: selectedCurrency,
      amount: Number(amount.toFixed(2))
    }
  }));

  return { dailySummaries, categorySummaries };
};

const initialMonth = dayjs().format('YYYY-MM');

const initialTransactions = mockTransactions;
const initialSubscriptions = mockSubscriptions;
const initialCurrency: CurrencyCode = 'RUB';

const initialAnalytics = recalculateAnalytics(
  initialTransactions,
  initialSubscriptions,
  initialMonth,
  initialCurrency,
  mockExchangeRates
);

const initialState: DashboardState = {
  selectedMonth: initialMonth,
  selectedCurrency: initialCurrency,
  transactions: initialTransactions,
  subscriptions: initialSubscriptions,
  dailySummaries: initialAnalytics.dailySummaries,
  categorySummaries: initialAnalytics.categorySummaries,
  chatHistory: mockChatHistory,
  exchangeRates: mockExchangeRates,
  categories: mockCategories,
  presets: mockPresets
};

export const useDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
  ...initialState,
  setCurrency: (currency) =>
    set((state) => ({
      selectedCurrency: currency,
      ...recalculateAnalytics(
        state.transactions,
        state.subscriptions,
        state.selectedMonth,
        currency,
        state.exchangeRates,
        state.categories
      )
    })),
  setMonth: (month) =>
    set((state) => ({
      selectedMonth: month,
      ...recalculateAnalytics(
        state.transactions,
        state.subscriptions,
        month,
        state.selectedCurrency,
        state.exchangeRates,
        state.categories
      )
    })),
  createTransaction: (transactionDraft) => {
    const categories = get().categories;
    const categoryName =
      transactionDraft.category ??
      categories.find((category) => category.id === transactionDraft.categoryId)?.name ??
      'Не задано';
    const normalizedDate = dayjs(transactionDraft.date).isValid()
      ? dayjs(transactionDraft.date).toISOString()
      : transactionDraft.date;
    const transaction: Transaction = {
      ...transactionDraft,
      id: `trx-${Date.now()}`,
      date: normalizedDate,
      category: categoryName
    };

    set((state) => {
      const transactions = [transaction, ...state.transactions];
      return {
        transactions,
        ...recalculateAnalytics(
          transactions,
          state.subscriptions,
          state.selectedMonth,
          state.selectedCurrency,
          state.exchangeRates,
          state.categories
        )
      };
    });

    return transaction;
  },
  updateTransaction: (id, updates) =>
    set((state) => {
      const transactions = state.transactions.map((transaction) => {
        if (transaction.id !== id) return transaction;
        const normalizedDate =
          updates.date && dayjs(updates.date).isValid() ? dayjs(updates.date).toISOString() : updates.date;
        const categoryName =
          updates.category ??
          state.categories.find((category) => category.id === (updates.categoryId ?? transaction.categoryId))
            ?.name ?? transaction.category;
        return {
          ...transaction,
          ...updates,
          ...(normalizedDate ? { date: normalizedDate } : {}),
          category: categoryName
        };
      });
      return {
        transactions,
        ...recalculateAnalytics(
          transactions,
          state.subscriptions,
          state.selectedMonth,
          state.selectedCurrency,
          state.exchangeRates,
          state.categories
        )
      };
    }),
  deleteTransaction: (id) =>
    set((state) => {
      const transactions = state.transactions.filter((transaction) => transaction.id !== id);
      return {
        transactions,
        ...recalculateAnalytics(
          transactions,
          state.subscriptions,
          state.selectedMonth,
          state.selectedCurrency,
          state.exchangeRates,
          state.categories
        )
      };
    }),
  applyPreset: (presetId) => {
    const state = get();
    const preset = state.presets.find((item) => item.id === presetId);
    if (!preset) return undefined;
    const transaction = state.createTransaction({
      type: preset.type,
      categoryId: preset.categoryId,
      category: state.categories.find((category) => category.id === preset.categoryId)?.name,
      merchant: preset.merchant,
      tags: preset.tags,
      date: dayjs().toISOString(),
      description: preset.label,
      amount: preset.amount,
      note: preset.note
    });
    return transaction;
  },
  upsertSubscription: (subscription) =>
    set((state) => {
      const exists = state.subscriptions.some((item) => item.id === subscription.id);
      const subscriptions = exists
        ? state.subscriptions.map((item) => (item.id === subscription.id ? subscription : item))
        : [subscription, ...state.subscriptions];
      return {
        subscriptions,
        ...recalculateAnalytics(
          state.transactions,
          subscriptions,
          state.selectedMonth,
          state.selectedCurrency,
          state.exchangeRates,
          state.categories
        )
      };
    }),
  toggleSubscriptionStatus: (subscriptionId) =>
    set((state) => {
      const subscriptions = state.subscriptions.map((subscription) => {
        if (subscription.id !== subscriptionId) return subscription;
        return {
          ...subscription,
          status: subscription.status === 'active' ? 'paused' : 'active'
        };
      });
      return {
        subscriptions,
        ...recalculateAnalytics(
          state.transactions,
          subscriptions,
          state.selectedMonth,
          state.selectedCurrency,
          state.exchangeRates,
          state.categories
        )
      };
    }),
  deleteSubscription: (subscriptionId) =>
    set((state) => {
      const subscriptions = state.subscriptions.filter((subscription) => subscription.id !== subscriptionId);
      return {
        subscriptions,
        ...recalculateAnalytics(
          state.transactions,
          subscriptions,
          state.selectedMonth,
          state.selectedCurrency,
          state.exchangeRates,
          state.categories
        )
      };
    }),
  sendChatPrompt: (prompt) => {
    if (!prompt.trim()) return;
    const state = get();
    const timestamp = new Date().toISOString();
    const userMessage = {
      id: `msg-${state.chatHistory.length + 1}`,
      role: 'user' as const,
      content: prompt,
      createdAt: timestamp
    };

    const spendingByCategory = state.categorySummaries
      .slice()
      .sort((a, b) => b.total.amount - a.total.amount)
      .map((summary) => `${summary.category}: ${summary.total.amount.toFixed(0)} ${state.selectedCurrency}`)
      .join('\n');

    const reminderSuggestion = state.subscriptions.find((subscription) => subscription.reminderDaysBefore);
    const assistantMessage = {
      id: `msg-${state.chatHistory.length + 2}`,
      role: 'assistant' as const,
      createdAt: new Date().toISOString(),
      content: `Запрос: ${prompt}\n\nОсновные траты за ${dayjs(state.selectedMonth).format('MMMM YYYY')}:\n${spendingByCategory}\n\nРекомендации:\n• Ограничьте категории с ростом >15% относительно среднего.\n• Настройте напоминания за ${
        reminderSuggestion?.reminderDaysBefore ?? 2
      } дня до списания подписок.\n• Рассмотрите перенос части подписок в одну дату для контроля кэша.`
    };

    set((prevState) => ({
      chatHistory: [...prevState.chatHistory, userMessage, assistantMessage]
    }));
  },
  getSubscriptionForecast: (monthsAhead) => {
    const state = get();
    const horizonEnd = dayjs(state.selectedMonth).startOf('month').add(monthsAhead, 'month').endOf('month');
    const start = dayjs(state.selectedMonth).startOf('month');

    const forecast: SubscriptionForecastItem[] = [];

    state.subscriptions.forEach((subscription) => {
      let paymentCursor = dayjs(subscription.nextPaymentDate);
      while (paymentCursor.isBefore(start)) {
        paymentCursor = shiftByCadence(paymentCursor, subscription.cadence);
      }

      while (paymentCursor.isBefore(horizonEnd) || paymentCursor.isSame(horizonEnd, 'day')) {
        forecast.push({
          id: `forecast-${subscription.id}-${paymentCursor.valueOf()}`,
          subscriptionId: subscription.id,
          name: subscription.name,
          scheduledDate: paymentCursor.toISOString(),
          status: subscription.status === 'active' ? 'scheduled' : 'paused',
          amount: convertAmount(subscription.amount, state.selectedCurrency, state.exchangeRates)
        });
        paymentCursor = shiftByCadence(paymentCursor, subscription.cadence);
      }
    });

    return forecast.sort((a, b) => dayjs(a.scheduledDate).valueOf() - dayjs(b.scheduledDate).valueOf());
  },
  convertToSelectedCurrency: (amount) => {
    const state = get();
    return convertAmount(amount, state.selectedCurrency, state.exchangeRates);
  }
}));
