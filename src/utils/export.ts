import { Expense } from '@/types/expense';
import { formatDate } from './date';

export const exportToCSV = (expenses: Expense[], filename = 'expenses.csv'): void => {
  const headers = ['Date', 'Description', 'Category', 'Amount'];
  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      formatDate(expense.date),
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.category,
      expense.amount.toString()
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  window.URL.revokeObjectURL(url);
};