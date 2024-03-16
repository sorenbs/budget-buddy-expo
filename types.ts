export interface Transaction {
  id: number;
  category_id: number;
  amount: number;
  date: number;
  description: string;
  type: string; // "Expense" | "Income";
}

export interface Category {
  id: number;
  name: string;
  type: string; //"Expense" | "Income";
}

export interface TransactionsByMonth {
  totalExpenses: number;
  totalIncome: number;
}
