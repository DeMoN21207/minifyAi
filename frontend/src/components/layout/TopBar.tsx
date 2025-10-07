import { Bell, ChevronDown, Menu, Moon, Search, Sun } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

const routeMeta: Record<
  string,
  {
    title: string;
    subtitle: string;
  }
> = {
  '/user': {
    title: 'Личный кабинет',
    subtitle: 'Контролируйте личные финансы, подписки и аналитику.'
  },
  '/admin': {
    title: 'Админ-панель',
    subtitle: 'Настраивайте команды, следите за метриками и безопасностью.'
  }
};

export const TopBar = () => {
  const location = useLocation();
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );

  const meta = useMemo(() => {
    const basePath = location.pathname.replace(/\/$/, '') || '/';
    return routeMeta[basePath] ?? {
      title: 'MinifyAI',
      subtitle: 'Финансовая осведомлённость и контроль расходов.'
    };
  }, [location.pathname]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <header className="glass-panel flex items-center justify-between gap-4 px-4 py-3 md:px-6">
      <div className="flex flex-1 items-center gap-4">
        <button className="lg:hidden" type="button" aria-label="Меню">
          <Menu className="text-slate-500" />
        </button>
        <div className="hidden md:flex flex-col">
          <h2 className="text-base font-semibold text-slate-900 dark:text-white">{meta.title}</h2>
          <p className="text-xs text-slate-500">{meta.subtitle}</p>
        </div>
        <div className="hidden md:flex items-center gap-3 rounded-full bg-white/80 px-4 py-2 shadow-inner">
          <Search size={16} className="text-brand-500" />
          <input
            type="search"
            placeholder="Поиск по операциям, мерчантам, тегам..."
            className="w-72 border-none bg-transparent text-sm focus:outline-none"
          />
        </div>
      </div>
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow"
          onClick={() => setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))}
          aria-label="Переключить тему"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </button>
        <button className="flex h-10 w-10 items-center justify-center rounded-full bg-white/70 shadow" type="button">
          <Bell size={18} />
        </button>
        <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1">
          <span className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
          <div className="text-left">
            <p className="text-xs text-slate-500">Анна Иванова</p>
            <p className="text-sm font-semibold">Product Lead</p>
          </div>
          <ChevronDown size={16} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
};
