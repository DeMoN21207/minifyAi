import { useEffect } from 'react';
import { CashflowChart } from '@features/CashflowChart';
import { CategoryBreakdown } from '@features/CategoryBreakdown';
import { DailyCalendar } from '@features/DailyCalendar';
import { MultiCurrencyRates } from '@features/MultiCurrencyRates';
import { OverviewCards } from '@features/OverviewCards';
import { SubscriptionForecast } from '@features/SubscriptionForecast';
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
      <OverviewCards />
      <section id="analytics" className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <CashflowChart />
        <CategoryBreakdown />
      </section>
      <section id="insights" className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DailyCalendar />
        <SubscriptionForecast />
        <MultiCurrencyRates />
      </section>
    </div>
  );
};
