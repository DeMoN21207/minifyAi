import { KeyRound, Shield, Users } from 'lucide-react';

const controls = [
  {
    icon: Users,
    title: 'Роли и доступ',
    description:
      'Создавайте роли, управляйте командами и определяйте уровни доступа к финансовым данным и инструментам.'
  },
  {
    icon: Shield,
    title: 'Политики безопасности',
    description:
      'Включайте обязательную двухфакторную аутентификацию, настраивайте правила аудита и контроль рисковых операций.'
  },
  {
    icon: KeyRound,
    title: 'Интеграции и API',
    description:
      'Подключайте корпоративные системы, управляйте API-ключами и отслеживайте активность интеграций.'
  }
];

export const ProductSettingsPage = () => {
  return (
    <div className="space-y-6">
      <section className="glass-panel space-y-4 p-6">
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-white">Настройки и безопасность</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Централизованное управление политиками доступа, безопасностью и интеграциями. Настройте платформу под процессы вашей
          компании и обеспечьте соблюдение требований комплаенса.
        </p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {controls.map(({ icon: Icon, title, description }) => (
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
