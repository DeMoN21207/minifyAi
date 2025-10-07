import { ShieldCheck, UserMinus, UserPlus } from 'lucide-react';
import clsx from 'classnames';
import dayjs from 'dayjs';
import { useAdminStore } from '@store/adminStore';

const statusConfig = {
  active: 'bg-emerald-500/10 text-emerald-600',
  invited: 'bg-amber-500/10 text-amber-600',
  blocked: 'bg-rose-500/10 text-rose-600'
} as const;

const roleLabel = {
  owner: 'Владелец',
  admin: 'Администратор',
  analyst: 'Аналитик',
  member: 'Участник'
} as const;

export const AdminUserTable = () => {
  const { accounts, setAccountStatus } = useAdminStore((state) => ({
    accounts: state.accounts,
    setAccountStatus: state.setAccountStatus
  }));

  return (
    <section className="glass-panel overflow-hidden">
      <header className="flex items-center justify-between border-b border-white/50 px-6 py-4">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Команды</p>
          <h2 className="mt-1 text-lg font-semibold">Управление доступом</h2>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-2 text-xs font-semibold text-brand-600">
          <ShieldCheck size={16} /> 2FA включена у 86%
        </span>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto divide-y divide-white/40 text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3">Участник</th>
              <th className="px-6 py-3">Роль</th>
              <th className="px-6 py-3">Статус</th>
              <th className="px-6 py-3">MRR</th>
              <th className="px-6 py-3">Активность</th>
              <th className="px-6 py-3 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/40">
            {accounts.map((account) => (
              <tr key={account.id} className="text-slate-700 dark:text-slate-200">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="h-10 w-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600" />
                    <div>
                      <p className="font-semibold">{account.name}</p>
                      <p className="text-xs text-slate-500">{account.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-500">{roleLabel[account.role]}</td>
                <td className="px-6 py-4">
                  <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', statusConfig[account.status])}>
                    {account.status === 'active'
                      ? 'Активен'
                      : account.status === 'invited'
                      ? 'Приглашён'
                      : 'Заблокирован'}
                  </span>
                </td>
                <td className="px-6 py-4 font-mono text-sm">₽ {account.mrr.toLocaleString('ru-RU')}</td>
                <td className="px-6 py-4 text-slate-500">
                  {dayjs(account.lastActiveAt).format('DD MMM YYYY, HH:mm')}
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setAccountStatus(account.id, account.status === 'blocked' ? 'active' : 'blocked')}
                      className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow"
                    >
                      {account.status === 'blocked' ? (
                        <>
                          <UserPlus size={14} /> Разблокировать
                        </>
                      ) : (
                        <>
                          <UserMinus size={14} /> Заблокировать
                        </>
                      )}
                    </button>
                    {account.status !== 'invited' && (
                      <button
                        type="button"
                        onClick={() => setAccountStatus(account.id, 'invited')}
                        className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-600 shadow"
                      >
                        Пригласить снова
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
