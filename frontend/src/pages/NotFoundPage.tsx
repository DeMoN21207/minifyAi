import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore, selectIsAuthenticated } from '@store/authStore';

export const NotFoundPage = () => {
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const role = useAuthStore((state) => state.user?.role ?? 'user');

  const homePath = useMemo(() => {
    if (!isAuthenticated) {
      return '/login';
    }
    return role === 'admin' ? '/admin' : '/user';
  }, [isAuthenticated, role]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-16 text-center dark:bg-slate-900">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand-500">404</p>
      <h1 className="mt-4 text-4xl font-bold text-slate-900 dark:text-white sm:text-5xl">Страница не найдена</h1>
      <p className="mt-3 max-w-xl text-base text-slate-500 dark:text-slate-400">
        К сожалению, страница, которую вы ищете, была удалена, переименована или временно недоступна.
      </p>
      <Link
        to={homePath}
        className="mt-8 inline-flex items-center rounded-full bg-brand-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-brand-600"
        replace
      >
        Вернуться на главную
      </Link>
    </div>
  );
};
