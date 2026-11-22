import axios from 'axios';
import type {
  Transaction,
  TransactionFormData,
  TransactionResponse,
} from '../types/transaction';

const API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export interface TransactionFilters {
  page?: number;
  limit?: number;
  type?: string;
  category?: string;
  account?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  minAmount?: number;
  maxAmount?: number;
}

export const getTransactions = async (
  filters: TransactionFilters = {},
): Promise<TransactionResponse> => {
  const response = await api.get<TransactionResponse>('/transactions', {
    params: filters,
  });

  return response.data;
};

export const createTransaction = async (
  payload: TransactionFormData,
): Promise<Transaction> => {
  const response = await api.post('/transactions', payload);
  return response.data.data;
};

export const updateTransaction = async (
  id: string,
  payload: TransactionFormData,
): Promise<Transaction> => {
  const response = await api.put(`/transactions/${id}`, payload);
  return response.data.data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await api.delete(`/transactions/${id}`);
};

// This endpoint needs the budget backend route/controller to be implemented.
export const setMonthlyBudget = async (amount: number): Promise<void> => {
  await api.put('/budgets/monthly', { amount });
};