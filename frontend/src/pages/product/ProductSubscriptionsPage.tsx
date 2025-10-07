import { SubscriptionsPanel } from '@features/SubscriptionsPanel';
import { SubscriptionForecast } from '@features/SubscriptionForecast';
import { DailyCalendar } from '@features/DailyCalendar';

export const ProductSubscriptionsPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Управление подписками</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Создавайте, редактируйте и приостанавливайте повторяющиеся платежи, отслеживайте владельцев сервисов и
          готовьтесь к продлениям заранее.
        </p>
      </section>
      <SubscriptionsPanel />
      <section className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
        <DailyCalendar />
        <SubscriptionForecast />
      </section>
    </div>
  );
};
