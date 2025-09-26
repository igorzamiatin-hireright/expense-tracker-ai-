'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { SummaryCard } from '@/components/SummaryCard';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CloudExportHub } from '@/components/cloud/CloudExportHub';
import { useRouter } from 'next/navigation';
import {
  DollarSign,
  Calendar,
  PieChart,
  Plus,
  TrendingUp,
  Cloud,
  Zap
} from 'lucide-react';

export default function Dashboard() {
  const { expenses, loading, getSummary } = useExpenses();
  const router = useRouter();
  const [isCloudExportOpen, setIsCloudExportOpen] = useState(false);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const summary = getSummary();

  const handleOpenCloudExport = () => {
    setIsCloudExportOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Track your expenses and manage your budget
          </p>
        </div>
        <div className="flex gap-3 mt-4 sm:mt-0">
          <Button
            onClick={handleOpenCloudExport}
            disabled={expenses.length === 0}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
          >
            <Cloud className="w-4 h-4 mr-2" />
            Cloud Export
            <Zap className="w-3 h-3 ml-1 opacity-70" />
          </Button>
          <Button onClick={() => router.push('/add')}>
            <Plus className="w-4 h-4 mr-2" />
            Add Expense
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SummaryCard
          title="Total Expenses"
          value={summary.totalExpenses}
          icon={<DollarSign className="w-6 h-6 text-blue-600" />}
        />
        <SummaryCard
          title="This Month"
          value={summary.monthlyExpenses}
          icon={<Calendar className="w-6 h-6 text-blue-600" />}
        />
        <SummaryCard
          title="Total Transactions"
          value={expenses.length.toString()}
          icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
        />
      </div>

      {/* Recent Expenses & Top Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Expenses */}
        <Card title="Recent Expenses">
          {expenses.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No expenses recorded yet</p>
              <Button onClick={() => router.push('/add')}>
                Add Your First Expense
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {expenses
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5)
                .map(expense => (
                  <div
                    key={expense.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{expense.description}</p>
                      <p className="text-sm text-gray-600">{expense.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        ${expense.amount.toFixed(2)}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(expense.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              {expenses.length > 5 && (
                <div className="text-center pt-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push('/expenses')}
                  >
                    View All Expenses
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Top Categories */}
        <Card title="Top Categories">
          {summary.topCategories.length === 0 ? (
            <div className="text-center py-8">
              <PieChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No category data available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {summary.topCategories.map(({ category, amount, percentage }) => (
                <div key={category} className="flex items-center">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        {category}
                      </span>
                      <span className="text-sm text-gray-600">
                        ${amount.toFixed(2)}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {percentage.toFixed(1)}% of total
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Cloud Export Hub */}
      <CloudExportHub
        isOpen={isCloudExportOpen}
        onClose={() => setIsCloudExportOpen(false)}
        expenses={expenses}
      />
    </div>
  );
}