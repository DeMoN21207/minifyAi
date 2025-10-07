import { KeyRound, Shield, UserCog, UserPlus, Users } from 'lucide-react';

const governance = [
  {
    icon: Shield,
    title: 'Политики безопасности',
    description:
      'Включайте обязательную MFA, управляйте правилами аудита и контролируйте попытки высокого риска в реальном времени.'
  },
  {
    icon: KeyRound,
    title: 'Интеграции и API',
    description:
      'Управляйте внешними подключениями, обновляйте API-ключи и отслеживайте активность интеграций без простоя.'
  },
  {
    icon: Users,
    title: 'Командные пространства',
    description:
      'Разделяйте доступ по отделам и проектам, назначайте владельцев бюджетов и утверждайте лимиты расходов.'
  }
];

const roleHighlights = [
  {
    title: 'Шаблоны ролей',
    description: 'Owner, Admin, Analyst и Member с готовыми наборами прав и зонами ответственности.'
  },
  {
    title: 'Кастомные ограничения',
    description: 'Настраивайте granular-доступ до уровня конкретных витрин, счетов и инструментов.'
  },
  {
    title: 'Журнал согласований',
    description: 'Фиксируйте все изменения доступа и переназначения владельцев с цифровой подписью.'
  }
];

const userManagement = [
  {
    icon: UserPlus,
    title: 'Онбординг сотрудников',
    description: 'Импортируйте пользователей из HRIS, выдавайте доступ пакетно и подключайте нужные роли за минуты.'
  },
  {
    icon: UserCog,
    title: 'Контроль активности',
    description: 'Отслеживайте, кто и когда вносил правки, просматривал отчёты или инициировал платежи.'
  },
  {
    icon: Shield,
    title: 'Автоматические проверки',
    description: 'Настраивайте правила отзыва доступа при увольнении или отсутствии активности более 30 дней.'
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
        {governance.map(({ icon: Icon, title, description }) => (
          <article key={title} className="glass-panel space-y-3 p-6">
            <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-500/10 text-brand-600">
              <Icon size={20} />
            </span>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{description}</p>
          </article>
        ))}
      </section>
      <section id="roles" className="glass-panel space-y-5 p-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-500">Настройка ролей</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Ролевое управление доступом</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Создавайте собственные профили доступа, наследуйте базовые шаблоны и контролируйте, какие данные доступны командам.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {roleHighlights.map(({ title, description }) => (
            <article key={title} className="rounded-2xl bg-white/70 p-5 shadow-inner dark:bg-white/5">
              <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>
      <section id="user-management" className="glass-panel space-y-5 p-6">
        <header className="space-y-2">
          <p className="text-xs uppercase tracking-widest text-slate-500">Администрирование</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Управление пользователями</h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            Контролируйте жизненный цикл сотрудников — от онбординга и разграничения прав до автоматического отзыва доступа.
          </p>
        </header>
        <div className="grid gap-4 md:grid-cols-3">
          {userManagement.map(({ icon: Icon, title, description }) => (
            <article key={title} className="rounded-2xl bg-white/70 p-5 shadow-inner dark:bg-white/5">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-500/10 text-brand-600">
                  <Icon size={18} />
                </span>
                <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-100">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 dark:text-slate-300">{description}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};
