import { useEffect, useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { TransactionComposer } from '@features/TransactionComposer';
import { TransactionsTable } from '@features/TransactionsTable';
import { CashflowChart } from '@features/CashflowChart';
import { CategoryBreakdown } from '@features/CategoryBreakdown';
import { useDashboardStore } from '@store/dashboardStore';

export const ProductOperationsPage = () => {
  const fetchTransactions = useDashboardStore((state) => state.fetchTransactions);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions().catch((cause) => {
      const message = cause instanceof Error ? cause.message : 'Не удалось загрузить операции';
      setError(message);
    });
  }, [fetchTransactions]);

  return (
    <div className="space-y-6">
      <section className="glass-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Управление операциями</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Добавляйте новые платежи, редактируйте существующие транзакции и поддерживайте чистоту журнала с помощью
          встроенных инструментов контроля.
        </p>
      </section>
      {error && (
        <div className="glass-panel flex items-center gap-3 p-4 text-sm text-red-600">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}
      <TransactionComposer />
      <section className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <TransactionsTable />
        <div className="flex flex-col gap-6">
          <CashflowChart />
          <CategoryBreakdown />
        </div>
      </section>
    </div>
  );
};
