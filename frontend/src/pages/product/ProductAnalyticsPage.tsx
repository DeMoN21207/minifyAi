import { BarChart3, Database, Gauge } from 'lucide-react';

const insights = [
  {
    icon: BarChart3,
    title: 'Интерактивные панели',
    description:
      'Стройте собственные дашборды с ключевыми показателями: выручка, burn-rate, удержание клиентов и эффективность маркетинга.'
  },
  {
    icon: Database,
    title: 'Единый источник данных',
    description:
      'Объединяйте банковские операции, CRM и данные бухгалтерии в одной витрине и анализируйте их без сложной настройки.'
  },
  {
    icon: Gauge,
    title: 'Мониторинг отклонений',
    description:
      'Настраивайте алерты по любым метрикам: система предупредит о превышении бюджетов или падении доходов.'
  }
];

export const ProductAnalyticsPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Отчётность и витрины данных</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Получайте наглядную картину финансового состояния бизнеса — от ежедневных транзакций до долгосрочных трендов.
          Используйте готовые шаблоны или создавайте собственные панели аналитики для разных стейкхолдеров.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {insights.map(({ icon: Icon, title, description }) => (
          <article key={title} className="glass-panel space-y-3 p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
              <Icon size={20} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
          </article>
        ))}
      </section>
    </div>
  );
};
