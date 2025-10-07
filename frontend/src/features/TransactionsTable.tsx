import { ArrowRight, Tag, Trash2 } from 'lucide-react';
import { useDashboardStore } from '@store/dashboardStore';
import { formatDate } from '@utils/format';

export const TransactionsTable = () => {
  const { transactions, categories, updateTransaction, deleteTransaction, convertToSelectedCurrency, selectedCurrency } =
    useDashboardStore((state) => ({
      transactions: state.transactions,
      categories: state.categories,
      updateTransaction: state.updateTransaction,
      deleteTransaction: state.deleteTransaction,
      convertToSelectedCurrency: state.convertToSelectedCurrency,
      selectedCurrency: state.selectedCurrency
    }));

  return (
    <section className="glass-panel flex flex-col overflow-hidden p-6">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-500">Журнал</p>
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Недавние операции</h2>
        </div>
        <button className="rounded-full bg-white/80 px-4 py-2 text-sm font-medium text-slate-600 shadow" type="button">
          Смотреть все
        </button>
      </header>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full divide-y divide-white/40 text-sm">
          <thead className="text-left text-xs uppercase tracking-widest text-slate-400">
            <tr>
              <th className="py-3 pr-4">Дата</th>
              <th className="py-3 pr-4">Описание</th>
              <th className="py-3 pr-4">Категория</th>
              <th className="py-3 pr-4 text-right">Сумма</th>
              <th className="py-3 pl-4 text-right">Теги</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                <td className="py-3 pr-4 text-slate-500">{formatDate(transaction.date)}</td>
                <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-100">
                  {transaction.description}
                </td>
                <td className="py-3 pr-4 text-slate-500">
                  <select
                    value={transaction.categoryId}
                    onChange={(event) =>
                      updateTransaction(transaction.id, {
                        categoryId: event.target.value
                      })
                    }
                    className="rounded-full bg-white/60 px-3 py-1 text-xs text-slate-600 focus:outline-none"
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-3 pr-4 text-right font-semibold text-slate-800 dark:text-white">
                  {convertToSelectedCurrency(transaction.amount).amount.toLocaleString('ru-RU', {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  })}{' '}
                  {selectedCurrency}
                </td>
                <td className="py-3 pl-4 text-right text-slate-400">
                  <div className="flex justify-end gap-2">
                    {(transaction.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 rounded-full bg-brand-500/10 px-2 py-1 text-xs text-brand-600"
                      >
                        <Tag size={12} />
                        {tag}
                      </span>
                    ))}
                    <button
                      type="button"
                      onClick={() => deleteTransaction(transaction.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] text-slate-400 shadow hover:text-red-500"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <footer className="mt-4 flex items-center justify-end text-sm text-brand-600">
        Экспортировать подборку <ArrowRight size={16} className="ml-2" />
      </footer>
    </section>
  );
};
