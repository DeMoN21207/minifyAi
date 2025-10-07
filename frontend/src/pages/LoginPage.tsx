import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import type { Location } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuthStore, selectIsAuthenticated } from '@store/authStore';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAuthenticated = useAuthStore(selectIsAuthenticated);
  const login = useAuthStore((state) => state.login);
  const status = useAuthStore((state) => state.status);
  const error = useAuthStore((state) => state.error);
  const user = useAuthStore((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated && user) {
      const redirectTo =
        (location.state as { from?: Location } | null)?.from?.pathname ??
        (user.role === 'admin' ? '/admin' : '/user');
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location.state]);

  if (isAuthenticated && user) {
    return <Navigate to={user.role === 'admin' ? '/admin' : '/user'} replace />;
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormError(null);
    try {
      const authUser = await login({ email, password });
      const redirectTo = (authUser.role === 'admin' ? '/admin' : '/user') as const;
      navigate(redirectTo, { replace: true });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Не удалось выполнить вход';
      setFormError(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-900/5 p-4">
      <form
        onSubmit={handleSubmit}
        className="glass-panel flex w-full max-w-md flex-col gap-6 rounded-3xl p-8"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
            <LogIn size={24} />
          </span>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Войти в MinifyAI</h1>
            <p className="text-sm text-slate-500">
              Управляйте финансами и аналитикой в едином рабочем пространстве.
            </p>
          </div>
        </div>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-widest text-slate-400">E-mail</span>
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase tracking-widest text-slate-400">Пароль</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            minLength={8}
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
            placeholder="********"
            autoComplete="current-password"
          />
        </label>
        {(formError || error) && (
          <div className="rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">
            {formError ?? error}
          </div>
        )}
        <button
          type="submit"
          className="rounded-full bg-brand-500 px-4 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-60"
          disabled={status === 'loading'}
        >
          {status === 'loading' ? 'Выполняем вход...' : 'Продолжить'}
        </button>
        <p className="text-center text-xs text-slate-400">
          Доступ к админ-панели автоматически открывается для пользователей с ролью «admin».
        </p>
      </form>
    </div>
  );
};
