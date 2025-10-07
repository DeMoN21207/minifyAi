import { useMemo } from 'react';
import dayjs from 'dayjs';
import { CalendarClock, Sparkles } from 'lucide-react';
import { useDashboardStore } from '@store/dashboardStore';

export const SubscriptionForecast = () => {
  const { getSubscriptionForecast, selectedCurrency, selectedMonth } = useDashboardStore((state) => ({
    getSubscriptionForecast: state.getSubscriptionForecast,
    selectedCurrency: state.selectedCurrency,
    selectedMonth: state.selectedMonth
  }));

  const forecast = useMemo(() => getSubscriptionForecast(3), [getSubscriptionForecast, selectedMonth, selectedCurrency]);

  return (
    <section className="glass-panel flex flex-col gap-5 p-6">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-500/10 text-brand-600">
            <CalendarClock size={18} />
          </span>
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">Прогноз подписок</p>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{dayjs(selectedMonth).format('MMMM YYYY')} +3 мес</h2>
          </div>
        </div>
        <span className="flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs text-slate-500">
          <Sparkles size={14} />
          {forecast.length} событий
        </span>
      </header>
      <div className="flex flex-col gap-3">
        {forecast.length === 0 && (
          <span className="rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-400">
            Активных подписок не найдено. Добавьте их, чтобы строить прогноз.
          </span>
        )}
        {forecast.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl bg-white/70 px-4 py-3 text-sm text-slate-600 shadow-inner dark:bg-white/5"
          >
            <div>
              <p className="font-semibold text-slate-700 dark:text-slate-100">{item.name}</p>
              <p className="text-xs text-slate-400">{dayjs(item.scheduledDate).format('DD MMMM YYYY')}</p>
            </div>
            <span className="font-semibold text-slate-900 dark:text-white">
              {item.amount.amount.toLocaleString('ru-RU', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              })}{' '}
              {selectedCurrency}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};
