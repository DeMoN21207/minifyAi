import { useEffect } from 'react';
import { ActionBar } from '@components/layout/ActionBar';
import { CashflowChart } from '@features/CashflowChart';
import { CategoryBreakdown } from '@features/CategoryBreakdown';
import { DailyCalendar } from '@features/DailyCalendar';
import { MultiCurrencyRates } from '@features/MultiCurrencyRates';
import { OverviewCards } from '@features/OverviewCards';
import { SubscriptionsPanel } from '@features/SubscriptionsPanel';
import { SubscriptionForecast } from '@features/SubscriptionForecast';
import { TransactionsTable } from '@features/TransactionsTable';
import { TransactionComposer } from '@features/TransactionComposer';
import { UserProfileSection } from '@features/UserProfileSection';
import { useDashboardStore } from '@store/dashboardStore';

export const UserDashboardPage = () => {
  const fetchTransactions = useDashboardStore((state) => state.fetchTransactions);

  useEffect(() => {
    fetchTransactions().catch((error) => {
      console.error('Не удалось загрузить операции', error);
    });
  }, [fetchTransactions]);

  return (
    <div className="space-y-6">
      <UserProfileSection />
      <ActionBar />
      <OverviewCards />
      <TransactionComposer />
      <section id="analytics" className="grid gap-6 xl:grid-cols-3">
        <CashflowChart />
        <CategoryBreakdown />
      </section>
      <section id="subscriptions" className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DailyCalendar />
        <SubscriptionsPanel />
        <SubscriptionForecast />
        <MultiCurrencyRates />
      </section>
      <section id="transactions" className="grid gap-6">
        <TransactionsTable />
      </section>
    </div>
  );
};
