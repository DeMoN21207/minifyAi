export type CurrencyCode = 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY';

export type UserRole = 'user' | 'admin';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
}

export interface MoneyAmount {
  currency: CurrencyCode;
  amount: number;
}

export interface Transaction {
  id: string;
  type: 'expense' | 'income' | 'transfer';
  categoryId: string;
  category: string;
  merchant?: string;
  tags?: string[];
  date: string;
  description: string;
  amount: MoneyAmount;
  note?: string;
}

export interface Subscription {
  id: string;
  name: string;
  categoryId: string;
  merchant?: string;
  nextPaymentDate: string;
  cadence: 'weekly' | 'monthly' | 'quarterly' | 'yearly';
  amount: MoneyAmount;
  status: 'active' | 'paused';
  tags?: string[];
  reminderDaysBefore?: number;
  notes?: string;
}

export interface SubscriptionForecastItem {
  id: string;
  subscriptionId: string;
  name: string;
  scheduledDate: string;
  amount: MoneyAmount;
  status: 'scheduled' | 'skipped' | 'paused';
}

export interface DailySummary {
  date: string;
  total: MoneyAmount;
}

export interface CategorySummary {
  category: string;
  total: MoneyAmount;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  createdAt: string;
  content: string;
}

export interface ExchangeRate {
  base: CurrencyCode;
  quote: CurrencyCode;
  date: string;
  rate: number;
}

export interface CategoryDefinition {
  id: string;
  name: string;
  kind: 'expense' | 'income' | 'transfer';
  color: string;
  icon: string;
}

export interface TransactionPreset {
  id: string;
  label: string;
  description: string;
  type: Transaction['type'];
  categoryId: string;
  merchant?: string;
  tags?: string[];
  note?: string;
  amount: MoneyAmount;
}

export interface DashboardState {
  selectedMonth: string;
  selectedCurrency: CurrencyCode;
  transactions: Transaction[];
  subscriptions: Subscription[];
  dailySummaries: DailySummary[];
  categorySummaries: CategorySummary[];
  chatHistory: ChatMessage[];
  exchangeRates: ExchangeRate[];
  categories: CategoryDefinition[];
  presets: TransactionPreset[];
}

export interface AdminMetric {
  id: string;
  label: string;
  value: string;
  trend: number;
  description: string;
}

export type UserAccountStatus = 'active' | 'invited' | 'blocked';

export type UserAccountRole = 'owner' | 'admin' | 'analyst' | 'member';

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserAccountRole;
  status: UserAccountStatus;
  mrr: number;
  createdAt: string;
  lastActiveAt: string;
}

export type AlertSeverity = 'info' | 'warning' | 'critical';

export interface AdminAlert {
  id: string;
  severity: AlertSeverity;
  message: string;
  createdAt: string;
  actionLabel?: string;
}

export interface AuditLogEntry {
  id: string;
  actor: string;
  action: string;
  target: string;
  channel: 'web' | 'mobile' | 'api';
  timestamp: string;
}

export interface PlanInsight {
  id: string;
  plan: string;
  customers: number;
  churnRate: number;
  arpa: number;
  trend: number;
}

export interface AdminState {
  metrics: AdminMetric[];
  accounts: UserAccount[];
  alerts: AdminAlert[];
  auditLog: AuditLogEntry[];
  planInsights: PlanInsight[];
}

export type ManagedUserStatus = 'active' | 'pending' | 'suspended';

export interface RoleDefinition {
  id: string;
  name: string;
  description: string;
  permissions: string[];
  isSystem?: boolean;
  isDefault?: boolean;
}

export interface ManagedUser {
  id: string;
  fullName: string;
  email: string;
  username: string;
  roleId: string;
  status: ManagedUserStatus;
  phone?: string;
  department?: string;
  lastLoginAt: string | null;
  createdAt: string;
  passwordUpdatedAt: string;
  requirePasswordReset: boolean;
  temporaryPassword?: string;
}

export interface SettingsState {
  roles: RoleDefinition[];
  users: ManagedUser[];
}
