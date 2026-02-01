import { Transaction } from '@/seed/mockData';

// Source types for transaction sources
export const SOURCE_TYPES = {
  'debit-card': 'Debit Card',
  'credit-card': 'Credit Card',
  'bank-account': 'Bank Account',
  'cash': 'Cash',
  'digital-wallet': 'Digital Wallet (PayPal, Venmo, etc.)',
  'investment': 'Investment Account',
  'crypto': 'Cryptocurrency',
  'other': 'Other'
} as const;

export type SourceType = keyof typeof SOURCE_TYPES;

// Extended interfaces for wallets and transaction sources
export interface TransactionSource {
  id: number;
  name: string;
  type: SourceType;
  icon: string;
  color: string;
  balance: number;
  walletId: number;
  isActive: boolean;
  lastUsed?: string;
  createdAt: string;
  description?: string;
  metadata?: Record<string, any>; // For storing type-specific data
}

export interface Wallet {
  id: number;
  name: string;
  description?: string;
  icon: string;
  color: string;
  currency: string;
  isDefault: boolean;
  totalBalance: number;
  sources: TransactionSource[];
  createdAt: string;
}

export interface EnhancedTransaction extends Transaction {
  sourceId?: number; // Where money comes from (for expenses) or goes to (for income)
  destinationId?: number; // Where money goes to (for transfers)
  isTransfer?: boolean; // Whether this is a transfer between sources
}

// Mock data for wallets and sources
export const mockWallets: Wallet[] = [
  {
    id: 1,
    name: "Personal Wallet",
    description: "Main personal finances",
    icon: "💳",
    color: "#4F46E5",
    currency: "USD",
    isDefault: true,
    totalBalance: 2847.50,
    sources: [],
    createdAt: "2025-01-01T00:00:00Z"
  },
  {
    id: 2,
    name: "Business Wallet", 
    description: "Business expenses and income",
    icon: "💼",
    color: "#059669",
    currency: "USD",
    isDefault: false,
    totalBalance: 5120.00,
    sources: [],
    createdAt: "2025-01-15T00:00:00Z"
  }
];

export const mockTransactionSources: TransactionSource[] = [
  // Personal Wallet Sources
  {
    id: 1,
    name: "Chase Checking",
    type: "bank-account",
    icon: "🏦",
    color: "#1E40AF",
    balance: 1200.50,
    walletId: 1,
    isActive: true,
    lastUsed: "2025-07-28",
    createdAt: "2025-01-01T00:00:00Z",
    description: "Primary checking account"
  },
  {
    id: 2,
    name: "Chase Credit Card",
    type: "credit-card",
    icon: "💳",
    color: "#DC2626",
    balance: -347.20, // Negative for credit card debt
    walletId: 1,
    isActive: true,
    lastUsed: "2025-07-27",
    createdAt: "2025-01-01T00:00:00Z",
    description: "Rewards credit card"
  },
  {
    id: 3,
    name: "Cash",
    type: "cash",
    icon: "💵",
    color: "#16A34A",
    balance: 150.00,
    walletId: 1,
    isActive: true,
    lastUsed: "2025-07-26",
    createdAt: "2025-01-01T00:00:00Z",
    description: "Physical cash"
  },
  {
    id: 4,
    name: "Savings Account",
    type: "bank-account",
    icon: "🏛️",
    color: "#7C3AED",
    balance: 1844.20,
    walletId: 1,
    isActive: true,
    lastUsed: "2025-07-20",
    createdAt: "2025-01-01T00:00:00Z",
    description: "Emergency savings"
  },
  // Business Wallet Sources
  {
    id: 5,
    name: "Business Checking",
    type: "bank-account",
    icon: "🏢",
    color: "#EA580C",
    balance: 4200.00,
    walletId: 2,
    isActive: true,
    lastUsed: "2025-07-25",
    createdAt: "2025-01-15T00:00:00Z",
    description: "Business operating account"
  },
  {
    id: 6,
    name: "Business Credit",
    type: "credit-card",
    icon: "💼",
    color: "#BE185D",
    balance: -280.00,
    walletId: 2,
    isActive: true,
    lastUsed: "2025-07-24",
    createdAt: "2025-01-15T00:00:00Z",
    description: "Business credit card"
  },
  {
    id: 7,
    name: "PayPal",
    type: "digital-wallet",
    icon: "📱",
    color: "#0EA5E9",
    balance: 1200.00,
    walletId: 2,
    isActive: true,
    lastUsed: "2025-07-23",
    createdAt: "2025-01-20T00:00:00Z",
    description: "PayPal business account"
  }
];

// Source type configurations - moved to top of file
