import { useMemo, useState, type FormEvent } from 'react';
import { Pencil, Plus, Save, Shield, Trash2, X } from 'lucide-react';
import { useSettingsStore } from '@store/settingsStore';
import type { RoleDefinition } from '@types/index';

interface RoleFormState {
  name: string;
  description: string;
  permissionsText: string;
}

const defaultFormState: RoleFormState = {
  name: '',
  description: '',
  permissionsText: ''
};

const parsePermissions = (value: string) =>
  value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

export const RoleManagementPanel = () => {
  const { roles, users, createRole, updateRole, deleteRole } = useSettingsStore((state) => ({
    roles: state.roles,
    users: state.users,
    createRole: state.createRole,
    updateRole: state.updateRole,
    deleteRole: state.deleteRole
  }));

  const [formState, setFormState] = useState<RoleFormState>(defaultFormState);
  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const assignments = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const role of roles) {
      counts[role.id] = 0;
    }
    for (const user of users) {
      counts[user.roleId] = (counts[user.roleId] ?? 0) + 1;
    }
    return counts;
  }, [roles, users]);

  const resetForm = () => {
    setFormState(defaultFormState);
    setEditingRoleId(null);
  };

  const handleEdit = (role: RoleDefinition) => {
    setEditingRoleId(role.id);
    setFormState({
      name: role.name,
      description: role.description,
      permissionsText: role.permissions.join(', ')
    });
    setMessage(null);
  };

  const handleDelete = (role: RoleDefinition) => {
    if (role.isSystem) {
      setMessage({ type: 'error', text: 'Системные роли нельзя удалить.' });
      return;
    }
    deleteRole(role.id);
    setMessage({ type: 'success', text: `Роль «${role.name}» удалена, пользователи переназначены автоматически.` });
    if (editingRoleId === role.id) {
      resetForm();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!formState.name.trim()) {
      setMessage({ type: 'error', text: 'Введите название роли.' });
      return;
    }

    const permissions = parsePermissions(formState.permissionsText);
    const payload = {
      name: formState.name.trim(),
      description: formState.description.trim(),
      permissions
    };

    if (editingRoleId) {
      updateRole(editingRoleId, payload);
      setMessage({ type: 'success', text: 'Роль обновлена.' });
    } else {
      createRole(payload);
      setMessage({ type: 'success', text: 'Новая роль добавлена.' });
    }

    resetForm();
  };

  const activeRole = editingRoleId ? roles.find((role) => role.id === editingRoleId) : null;

  return (
    <section className="glass-panel space-y-6 p-6">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Настройка ролей</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ролевое управление доступом</h2>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Создавайте и обновляйте шаблоны доступа, контролируйте назначения и поддерживайте прозрачность полномочий.
          </p>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full bg-brand-500/10 px-3 py-2 text-xs font-semibold text-brand-600">
          <Shield size={16} /> {roles.length} активных ролей
        </span>
      </header>
      {message && (
        <div
          className={`rounded-2xl px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'bg-emerald-500/10 text-emerald-700'
              : 'bg-rose-500/10 text-rose-600'
          }`}
        >
          {message.text}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[3fr_2fr]">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-white/40 text-sm">
            <thead className="text-left text-xs uppercase tracking-widest text-slate-400">
              <tr>
                <th className="py-3 pr-4">Роль</th>
                <th className="py-3 pr-4">Полномочия</th>
                <th className="py-3 pr-4 text-center">Пользователи</th>
                <th className="py-3 pl-4 text-right">Действия</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/30">
              {roles.map((role) => (
                <tr key={role.id} className="align-top transition hover:bg-white/40 dark:hover:bg-white/5">
                  <td className="py-4 pr-4 text-sm">
                    <p className="font-semibold text-slate-900 dark:text-white">{role.name}</p>
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-300">{role.description}</p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {role.isSystem && (
                        <span className="rounded-full bg-slate-900 px-3 py-1 text-[11px] font-semibold text-white">
                          Системная
                        </span>
                      )}
                      {role.isDefault && (
                        <span className="rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-semibold text-brand-600">
                          Назначается по умолчанию
                        </span>
                      )}
                      {activeRole?.id === role.id && (
                        <span className="rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-600">
                          Редактируется
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap gap-2">
                      {role.permissions.map((permission) => (
                        <span
                          key={permission}
                          className="inline-flex items-center rounded-full bg-white/70 px-3 py-1 text-[11px] text-slate-500 shadow dark:bg-white/10 dark:text-slate-200"
                        >
                          {permission}
                        </span>
                      ))}
                      {role.permissions.length === 0 && (
                        <span className="text-xs text-slate-400">Полномочия не заданы</span>
                      )}
                    </div>
                  </td>
                  <td className="py-4 pr-4 text-center text-sm font-semibold text-slate-600">
                    {assignments[role.id] ?? 0}
                  </td>
                  <td className="py-4 pl-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => handleEdit(role)}
                        className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow transition hover:bg-white/90 dark:bg-white/10 dark:text-slate-200"
                      >
                        <Pencil size={14} /> Изменить
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(role)}
                        disabled={role.isSystem}
                        className="inline-flex items-center gap-1 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-rose-500 shadow transition hover:bg-white/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10"
                      >
                        <Trash2 size={14} /> Удалить
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <form className="space-y-4 rounded-3xl bg-white/70 p-5 shadow-inner dark:bg-white/5" onSubmit={handleSubmit}>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">
              {editingRoleId ? 'Редактирование роли' : 'Создание новой роли'}
            </h3>
            {editingRoleId ? (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-500 shadow transition hover:bg-white/90 dark:bg-white/10 dark:text-slate-200"
              >
                <X size={14} /> Отмена
              </button>
            ) : (
              <span className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-3 py-1 text-[11px] font-semibold text-brand-600">
                <Plus size={14} /> Новая роль
              </span>
            )}
          </div>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Название</span>
            <input
              type="text"
              value={formState.name}
              onChange={(event) => {
                setFormState((prev) => ({ ...prev, name: event.target.value }));
                setMessage(null);
              }}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              placeholder="Например, Финансовый контролёр"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Описание</span>
            <textarea
              value={formState.description}
              onChange={(event) => {
                setFormState((prev) => ({ ...prev, description: event.target.value }));
                setMessage(null);
              }}
              rows={3}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              placeholder="Кратко опишите назначение роли"
            />
          </label>
          <label className="block text-sm">
            <span className="text-xs uppercase tracking-widest text-slate-500">Полномочия</span>
            <textarea
              value={formState.permissionsText}
              onChange={(event) => {
                setFormState((prev) => ({ ...prev, permissionsText: event.target.value }));
                setMessage(null);
              }}
              rows={4}
              className="mt-2 w-full rounded-2xl border border-white/60 bg-white px-3 py-2 text-sm text-slate-700 shadow focus:border-brand-500 focus:outline-none dark:bg-white/10 dark:text-slate-100"
              placeholder="Перечислите полномочия через запятую или с новой строки"
            />
            <span className="mt-1 block text-xs text-slate-400">Например: transactions.read, analytics.read</span>
          </label>
          <div className="flex items-center justify-between gap-3">
            <button
              type="submit"
              className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow transition hover:bg-slate-800 dark:bg-brand-500 dark:hover:bg-brand-400"
            >
              <Save size={16} /> {editingRoleId ? 'Сохранить изменения' : 'Добавить роль'}
            </button>
            {editingRoleId && (
              <button
                type="button"
                onClick={() => {
                  if (!activeRole) {
                    resetForm();
                    return;
                  }
                  setFormState({
                    name: activeRole.name,
                    description: activeRole.description,
                    permissionsText: activeRole.permissions.join(', ')
                  });
                  setMessage(null);
                }}
                className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-2 text-xs font-semibold text-slate-600 shadow transition hover:bg-white/90 dark:bg-white/10 dark:text-slate-200"
              >
                Вернуть
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
};
