import { AlarmClock, CreditCard, ShieldCheck } from 'lucide-react';

const benefits = [
  {
    icon: CreditCard,
    title: 'Единый реестр подписок',
    description:
      'Все регулярные платежи компании собраны в одном календаре: отслеживайте статус оплаты, ответственных и бюджеты по командам.'
  },
  {
    icon: AlarmClock,
    title: 'Прогноз продлений',
    description:
      'Получайте прогнозы по предстоящим продлениям, чтобы заранее планировать бюджеты и избегать неожиданных расходов.'
  },
  {
    icon: ShieldCheck,
    title: 'Контроль прав доступа',
    description:
      'Управляйте правами пользователей и интеграциями, фиксируйте владельцев подписок и следите за безопасностью доступа.'
  }
];

export const ProductSubscriptionsPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Подписки и сервисы</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Получайте прозрачность по всем SaaS-расходам: отслеживайте, кто пользуется сервисом, сколько он стоит и когда
          потребуется продление.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {benefits.map(({ icon: Icon, title, description }) => (
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
