import { AdminAlerts } from '@features/admin/AdminAlerts';
import { AdminAuditTrail } from '@features/admin/AdminAuditTrail';
import { AdminMetrics } from '@features/admin/AdminMetrics';
import { AdminUserTable } from '@features/admin/AdminUserTable';
import { PlanPerformance } from '@features/admin/PlanPerformance';

export const AdminConsolePage = () => {
  return (
    <div className="space-y-6">
      <AdminMetrics />
      <section className="grid gap-6 xl:grid-cols-[3fr_2fr]">
        <AdminUserTable />
        <AdminAlerts />
      </section>
      <section className="grid gap-6 xl:grid-cols-2">
        <PlanPerformance />
        <AdminAuditTrail />
      </section>
    </div>
  );
};
