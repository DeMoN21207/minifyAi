import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, ChevronsLeft, ChevronsRight, Tag, Trash2 } from 'lucide-react';
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

  const [pendingId, setPendingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(transactions.length / pageSize));
  }, [transactions.length, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, page, pageSize]);

  const startIndex = useMemo(() => {
    if (transactions.length === 0) {
      return 0;
    }
    return (page - 1) * pageSize + 1;
  }, [transactions.length, page, pageSize]);

  const endIndex = useMemo(() => {
    return Math.min(page * pageSize, transactions.length);
  }, [transactions.length, page, pageSize]);

  const handleCategoryChange = async (transactionId: string, value: string) => {
    setError(null);
    try {
      await updateTransaction(transactionId, { categoryId: value });
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Не удалось обновить категорию';
      setError(message);
    }
  };

  const handleDelete = async (transactionId: string) => {
    setPendingId(transactionId);
    setError(null);
    try {
      await deleteTransaction(transactionId);
    } catch (cause) {
      const message = cause instanceof Error ? cause.message : 'Не удалось удалить операцию';
      setError(message);
    } finally {
      setPendingId(null);
    }
  };

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
      {error && <div className="mt-3 rounded-2xl bg-red-100 px-4 py-3 text-sm text-red-600">{error}</div>}
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
            {paginatedTransactions.map((transaction) => (
              <tr key={transaction.id} className="transition-colors hover:bg-white/40 dark:hover:bg-white/5">
                <td className="py-3 pr-4 text-slate-500">{formatDate(transaction.date)}</td>
                <td className="py-3 pr-4 font-medium text-slate-700 dark:text-slate-100">
                  {transaction.description}
                </td>
                <td className="py-3 pr-4 text-slate-500">
                  <select
                    value={transaction.categoryId}
                    onChange={(event) => {
                      void handleCategoryChange(transaction.id, event.target.value);
                    }}
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
                      onClick={() => void handleDelete(transaction.id)}
                      className="inline-flex items-center gap-1 rounded-full bg-white/70 px-2 py-1 text-[11px] text-slate-400 shadow hover:text-red-500 disabled:opacity-60"
                      disabled={pendingId === transaction.id}
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
      <footer className="mt-6 flex flex-col gap-4 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
          <span className="text-xs uppercase tracking-widest text-slate-400">Строк на странице</span>
          <select
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number.parseInt(event.target.value, 10));
              setPage(1);
            }}
            className="w-24 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-sm text-slate-600 shadow focus:outline-none dark:bg-white/10 dark:text-slate-200"
          >
            {[5, 10, 20, 50].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
          <span>
            Показаны {transactions.length === 0 ? 0 : `${startIndex}–${endIndex}`} из {transactions.length}
          </span>
        </div>
        <div className="flex flex-col items-start gap-3 text-slate-600 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10 dark:text-slate-200"
              onClick={() => setPage(1)}
              disabled={page === 1}
            >
              <ChevronsLeft size={14} />
              В начало
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10 dark:text-slate-200"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Назад
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10 dark:text-slate-200"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Вперёд
            </button>
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold shadow transition hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white/10 dark:text-slate-200"
              onClick={() => setPage(totalPages)}
              disabled={page === totalPages}
            >
              В конец
              <ChevronsRight size={14} />
            </button>
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400">Страница {page} из {totalPages}</span>
        </div>
        <button className="inline-flex items-center justify-center rounded-full bg-brand-500/10 px-4 py-2 text-sm font-medium text-brand-600 transition hover:bg-brand-500/20" type="button">
          Экспортировать подборку
          <ArrowRight size={16} className="ml-2" />
        </button>
      </footer>
    </section>
  );
};
