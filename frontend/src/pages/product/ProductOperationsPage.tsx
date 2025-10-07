import { CheckCircle, Clock, FileBarChart } from 'lucide-react';

const highlights = [
  {
    icon: CheckCircle,
    title: 'Автоматическая категоризация',
    description:
      'Загружайте выписки из любых банков и получайте мгновенную расшифровку операций с умной категоризацией и тегированием.'
  },
  {
    icon: FileBarChart,
    title: 'Глубокая аналитика расходов',
    description:
      'Отслеживайте траты по мерчантам, проектам и пользователям, строите отчёты за любые периоды и экспортируйте их для команды.'
  },
  {
    icon: Clock,
    title: 'Сценарии и напоминания',
    description:
      'Настраивайте автоматические сценарии, напоминания о платежах и контроль лимитов, чтобы ничего не упустить.'
  }
];

export const ProductOperationsPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Операции и контроль</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Управляйте денежными потоками компании в едином окне: собирайте операции из разных банков,
          настраивайте автоматические правила и отслеживайте статусы платежей в режиме реального времени.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {highlights.map(({ icon: Icon, title, description }) => (
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
