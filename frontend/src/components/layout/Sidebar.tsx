import { LayoutDashboard, Layers, PieChart, Settings, ShieldCheck, Wallet } from 'lucide-react';
import clsx from 'classnames';
import { NavLink } from 'react-router-dom';

const workspaceNav = [
  { icon: LayoutDashboard, label: 'Личный кабинет', to: '/user' },
  { icon: ShieldCheck, label: 'Админ-панель', to: '/admin' }
];

const productNav = [
  { icon: Wallet, label: 'Операции', to: '/user#transactions' },
  { icon: Layers, label: 'Подписки', to: '/user#subscriptions' },
  { icon: PieChart, label: 'Аналитика', to: '/user#analytics' },
  { icon: Settings, label: 'Настройки', to: '/admin#settings' }
];

export const Sidebar = () => {
  return (
    <aside className="glass-panel hidden lg:flex w-72 flex-col justify-between p-8">
      <div>
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="MinifyAI" className="h-10 w-10" />
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">MinifyAI</p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Finance OS</h1>
          </div>
        </div>
        <div className="mt-10 space-y-6">
          <nav className="flex flex-col gap-2">
            <p className="px-4 text-xs uppercase tracking-widest text-slate-400">Рабочие области</p>
            {workspaceNav.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all',
                    isActive
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200'
                      : 'text-slate-500 hover:bg-slate-100/60 dark:hover:bg-white/5'
                  )
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <Icon size={18} />
                </span>
                {label}
              </NavLink>
            ))}
          </nav>
          <nav className="flex flex-col gap-2">
            <p className="px-4 text-xs uppercase tracking-widest text-slate-400">Продукт</p>
            {productNav.map(({ icon: Icon, label, to }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  clsx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all',
                    isActive
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200'
                      : 'text-slate-500 hover:bg-slate-100/60 dark:hover:bg-white/5'
                  )
                }
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <Icon size={18} />
                </span>
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
      <div className="rounded-2xl bg-gradient-to-br from-brand-500 to-brand-400 p-5 text-white">
        <p className="text-xs uppercase tracking-widest text-white/70">Версия</p>
        <p className="mt-1 text-2xl font-semibold">{__APP_VERSION__}</p>
      </div>
    </aside>
  );
};
