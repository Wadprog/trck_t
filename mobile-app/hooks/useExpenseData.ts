import { useState, useMemo } from 'react';
import { mockExpenses } from '../seed/mockData';
import { getCategoryTotals, preparePieChartData, filterExpensesByDateRange, calculateTotal, formatDateRange } from '../utils/expenseUtils';

export const useExpenseData = () => {
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 6, 20)); // July 20, 2025
  const [endDate, setEndDate] = useState<Date>(new Date()); // Today

  // Filter expenses by date range
  const filteredExpenses = useMemo(() => {
    return filterExpensesByDateRange(mockExpenses, startDate, endDate);
  }, [startDate, endDate]);

  // Calculate category totals and pie chart data
  const categoryTotals = useMemo(() => getCategoryTotals(filteredExpenses), [filteredExpenses]);
  const pieChartData = useMemo(() => preparePieChartData(categoryTotals), [categoryTotals]);
  const totalExpenses = useMemo(() => calculateTotal(filteredExpenses), [filteredExpenses]);

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
    expenses: filteredExpenses,
    categoryTotals,
    pieChartData,
    totalExpenses,
    
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
