import { KeyRound, Shield, Users } from 'lucide-react';
import { RoleManagementPanel } from '@features/settings/RoleManagementPanel';
import { UserManagementTable } from '@features/settings/UserManagementTable';

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
      <RoleManagementPanel />
      <UserManagementTable />
    </div>
  );
};
