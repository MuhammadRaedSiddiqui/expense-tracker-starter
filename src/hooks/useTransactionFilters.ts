import { useState, useMemo, useCallback } from 'react';

interface Transaction {
  description: string;
  type: string;
  category: string;
  date: string;
  [key: string]: any;
}

export interface FilterState {
  searchTerm: string;
  filterType: string;
  filterCategory: string;
  startDate: string;
  endDate: string;
}

export interface FilterActions {
  setSearchTerm: (value: string) => void;
  setFilterType: (value: string) => void;
  setFilterCategory: (value: string) => void;
  setStartDate: (value: string) => void;
  setEndDate: (value: string) => void;
  resetFilters: () => void;
}

export function useTransactionFilters(transactions: Transaction[] | undefined) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const resetFilters = useCallback(() => {
    setSearchTerm('');
    setFilterType('all');
    setFilterCategory('all');
    setStartDate('');
    setEndDate('');
  }, []);

  const filteredTransactions = useMemo(() => {
    if (!transactions) return [];

    return transactions.filter((t) => {
      if (searchTerm && !t.description.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filterType !== 'all' && t.type !== filterType) {
        return false;
      }
      if (filterCategory !== 'all' && t.category !== filterCategory) {
        return false;
      }
      const transactionDate = new Date(t.date);
      if (startDate && transactionDate < new Date(startDate)) {
        return false;
      }
      if (endDate && transactionDate > new Date(endDate)) {
        return false;
      }
      return true;
    });
  }, [transactions, searchTerm, filterType, filterCategory, startDate, endDate]);

  const filters: FilterState = { searchTerm, filterType, filterCategory, startDate, endDate };
  const actions: FilterActions = { setSearchTerm, setFilterType, setFilterCategory, setStartDate, setEndDate, resetFilters };

  return { filters, actions, filteredTransactions };
}
