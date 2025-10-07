import dayjs from 'dayjs';
import { useMemo } from 'react';
import { useAuthStore } from '@store/authStore';
import { useDashboardStore } from '@store/dashboardStore';
import { formatDate } from '@utils/format';

const roleLabels: Record<string, string> = {
  admin: 'Администратор системы',
  user: 'Пользователь'
};

const getInitials = (name?: string | null) => {
  if (!name) return '??';
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '??';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

export const UserProfileSection = () => {
  const user = useAuthStore((state) => state.user);
  const { selectedMonth, selectedCurrency, transactions, subscriptions, convertToSelectedCurrency } =
    useDashboardStore((state) => ({
      selectedMonth: state.selectedMonth,
      selectedCurrency: state.selectedCurrency,
      transactions: state.transactions,
      subscriptions: state.subscriptions,
      convertToSelectedCurrency: state.convertToSelectedCurrency
    }));

  const month = useMemo(() => dayjs(selectedMonth).format('MMMM YYYY'), [selectedMonth]);
  const stats = useMemo(() => {
    const monthDate = dayjs(selectedMonth);
    const monthlyTransactions = transactions.filter((transaction) =>
      dayjs(transaction.date).isSame(monthDate, 'month')
    );

    const totalIncome = monthlyTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + convertToSelectedCurrency(transaction.amount).amount, 0);
    const totalExpenses = monthlyTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + convertToSelectedCurrency(transaction.amount).amount, 0);

    return {
      income: totalIncome,
      expenses: totalExpenses,
      balance: totalIncome - totalExpenses
    };
  }, [convertToSelectedCurrency, selectedMonth, transactions]);

  const activeSubscriptions = useMemo(
    () => subscriptions.filter((subscription) => subscription.status === 'active'),
    [subscriptions]
  );

  const nextPayment = useMemo(() => {
    if (activeSubscriptions.length === 0) return null;
    return activeSubscriptions
      .slice()
      .sort((a, b) => dayjs(a.nextPaymentDate).valueOf() - dayjs(b.nextPaymentDate).valueOf())[0];
  }, [activeSubscriptions]);

  const formatCurrency = (value: number) =>
    value.toLocaleString('ru-RU', { style: 'currency', currency: selectedCurrency });

  return (
    <section
      id="profile"
      className="glass-panel grid gap-6 p-6 lg:grid-cols-[minmax(0,260px),1fr]"
      aria-labelledby="user-profile-heading"
    >
      <div className="flex flex-col gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-lg font-semibold text-white">
          {getInitials(user?.fullName)}
        </span>
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Профиль</p>
          <h2 id="user-profile-heading" className="text-2xl font-semibold text-slate-900 dark:text-white">
            {user?.fullName ?? 'Неизвестный пользователь'}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{user?.email ?? '—'}</p>
          <span className="inline-flex rounded-full bg-brand-500/10 px-3 py-1 text-xs font-medium text-brand-700 dark:text-brand-200">
            {roleLabels[user?.role ?? 'user']}
          </span>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm dark:border-white/5 dark:bg-slate-900/60">
          <p className="text-xs uppercase tracking-widest text-slate-400">Доходы за {month}</p>
          <p className="mt-2 text-2xl font-semibold text-emerald-600 dark:text-emerald-400">{formatCurrency(stats.income)}</p>
          <p className="mt-1 text-xs text-slate-500">Все поступления, зафиксированные в текущем месяце.</p>
        </article>
        <article className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm dark:border-white/5 dark:bg-slate-900/60">
          <p className="text-xs uppercase tracking-widest text-slate-400">Расходы за {month}</p>
          <p className="mt-2 text-2xl font-semibold text-rose-500">{formatCurrency(stats.expenses)}</p>
          <p className="mt-1 text-xs text-slate-500">Сумма трат по всем категориям за выбранный месяц.</p>
        </article>
        <article className="rounded-2xl border border-dashed border-brand-400 bg-brand-500/10 p-4 shadow-sm dark:border-brand-300/40">
          <p className="text-xs uppercase tracking-widest text-brand-600">Баланс месяца</p>
          <p className="mt-2 text-2xl font-semibold text-brand-700 dark:text-brand-200">{formatCurrency(stats.balance)}</p>
          <p className="mt-1 text-xs text-brand-700/70 dark:text-brand-200/80">
            Разница между доходами и расходами за период.
          </p>
        </article>
        <article className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm dark:border-white/5 dark:bg-slate-900/60">
          <p className="text-xs uppercase tracking-widest text-slate-400">Активные подписки</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{activeSubscriptions.length}</p>
          <p className="mt-1 text-xs text-slate-500">Подписки со статусом «активна».</p>
        </article>
        <article className="rounded-2xl border border-white/40 bg-white/70 p-4 shadow-sm dark:border-white/5 dark:bg-slate-900/60">
          <p className="text-xs uppercase tracking-widest text-slate-400">Ближайшее списание</p>
          {nextPayment ? (
            <div className="mt-2 space-y-1 text-sm text-slate-600 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">{nextPayment.name}</p>
              <p>{formatDate(nextPayment.nextPaymentDate)}</p>
              <p className="text-xs text-slate-400">{formatCurrency(convertToSelectedCurrency(nextPayment.amount).amount)}</p>
            </div>
          ) : (
            <p className="mt-2 text-sm text-slate-500">Нет предстоящих платежей.</p>
          )}
        </article>
      </div>
    </section>
  );
};
