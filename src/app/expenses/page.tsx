'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseList } from '@/components/ExpenseList';
import { ExpenseFilters } from '@/components/ExpenseFilters';
import { Button } from '@/components/ui/Button';
import { ExpenseFilters as ExpenseFiltersType, Expense } from '@/types/expense';
import { Plus, Download } from 'lucide-react';
import { exportToCSV } from '@/utils/export';

export default function ExpensesPage() {
  const router = useRouter();
  const { loading, deleteExpense, getFilteredExpenses } = useExpenses();

  const [filters, setFilters] = useState<ExpenseFiltersType>({
    category: 'all',
    search: '',
    dateFrom: '',
    dateTo: ''
  });

  const filteredExpenses = getFilteredExpenses(filters);
  const sortedExpenses = filteredExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleEdit = (expense: Expense) => {
    router.push(`/expenses/${expense.id}/edit`);
  };

  const handleClearFilters = () => {
    setFilters({
      category: 'all',
      search: '',
      dateFrom: '',
      dateTo: ''
    });
  };

  const handleExport = () => {
    if (sortedExpenses.length === 0) {
      alert('No expenses to export');
      return;
    }
    exportToCSV(sortedExpenses, 'filtered-expenses.csv');
  };

  const totalAmount = sortedExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Expenses</h1>
          <p className="text-gray-600 mt-1">
            Manage and review your expense history
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={sortedExpenses.length === 0}
          >
            <Download className="w-4 h-4 mr-2" />
            Export CSV
          </Button>
          <Button onClick={() => router.push('/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ExpenseFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        className="mb-8"
      />

      {/* Summary */}
      <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">
              ${totalAmount.toFixed(2)}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Number of Expenses</p>
            <p className="text-2xl font-bold text-gray-900">
              {sortedExpenses.length}
            </p>
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-gray-600">Average Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              ${sortedExpenses.length > 0 ? (totalAmount / sortedExpenses.length).toFixed(2) : '0.00'}
            </p>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <ExpenseList
        expenses={sortedExpenses}
        onEdit={handleEdit}
        onDelete={deleteExpense}
        loading={loading}
      />
    </div>
  );
}