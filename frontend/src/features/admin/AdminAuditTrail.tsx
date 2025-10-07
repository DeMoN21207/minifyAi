import { Activity } from 'lucide-react';
import dayjs from 'dayjs';
import { useAdminStore } from '@store/adminStore';

export const AdminAuditTrail = () => {
  const auditLog = useAdminStore((state) => state.auditLog);

  return (
    <section className="glass-panel p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Аудит</p>
          <h2 className="mt-1 text-lg font-semibold">Журнал активности</h2>
        </div>
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-600 shadow"
        >
          <Activity size={16} /> Экспорт CSV
        </button>
      </header>
      <ul className="mt-6 space-y-4">
        {auditLog.map((entry) => (
          <li key={entry.id} className="flex items-start justify-between gap-4 rounded-3xl border border-white/40 bg-white/60 p-4 dark:bg-slate-900/60">
            <div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                {entry.actor}{' '}
                <span className="font-normal text-slate-500">{entry.action}</span>
              </p>
              <p className="mt-1 text-xs text-slate-500">{entry.target}</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>{dayjs(entry.timestamp).format('DD MMM, HH:mm')}</p>
              <p className="mt-1 uppercase tracking-widest">{entry.channel}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};
