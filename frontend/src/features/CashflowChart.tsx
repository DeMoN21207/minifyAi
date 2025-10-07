import type { FC } from 'react';
import { useMemo } from 'react';
import dayjs from 'dayjs';
import { useDashboardStore } from '@store/dashboardStore';

export const CashflowChart: FC = () => {
  const { dailySummaries, selectedMonth } = useDashboardStore((state) => ({
    dailySummaries: state.dailySummaries,
    selectedMonth: state.selectedMonth
  }));

  const { peakValue, peakDate } = useMemo(() => {
    if (dailySummaries.length === 0) {
      return { peakValue: 0, peakDate: '—' };
    }
    const maxEntry = dailySummaries.reduce((acc, current) =>
      current.total.amount > acc.total.amount ? current : acc
    );
    return {
      peakValue: maxEntry.total.amount,
      peakDate: dayjs(maxEntry.date).format('DD MMM')
    };
  }, [dailySummaries]);

  const monthLabel = useMemo(() => dayjs(selectedMonth).format('MMMM YYYY'), [selectedMonth]);

  return (
    <section className="glass-panel col-span-2 flex flex-col justify-between p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Календарь расходов</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Cashflow Heatmap</h2>
        </div>
        <div className="rounded-full bg-brand-500/10 px-4 py-1 text-xs font-semibold text-brand-600">
          Обновлено {dayjs().format('DD MMM, HH:mm')}
        </div>
      </header>
      <div className="mt-6 grid max-h-60 grid-rows-5 gap-2 overflow-hidden">
        <div className="flex items-end gap-2 overflow-x-auto pb-2 scrollbar">
          {dailySummaries.map((summary) => {
            const intensity = peakValue ? summary.total.amount / peakValue : 0;
            return (
              <div key={summary.date} className="flex flex-col items-center gap-2 text-center">
                <div
                  className="flex h-28 w-12 items-end rounded-xl bg-slate-100 p-1 transition-all hover:scale-105 dark:bg-white/10"
                >
                  <div
                    className="w-full rounded-full bg-gradient-to-t from-brand-500 via-brand-400 to-brand-300"
                    style={{ height: `${Math.max(intensity * 100, 8)}%` }}
                  />
                </div>
                <p className="text-[11px] font-medium text-slate-500">
                  {dayjs(summary.date).format('DD')}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <footer className="mt-4 flex items-center justify-between text-sm text-slate-500">
        <span>Пиковый день: {peakDate}</span>
        <span>
          Месяц: {monthLabel}
        </span>
      </footer>
    </section>
  );
};
