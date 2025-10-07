import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { BadgeCheck, Eye, LockReset, Plus, Save, Trash2, UserPlus, X } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ru';
import clsx from 'classnames';
import { useSettingsStore } from '@store/settingsStore';
import type { ManagedUser, RoleDefinition } from '@types/index';

dayjs.extend(relativeTime);
dayjs.locale('ru');

type UserFormState = {
  fullName: string;
  email: string;
  username: string;
  roleId: string;
  status: ManagedUser['status'];
  phone?: string;
  department?: string;
  requirePasswordReset: boolean;
  password: string;
  confirmPassword: string;
};

const statusLabel: Record<ManagedUser['status'], string> = {
  active: 'Активен',
  pending: 'Ожидает входа',
  suspended: 'Заблокирован'
};

const statusStyles: Record<ManagedUser['status'], string> = {
  active: 'bg-emerald-500/10 text-emerald-600',
  pending: 'bg-amber-500/10 text-amber-600',
  suspended: 'bg-rose-500/10 text-rose-600'
};

const createInitialUserForm = (roleId: string): UserFormState => ({
  fullName: '',
  email: '',
  username: '',
  roleId,
  status: 'pending',
  phone: '',
  department: '',
  requirePasswordReset: true,
  password: '',
  confirmPassword: ''
});

interface UserDetailsCardProps {
  user: ManagedUser;
  roles: RoleDefinition[];
  onClose: () => void;
  onUpdate: (userId: string, input: Partial<UserFormState> & { password?: string }) => void;
  onDelete: (userId: string) => void;
  onResetPassword: (userId: string) => string;
}

