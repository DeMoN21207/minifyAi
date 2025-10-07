import { LayoutDashboard, Layers, PieChart, Settings, Wallet } from 'lucide-react';
import clsx from 'classnames';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';
import type { UserRole } from '@types/index';

interface NavItem {
  icon: typeof LayoutDashboard;
  label: string;
  to: string;
  roles: UserRole[];
}

const productNav: NavItem[] = [
  { icon: LayoutDashboard, label: 'Обзор', to: '/user', roles: ['user', 'admin'] },
  { icon: Wallet, label: 'Операции', to: '/product/operations', roles: ['user', 'admin'] },
  { icon: Layers, label: 'Подписки', to: '/product/subscriptions', roles: ['user', 'admin'] },
  { icon: PieChart, label: 'Аналитика', to: '/product/analytics', roles: ['user', 'admin'] },
  { icon: Settings, label: 'Настройки', to: '/product/settings', roles: ['admin'] }
];

export const Sidebar = () => {
  const role = useAuthStore((state) => state.user?.role ?? 'user');
  const location = useLocation();
  const homePath = role === 'admin' ? '/admin' : '/user';

  const normalizePath = (path: string) => path.replace(/\/$/, '') || '/';

  const isNavItemActive = (target: string) => {
    const [rawPath, rawHash] = target.split('#');
    const targetPath = normalizePath(rawPath);
    const currentPath = normalizePath(location.pathname);
    if (targetPath !== currentPath) {
      return false;
    }
    if (!rawHash) {
      return true;
    }
    const targetHash = `#${rawHash}`;
    return location.hash === targetHash;
  };

  const filterByRole = (items: NavItem[]) => items.filter((item) => item.roles.includes(role));

  return (
    <aside className="glass-panel hidden lg:flex w-72 flex-col justify-between p-8">
      <div>
        <Link
          to={homePath}
          className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-500"
        >
          <img src="/logo.svg" alt="MinifyAI" className="h-10 w-10" />
          <div>
            <p className="text-xs uppercase tracking-widest text-slate-500">MinifyAI</p>
            <h1 className="text-lg font-semibold text-slate-900 dark:text-white">Finance OS</h1>
          </div>
        </Link>
        <div className="mt-10">
          <nav className="flex flex-col gap-2">
            <p className="px-4 text-xs uppercase tracking-widest text-slate-400">Продукт</p>
            {filterByRole(productNav).map(({ icon: Icon, label, to }) => {
              const active = isNavItemActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  className={clsx(
                    'flex items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-medium transition-all',
                    active
                      ? 'bg-brand-500/10 text-brand-700 dark:text-brand-200'
                      : 'text-slate-500 hover:bg-slate-100/60 dark:hover:bg-white/5'
                  )}
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                    <Icon size={18} />
                  </span>
                  {label}
                </Link>
              );
            })}
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
