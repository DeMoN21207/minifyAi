import { TrendingUp } from 'lucide-react';
import clsx from 'classnames';
import { useAdminStore } from '@store/adminStore';

export const PlanPerformance = () => {
  const planInsights = useAdminStore((state) => state.planInsights);

  return (
    <section className="glass-panel p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Планы</p>
          <h2 className="mt-1 text-lg font-semibold">Динамика подписок</h2>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow-lg"
        >
          <TrendingUp size={16} /> Построить прогноз
        </button>
      </header>
      <div className="mt-6 space-y-3">
        {planInsights.map((plan) => (
          <article
            key={plan.id}
            className="flex items-center justify-between gap-4 rounded-3xl border border-white/40 bg-white/60 p-4 dark:bg-slate-900/60"
          >
            <div>
              <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">{plan.plan}</h3>
              <p className="mt-1 text-xs uppercase tracking-widest text-slate-500">
                {plan.customers} клиентов • ARPA ₽ {plan.arpa.toLocaleString('ru-RU')}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Отток: {plan.churnRate}%</p>
              <span
                className={clsx(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                  plan.trend >= 0 ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                )}
              >
                Δ {plan.trend.toFixed(1)}% к прошлому месяцу
              </span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};
