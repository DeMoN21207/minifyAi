import { useMemo } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Sparkles, Wallet } from 'lucide-react';
import dayjs from 'dayjs';
import { useDashboardStore } from '@store/dashboardStore';

export const OverviewCards = () => {
  const { transactions, subscriptions, convertToSelectedCurrency, selectedCurrency, chatHistory, selectedMonth } =
    useDashboardStore((state) => ({
      transactions: state.transactions,
      subscriptions: state.subscriptions,
      convertToSelectedCurrency: state.convertToSelectedCurrency,
      selectedCurrency: state.selectedCurrency,
      chatHistory: state.chatHistory,
      selectedMonth: state.selectedMonth
    }));

  const { incomeTotal, expenseTotal } = useMemo(() => {
    return transactions.reduce(
      (acc, transaction) => {
        const amount = convertToSelectedCurrency(transaction.amount).amount;
        if (transaction.type === 'income') {
          acc.incomeTotal += amount;
        } else if (transaction.type === 'expense') {
          acc.expenseTotal += amount;
        }
        return acc;
      },
      { incomeTotal: 0, expenseTotal: 0 }
    );
  }, [transactions, convertToSelectedCurrency, selectedCurrency]);

  const subscriptionTotalConverted = useMemo(() => {
    const month = dayjs(selectedMonth);
    return subscriptions
      .filter((subscription) => subscription.status === 'active')
      .filter((subscription) => dayjs(subscription.nextPaymentDate).isSame(month, 'month'))
      .reduce((sum, subscription) => sum + convertToSelectedCurrency(subscription.amount).amount, 0);
  }, [subscriptions, convertToSelectedCurrency, selectedMonth, selectedCurrency]);

  const formatter = useMemo(() => new Intl.NumberFormat('ru-RU', { minimumFractionDigits: 0, maximumFractionDigits: 0 }), []);

  const assistantInsights = chatHistory.filter((message) => message.role === 'assistant').length;

  const stats = [
    {
      icon: Wallet,
      title: 'Баланс месяца',
      value: `${formatter.format(incomeTotal - (expenseTotal + subscriptionTotalConverted))} ${selectedCurrency}`,
      delta: 'На основе ручных операций и подписок'
    },
    {
      icon: ArrowUpCircle,
      title: 'Доходы',
      value: `${formatter.format(incomeTotal)} ${selectedCurrency}`,
      delta: 'Включает авансы и регулярные поступления'
    },
    {
      icon: ArrowDownCircle,
      title: 'Расходы',
      value: `${formatter.format(expenseTotal + subscriptionTotalConverted)} ${selectedCurrency}`,
      delta: 'С учётом предстоящих подписок'
    },
    {
      icon: Sparkles,
      title: 'AI рекомендации',
      value: `${assistantInsights} инсайт(ов)`,
      delta: 'Генерируются на основе истории транзакций'
    }
  ];

  return (
    <section className="card-grid">
      {stats.map(({ icon: Icon, title, value, delta }) => (
        <article
          key={title}
          className="glass-panel relative overflow-hidden px-6 py-6 transition-transform hover:-translate-y-1"
        >
          <span className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-brand-500/10" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
            <Icon size={20} />
          </div>
          <h3 className="mt-4 text-sm font-medium text-slate-500">{title}</h3>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{value}</p>
          <p className="mt-3 text-sm text-brand-600 dark:text-brand-300">{delta}</p>
        </article>
      ))}
    </section>
  );
};
