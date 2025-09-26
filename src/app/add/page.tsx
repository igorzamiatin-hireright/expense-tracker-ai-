'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseFormData, Expense } from '@/types/expense';
import { parseCurrency } from '@/utils/currency';

export default function AddExpensePage() {
  const router = useRouter();
  const { addExpense } = useExpenses();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: ExpenseFormData) => {
    setLoading(true);

    try {
      const expense: Expense = {
        id: Date.now().toString(),
        amount: parseCurrency(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      addExpense(expense);
      router.push('/');
    } catch (error) {
      console.error('Error adding expense:', error);
      alert('Failed to add expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Add New Expense</h1>
        <p className="text-gray-600 mt-1">
          Record a new expense to track your spending
        </p>
      </div>

      <ExpenseForm
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel="Add Expense"
        loading={loading}
      />
    </div>
  );
}