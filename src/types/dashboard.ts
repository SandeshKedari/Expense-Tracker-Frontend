export interface DashboardSummary {
    totalBalance: number;
    totalIncome: number;
    totalExpenses: number;
    monthlyBudget: number;
    remainingBudget: number;
    budgetUsedPercentage: number;
}

export interface MonthlyOverview {
    month: string;
    income: number;
    expenses: number;
}

export interface CategoryExpense {
    category: string;
    amount: number;
}

export interface RecentTransaction {
    _id: string;
    type: 'income' | 'expense';
    category: string;
    note?: string;
    account: string;
    amount: number;
    date: string;
}

export interface DashboardData {
    summary: DashboardSummary;
    monthlyOverview: MonthlyOverview[];
    categoryBreakdown: CategoryExpense[];
    recentTransactions: RecentTransaction[];
}

// {
//   "summary": {
//     "totalBalance": 25000,
//     "totalIncome": 40000,
//     "totalExpenses": 15000,
//     "monthlyBudget": 20000,
//     "remainingBudget": 5000,
//     "budgetUsedPercentage": 75
//   },
//   "monthlyOverview": [],
//   "categoryBreakdown": [],
//   "recentTransactions": []
// }