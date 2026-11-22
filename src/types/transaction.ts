export type TransactionType = 'income' | 'expense';

export interface TransactionFormData {
  type: TransactionType;
  amount: number;
  category: string;
  account: string;
  note: string;
  date: string;
}

export type TransactionPayload = TransactionFormData;

export interface Transaction {
  _id: string;
  type: TransactionType;
  amount: number;
  category: string;
  account: string;
  note: string;
  date: string;
}

export interface TransactionResponse {
  success: boolean;
  data: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}