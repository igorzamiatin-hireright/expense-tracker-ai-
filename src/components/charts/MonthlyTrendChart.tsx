'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { Expense } from '@/types/expense';
import { format, parseISO, eachMonthOfInterval, startOfMonth, endOfMonth } from 'date-fns';

interface MonthlyTrendChartProps {
  expenses: Expense[];
  chartType?: 'line' | 'bar';
}

export const MonthlyTrendChart: React.FC<MonthlyTrendChartProps> = ({
  expenses,
  chartType = 'line'
}) => {
  if (!expenses || expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📈</div>
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

  const monthlyData = eachMonthOfInterval({
    start: sixMonthsAgo,
    end: now
  }).map(month => {
    const monthStart = startOfMonth(month);
    const monthEnd = endOfMonth(month);

    const monthlyExpenses = expenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return expenseDate >= monthStart && expenseDate <= monthEnd;
    });

    const total = monthlyExpenses.reduce((sum, expense) => sum + expense.amount, 0);

    return {
      month: format(month, 'MMM yyyy'),
      amount: total,
      count: monthlyExpenses.length
    };
  });

  const CustomTooltip = ({ active, payload, label }: {
    active?: boolean;
    payload?: Array<{ value: number; payload: { count: number } }>;
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-blue-600">
            Amount: ${payload[0].value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            Transactions: {payload[0].payload.count}
          </p>
        </div>
      );
    }
    return null;
  };

  const maxAmount = Math.max(...monthlyData.map(d => d.amount));

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        {chartType === 'line' ? (
          <LineChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              domain={[0, maxAmount * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="amount"
              stroke="#3B82F6"
              strokeWidth={2}
              dot={{ r: 4, fill: '#3B82F6' }}
              activeDot={{ r: 6, fill: '#1D4ED8' }}
            />
          </LineChart>
        ) : (
          <BarChart data={monthlyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12 }}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(value) => `$${value}`}
              tick={{ fontSize: 12 }}
              tickLine={false}
              domain={[0, maxAmount * 1.1]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="amount"
              fill="#3B82F6"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};