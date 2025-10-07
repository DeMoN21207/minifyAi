import { useMemo } from 'react';
import { useDashboardStore } from '@store/dashboardStore';

export const CategoryBreakdown = () => {
  const { categorySummaries, selectedCurrency } = useDashboardStore((state) => ({
    categorySummaries: state.categorySummaries,
    selectedCurrency: state.selectedCurrency
  }));

  const total = useMemo(
    () => categorySummaries.reduce((sum, category) => sum + category.total.amount, 0),
    [categorySummaries]
  );

  return (
    <section className="glass-panel flex flex-col gap-5 p-6">
      <header>
        <p className="text-xs uppercase tracking-widest text-slate-500">Категории</p>
        <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Расходы по категориям</h2>
      </header>
      <div className="flex flex-col gap-4">
        {categorySummaries.map((category) => {
          const share = total ? (category.total.amount / total) * 100 : 0;
          return (
            <div key={category.category} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-600 dark:text-slate-200">{category.category}</span>
                <span className="text-slate-500">
                  {category.total.amount.toLocaleString('ru-RU', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })}{' '}
                  {selectedCurrency} · {share.toFixed(1)}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 dark:bg-white/10">
                <div
                  className="h-2 rounded-full bg-gradient-to-r from-brand-500 via-brand-400 to-brand-300"
                  style={{ width: `${share}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