const UserDetailsCard = ({ user, roles, onClose, onUpdate, onDelete, onResetPassword }: UserDetailsCardProps) => {
  const [formState, setFormState] = useState<UserFormState>(() => ({
    fullName: user.fullName,
    email: user.email,
    username: user.username,
    roleId: user.roleId,
    status: user.status,
    phone: user.phone,
    department: user.department,
    requirePasswordReset: user.requirePasswordReset,
    password: '',
    confirmPassword: ''
  }));
  const [feedback, setFeedback] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);

  useEffect(() => {
    setFormState({
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      roleId: user.roleId,
      status: user.status,
      phone: user.phone,
      department: user.department,
      requirePasswordReset: user.requirePasswordReset,
      password: '',
      confirmPassword: ''
    });
    setFeedback(null);
    setPasswordMessage(null);
  }, [user]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (formState.password && formState.password !== formState.confirmPassword) {
      setFeedback('Пароли не совпадают.');
      return;
    }

    const { password, confirmPassword, ...rest } = formState;

    onUpdate(user.id, {
      ...rest,
      password: password || undefined
    });
    setFeedback('Данные пользователя сохранены.');
    if (formState.password) {
      setPasswordMessage(`Пароль обновлён и будет запрошен при следующем входе.`);
    }
    setFormState((prev) => ({ ...prev, password: '', confirmPassword: '' }));
  };

  const handleResetPassword = () => {
    const password = onResetPassword(user.id);
    setPasswordMessage(`Сгенерирован временный пароль: ${password}`);
    setFeedback('Пользователь должен сменить пароль при следующем входе.');
  };

  return (
    <aside className="rounded-3xl bg-white/80 p-6 shadow-xl ring-1 ring-black/5 dark:bg-slate-900/70">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{user.fullName}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-300">{user.email}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
            <span className={clsx('rounded-full px-3 py-1 font-semibold', statusStyles[user.status])}>
              {statusLabel[user.status]}
            </span>
            <span className="rounded-full bg-white/70 px-3 py-1 font-semibold text-slate-500 shadow dark:bg-white/10 dark:text-slate-200">
              Логин: {user.username}
            </span>
            <span className="rounded-full bg-brand-500/10 px-3 py-1 font-semibold text-brand-600">
              Роль: {roles.find((role) => role.id === user.roleId)?.name ?? '—'}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-2 text-xs font-semibold text-slate-500 shadow transition hover:bg-white/90 dark:bg-white/10 dark:text-slate-200"
        >
          <X size={14} /> Закрыть
        </button>
      </header>
      <dl className="mt-4 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs uppercase tracking-widest text-slate-400">Создан</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-200">{dayjs(user.createdAt).format('DD MMMM YYYY, HH:mm')}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-slate-400">Последний вход</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-200">
            {user.lastLoginAt ? dayjs(user.lastLoginAt).format('DD MMMM YYYY, HH:mm') : 'Ещё не входил'}
          </dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-slate-400">Команда</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-200">{user.department ?? 'Не указано'}</dd>
        </div>
        <div>
          <dt className="text-xs uppercase tracking-widest text-slate-400">Последнее обновление пароля</dt>
          <dd className="mt-1 text-slate-600 dark:text-slate-200">
            {dayjs(user.passwordUpdatedAt).format('DD MMMM YYYY, HH:mm')}
          </dd>
        </div>
      </dl>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">ФИО</span>
            <input
              type="text"
              value={formState.fullName}
              onChange={(event) => setFormState((prev) => ({ ...prev, fullName: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Email</span>
            <input
              type="email"
              value={formState.email}
              onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Логин</span>
            <input
              type="text"
              value={formState.username}
              onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Телефон</span>
            <input
              type="tel"
              value={formState.phone ?? ''}
              onChange={(event) => setFormState((prev) => ({ ...prev, phone: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              placeholder="Например, +7 (999) 123-45-67"
            />
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Департамент</span>
            <input
              type="text"
              value={formState.department ?? ''}
              onChange={(event) => setFormState((prev) => ({ ...prev, department: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              placeholder="Например, Финансы"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Роль</span>
            <select
              value={formState.roleId}
              onChange={(event) => setFormState((prev) => ({ ...prev, roleId: event.target.value }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Статус</span>
            <select
              value={formState.status}
              onChange={(event) => setFormState((prev) => ({ ...prev, status: event.target.value as ManagedUser['status'] }))}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
            >
              {Object.entries(statusLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-3 rounded-2xl border border-dashed border-slate-200 bg-white/60 px-4 py-3 text-sm text-slate-600 shadow-inner dark:border-white/10 dark:bg-white/10 dark:text-slate-200">
            <input
              type="checkbox"
              checked={formState.requirePasswordReset}
              onChange={(event) => setFormState((prev) => ({ ...prev, requirePasswordReset: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            Требовать смену пароля при следующем входе
          </label>
        </div>
        <fieldset className="grid gap-4 rounded-2xl border border-white/70 bg-white/50 p-4 shadow-inner dark:border-white/10 dark:bg-white/10">
          <legend className="px-2 text-xs uppercase tracking-widest text-slate-500">Смена пароля</legend>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Новый пароль</span>
              <input
                type="password"
                value={formState.password}
                onChange={(event) => setFormState((prev) => ({ ...prev, password: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Повторите пароль</span>
              <input
                type="password"
                value={formState.confirmPassword}
                onChange={(event) => setFormState((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
          </div>
          <div className="flex flex-col gap-2 text-xs text-slate-500">
            <span>Оставьте поле пустым, если менять пароль не требуется.</span>
            {passwordMessage && <span className="font-medium text-brand-600">{passwordMessage}</span>}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={handleResetPassword}
              className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow transition hover:bg-white/90 dark:bg-white/10 dark:text-slate-200"
            >
              <LockReset size={16} /> Сгенерировать временный пароль
            </button>
            {user.temporaryPassword && (
              <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600">
                <BadgeCheck size={14} /> {user.temporaryPassword}
              </span>
            )}
          </div>
        </fieldset>
        {feedback && <div className="rounded-2xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">{feedback}</div>}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              <Save size={16} /> Сохранить изменения
            </button>
            <button
              type="button"
              onClick={() => onDelete(user.id)}
              className="inline-flex items-center gap-2 rounded-full bg-rose-500/10 px-4 py-2 text-sm font-semibold text-rose-600 shadow transition hover:bg-rose-500/20"
            >
              <Trash2 size={16} /> Удалить пользователя
            </button>
          </div>
          <p className="text-xs text-slate-400">Последнее изменение: {dayjs(user.passwordUpdatedAt).format('DD.MM.YYYY HH:mm')}</p>
        </div>
      </form>
    </aside>
  );
};

export const UserManagementTable = () => {
  const { roles, users, createUser, updateUser, deleteUser, resetUserPassword } = useSettingsStore((state) => ({
    roles: state.roles,
    users: state.users,
    createUser: state.createUser,
    updateUser: state.updateUser,
    deleteUser: state.deleteUser,
    resetUserPassword: state.resetUserPassword
  }));

  const [search, setSearch] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const defaultRoleId = useMemo(() => roles.find((role) => role.isDefault)?.id ?? roles[0]?.id ?? '', [roles]);
  const [createForm, setCreateForm] = useState<UserFormState>(() => createInitialUserForm(defaultRoleId));
  const [creationFeedback, setCreationFeedback] = useState<string | null>(null);

  useEffect(() => {
    setCreateForm((prev) => ({ ...prev, roleId: prev.roleId || defaultRoleId }));
  }, [defaultRoleId]);

  const roleDictionary = useMemo(() => {
    return roles.reduce<Record<string, RoleDefinition>>((acc, role) => {
      acc[role.id] = role;
      return acc;
    }, {} as Record<string, RoleDefinition>);
  }, [roles]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter((user) => {
      const haystack = [user.fullName, user.email, user.username, roleDictionary[user.roleId]?.name ?? '']
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [users, search, roleDictionary]);

  const handleCreateUser = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!createForm.fullName.trim() || !createForm.email.trim()) {
      setCreationFeedback('Укажите как минимум имя и email.');
      return;
    }
    const user = createUser({
      fullName: createForm.fullName.trim(),
      email: createForm.email.trim(),
      username: createForm.username?.trim() || createForm.email.trim(),
      roleId: createForm.roleId,
      status: createForm.status,
      phone: createForm.phone,
      department: createForm.department
    });
    setCreationFeedback(`Пользователь «${user.fullName}» приглашён. Пароль будет задан при первом входе.`);
    setCreateForm(createInitialUserForm(defaultRoleId));
    setShowCreate(false);
  };

  const handleSelectUser = (userId: string) => {
    setSelectedUserId(userId);
    setShowCreate(false);
  };

  const selectedUser = selectedUserId ? users.find((user) => user.id === selectedUserId) ?? null : null;

  return (
    <section className="glass-panel space-y-6 p-6">
      <header className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Пользователи</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Управление доступами сотрудников</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Отслеживайте активность, контролируйте роли и обновляйте учетные данные без выхода из раздела.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 shadow dark:bg-white/10">
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Поиск по имени, email или роли"
              className="w-48 bg-transparent text-sm text-slate-600 focus:outline-none dark:text-slate-100"
            />
            <Eye size={16} className="text-slate-400" />
          </div>
          <button
            type="button"
            onClick={() => {
              setShowCreate((prev) => !prev);
              setSelectedUserId(null);
              setCreationFeedback(null);
            }}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-400"
          >
            <UserPlus size={16} /> Добавить пользователя
          </button>
        </div>
      </header>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/40 text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="py-3 pr-4">Сотрудник</th>
              <th className="py-3 pr-4">Роль</th>
              <th className="py-3 pr-4">Статус</th>
              <th className="py-3 pr-4">Последний вход</th>
              <th className="py-3 pr-4">Команда</th>
              <th className="py-3 pl-4 text-right">Действия</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="transition hover:bg-white/40 dark:hover:bg-white/5">
                <td className="py-4 pr-4">
                  <p className="font-semibold text-slate-900 dark:text-white">{user.fullName}</p>
                  <p className="text-xs text-slate-500">{user.email}</p>
                </td>
                <td className="py-4 pr-4 text-slate-600">{roleDictionary[user.roleId]?.name ?? '—'}</td>
                <td className="py-4 pr-4">
                  <span className={clsx('rounded-full px-3 py-1 text-xs font-semibold', statusStyles[user.status])}>
                    {statusLabel[user.status]}
                  </span>
                </td>
                <td className="py-4 pr-4 text-slate-500">
                  {user.lastLoginAt ? dayjs(user.lastLoginAt).fromNow() : 'Ещё не входил'}
                </td>
                <td className="py-4 pr-4 text-slate-500">{user.department ?? '—'}</td>
                <td className="py-4 pl-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => handleSelectUser(user.id)}
                      className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow transition hover:bg-white/90 dark:bg-white/10 dark:text-slate-200"
                    >
                      <Eye size={14} /> Подробнее
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        resetUserPassword(user.id);
                        setSelectedUserId(user.id);
                      }}
                      className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-brand-600 shadow transition hover:bg-white/80 dark:bg-white/10"
                    >
                      <LockReset size={14} /> Сбросить пароль
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredUsers.length === 0 && (
              <tr>
                <td colSpan={6} className="py-6 text-center text-sm text-slate-500">
                  Пользователи не найдены. Измените параметры поиска или добавьте нового участника.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {showCreate && (
        <form className="space-y-4 rounded-3xl bg-white/70 p-6 shadow-inner dark:bg-white/5" onSubmit={handleCreateUser}>
          <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">Пригласить нового пользователя</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">ФИО</span>
              <input
                type="text"
                value={createForm.fullName}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, fullName: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Email</span>
              <input
                type="email"
                value={createForm.email}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, email: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Логин (необязательно)</span>
              <input
                type="text"
                value={createForm.username}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, username: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Телефон</span>
              <input
                type="tel"
                value={createForm.phone ?? ''}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, phone: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Департамент</span>
              <input
                type="text"
                value={createForm.department ?? ''}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, department: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              />
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Роль</span>
              <select
                value={createForm.roleId}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, roleId: event.target.value }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-sm">
              <span className="text-xs uppercase tracking-widest text-slate-500">Статус приглашения</span>
              <select
                value={createForm.status}
                onChange={(event) => setCreateForm((prev) => ({ ...prev, status: event.target.value as ManagedUser['status'] }))}
                className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              >
                {Object.entries(statusLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-brand-400"
            >
              <Plus size={16} /> Отправить приглашение
            </button>
            {creationFeedback && <span className="text-xs text-slate-500">{creationFeedback}</span>}
          </div>
        </form>
      )}
      {selectedUser && (
        <UserDetailsCard
          key={selectedUser.id}
          user={selectedUser}
          roles={roles}
          onClose={() => setSelectedUserId(null)}
          onUpdate={(userId, payload) => {
            const { password, confirmPassword, ...rest } = payload;
            updateUser(userId, {
              fullName: rest.fullName,
              email: rest.email,
              username: rest.username,
              roleId: rest.roleId,
              status: rest.status,
              phone: rest.phone,
              department: rest.department,
              requirePasswordReset: rest.requirePasswordReset,
              password
            });
          }}
          onDelete={(userId) => {
            deleteUser(userId);
            setSelectedUserId(null);
          }}
          onResetPassword={resetUserPassword}
        />
      )}
    </section>
  );
};
