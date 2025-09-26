'use client';

import { useState } from 'react';
import { useExpenses } from '@/hooks/useExpenses';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { CategoryChart } from '@/components/charts/CategoryChart';
import { MonthlyTrendChart } from '@/components/charts/MonthlyTrendChart';
import { SummaryCard } from '@/components/SummaryCard';
import { BarChart3, PieChart, TrendingUp, Calendar, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/utils/currency';
import { isDateInCurrentMonth } from '@/utils/date';

export default function AnalyticsPage() {
  const { expenses, loading, getSummary } = useExpenses();
  const [chartType, setChartType] = useState<'line' | 'bar'>('line');

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
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="h-96 bg-gray-300 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const summary = getSummary();

  const currentMonthExpenses = expenses.filter(expense =>
    isDateInCurrentMonth(expense.date)
  );

  const lastMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return (
      expenseDate.getMonth() === lastMonth.getMonth() &&
      expenseDate.getFullYear() === lastMonth.getFullYear()
    );
  });

  const currentMonthTotal = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const monthlyChange = lastMonthTotal > 0
    ? ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100
    : 0;

  const avgExpenseAmount = expenses.length > 0
    ? expenses.reduce((sum, expense) => sum + expense.amount, 0) / expenses.length
    : 0;

  const avgCurrentMonth = currentMonthExpenses.length > 0
    ? currentMonthTotal / currentMonthExpenses.length
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="text-gray-600 mt-1">
          Analyze your spending patterns and financial trends
        </p>
      </div>

      {expenses.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-gray-400 mb-6">
            <BarChart3 className="w-24 h-24 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Data Available</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Start adding expenses to see detailed analytics and insights about your spending habits.
          </p>
          <Button onClick={() => window.location.href = '/add'}>
            Add Your First Expense
          </Button>
        </div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <SummaryCard
              title="This Month"
              value={currentMonthTotal}
              icon={<Calendar className="w-6 h-6 text-blue-600" />}
              trend={
                lastMonthTotal > 0
                  ? {
                      value: Math.abs(monthlyChange),
                      isPositive: monthlyChange < 0
                    }
                  : undefined
              }
            />
            <SummaryCard
              title="Average Expense"
              value={avgExpenseAmount}
              icon={<DollarSign className="w-6 h-6 text-blue-600" />}
            />
            <SummaryCard
              title="Monthly Avg"
              value={avgCurrentMonth}
              icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
            />
            <SummaryCard
              title="Total Categories"
              value={summary.topCategories.length.toString()}
              icon={<PieChart className="w-6 h-6 text-blue-600" />}
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Monthly Trend Chart */}
            <Card title="Spending Trend">
              <div className="mb-4">
                <div className="flex space-x-2">
                  <Button
                    variant={chartType === 'line' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('line')}
                  >
                    Line Chart
                  </Button>
                  <Button
                    variant={chartType === 'bar' ? 'primary' : 'outline'}
                    size="sm"
                    onClick={() => setChartType('bar')}
                  >
                    Bar Chart
                  </Button>
                </div>
              </div>
              <MonthlyTrendChart expenses={expenses} chartType={chartType} />
            </Card>

            {/* Category Distribution Chart */}
            <Card title="Spending by Category">
              <CategoryChart data={summary.topCategories} />
            </Card>
          </div>

          {/* Detailed Category Analysis */}
          <Card title="Category Breakdown" className="mb-8">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Amount
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Percentage
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Transactions
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg per Transaction
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {summary.topCategories.map(({ category, amount, percentage }) => {
                    const categoryExpenses = expenses.filter(e => e.category === category);
                    const avgPerTransaction = categoryExpenses.length > 0 ? amount / categoryExpenses.length : 0;

                    return (
                      <tr key={category} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="font-medium text-gray-900">{category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {formatCurrency(amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-sm text-gray-900 mr-2">
                              {percentage.toFixed(1)}%
                            </span>
                            <div className="flex-1 bg-gray-200 rounded-full h-2 max-w-24">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {categoryExpenses.length}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-900">
                          {formatCurrency(avgPerTransaction)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      )}
    </div>
  );
}