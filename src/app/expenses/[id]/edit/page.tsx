'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExpenseForm } from '@/components/forms/ExpenseForm';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseFormData, Expense } from '@/types/expense';
import { parseCurrency } from '@/utils/currency';
import { formatDateInput } from '@/utils/date';

interface EditExpensePageProps {
  params: {
    id: string;
  };
}

export default function EditExpensePage({ params }: EditExpensePageProps) {
  const router = useRouter();
  const { expenses, updateExpense } = useExpenses();
  const [expense, setExpense] = useState<Expense | null>(null);
  const [loading, setLoading] = useState(false);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const foundExpense = expenses.find(e => e.id === params.id);
    if (foundExpense) {
      setExpense(foundExpense);
    } else if (expenses.length > 0) {
      setNotFound(true);
    }
  }, [expenses, params.id]);

  const handleSubmit = async (formData: ExpenseFormData) => {
    if (!expense) return;

    setLoading(true);

    try {
      const updatedData: Partial<Expense> = {
        amount: parseCurrency(formData.amount),
        category: formData.category,
        description: formData.description,
        date: formData.date,
        updatedAt: new Date().toISOString()
      };

      updateExpense(expense.id, updatedData);
      router.push('/expenses');
    } catch (error) {
      console.error('Error updating expense:', error);
      alert('Failed to update expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (notFound) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Expense Not Found</h1>
          <p className="text-gray-600 mb-6">
            The expense you&apos;re trying to edit could not be found.
          </p>
          <button
            onClick={() => router.push('/expenses')}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Back to Expenses
          </button>
        </div>
      </div>
    );
  }

  if (!expense) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded mb-6"></div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="space-y-4">
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
              <div className="h-4 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Edit Expense</h1>
        <p className="text-gray-600 mt-1">
          Make changes to your expense record
        </p>
      </div>

      <ExpenseForm
        initialData={{
          ...expense,
          date: formatDateInput(expense.date)
        }}
        onSubmit={handleSubmit}
        onCancel={() => router.back()}
        submitLabel="Update Expense"
        loading={loading}
      />
    </div>
  );
}