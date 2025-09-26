'use client';

import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ExpenseCategory } from '@/types/expense';

interface CategoryChartProps {
  data: Array<{
    category: ExpenseCategory;
    amount: number;
    percentage: number;
  }>;
}

const COLORS = {
  Food: '#3B82F6',
  Transportation: '#10B981',
  Entertainment: '#F59E0B',
  Shopping: '#EF4444',
  Bills: '#8B5CF6',
  Other: '#6B7280'
};

export const CategoryChart: React.FC<CategoryChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-80">
        <div className="text-center text-gray-500">
          <div className="text-6xl mb-4">📊</div>
          <p>No data to display</p>
        </div>
      </div>
    );
  }

  const chartData = data.map(item => ({
    name: item.category,
    value: item.amount,
    percentage: item.percentage
  }));

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ payload: { name: string; value: number; percentage: number } }> }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md">
          <p className="font-medium">{data.name}</p>
          <p className="text-sm text-gray-600">
            Amount: ${data.value.toFixed(2)}
          </p>
          <p className="text-sm text-gray-600">
            {data.percentage.toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[entry.name as ExpenseCategory]}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};