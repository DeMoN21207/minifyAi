import { useMemo, useState } from 'react';
import { AlarmClock, PauseCircle, PlayCircle, PlusCircle, Save, Trash } from 'lucide-react';
import dayjs from 'dayjs';
import { useDashboardStore } from '@store/dashboardStore';
import type { CurrencyCode, Subscription } from '@types/index';

export const SubscriptionsPanel = () => {
  const {
    subscriptions,
    categories,
    selectedCurrency,
    convertToSelectedCurrency,
    toggleSubscriptionStatus,
    deleteSubscription,
    upsertSubscription
  } = useDashboardStore((state) => ({
    subscriptions: state.subscriptions,
    categories: state.categories.filter((category) => category.kind === 'expense'),
    selectedCurrency: state.selectedCurrency,
    convertToSelectedCurrency: state.convertToSelectedCurrency,
    toggleSubscriptionStatus: state.toggleSubscriptionStatus,
    deleteSubscription: state.deleteSubscription,
    upsertSubscription: state.upsertSubscription
  }));

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<Subscription | null>(null);

  const handleStartEditing = (subscription: Subscription) => {
    setEditingId(subscription.id);
    setDraft({ ...subscription });
  };

  const handleStartCreating = () => {
    const defaultCategory = categories[0];
    setEditingId('new');
    setDraft({
      id: `sub-${Date.now()}`,
      name: '',
      categoryId: defaultCategory?.id ?? '',
      merchant: '',
      cadence: 'monthly',
      nextPaymentDate: dayjs().format('YYYY-MM-DD'),
      amount: { currency: selectedCurrency, amount: 0 },
      status: 'active',
      reminderDaysBefore: 1,
      tags: [],
      notes: ''
    });
  };

  const handleCancel = () => {
    setEditingId(null);
    setDraft(null);
  };

  const handleChange = (field: keyof Subscription, value: string | number | CurrencyCode | string[]) => {
    if (!draft) return;
    if (field === 'amount' && typeof value === 'number') {
      setDraft({ ...draft, amount: { ...draft.amount, amount: value } });
      return;
    }
    setDraft({ ...draft, [field]: value });
  };

  const handleSave = () => {
    if (!draft) return;
    const normalizedDate = dayjs(draft.nextPaymentDate).isValid()
      ? dayjs(draft.nextPaymentDate).toISOString()
      : draft.nextPaymentDate;
    upsertSubscription({
      ...draft,
      nextPaymentDate: normalizedDate,
      amount: { ...draft.amount, amount: Number(draft.amount.amount) }
    });
    handleCancel();
  };

  const sortedSubscriptions = useMemo(
    () =>
      [...subscriptions].sort(
        (a, b) => dayjs(a.nextPaymentDate).valueOf() - dayjs(b.nextPaymentDate).valueOf()
      ),
    [subscriptions]
  );

  return (
    <section className="glass-panel flex flex-col gap-5 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Подписки</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Повторяющиеся платежи</h2>
        </div>
        <button
          className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow"
          type="button"
          onClick={handleStartCreating}
        >
          <PlusCircle size={16} /> Добавить
        </button>
      </header>
      <div className="flex flex-col gap-4">
        {sortedSubscriptions.map((subscription) => {
          const converted = convertToSelectedCurrency(subscription.amount);
          const isEditing = editingId === subscription.id;
          return (
            <article
              key={subscription.id}
              className="flex flex-col gap-3 rounded-2xl bg-white/70 px-4 py-4 shadow-inner dark:bg-white/5"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-100">
                    {subscription.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {converted.amount.toLocaleString('ru-RU', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}{' '}
                    {selectedCurrency} · {subscription.cadence}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-500">
                  <span className="flex items-center gap-1 text-slate-400">
                    <AlarmClock size={14} />
                    {dayjs(subscription.nextPaymentDate).format('DD MMM')}
                  </span>
                  <button
                    type="button"
                    onClick={() => toggleSubscriptionStatus(subscription.id)}
                    className="flex items-center gap-1 rounded-full bg-slate-900 px-3 py-1 text-xs font-semibold text-white shadow"
                  >
                    {subscription.status === 'active' ? (
                      <>
                        <PauseCircle size={14} /> Пауза
                      </>
                    ) : (
                      <>
                        <PlayCircle size={14} /> Возобновить
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEditing(subscription)}
                    className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-500 shadow"
                  >
                    Редактировать
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      deleteSubscription(subscription.id);
                      if (editingId === subscription.id) {
                        handleCancel();
                      }
                    }}
                    className="rounded-full bg-white/70 px-2 py-1 text-xs text-red-500 shadow"
                  >
                    <Trash size={14} />
                  </button>
                </div>
              </div>
              {isEditing && draft && (
                <div className="grid gap-3 rounded-2xl bg-white/60 p-4 text-xs text-slate-500">
                  <div className="grid gap-3 md:grid-cols-2">
                    <label className="flex flex-col gap-1">
                      Название
                      <input
                        value={draft.name}
                        onChange={(event) => handleChange('name', event.target.value)}
                        className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Мерчант
                      <input
                        value={draft.merchant ?? ''}
                        onChange={(event) => handleChange('merchant', event.target.value)}
                        className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      Категория
                      <select
                        value={draft.categoryId}
                        onChange={(event) => handleChange('categoryId', event.target.value)}
                        className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Периодичность
                      <select
                        value={draft.cadence}
                        onChange={(event) => handleChange('cadence', event.target.value as Subscription['cadence'])}
                        className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="weekly">еженедельно</option>
                        <option value="monthly">ежемесячно</option>
                        <option value="quarterly">ежеквартально</option>
                        <option value="yearly">ежегодно</option>
                      </select>
                    </label>
                    <label className="flex flex-col gap-1">
                      Дата списания
                      <input
                        type="date"
                        value={dayjs(draft.nextPaymentDate).format('YYYY-MM-DD')}
                        onChange={(event) => handleChange('nextPaymentDate', event.target.value)}
                        className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                      />
                    </label>
                    <div className="grid grid-cols-[1fr_auto] gap-2">
                      <label className="flex flex-col gap-1">
                        Сумма
                        <input
                          value={draft.amount.amount}
                          onChange={(event) => handleChange('amount', Number(event.target.value))}
                          className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                        />
                      </label>
                      <label className="flex flex-col gap-1">
                        Валюта
                        <select
                          value={draft.amount.currency}
                          onChange={(event) =>
                            setDraft({
                              ...draft,
                              amount: { ...draft.amount, currency: event.target.value as CurrencyCode }
                            })
                          }
                          className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                        >
                          <option value="RUB">₽</option>
                          <option value="USD">$</option>
                          <option value="EUR">€</option>
                        </select>
                      </label>
                    </div>
                  </div>
                  <label className="flex flex-col gap-1">
                    Теги
                    <input
                      value={(draft.tags ?? []).join(', ')}
                      onChange={(event) =>
                        handleChange(
                          'tags',
                          event.target.value
                            .split(',')
                            .map((tag) => tag.trim())
                            .filter(Boolean)
                        )
                      }
                      className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    Напоминание (дней до)
                    <input
                      value={draft.reminderDaysBefore ?? 0}
                      onChange={(event) => handleChange('reminderDaysBefore', Number(event.target.value))}
                      className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                    />
                  </label>
                  <label className="flex flex-col gap-1">
                    Заметка
                    <textarea
                      value={draft.notes ?? ''}
                      onChange={(event) => handleChange('notes', event.target.value)}
                      className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                      rows={3}
                    />
                  </label>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleSave}
                      className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow"
                    >
                      <Save size={14} /> Сохранить
                    </button>
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-500 shadow"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
        {editingId === 'new' && draft && (
          <article className="flex flex-col gap-3 rounded-2xl bg-white/70 px-4 py-4 shadow-inner dark:bg-white/5">
            <h3 className="text-sm font-semibold text-slate-700">Новая подписка</h3>
            <div className="grid gap-3 md:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs text-slate-500">
                Название
                <input
                  value={draft.name}
                  onChange={(event) => handleChange('name', event.target.value)}
                  className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-500">
                Мерчант
                <input
                  value={draft.merchant ?? ''}
                  onChange={(event) => handleChange('merchant', event.target.value)}
                  className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-500">
                Категория
                <select
                  value={draft.categoryId}
                  onChange={(event) => handleChange('categoryId', event.target.value)}
                  className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-500">
                Периодичность
                <select
                  value={draft.cadence}
                  onChange={(event) => handleChange('cadence', event.target.value as Subscription['cadence'])}
                  className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                >
                  <option value="weekly">еженедельно</option>
                  <option value="monthly">ежемесячно</option>
                  <option value="quarterly">ежеквартально</option>
                  <option value="yearly">ежегодно</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-xs text-slate-500">
                Дата списания
                <input
                  type="date"
                  value={dayjs(draft.nextPaymentDate).format('YYYY-MM-DD')}
                  onChange={(event) => handleChange('nextPaymentDate', event.target.value)}
                  className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                />
              </label>
              <div className="grid grid-cols-[1fr_auto] gap-2 text-xs text-slate-500">
                <label className="flex flex-col gap-1">
                  Сумма
                  <input
                    value={draft.amount.amount}
                    onChange={(event) => handleChange('amount', Number(event.target.value))}
                    className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                  />
                </label>
                <label className="flex flex-col gap-1">
                  Валюта
                  <select
                    value={draft.amount.currency}
                    onChange={(event) =>
                      setDraft({
                        ...draft,
                        amount: { ...draft.amount, currency: event.target.value as CurrencyCode }
                      })
                    }
                    className="rounded-xl border border-white/60 bg-white px-3 py-2 text-sm focus:outline-none"
                  >
                    <option value="RUB">₽</option>
                    <option value="USD">$</option>
                    <option value="EUR">€</option>
                  </select>
                </label>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleSave}
                className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-xs font-semibold text-white shadow"
              >
                <Save size={14} /> Сохранить
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-full bg-white/70 px-4 py-2 text-xs font-semibold text-slate-500 shadow"
              >
                Отмена
              </button>
            </div>
          </article>
        )}
      </div>
    </section>
  );
};
