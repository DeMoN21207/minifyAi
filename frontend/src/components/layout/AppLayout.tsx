import { Outlet } from 'react-router-dom';
import { Sidebar } from '@components/layout/Sidebar';
import { TopBar } from '@components/layout/TopBar';
import { BudgetAssistant } from '@features/BudgetAssistant';

export const AppLayout = () => {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(72,198,170,0.12),_transparent_55%)] p-4 md:p-6 lg:p-10">
      <div className="mx-auto flex max-w-[1600px] gap-6">
        <Sidebar />
        <main className="flex-1 space-y-6">
          <TopBar />
          <Outlet />
        </main>
      </div>
      <BudgetAssistant />
    </div>
  );
};
