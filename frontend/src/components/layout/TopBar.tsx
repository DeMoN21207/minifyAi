import { Bell, ChevronDown, LogOut, Menu, Moon, Search, Sun, UserCircle } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@store/authStore';

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
  '/product/operations': {
    title: 'Операции',
    subtitle: 'Управляйте платежами и контролируйте денежные потоки компании.'
  },
  '/product/subscriptions': {
    title: 'Подписки',
    subtitle: 'Отслеживайте SaaS-расходы и продления сервисов.'
  },
  '/product/analytics': {
    title: 'Аналитика',
    subtitle: 'Получайте визуальные отчёты и следите за ключевыми метриками.'
  },
  '/product/settings': {
    title: 'Настройки',
    subtitle: 'Управляйте безопасностью, ролями и интеграциями платформы.'
  },
  '/admin': {
    title: 'Админ-панель',
    subtitle: 'Настраивайте команды, следите за метриками и безопасностью.'
  }
};

export const TopBar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const [theme, setTheme] = useState<'light' | 'dark'>(() =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    if (!isMenuOpen) return;
    const handleClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    window.addEventListener('mousedown', handleClick);
    return () => {
      window.removeEventListener('mousedown', handleClick);
    };
  }, [isMenuOpen]);

  const roleLabel = user?.role === 'admin' ? 'Администратор' : 'Пользователь';

  const handleProfileNavigate = () => {
    setIsMenuOpen(false);
    const target = user?.role === 'admin' ? '/admin' : '/user#profile';
    navigate(target);
  };

  const handleLogout = () => {
    setIsMenuOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

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
        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-left shadow"
            aria-haspopup="menu"
            aria-expanded={isMenuOpen}
          >
            <span className="h-8 w-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
            <div className="text-left">
              <p className="text-xs text-slate-500">{user?.fullName ?? 'Профиль'}</p>
              <p className="text-sm font-semibold capitalize">{roleLabel}</p>
            </div>
            <ChevronDown size={16} className="text-slate-400" />
          </button>
          {isMenuOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 rounded-2xl bg-white p-3 shadow-xl ring-1 ring-black/5"
            >
              <button
                type="button"
                onClick={handleProfileNavigate}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
                role="menuitem"
              >
                <UserCircle size={18} /> Профиль
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-red-500 hover:bg-red-50"
                role="menuitem"
              >
                <LogOut size={18} /> Выйти
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
