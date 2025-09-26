'use client';

import { useState, useEffect } from 'react';
import { Expense, ExpenseCategory, ExpenseSummary, ExpenseFilters } from '@/types/expense';
import { storage } from '@/utils/storage';
import { isDateInCurrentMonth, isDateInRange } from '@/utils/date';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExpenses = () => {
      try {
        const storedExpenses = storage.getExpenses();
        setExpenses(storedExpenses);
      } catch (error) {
        console.error('Error loading expenses:', error);
      } finally {
        setLoading(false);
      }
    };

    loadExpenses();
  }, []);

  const addExpense = (expense: Expense) => {
    storage.addExpense(expense);
    setExpenses(prev => [...prev, expense]);
  };

  const updateExpense = (id: string, updatedData: Partial<Expense>) => {
    storage.updateExpense(id, updatedData);
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === id
          ? { ...expense, ...updatedData, updatedAt: new Date().toISOString() }
          : expense
      )
    );
  };

  const deleteExpense = (id: string) => {
    storage.deleteExpense(id);
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const getFilteredExpenses = (filters: ExpenseFilters): Expense[] => {
    return expenses.filter(expense => {
      if (filters.category && filters.category !== 'all' && expense.category !== filters.category) {
        return false;
      }

      if (filters.search && !expense.description.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      if (!isDateInRange(expense.date, filters.dateFrom, filters.dateTo)) {
        return false;
      }

      return true;
    });
  };

  const getSummary = (): ExpenseSummary => {
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const monthlyExpenses = expenses
      .filter(expense => isDateInCurrentMonth(expense.date))
      .reduce((sum, expense) => sum + expense.amount, 0);

    const categoryTotals = expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    const topCategories = Object.entries(categoryTotals)
      .map(([category, amount]) => ({
        category: category as ExpenseCategory,
        amount,
        percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return {
      totalExpenses,
      monthlyExpenses,
      categoryTotals,
      topCategories
    };
  };

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense,
    getFilteredExpenses,
    getSummary
  };
};