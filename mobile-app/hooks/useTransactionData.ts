import { useState, useMemo } from 'react';
import { mockTransactions } from '../seed/mockData';
import { 
  getCategoryTotals, 
  preparePieChartData, 
  filterTransactionsByDateRange, 
  filterTransactionsByType,
  calculateTotal,
  calculateTotalExpenses,
  calculateTotalIncome,
  calculateNetBalance,
  formatDateRange 
} from '../utils/expenseUtils';

export const useTransactionData = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 6, 20)); // July 20, 2025
  const [endDate, setEndDate] = useState<Date>(new Date()); // Today
  const [filterType, setFilterType] = useState<'all' | 'income' | 'expense'>('all');

  // Filter transactions by date range
  const filteredTransactions = useMemo(() => {
    let transactions = filterTransactionsByDateRange(mockTransactions, startDate, endDate);
    
    if (filterType === 'income') {
      transactions = filterTransactionsByType(transactions, 'income');
    } else if (filterType === 'expense') {
      transactions = filterTransactionsByType(transactions, 'expense');
    }
    
    return transactions;
  }, [startDate, endDate, filterType]);

  // Calculate category totals and pie chart data
  const categoryTotals = useMemo(() => getCategoryTotals(filteredTransactions), [filteredTransactions]);
  const pieChartData = useMemo(() => preparePieChartData(categoryTotals), [categoryTotals]);
  
  // Calculate totals
  const totalExpenses = useMemo(() => calculateTotalExpenses(filteredTransactions), [filteredTransactions]);
  const totalIncome = useMemo(() => calculateTotalIncome(filteredTransactions), [filteredTransactions]);
  const netBalance = useMemo(() => calculateNetBalance(filteredTransactions), [filteredTransactions]);
  const totalTransactions = useMemo(() => calculateTotal(filteredTransactions), [filteredTransactions]);

  // Date range utilities
  const dateRangeText = useMemo(() => formatDateRange(startDate, endDate), [startDate, endDate]);

  const setDateRange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  const setTodayRange = () => {
    const today = new Date();
    setDateRange(today, today);
  };

  const setLastWeekRange = () => {
    const today = new Date();
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    setDateRange(lastWeek, today);
  };

  const setLastMonthRange = () => {
    const today = new Date();
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    setDateRange(lastMonth, today);
  };

  return {
    // Data
    transactions: filteredTransactions,
    categoryTotals,
    pieChartData,
    
    // Totals
    totalExpenses,
    totalIncome,
    netBalance,
    totalTransactions,
    
    // Filters
    filterType,
    setFilterType,
    
    // Date range
    startDate,
    endDate,
    dateRangeText,
    setStartDate,
    setEndDate,
    setDateRange,
    
    // Quick date setters
    setTodayRange,
    setLastWeekRange,
    setLastMonthRange,
  };
};

// Legacy export for backward compatibility
export const useExpenseData = useTransactionData;
