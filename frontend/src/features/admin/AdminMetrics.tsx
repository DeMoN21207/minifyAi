import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import clsx from 'classnames';
import { useAdminStore } from '@store/adminStore';

export const AdminMetrics = () => {
  const metrics = useAdminStore((state) => state.metrics);

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const isPositive = metric.trend >= 0;
        return (
          <article key={metric.id} className="glass-panel p-5">
            <p className="text-xs uppercase tracking-widest text-slate-500">{metric.label}</p>
            <p className="mt-3 text-2xl font-semibold text-slate-900 dark:text-white">
              {metric.value}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span
                className={clsx(
                  'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold',
                  isPositive
                    ? 'bg-emerald-500/10 text-emerald-600'
                    : 'bg-rose-500/10 text-rose-600'
                )}
              >
                {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                {Math.abs(metric.trend).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-500">за 30 дней</span>
            </div>
            <p className="mt-4 text-sm text-slate-500">{metric.description}</p>
          </article>
        );
      })}
    </section>
  );
};
