// Base types
export type ID = string;
export type DateTime = string;

// Enums
export enum TransactionType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum CategoryType {
  INCOME = 'INCOME',
  EXPENSE = 'EXPENSE'
}

export enum SourceType {
  BANK_ACCOUNT = 'BANK_ACCOUNT',
  DEBIT_CARD = 'DEBIT_CARD',
  CREDIT_CARD = 'CREDIT_CARD',
  CASH = 'CASH',
  DIGITAL_WALLET = 'DIGITAL_WALLET',
  INVESTMENT_ACCOUNT = 'INVESTMENT_ACCOUNT'
}

export enum AnalyticsGroupBy {
  CATEGORY = 'CATEGORY',
  SOURCE = 'SOURCE',
  DATE = 'DATE'
}

// Core entities
export interface User {
  id: ID;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  preferences: UserPreferences;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface UserPreferences {
  currency: string;
  language: string;
  timezone: string;
}

export interface Wallet {
  id: ID;
  name: string;
  description?: string;
  icon: string;
  color: string;
  isDefault: boolean;
  balance: number;
  sources?: TransactionSource[];
  transactions?: Transaction[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface TransactionSource {
  id: ID;
  name: string;
  type: SourceType;
  description?: string;
  balance: number;
  icon: string;
  color: string;
  isActive: boolean;
  lastUsed?: DateTime;
  wallet: Wallet;
  walletId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Category {
  id: ID;
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  description?: string;
  isDefault: boolean;
  transactionCount: number;
  totalAmount: number;
  transactions?: Transaction[];
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Transaction {
  id: ID;
  amount: number;
  description: string;
  type: TransactionType;
  date: DateTime;
  category: Category;
  categoryId: ID;
  source: TransactionSource;
  sourceId: ID;
  wallet: Wallet;
  walletId: ID;
  createdAt: DateTime;
  updatedAt: DateTime;
}

export interface Transfer {
  id: ID;
  amount: number;
  description?: string;
  fromSource: TransactionSource;
  fromSourceId: ID;
  toSource: TransactionSource;
  toSourceId: ID;
  createdAt: DateTime;
}

// Analytics types
export interface TransactionAnalytics {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  categoryBreakdown: CategoryBreakdown[];
  monthlyTrends: MonthlyTrend[];
}

export interface CategoryBreakdown {
  category: Category;
  totalAmount: number;
  transactionCount: number;
  percentage: number;
}

export interface MonthlyTrend {
  month: string;
  income: number;
  expenses: number;
  net: number;
}

// Input types for mutations
export interface CreateWalletInput {
  name: string;
  description?: string;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface UpdateWalletInput {
  name?: string;
  description?: string;
  icon?: string;
  color?: string;
  isDefault?: boolean;
}

export interface CreateTransactionInput {
  amount: number;
  description: string;
  type: TransactionType;
  date?: DateTime;
  categoryId: ID;
  sourceId: ID;
  walletId: ID;
}

export interface UpdateTransactionInput {
  amount?: number;
  description?: string;
  type?: TransactionType;
  date?: DateTime;
  categoryId?: ID;
  sourceId?: ID;
}

export interface CreateCategoryInput {
  name: string;
  icon: string;
  color: string;
  type: CategoryType;
  description?: string;
}

export interface UpdateCategoryInput {
  name?: string;
  icon?: string;
  color?: string;
  description?: string;
}

export interface CreateSourceInput {
  name: string;
  type: SourceType;
  description?: string;
  balance: number;
  icon: string;
  color: string;
  walletId: ID;
}

export interface UpdateSourceInput {
  name?: string;
  type?: SourceType;
  description?: string;
  balance?: number;
  icon?: string;
  color?: string;
  isActive?: boolean;
}

export interface CreateTransferInput {
  amount: number;
  description?: string;
  fromSourceId: ID;
  toSourceId: ID;
}

export interface UpdateUserInput {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  preferences?: Partial<UserPreferences>;
}

// Query filter types
export interface TransactionFilters {
  walletId?: ID;
  limit?: number;
  offset?: number;
  startDate?: DateTime;
  endDate?: DateTime;
  type?: TransactionType;
  categoryId?: ID;
}

export interface AnalyticsFilters {
  walletId?: ID;
  startDate: DateTime;
  endDate: DateTime;
  groupBy?: AnalyticsGroupBy;
}
