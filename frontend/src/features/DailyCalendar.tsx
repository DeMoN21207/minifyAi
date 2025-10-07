import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { useDashboardStore } from '@store/dashboardStore';

export const DailyCalendar = () => {
  const { dailySummaries, transactions, subscriptions, selectedCurrency, convertToSelectedCurrency } =
    useDashboardStore((state) => ({
      dailySummaries: state.dailySummaries,
      transactions: state.transactions,
      subscriptions: state.subscriptions,
      selectedCurrency: state.selectedCurrency,
      convertToSelectedCurrency: state.convertToSelectedCurrency
    }));

  const [activeDate, setActiveDate] = useState(() => dayjs().format('YYYY-MM-DD'));

  const daySummaries = dailySummaries;

  const selectedSummary = useMemo(
    () => daySummaries.find((summary) => dayjs(summary.date).isSame(activeDate, 'day')),
    [daySummaries, activeDate]
  );

  const details = useMemo(() => {
    const date = dayjs(activeDate);
    const dayTransactions = transactions
      .filter((transaction) => dayjs(transaction.date).isSame(date, 'day'))
      .map((transaction) => ({
        id: transaction.id,
        title: transaction.description,
        amount: convertToSelectedCurrency(transaction.amount).amount,
        type: transaction.type,
        source: transaction.merchant ?? '—'
      }));

    const daySubscriptions = subscriptions
      .filter((subscription) => subscription.status === 'active')
      .filter((subscription) => dayjs(subscription.nextPaymentDate).isSame(date, 'day'))
      .map((subscription) => ({
        id: subscription.id,
        title: `Подписка · ${subscription.name}`,
        amount: convertToSelectedCurrency(subscription.amount).amount,
        type: 'expense' as const,
        source: subscription.merchant ?? 'подписка'
      }));

    return [...dayTransactions, ...daySubscriptions];
  }, [transactions, subscriptions, convertToSelectedCurrency, activeDate, selectedCurrency]);

  return (
    <section className="glass-panel flex flex-col gap-5 p-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-slate-500">Календарь</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Ближайшие дни</h2>
      </header>
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar">
        {daySummaries.map((day) => {
          const amount = day.total.amount.toLocaleString('ru-RU', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
          });
          const isActive = dayjs(day.date).isSame(activeDate, 'day');
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setActiveDate(dayjs(day.date).format('YYYY-MM-DD'))}
              className={`flex min-w-[160px] flex-col gap-2 rounded-2xl border px-4 py-3 text-left transition ${
                isActive
                  ? 'border-transparent bg-slate-900 text-white shadow-lg'
                  : 'border-transparent bg-white/70 text-slate-600 hover:bg-white shadow'
              }`}
            >
              <span className="text-xs uppercase text-slate-400">
                {dayjs(day.date).format('ddd').toUpperCase()}
              </span>
              <span className="text-lg font-semibold">
                {dayjs(day.date).format('DD MMM')}
              </span>
              <span className="text-sm font-medium">
                {amount} {selectedCurrency}
              </span>
            </button>
          );
        })}
      </div>
      <div className="rounded-2xl bg-white/70 p-5 shadow-inner dark:bg-white/5">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
              {dayjs(activeDate).format('DD MMMM, dddd')}
            </h3>
            <p className="text-sm text-slate-500">
              Запланированные операции и подписки на выбранный день
            </p>
          </div>
          <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600">
            Итого:{' '}
            {selectedSummary?.total.amount.toLocaleString('ru-RU', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 0
            })}{' '}
            {selectedCurrency}
          </span>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          {details.length === 0 && (
            <span className="rounded-xl bg-white/60 px-4 py-3 text-sm text-slate-400">
              На эту дату пока нет операций. Добавьте их в форме выше.
            </span>
          )}
          {details.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-xl bg-white/80 px-4 py-3 text-sm text-slate-600 shadow"
            >
              <div>
                <p className="font-semibold text-slate-700 dark:text-slate-100">{item.title}</p>
                <p className="text-xs uppercase text-slate-400">{item.source}</p>
              </div>
              <span
                className={`font-semibold ${
                  item.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'
                }`}
              >
                {item.type === 'income' ? '+' : '-'}
                {item.amount.toLocaleString('ru-RU', {
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0
                })}{' '}
                {selectedCurrency}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
