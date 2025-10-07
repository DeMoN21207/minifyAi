import { Calendar, Download, PlusCircle, SlidersHorizontal } from 'lucide-react';
import dayjs from 'dayjs';
import { useDashboardStore } from '@store/dashboardStore';

export const ActionBar = () => {
  const { selectedMonth, setMonth, selectedCurrency, setCurrency } = useDashboardStore(
    (state) => ({
      selectedMonth: state.selectedMonth,
      setMonth: state.setMonth,
      selectedCurrency: state.selectedCurrency,
      setCurrency: state.setCurrency
    })
  );

  return (
    <section className="glass-panel flex flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
      <div className="flex items-center gap-3">
        <div className="rounded-full bg-white/70 px-4 py-2 text-sm text-slate-500 shadow">
          {dayjs(selectedMonth).format('MMMM YYYY')}
        </div>
        <label className="flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm shadow">
          <Calendar size={16} className="text-brand-500" />
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) => setMonth(event.target.value)}
            className="border-none bg-transparent focus:outline-none"
          />
        </label>
        <select
          value={selectedCurrency}
          onChange={(event) => setCurrency(event.target.value as typeof selectedCurrency)}
          className="rounded-full bg-white/70 px-4 py-2 text-sm shadow focus:outline-none"
        >
          <option value="RUB">₽ Рубли</option>
          <option value="USD">$ Доллары</option>
          <option value="EUR">€ Евро</option>
        </select>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow"
        >
          <SlidersHorizontal size={16} /> Фильтры
        </button>
        <button
          type="button"
          className="flex items-center gap-2 rounded-full bg-brand-500 px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          <Download size={16} /> Экспорт
        </button>
        <a
          href="#transaction-compose"
          className="flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-lg"
        >
          <PlusCircle size={16} /> Новая операция
        </a>
      </div>
    </section>
  );
};
