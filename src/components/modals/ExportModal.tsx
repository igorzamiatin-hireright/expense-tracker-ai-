'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Expense, ExpenseCategory } from '@/types/expense';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import {
  X,
  Download,
  FileText,
  Database,
  FileType,
  Calendar,
  Filter,
  Eye,
  Settings,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { formatDate } from '@/utils/date';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  expenses: Expense[];
}

type ExportFormat = 'csv' | 'json' | 'pdf';

interface ExportFilters {
  dateFrom: string;
  dateTo: string;
  categories: ExpenseCategory[];
}

interface ExportConfig {
  format: ExportFormat;
  filename: string;
  filters: ExportFilters;
}

const CATEGORIES: ExpenseCategory[] = ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other'];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, expenses }) => {
  const [activeTab, setActiveTab] = useState<'configure' | 'preview'>('configure');
  const [isExporting, setIsExporting] = useState(false);
  const [exportStatus, setExportStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const [config, setConfig] = useState<ExportConfig>({
    format: 'csv',
    filename: `expenses_${new Date().toISOString().split('T')[0]}`,
    filters: {
      dateFrom: '',
      dateTo: '',
      categories: [...CATEGORIES]
    }
  });

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setActiveTab('configure');
      setExportStatus('idle');
      setIsExporting(false);
    }
  }, [isOpen]);

  // Filter expenses based on current filters
  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const fromDate = config.filters.dateFrom ? new Date(config.filters.dateFrom) : null;
      const toDate = config.filters.dateTo ? new Date(config.filters.dateTo) : null;

      // Date filtering
      if (fromDate && expenseDate < fromDate) return false;
      if (toDate && expenseDate > toDate) return false;

      // Category filtering
      if (!config.filters.categories.includes(expense.category)) return false;

      return true;
    });
  }, [expenses, config.filters]);

  // Export summary statistics
  const exportSummary = useMemo(() => {
    const totalAmount = filteredExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const categoryBreakdown = filteredExpenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);

    return {
      recordCount: filteredExpenses.length,
      totalAmount,
      categoryBreakdown,
      dateRange: {
        from: filteredExpenses.length > 0 ?
          Math.min(...filteredExpenses.map(e => new Date(e.date).getTime())) : null,
        to: filteredExpenses.length > 0 ?
          Math.max(...filteredExpenses.map(e => new Date(e.date).getTime())) : null
      }
    };
  }, [filteredExpenses]);

  const handleCategoryToggle = (category: ExpenseCategory) => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        categories: prev.filters.categories.includes(category)
          ? prev.filters.categories.filter(c => c !== category)
          : [...prev.filters.categories, category]
      }
    }));
  };

  const selectAllCategories = () => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        categories: [...CATEGORIES]
      }
    }));
  };

  const deselectAllCategories = () => {
    setConfig(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        categories: []
      }
    }));
  };

  const handleExport = async () => {
    if (filteredExpenses.length === 0) {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
      return;
    }

    setIsExporting(true);
    setExportStatus('idle');

    try {
      // Simulate export processing time
      await new Promise(resolve => setTimeout(resolve, 1500));

      switch (config.format) {
        case 'csv':
          await exportToCSV();
          break;
        case 'json':
          await exportToJSON();
          break;
        case 'pdf':
          await exportToPDF();
          break;
      }

      setExportStatus('success');
      setTimeout(() => {
        setExportStatus('idle');
        onClose();
      }, 2000);
    } catch {
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  const exportToCSV = async () => {
    const headers = ['Date', 'Description', 'Category', 'Amount'];
    const csvContent = [
      headers.join(','),
      ...filteredExpenses.map(expense => [
        formatDate(expense.date),
        `"${expense.description.replace(/"/g, '""')}"`,
        expense.category,
        expense.amount.toString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    downloadFile(blob, `${config.filename}.csv`);
  };

  const exportToJSON = async () => {
    const jsonData = {
      exportDate: new Date().toISOString(),
      summary: exportSummary,
      expenses: filteredExpenses.map(expense => ({
        id: expense.id,
        date: expense.date,
        description: expense.description,
        category: expense.category,
        amount: expense.amount,
        createdAt: expense.createdAt,
        updatedAt: expense.updatedAt
      }))
    };

    const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json' });
    downloadFile(blob, `${config.filename}.json`);
  };

  const exportToPDF = async () => {
    // For this demo, we'll create a simple text-based PDF content
    // In a real app, you'd use a library like jsPDF or PDFKit
    const pdfContent = `EXPENSE REPORT
Generated on: ${new Date().toLocaleDateString()}

SUMMARY
Total Records: ${exportSummary.recordCount}
Total Amount: $${exportSummary.totalAmount.toFixed(2)}

EXPENSES
${filteredExpenses.map(exp =>
  `${formatDate(exp.date)} | ${exp.category} | ${exp.description} | $${exp.amount.toFixed(2)}`
).join('\n')}`;

    const blob = new Blob([pdfContent], { type: 'text/plain' });
    downloadFile(blob, `${config.filename}.txt`);
  };

  const downloadFile = (blob: Blob, filename: string) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Advanced Data Export</h2>
              <p className="text-gray-600 mt-1">Configure and export your expense data</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('configure')}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === 'configure'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Settings className="w-4 h-4 inline mr-2" />
              Configure Export
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`flex-1 px-6 py-3 font-medium transition-colors ${
                activeTab === 'preview'
                  ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview Data ({filteredExpenses.length})
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'configure' && (
              <div className="space-y-6">
                {/* Export Format */}
                <Card title="Export Format">
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { format: 'csv' as ExportFormat, icon: FileText, name: 'CSV', desc: 'Comma-separated values' },
                      { format: 'json' as ExportFormat, icon: Database, name: 'JSON', desc: 'Structured data format' },
                      { format: 'pdf' as ExportFormat, icon: FileType, name: 'PDF', desc: 'Portable document' }
                    ].map(({ format, icon: Icon, name, desc }) => (
                      <button
                        key={format}
                        onClick={() => setConfig(prev => ({ ...prev, format }))}
                        className={`p-4 border-2 rounded-lg transition-all ${
                          config.format === format
                            ? 'border-blue-500 bg-blue-50 text-blue-700'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        <Icon className="w-8 h-8 mx-auto mb-2" />
                        <div className="font-medium">{name}</div>
                        <div className="text-xs opacity-70">{desc}</div>
                      </button>
                    ))}
                  </div>
                </Card>

                {/* Filename */}
                <Card title="File Settings">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Filename
                      </label>
                      <Input
                        type="text"
                        value={config.filename}
                        onChange={(e) => setConfig(prev => ({ ...prev, filename: e.target.value }))}
                        placeholder="Enter filename (without extension)"
                      />
                    </div>
                  </div>
                </Card>

                {/* Date Range Filter */}
                <Card title="Date Range Filter">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        From Date
                      </label>
                      <Input
                        type="date"
                        value={config.filters.dateFrom}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          filters: { ...prev.filters, dateFrom: e.target.value }
                        }))}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-1" />
                        To Date
                      </label>
                      <Input
                        type="date"
                        value={config.filters.dateTo}
                        onChange={(e) => setConfig(prev => ({
                          ...prev,
                          filters: { ...prev.filters, dateTo: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </Card>

                {/* Category Filter */}
                <Card title="Category Filter">
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={selectAllCategories}
                      >
                        Select All
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={deselectAllCategories}
                      >
                        Deselect All
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {CATEGORIES.map(category => (
                        <label key={category} className="flex items-center space-x-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={config.filters.categories.includes(category)}
                            onChange={() => handleCategoryToggle(category)}
                            className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm font-medium text-gray-700">{category}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </Card>

                {/* Export Summary */}
                <Card title="Export Summary">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{exportSummary.recordCount}</div>
                      <div className="text-sm text-gray-600">Records</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        ${exportSummary.totalAmount.toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-600">Total Amount</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {config.filters.categories.length}
                      </div>
                      <div className="text-sm text-gray-600">Categories</div>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-orange-600">
                        {config.format.toUpperCase()}
                      </div>
                      <div className="text-sm text-gray-600">Format</div>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'preview' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Data Preview ({filteredExpenses.length} records)
                  </h3>
                  {filteredExpenses.length === 0 && (
                    <div className="flex items-center text-amber-600">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      No data matches current filters
                    </div>
                  )}
                </div>

                {filteredExpenses.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Date</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Description</th>
                            <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Category</th>
                            <th className="px-4 py-3 text-right text-sm font-medium text-gray-700">Amount</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {filteredExpenses.slice(0, 10).map(expense => (
                            <tr key={expense.id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {formatDate(expense.date)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {expense.description}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {expense.category}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 text-right font-medium">
                                ${expense.amount.toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {filteredExpenses.length > 10 && (
                      <div className="bg-gray-50 px-4 py-3 text-sm text-gray-600 text-center">
                        Showing first 10 of {filteredExpenses.length} records
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Filter className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">No expenses match your current filters</p>
                    <p className="text-sm text-gray-500">Try adjusting your date range or category selection</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center space-x-4">
              {exportStatus === 'success' && (
                <div className="flex items-center text-green-600">
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Export completed successfully!
                </div>
              )}
              {exportStatus === 'error' && (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Export failed. Please try again.
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                disabled={isExporting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleExport}
                disabled={isExporting || filteredExpenses.length === 0}
                className="min-w-[120px]"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Exporting...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};