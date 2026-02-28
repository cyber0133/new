export type User = {
  id: string;
  email: string;
  name: string;
  country: string;
  isVerified: boolean;
  isAdmin?: boolean;
  balance?: number;
  lockedPages?: string[];
};

export type AccountType = 'DEMO' | 'LIVE';

export type Account = {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  leverage: number;
  type: AccountType;
  currency: string;
};

export type TradeType = 'BUY' | 'SELL';

export type TradeStatus = 'OPEN' | 'CLOSED';

export type Trade = {
  id: string;
  symbol: string;
  type: TradeType;
  lots: number;
  entryPrice: number;
  currentPrice: number;
  sl: number | null;
  tp: number | null;
  openTime: number;
  closeTime?: number;
  profit: number;
  status: TradeStatus;
  commission: number;
  swap: number;
};

export type Asset = {
  symbol: string;
  bid: number;
  ask: number;
  spread: number;
  digits: number;
  change: number; // Daily change percentage
};

export type Signal = {
  id: string;
  symbol: string;
  type: TradeType;
  entry: number;
  sl: number;
  tp: number;
  confidence: number;
  time: number;
};

export type TransactionType = 'DEPOSIT' | 'WITHDRAWAL';
export type TransactionStatus =
'PENDING' |
'APPROVED' |
'COMPLETED' |
'REJECTED';

export type Transaction = {
  id: string;
  type: TransactionType;
  amount: number;
  method: string;
  status: TransactionStatus;
  date: number;
};

export type PurchasedBot = {
  id: string;
  userId: string;
  botId: string;
  botName: string;
  allocatedAmount: number;
  totalEarned: number;
  totalLost: number;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'PAUSED' | 'CLOSED';
  purchasedAt: number;
  approvedAt?: number;
  performance: number; // percentage: 64, 72, etc
  dailyReturn?: number; // 5-15% range
};

export type PurchasedSignal = {
  id: string;
  userId: string;
  signalId: string;
  providerName: string;
  cost: number;
  status: 'PENDING_APPROVAL' | 'ACTIVE' | 'EXPIRED';
  subscribedAt: number;
  approvedAt?: number;
  tradesFollowed: number;
  winRate: number;
  earnings: number;
};
  status: TransactionStatus;
  date: number;
};