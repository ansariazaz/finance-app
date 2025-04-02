import { toast } from "sonner";

// Types
export type Transaction = {
  id: string;
  date: string;
  amount: number;
  category: string;
  description: string;
  type: 'income' | 'expense';
};

export type Budget = {
  id: string;
  category: string;
  amount: number;
  spent: number;
  period: 'monthly' | 'weekly' | 'yearly';
};

// Mock data
let TRANSACTIONS: Transaction[] = [
  {
    id: '1',
    date: '2025-04-01',
    amount: 2000,
    category: 'Salary',
    description: 'Monthly salary',
    type: 'income',
  },
  {
    id: '2',
    date: '2025-04-02',
    amount: 500,
    category: 'Rent',
    description: 'Monthly rent payment',
    type: 'expense',
  },
  {
    id: '3',
    date: '2025-04-02',
    amount: 50,
    category: 'Groceries',
    description: 'Weekly grocery shopping',
    type: 'expense',
  },
  {
    id: '4',
    date: '2025-04-03',
    amount: 100,
    category: 'Utilities',
    description: 'Electricity bill',
    type: 'expense',
  },
  {
    id: '5',
    date: '2025-04-04',
    amount: 300,
    category: 'Freelance',
    description: 'Website development project',
    type: 'income',
  },
];

let BUDGETS: Budget[] = [
  {
    id: '1',
    category: 'Groceries',
    amount: 400,
    spent: 210,
    period: 'monthly',
  },
  {
    id: '2',
    category: 'Entertainment',
    amount: 200,
    spent: 150,
    period: 'monthly',
  },
  {
    id: '3',
    category: 'Transportation',
    amount: 150,
    spent: 80,
    period: 'monthly',
  },
  {
    id: '4',
    category: 'Dining Out',
    amount: 300,
    spent: 250,
    period: 'monthly',
  },
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Transaction Service
export const transactionService = {
  // Get all transactions
  getAll: async (): Promise<Transaction[]> => {
    await delay(500); // Simulate network delay
    return [...TRANSACTIONS].sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  },
  
  // Add a new transaction
  add: async (transaction: Omit<Transaction, 'id'>): Promise<Transaction> => {
    await delay(500);
    
    const newTransaction = {
      ...transaction,
      id: Date.now().toString(),
    };
    
    TRANSACTIONS = [...TRANSACTIONS, newTransaction];
    toast.success('Transaction added successfully');
    return newTransaction;
  },
  
  // Update a transaction
  update: async (transaction: Transaction): Promise<Transaction> => {
    await delay(500);
    
    TRANSACTIONS = TRANSACTIONS.map(t => 
      t.id === transaction.id ? transaction : t
    );
    
    toast.success('Transaction updated successfully');
    return transaction;
  },
  
  // Delete a transaction
  delete: async (id: string): Promise<void> => {
    await delay(500);
    TRANSACTIONS = TRANSACTIONS.filter(t => t.id !== id);
    toast.success('Transaction deleted successfully');
  },
  
  // Get transaction summary (for dashboard)
  getSummary: async () => {
    await delay(500);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyTransactions = TRANSACTIONS.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    
    const totalIncome = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const totalExpenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
      
    const netIncome = totalIncome - totalExpenses;
    
    // Get expense breakdown by category
    const expenseByCategory = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((acc: Record<string, number>, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {});
      
    // Recent transactions (last 5)
    const recentTransactions = [...TRANSACTIONS]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
      
    return {
      totalIncome,
      totalExpenses,
      netIncome,
      expenseByCategory,
      recentTransactions,
    };
  }
};

// Budget Service
export const budgetService = {
  // Get all budgets
  getAll: async (): Promise<Budget[]> => {
    await delay(500);
    return [...BUDGETS];
  },
  
  // Add a new budget
  add: async (budget: Omit<Budget, 'id' | 'spent'>): Promise<Budget> => {
    await delay(500);
    
    const newBudget = {
      ...budget,
      id: Date.now().toString(),
      spent: 0,
    };
    
    BUDGETS = [...BUDGETS, newBudget];
    toast.success('Budget added successfully');
    return newBudget;
  },
  
  // Update a budget
  update: async (budget: Budget): Promise<Budget> => {
    await delay(500);
    
    BUDGETS = BUDGETS.map(b => 
      b.id === budget.id ? budget : b
    );
    
    toast.success('Budget updated successfully');
    return budget;
  },
  
  // Delete a budget
  delete: async (id: string): Promise<void> => {
    await delay(500);
    BUDGETS = BUDGETS.filter(b => b.id !== id);
    toast.success('Budget deleted successfully');
  },
  
  // Update budget spending based on transactions
  updateSpending: async (): Promise<void> => {
    await delay(200);
    
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const monthlyExpenses = TRANSACTIONS
      .filter(t => {
        const date = new Date(t.date);
        return t.type === 'expense' && 
               date.getMonth() === currentMonth && 
               date.getFullYear() === currentYear;
      });
      
    // Calculate spent amount per category
    const spentByCategory = monthlyExpenses.reduce((acc: Record<string, number>, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {});
    
    // Update budgets with actual spending
    BUDGETS = BUDGETS.map(budget => ({
      ...budget,
      spent: spentByCategory[budget.category] || 0,
    }));
  },
};

// Financial categories
export const CATEGORIES = {
  INCOME: [
    'Salary',
    'Freelance',
    'Investments',
    'Gift',
    'Other Income'
  ],
  EXPENSE: [
    'Housing',
    'Transportation',
    'Food',
    'Utilities',
    'Insurance',
    'Healthcare',
    'Debt',
    'Entertainment',
    'Personal',
    'Education',
    'Clothing',
    'Gifts',
    'Travel',
    'Groceries',
    'Dining Out',
    'Rent',
    'Other Expense'
  ],
};
