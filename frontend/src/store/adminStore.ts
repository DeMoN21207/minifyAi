import { create } from 'zustand';
import type { AdminState, UserAccountStatus } from '@types/index';
import {
  mockAdminAlerts,
  mockAdminMetrics,
  mockAuditLog,
  mockPlanInsights,
  mockUserAccounts
} from '@mocks/admin';

interface AdminActions {
  setAccountStatus: (userId: string, status: UserAccountStatus) => void;
}

const initialState: AdminState = {
  metrics: mockAdminMetrics,
  accounts: mockUserAccounts,
  alerts: mockAdminAlerts,
  auditLog: mockAuditLog,
  planInsights: mockPlanInsights
};

export const useAdminStore = create<AdminState & AdminActions>((set) => ({
  ...initialState,
  setAccountStatus: (userId, status) =>
    set((state) => ({
      accounts: state.accounts.map((account) =>
        account.id === userId ? { ...account, status } : account
      )
    }))
}));
