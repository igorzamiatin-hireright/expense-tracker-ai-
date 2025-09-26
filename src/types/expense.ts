export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';

export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExpenseFormData {
  amount: string;
  category: ExpenseCategory;
  description: string;
  date: string;
}

export interface ExpenseFilters {
  category?: ExpenseCategory | 'all';
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

export interface ExpenseSummary {
  totalExpenses: number;
  monthlyExpenses: number;
  categoryTotals: Record<ExpenseCategory, number>;
  topCategories: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
}