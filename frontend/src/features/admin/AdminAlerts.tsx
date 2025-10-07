import { AlertCircle, AlertOctagon, BellRing } from 'lucide-react';
import clsx from 'classnames';
import dayjs from 'dayjs';
import { useAdminStore } from '@store/adminStore';

const severityConfig = {
  info: {
    icon: BellRing,
    className: 'bg-brand-500/10 text-brand-600',
    label: 'Инфо'
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-amber-500/10 text-amber-600',
    label: 'Внимание'
  },
  critical: {
    icon: AlertOctagon,
    className: 'bg-rose-500/10 text-rose-600',
    label: 'Критично'
  }
} as const;

export const AdminAlerts = () => {
  const alerts = useAdminStore((state) => state.alerts);

  return (
    <section id="settings" className="glass-panel p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Оповещения</p>
          <h2 className="mt-1 text-lg font-semibold">Финансовый контроль</h2>
        </div>
        <button
          type="button"
          className="rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow"
        >
          Настроить правила
        </button>
      </header>
      <ul className="mt-5 space-y-4">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          return (
            <li key={alert.id} className="rounded-3xl border border-white/50 bg-white/60 p-4 dark:bg-slate-900/60">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className={clsx('flex h-10 w-10 items-center justify-center rounded-2xl', config.className)}>
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-500">{config.label}</p>
                    <p className="mt-1 text-sm font-medium text-slate-700 dark:text-slate-200">{alert.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">
                    {dayjs(alert.createdAt).format('DD MMM, HH:mm')}
                  </p>
                  {alert.actionLabel && (
                    <button
                      type="button"
                      className="mt-3 text-xs font-semibold text-brand-600 hover:underline"
                    >
                      {alert.actionLabel}
                    </button>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
};
