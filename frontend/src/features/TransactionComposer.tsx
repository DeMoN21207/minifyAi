import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import { Sparkles, Wand2 } from 'lucide-react';
import { useDashboardStore } from '@store/dashboardStore';
import type { CurrencyCode } from '@types/index';

const defaultTags = (tags: string[] = []) => tags.join(', ');

export const TransactionComposer = () => {
  const {
    categories,
    presets,
    selectedCurrency,
    createTransaction,
    applyPreset,
    convertToSelectedCurrency
  } = useDashboardStore((state) => ({
    categories: state.categories,
    presets: state.presets,
    selectedCurrency: state.selectedCurrency,
    createTransaction: state.createTransaction,
    applyPreset: state.applyPreset,
    convertToSelectedCurrency: state.convertToSelectedCurrency
  }));

  const initialCategory = categories.find((category) => category.kind === 'expense') ?? categories[0];

  const [type, setType] = useState<'expense' | 'income' | 'transfer'>(initialCategory?.kind ?? 'expense');
  const [categoryId, setCategoryId] = useState(initialCategory?.id ?? '');
  const [description, setDescription] = useState('');
  const [merchant, setMerchant] = useState('');
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState<CurrencyCode>(selectedCurrency);
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [tags, setTags] = useState('');
  const [note, setNote] = useState('');
  const [lastCreatedId, setLastCreatedId] = useState<string | null>(null);

  const relatedPresets = useMemo(
    () => presets.filter((preset) => preset.type === type && preset.categoryId === categoryId),
    [presets, type, categoryId]
  );

  const suggestedCategories = useMemo(
    () =>
      categories.filter((category) =>
        category.kind === type || (type === 'transfer' && category.kind === 'transfer')
      ),
    [categories, type]
  );

  const convertedAmount = useMemo(() => {
    if (!amount) return null;
    const numeric = Number(amount);
    if (Number.isNaN(numeric)) return null;
    const money = convertToSelectedCurrency({ currency, amount: numeric });
    if (money.currency === currency) return null;
    return money;
  }, [amount, currency, convertToSelectedCurrency, selectedCurrency]);

  const handleSubmit = () => {
    if (!amount || !categoryId || !description) return;
    const numeric = Number(amount);
    if (Number.isNaN(numeric)) return;

    const created = createTransaction({
      type,
      categoryId,
      merchant: merchant.trim() || undefined,
      tags: tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
      date: dayjs(date).toISOString(),
      description: description.trim(),
      amount: { currency, amount: numeric },
      note: note.trim() || undefined
    });
    setLastCreatedId(created.id);
    setDescription('');
    setMerchant('');
    setAmount('');
    setTags('');
    setNote('');
  };

  const handlePreset = (presetId: string) => {
    const transaction = applyPreset(presetId);
    if (!transaction) return;
    setType(transaction.type);
    setCategoryId(transaction.categoryId);
    setDescription(transaction.description);
    setMerchant(transaction.merchant ?? '');
    setAmount(String(transaction.amount.amount));
    setCurrency(transaction.amount.currency);
    setTags(defaultTags(transaction.tags));
    setNote(transaction.note ?? '');
    setDate(dayjs(transaction.date).format('YYYY-MM-DD'));
    setLastCreatedId(transaction.id);
  };

  return (
    <section id="transaction-compose" className="glass-panel flex flex-col gap-5 p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Операции</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Добавить расход / доход</h2>
        </div>
        {lastCreatedId && (
          <span className="rounded-full bg-brand-500/10 px-3 py-1 text-xs font-semibold text-brand-600">
            Сохранено #{lastCreatedId.split('-').pop()}
          </span>
        )}
      </header>
      <div className="flex flex-wrap gap-2 text-sm">
        {(['expense', 'income', 'transfer'] as const).map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => {
              setType(option);
              const firstMatch = categories.find((category) => category.kind === option);
              if (firstMatch) {
                setCategoryId(firstMatch.id);
              }
            }}
            className={`rounded-full px-4 py-2 transition ${
              type === option
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white/70 text-slate-600 hover:bg-white shadow'
            }`}
          >
            {option === 'expense' && 'Расход'}
            {option === 'income' && 'Доход'}
            {option === 'transfer' && 'Перевод'}
          </button>
        ))}
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase text-slate-400">Категория</span>
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(event.target.value)}
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
          >
            {suggestedCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase text-slate-400">Дата</span>
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm md:col-span-2">
          <span className="text-xs uppercase text-slate-400">Описание</span>
          <input
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Например, покупка продуктов, аванс..."
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase text-slate-400">Мерчант</span>
          <input
            value={merchant}
            onChange={(event) => setMerchant(event.target.value)}
            placeholder="Название магазина или контрагента"
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
          />
        </label>
        <div className="grid grid-cols-[1fr_auto] gap-2">
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs uppercase text-slate-400">Сумма</span>
            <input
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              placeholder="0.00"
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
            />
          </label>
          <label className="flex flex-col gap-2 text-sm">
            <span className="text-xs uppercase text-slate-400">Валюта</span>
            <select
              value={currency}
              onChange={(event) => setCurrency(event.target.value as CurrencyCode)}
              className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
            >
              <option value="RUB">₽</option>
              <option value="USD">$</option>
              <option value="EUR">€</option>
            </select>
          </label>
        </div>
        {convertedAmount && (
          <div className="rounded-2xl bg-brand-500/10 px-4 py-3 text-sm text-brand-700">
            В валюте дашборда: {convertedAmount.amount.toLocaleString('ru-RU', { maximumFractionDigits: 2 })}
            &nbsp;
            {convertedAmount.currency}
          </div>
        )}
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase text-slate-400">Теги</span>
          <input
            value={tags}
            onChange={(event) => setTags(event.target.value)}
            placeholder="через запятую"
            className="rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm">
          <span className="text-xs uppercase text-slate-400">Заметка</span>
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={3}
            className="resize-none rounded-2xl border border-white/60 bg-white/80 px-4 py-3 shadow-inner focus:outline-none"
            placeholder="Дополнительные детали, напоминания..."
          />
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg disabled:opacity-40"
          disabled={!amount || !description || !categoryId}
        >
          <Sparkles size={16} /> Сохранить
        </button>
        <span className="text-xs uppercase tracking-widest text-slate-400">быстрые пресеты</span>
        <div className="flex flex-wrap gap-2">
          {relatedPresets.length === 0 && (
            <span className="rounded-full bg-white/60 px-3 py-1 text-xs text-slate-400">
              Нет пресетов для выбранной категории
            </span>
          )}
          {relatedPresets.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => handlePreset(preset.id)}
              className="inline-flex items-center gap-1 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-slate-600 shadow hover:bg-white"
            >
              <Wand2 size={14} /> {preset.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};
