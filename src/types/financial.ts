export interface RevenuePoint {
  month: string;
  actual: number | null;
  forecast: number;
  low50: number;
  high50: number;
  low80: number;
  high80: number;
}

export interface ExpensePoint {
  month: string;
  amount: number;
  category: string;
}

export interface ScenarioParameters {
  growthRate: number; // percentage, e.g. 10
  expenseReduction: number; // percentage, e.g. 5
  volatility: number; // scale 1-10
}

export interface KPIData {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  thinkingSteps?: string[];
}
