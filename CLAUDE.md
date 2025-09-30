# CLAUDE.md - ExpenseTracker AI Development Guide

> **Version**: 1.0
> **Last Updated**: 2025-09-30
> **Project**: Personal Expense Tracker with AI Categorization
> **Framework**: Next.js 15 + TypeScript + Tailwind CSS

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture & Patterns](#architecture--patterns)
3. [Development Workflow](#development-workflow)
4. [Code Standards & Conventions](#code-standards--conventions)
5. [Testing Strategy](#testing-strategy)
6. [Common Development Tasks](#common-development-tasks)
7. [AI-Specific Guidelines](#ai-specific-guidelines)
8. [Troubleshooting & Debugging](#troubleshooting--debugging)
9. [Performance & Optimization](#performance--optimization)
10. [Security Considerations](#security-considerations)
11. [Deployment & Operations](#deployment--operations)
12. [Claude Commands Reference](#claude-commands-reference)

---

## 🎯 Project Overview

The ExpenseTracker is a modern personal finance management application built with Next.js 15 that helps users track, categorize, and analyze their expenses. The project is evolving towards AI-powered expense categorization using machine learning to learn from user behavior.

### Core Features
- **Expense Management**: CRUD operations for expense tracking
- **Smart Categorization**: Auto-categorization with ML (planned)
- **Analytics Dashboard**: Visual spending insights and trends
- **Data Export**: CSV export functionality for external analysis
- **Responsive Design**: Mobile-first, desktop-optimized interface

### Technology Stack
```
Frontend:
├── Next.js 15 (App Router)
├── TypeScript 5.0+
├── Tailwind CSS 4.0
├── React 19.1.0
├── Recharts (data visualization)
└── Lucide React (icons)

Backend:
├── Next.js API Routes
├── Local Storage (current)
└── Planned: PostgreSQL + Prisma ORM

Tooling:
├── ESLint + Prettier
├── Turbopack (build optimization)
└── GitHub CLI integration
```

---

## 🏗️ Architecture & Patterns

### Project Structure
```
src/
├── app/                    # Next.js 15 App Router
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Dashboard home page
│   ├── add/               # Add expense feature
│   ├── expenses/          # Expense management
│   │   └── [id]/edit/     # Dynamic edit routes
│   └── analytics/         # Analytics dashboard
├── components/
│   ├── ui/                # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── forms/             # Form components
│   │   └── ExpenseForm.tsx
│   ├── charts/            # Data visualization
│   │   ├── CategoryChart.tsx
│   │   └── MonthlyTrendChart.tsx
│   └── *.tsx              # Feature-specific components
├── hooks/                 # Custom React hooks
│   └── useExpenses.ts     # Expense state management
├── types/                 # TypeScript definitions
│   └── expense.ts         # Core data types
├── utils/                 # Utility functions
│   ├── currency.ts        # Currency formatting
│   ├── storage.ts         # Local storage operations
│   ├── date.ts           # Date utilities
│   └── export.ts         # Data export utilities
└── lib/                   # Library configurations
```

### Design Patterns Used

#### 1. **Custom Hook Pattern**
Centralized state management using custom hooks:
```typescript
// src/hooks/useExpenses.ts
export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

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
```

#### 2. **Component Composition Pattern**
Reusable UI components with props interface:
```typescript
interface ExpenseFormProps {
  initialData?: Partial<Expense>;
  onSubmit: (data: ExpenseFormData) => void;
  onCancel?: () => void;
  submitLabel?: string;
  loading?: boolean;
}
```

#### 3. **Type-Safe Data Flow**
Strict TypeScript interfaces for all data:
```typescript
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}
```

#### 4. **Utility-First CSS**
Tailwind CSS with component-specific styling:
```tsx
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    Recent Expenses
  </h2>
</div>
```

---

## 🔄 Development Workflow

### Branch Strategy
```
main                    # Production-ready code
├── feature-*           # New features (feature-ml-categorization)
├── bugfix-*           # Bug fixes (bugfix-date-validation)
├── hotfix-*           # Critical fixes (hotfix-security-patch)
└── docs               # Documentation updates
```

### Git Commit Standards
Follow Conventional Commits specification:
```bash
# Feature commits
feat: add ML-powered expense categorization
feat(ui): implement dark mode toggle
feat(export): add PDF export functionality

# Bug fix commits
fix: resolve date parsing issue in ExpenseForm
fix(analytics): correct percentage calculation in charts
fix(mobile): improve responsive layout on small screens

# Documentation commits
docs: update API documentation for expense endpoints
docs(readme): add installation instructions for ML features

# Refactor commits
refactor: extract common validation logic to utilities
refactor(hooks): optimize useExpenses performance

# Style commits
style: format code according to Prettier rules
style(ui): improve button hover states and transitions
```

### Quality Gates Before Committing
```bash
# 1. Run linting and type checking
npm run lint
npm run type-check

# 2. Run tests (when implemented)
npm run test

# 3. Build verification
npm run build

# 4. Verify changes
git diff --staged
```

### Branch Creation and Management
```bash
# Create feature branch from main
git checkout main
git pull origin main
git checkout -b feature-smart-categorization

# Regular workflow
git add .
git commit -m "feat: implement basic ML categorization model"
git push -u origin feature-smart-categorization

# Create PR when ready
gh pr create --title "Add ML-powered expense categorization" --body "Implements intelligent expense categorization using machine learning"
```

---

## 📝 Code Standards & Conventions

### TypeScript Standards

#### 1. **Interface Definitions**
Always prefer interfaces over types for object shapes:
```typescript
// ✅ Preferred
export interface Expense {
  id: string;
  amount: number;
  category: ExpenseCategory;
  description: string;
  date: string;
}

// ❌ Avoid for object shapes
export type Expense = {
  id: string;
  // ...
}

// ✅ Use types for unions and primitives
export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other';
```

#### 2. **Component Props Pattern**
Always define explicit props interfaces:
```typescript
interface ComponentNameProps {
  // Required props first
  data: Expense[];
  onSubmit: (data: FormData) => void;

  // Optional props with default values
  loading?: boolean;
  className?: string;

  // Event handlers with clear naming
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  data,
  onSubmit,
  loading = false,
  className = '',
  onEdit,
  onDelete
}) => {
  // Component implementation
};
```

#### 3. **Error Handling Pattern**
Consistent error handling with try-catch and user feedback:
```typescript
const handleSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    await submitExpense(data);
    // Success feedback
    toast.success('Expense added successfully');
    router.push('/expenses');
  } catch (error) {
    console.error('Error submitting expense:', error);
    toast.error('Failed to add expense. Please try again.');
  } finally {
    setLoading(false);
  }
};
```

### React Component Standards

#### 1. **Functional Components Only**
Use functional components with hooks, avoid class components:
```typescript
// ✅ Preferred
export const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onEdit }) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      {expenses.map(expense => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          isSelected={selectedId === expense.id}
          onSelect={setSelectedId}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};
```

#### 2. **Hook Usage Pattern**
Follow hooks rules and use custom hooks for complex logic:
```typescript
// Custom hook for form management
const useExpenseForm = (initialData?: Partial<Expense>) => {
  const [formData, setFormData] = useState<ExpenseFormData>({
    amount: initialData?.amount?.toString() || '',
    category: initialData?.category || 'Food',
    description: initialData?.description || '',
    date: initialData?.date || new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    // Validation logic
  };

  const handleSubmit = async () => {
    // Submit logic
  };

  return {
    formData,
    errors,
    loading,
    updateField: (field: string, value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    },
    handleSubmit,
    validateForm
  };
};
```

### Styling Standards

#### 1. **Tailwind CSS Best Practices**
Use utility classes with consistent patterns:
```tsx
// ✅ Good - Consistent spacing and responsive design
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
  <h2 className="text-lg font-semibold text-gray-900 mb-4">
    Title
  </h2>
  <p className="text-sm text-gray-600">
    Description text
  </p>
</div>

// ❌ Avoid - Inconsistent spacing and no responsive considerations
<div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
  <h2 className="text-xl font-bold text-black mb-2">
    Title
  </h2>
</div>
```

#### 2. **Color Palette Consistency**
Use consistent color tokens throughout the application:
```tsx
// Primary colors
bg-blue-600 text-blue-600 border-blue-600    // Primary actions
bg-green-600 text-green-600 border-green-600  // Success states
bg-red-600 text-red-600 border-red-600        // Error states
bg-yellow-600 text-yellow-600 border-yellow-600 // Warning states

// Neutral colors
bg-gray-50 text-gray-900 border-gray-200      // Light backgrounds
bg-gray-100 text-gray-700 border-gray-300     // Medium backgrounds
bg-gray-800 text-gray-100 border-gray-600     // Dark backgrounds
```

---

## 🧪 Testing Strategy

### Testing Philosophy
- **Unit Tests**: Test individual components and utilities
- **Integration Tests**: Test component interactions and data flow
- **E2E Tests**: Test complete user workflows
- **Visual Testing**: Ensure consistent UI across devices

### Testing Stack (Planned)
```typescript
// Unit Testing
import { render, screen, fireEvent } from '@testing-library/react';
import { jest } from '@jest/globals';

// Integration Testing
import { renderHook, act } from '@testing-library/react-hooks';

// E2E Testing
import { test, expect } from '@playwright/test';
```

### Test File Organization
```
__tests__/
├── components/
│   ├── ExpenseForm.test.tsx
│   ├── ExpenseList.test.tsx
│   └── ui/
│       ├── Button.test.tsx
│       └── Input.test.tsx
├── hooks/
│   └── useExpenses.test.tsx
├── utils/
│   ├── currency.test.ts
│   └── storage.test.ts
└── e2e/
    ├── expense-management.spec.ts
    └── analytics-dashboard.spec.ts
```

### Writing Effective Tests

#### 1. **Component Testing Pattern**
```typescript
// src/__tests__/components/ExpenseForm.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ExpenseForm } from '@/components/forms/ExpenseForm';

describe('ExpenseForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnCancel = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render with initial data', () => {
    const initialData = {
      amount: 25.50,
      category: 'Food' as const,
      description: 'Lunch',
      date: '2024-01-15'
    };

    render(
      <ExpenseForm
        initialData={initialData}
        onSubmit={mockOnSubmit}
        onCancel={mockOnCancel}
      />
    );

    expect(screen.getByDisplayValue('25.50')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Food')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Lunch')).toBeInTheDocument();
  });

  it('should validate required fields', async () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} />);

    fireEvent.click(screen.getByText('Add Expense'));

    await waitFor(() => {
      expect(screen.getByText('Amount must be greater than 0')).toBeInTheDocument();
      expect(screen.getByText('Description is required')).toBeInTheDocument();
    });

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('should submit form with valid data', async () => {
    render(<ExpenseForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByLabelText('Amount'), {
      target: { value: '15.75' }
    });
    fireEvent.change(screen.getByLabelText('Description'), {
      target: { value: 'Coffee' }
    });
    fireEvent.click(screen.getByText('Add Expense'));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        amount: '15.75',
        category: 'Food',
        description: 'Coffee',
        date: expect.any(String)
      });
    });
  });
});
```

#### 2. **Hook Testing Pattern**
```typescript
// src/__tests__/hooks/useExpenses.test.tsx
import { renderHook, act } from '@testing-library/react-hooks';
import { useExpenses } from '@/hooks/useExpenses';
import { storage } from '@/utils/storage';

jest.mock('@/utils/storage');

describe('useExpenses', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (storage.getExpenses as jest.Mock).mockReturnValue([]);
  });

  it('should initialize with empty expenses', () => {
    const { result } = renderHook(() => useExpenses());

    expect(result.current.loading).toBe(false);
    expect(result.current.expenses).toEqual([]);
  });

  it('should add expense correctly', () => {
    const { result } = renderHook(() => useExpenses());

    const newExpense = {
      id: '1',
      amount: 25.50,
      category: 'Food' as const,
      description: 'Lunch',
      date: '2024-01-15',
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    };

    act(() => {
      result.current.addExpense(newExpense);
    });

    expect(storage.addExpense).toHaveBeenCalledWith(newExpense);
    expect(result.current.expenses).toContain(newExpense);
  });
});
```

---

## 🛠️ Common Development Tasks

### Adding a New Expense Category

1. **Update Type Definition**
```typescript
// src/types/expense.ts
export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Healthcare'  // ← New category
  | 'Other';
```

2. **Update Form Options**
```typescript
// src/components/forms/ExpenseForm.tsx
const categoryOptions = [
  { value: 'Food', label: 'Food' },
  { value: 'Transportation', label: 'Transportation' },
  { value: 'Entertainment', label: 'Entertainment' },
  { value: 'Shopping', label: 'Shopping' },
  { value: 'Bills', label: 'Bills' },
  { value: 'Healthcare', label: 'Healthcare' },  // ← New option
  { value: 'Other', label: 'Other' }
];
```

3. **Update Charts and Analytics**
```typescript
// src/components/charts/CategoryChart.tsx - Add color mapping
const categoryColors = {
  Food: '#10b981',
  Transportation: '#3b82f6',
  Entertainment: '#f59e0b',
  Shopping: '#ef4444',
  Bills: '#8b5cf6',
  Healthcare: '#06b6d4',  // ← New color
  Other: '#6b7280'
};
```

### Creating a New UI Component

1. **Create Component File**
```typescript
// src/components/ui/Badge.tsx
import React from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  className
}) => {
  const baseStyles = 'inline-flex items-center font-medium rounded-full';

  const variants = {
    default: 'bg-gray-100 text-gray-800',
    success: 'bg-green-100 text-green-800',
    warning: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800'
  };

  const sizes = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return (
    <span
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
    >
      {children}
    </span>
  );
};
```

2. **Add to UI Index** (if using barrel exports)
```typescript
// src/components/ui/index.ts
export { Badge } from './Badge';
export { Button } from './Button';
export { Card } from './Card';
// ... other exports
```

### Adding a New Page/Route

1. **Create Page Component**
```typescript
// src/app/reports/page.tsx
import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Reports - ExpenseTracker',
  description: 'View detailed expense reports and analytics'
};

export default function ReportsPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Expense Reports
        </h1>
        <p className="text-gray-600">
          Generate and view detailed reports of your spending patterns
        </p>
      </div>

      {/* Page content */}
    </div>
  );
}
```

2. **Update Navigation**
```typescript
// src/components/Navigation.tsx
const navigationItems = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Add Expense', href: '/add', icon: Plus },
  { name: 'Expenses', href: '/expenses', icon: List },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Reports', href: '/reports', icon: FileText },  // ← New item
];
```

### Implementing Data Export Features

1. **Create Export Utility**
```typescript
// src/utils/export.ts
import { Expense } from '@/types/expense';

export const exportToCSV = (expenses: Expense[], filename?: string) => {
  const headers = ['Date', 'Description', 'Category', 'Amount'];

  const csvContent = [
    headers.join(','),
    ...expenses.map(expense => [
      expense.date,
      `"${expense.description.replace(/"/g, '""')}"`,
      expense.category,
      expense.amount.toFixed(2)
    ].join(','))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');

  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename || `expenses-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = async (expenses: Expense[]) => {
  // Implementation for PDF export using libraries like jsPDF or Puppeteer
  // This would be a more complex implementation
};
```

2. **Add Export Component**
```typescript
// src/components/ExportButton.tsx
import React from 'react';
import { Button } from '@/components/ui/Button';
import { Download } from 'lucide-react';
import { exportToCSV } from '@/utils/export';
import { Expense } from '@/types/expense';

interface ExportButtonProps {
  expenses: Expense[];
  format?: 'csv' | 'pdf';
  className?: string;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  expenses,
  format = 'csv',
  className
}) => {
  const handleExport = () => {
    if (format === 'csv') {
      exportToCSV(expenses);
    }
    // Add PDF export when implemented
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleExport}
      className={className}
      disabled={expenses.length === 0}
    >
      <Download className="w-4 h-4 mr-2" />
      Export {format.toUpperCase()}
    </Button>
  );
};
```

---

## 🤖 AI-Specific Guidelines

### Machine Learning Integration Patterns

#### 1. **Feature Preparation Pipeline**
```typescript
// src/utils/ml/features.ts
export interface TransactionFeatures {
  // Text features
  description_tokens: string[];
  merchant_name: string;
  description_length: number;

  // Numerical features
  amount: number;
  amount_rounded: number;
  day_of_week: number;
  hour_of_day: number;

  // Categorical features
  payment_method?: string;
  is_recurring: boolean;

  // User context
  user_category_history: Record<string, number>;
  similar_transaction_categories: string[];
}

export const extractFeatures = (
  transaction: Partial<Expense>,
  userHistory: Expense[]
): TransactionFeatures => {
  return {
    description_tokens: tokenizeDescription(transaction.description || ''),
    merchant_name: extractMerchantName(transaction.description || ''),
    description_length: transaction.description?.length || 0,
    amount: transaction.amount || 0,
    amount_rounded: Math.round((transaction.amount || 0) / 5) * 5,
    day_of_week: new Date(transaction.date || Date.now()).getDay(),
    hour_of_day: new Date(transaction.date || Date.now()).getHours(),
    is_recurring: detectRecurring(transaction, userHistory),
    user_category_history: buildCategoryHistory(userHistory),
    similar_transaction_categories: findSimilarTransactions(transaction, userHistory)
  };
};
```

#### 2. **Model Interface Pattern**
```typescript
// src/utils/ml/categorizer.ts
export interface CategoryPrediction {
  category: ExpenseCategory;
  confidence: number;
  reasoning?: string;
}

export interface ExpenseCategorizer {
  predict(transaction: Partial<Expense>): Promise<CategoryPrediction[]>;
  train(transactions: Expense[]): Promise<void>;
  updateWithFeedback(
    transaction: Expense,
    predictedCategory: ExpenseCategory,
    actualCategory: ExpenseCategory
  ): Promise<void>;
}

export class HybridCategorizer implements ExpenseCategorizer {
  private ruleBasedModel: RuleBasedCategorizer;
  private mlModel?: MLCategorizer;

  constructor() {
    this.ruleBasedModel = new RuleBasedCategorizer();
  }

  async predict(transaction: Partial<Expense>): Promise<CategoryPrediction[]> {
    // Always get rule-based prediction as fallback
    const rulePrediction = this.ruleBasedModel.predict(transaction);

    // If ML model is available, get ML prediction
    if (this.mlModel) {
      try {
        const mlPrediction = await this.mlModel.predict(transaction);
        return this.combineMLAndRulePredictions(mlPrediction, rulePrediction);
      } catch (error) {
        console.warn('ML prediction failed, using rule-based fallback:', error);
        return [rulePrediction];
      }
    }

    return [rulePrediction];
  }

  async train(transactions: Expense[]): Promise<void> {
    // Initialize and train ML model
    this.mlModel = new MLCategorizer();
    await this.mlModel.train(transactions);
  }

  private combineMLAndRulePredictions(
    mlPreds: CategoryPrediction[],
    rulePred: CategoryPrediction
  ): CategoryPrediction[] {
    // Ensemble logic combining ML and rule-based predictions
    const combined = [...mlPreds];

    // Boost rule-based prediction if it has high confidence
    if (rulePred.confidence > 0.8) {
      const existingRule = combined.find(p => p.category === rulePred.category);
      if (existingRule) {
        existingRule.confidence = Math.max(existingRule.confidence, rulePred.confidence);
      } else {
        combined.push(rulePred);
      }
    }

    return combined.sort((a, b) => b.confidence - a.confidence).slice(0, 3);
  }
}
```

#### 3. **User Feedback Collection**
```typescript
// src/components/CategorySuggestion.tsx
import React, { useState } from 'react';
import { CategoryPrediction } from '@/utils/ml/categorizer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface CategorySuggestionProps {
  transaction: Partial<Expense>;
  predictions: CategoryPrediction[];
  onCategorySelect: (category: ExpenseCategory, wasCorrect: boolean) => void;
}

export const CategorySuggestion: React.FC<CategorySuggestionProps> = ({
  transaction,
  predictions,
  onCategorySelect
}) => {
  const [feedbackGiven, setFeedbackGiven] = useState(false);

  const handleCategorySelect = (category: ExpenseCategory) => {
    const wasCorrect = predictions[0]?.category === category;
    onCategorySelect(category, wasCorrect);
    setFeedbackGiven(true);

    // Track feedback for model improvement
    trackFeedback({
      transactionId: transaction.id,
      suggestedCategory: predictions[0]?.category,
      actualCategory: category,
      wasCorrect,
      confidence: predictions[0]?.confidence || 0
    });
  };

  if (feedbackGiven) {
    return (
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-green-800">Thanks for the feedback! 🎉</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
      <div className="mb-3">
        <h4 className="font-medium text-blue-900">
          Suggested Categories for "{transaction.description}"
        </h4>
      </div>

      <div className="space-y-2">
        {predictions.map((prediction, index) => (
          <div key={prediction.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge
                variant={index === 0 ? 'success' : 'default'}
                size="sm"
              >
                {Math.round(prediction.confidence * 100)}%
              </Badge>
              <span>{prediction.category}</span>
            </div>
            <Button
              size="sm"
              variant={index === 0 ? 'default' : 'outline'}
              onClick={() => handleCategorySelect(prediction.category)}
            >
              Select
            </Button>
          </div>
        ))}
      </div>

      <div className="mt-3 pt-3 border-t border-blue-200">
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            // Show manual category selection
          }}
        >
          None of these are correct
        </Button>
      </div>
    </div>
  );
};
```

### Privacy-Preserving ML Patterns

#### 1. **Local Feature Processing**
```typescript
// src/utils/ml/privacy.ts
export const createPrivateFeatures = (
  transaction: Partial<Expense>
): PrivateFeatures => {
  // Hash sensitive information before sending to server
  const merchantHash = hashString(extractMerchantName(transaction.description || ''));
  const descriptionTokens = tokenizeAndHash(transaction.description || '');

  return {
    // Safe numerical features
    amount_bin: quantizeAmount(transaction.amount || 0),
    day_of_week: new Date(transaction.date || Date.now()).getDay(),
    hour_bin: quantizeHour(new Date(transaction.date || Date.now()).getHours()),

    // Hashed text features
    merchant_hash: merchantHash,
    description_hashes: descriptionTokens,

    // Aggregated user patterns (no individual transaction info)
    user_spending_patterns: aggregateUserPatterns(userHistory),
  };
};

const hashString = (str: string): string => {
  // Use a cryptographic hash function
  return btoa(str).replace(/[^a-zA-Z0-9]/g, '').substring(0, 16);
};

const quantizeAmount = (amount: number): number => {
  // Quantize to reduce precision for privacy
  if (amount < 10) return 0;
  if (amount < 50) return 1;
  if (amount < 100) return 2;
  if (amount < 500) return 3;
  return 4;
};
```

---

## 🔧 Troubleshooting & Debugging

### Common Issues and Solutions

#### 1. **TypeScript Compilation Errors**

**Error**: `Property 'X' does not exist on type 'Y'`
```typescript
// ❌ Common mistake
const expense = getExpense();
expense.category = 'NewCategory'; // Error if 'NewCategory' not in ExpenseCategory

// ✅ Solution
const expense = getExpense();
if (isValidCategory(newCategory)) {
  expense.category = newCategory as ExpenseCategory;
}

// Helper function
const isValidCategory = (category: string): category is ExpenseCategory => {
  return ['Food', 'Transportation', 'Entertainment', 'Shopping', 'Bills', 'Other']
    .includes(category);
};
```

**Error**: `Cannot find module '@/components/...'`
```json
// tsconfig.json - Ensure path mapping is correct
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

#### 2. **React Hook Errors**

**Error**: `Cannot read property 'map' of undefined`
```typescript
// ❌ Common mistake
const ExpenseList = ({ expenses }) => {
  return (
    <div>
      {expenses.map(expense => (  // Error if expenses is undefined
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
};

// ✅ Solution with proper defaults and checks
const ExpenseList: React.FC<{ expenses?: Expense[] }> = ({
  expenses = []
}) => {
  if (!expenses.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        No expenses found
      </div>
    );
  }

  return (
    <div>
      {expenses.map(expense => (
        <ExpenseItem key={expense.id} expense={expense} />
      ))}
    </div>
  );
};
```

**Error**: `Hook called outside function component`
```typescript
// ❌ Don't call hooks in event handlers or conditions
const handleClick = () => {
  const [loading, setLoading] = useState(false); // Error!
};

// ✅ Call hooks at component top level
const Component = () => {
  const [loading, setLoading] = useState(false);

  const handleClick = () => {
    setLoading(true);
    // Handle click logic
  };

  return <button onClick={handleClick}>Click me</button>;
};
```

#### 3. **State Management Issues**

**Issue**: State not updating immediately
```typescript
// ❌ State updates are asynchronous
const handleUpdate = () => {
  setExpenses([...expenses, newExpense]);
  console.log(expenses); // Still shows old state!
};

// ✅ Use useEffect to react to state changes
const Component = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);

  useEffect(() => {
    console.log('Expenses updated:', expenses);
  }, [expenses]);

  const handleUpdate = () => {
    setExpenses(prev => [...prev, newExpense]);
  };
};
```

**Issue**: Stale closure in event handlers
```typescript
// ❌ Stale closure issue
const Component = () => {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setTimeout(() => {
      setCount(count + 1); // Uses stale count value
    }, 1000);
  };

  // ✅ Solution: Use functional update
  const handleClick = () => {
    setTimeout(() => {
      setCount(prev => prev + 1); // Always uses current value
    }, 1000);
  };
};
```

#### 4. **Storage and Data Persistence Issues**

**Issue**: Data not persisting between sessions
```typescript
// Check localStorage implementation
export const storage = {
  getExpenses: (): Expense[] => {
    try {
      const data = localStorage.getItem('expenses');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error loading expenses:', error);
      return []; // Fallback to empty array
    }
  },

  addExpense: (expense: Expense) => {
    try {
      const expenses = storage.getExpenses();
      const updated = [...expenses, expense];
      localStorage.setItem('expenses', JSON.stringify(updated));
    } catch (error) {
      console.error('Error saving expense:', error);
      // Consider implementing fallback storage
    }
  }
};
```

### Debugging Tools and Techniques

#### 1. **Browser DevTools**
```typescript
// Add debugging helpers in development
const debugExpense = (expense: Expense, action: string) => {
  if (process.env.NODE_ENV === 'development') {
    console.group(`💰 Expense ${action}`);
    console.log('Expense:', expense);
    console.log('Storage state:', localStorage.getItem('expenses'));
    console.log('Component state:', expenses);
    console.groupEnd();
  }
};

// Use in components
const addExpense = (newExpense: Expense) => {
  debugExpense(newExpense, 'ADD');
  storage.addExpense(newExpense);
  setExpenses(prev => [...prev, newExpense]);
};
```

#### 2. **Performance Profiling**
```typescript
// Add performance markers for expensive operations
const processExpenses = (expenses: Expense[]) => {
  performance.mark('process-start');

  const result = expenses
    .filter(e => e.amount > 0)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 100);

  performance.mark('process-end');
  performance.measure('process-expenses', 'process-start', 'process-end');

  return result;
};

// Check measurements in DevTools Performance tab
console.log(performance.getEntriesByName('process-expenses'));
```

#### 3. **Error Boundary for Graceful Error Handling**
```typescript
// src/components/ErrorBoundary.tsx
import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);

    // In production, send error to monitoring service
    if (process.env.NODE_ENV === 'production') {
      // reportError(error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0">
                <svg className="h-8 w-8 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-medium text-gray-900">Something went wrong</h3>
              </div>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-700">
                We encountered an error while loading this page. Please try refreshing the page or contact support if the problem persists.
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Refresh Page
              </button>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
```

---

## ⚡ Performance & Optimization

### React Performance Patterns

#### 1. **Memoization Strategies**
```typescript
// Memoize expensive calculations
const ExpenseAnalytics: React.FC<{ expenses: Expense[] }> = ({ expenses }) => {
  const analytics = useMemo(() => {
    return calculateExpenseAnalytics(expenses);
  }, [expenses]);

  const categoryTotals = useMemo(() => {
    return expenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);
  }, [expenses]);

  return <AnalyticsDisplay analytics={analytics} categoryTotals={categoryTotals} />;
};

// Memoize component to prevent unnecessary re-renders
export const ExpenseItem = React.memo<ExpenseItemProps>(({
  expense,
  onEdit,
  onDelete
}) => {
  return (
    <div className="expense-item">
      <span>{expense.description}</span>
      <span>{formatCurrency(expense.amount)}</span>
      <button onClick={() => onEdit(expense.id)}>Edit</button>
      <button onClick={() => onDelete(expense.id)}>Delete</button>
    </div>
  );
});

// Memoize callback functions to prevent child re-renders
const ExpenseList: React.FC<ExpenseListProps> = ({ expenses, onExpenseUpdate }) => {
  const handleEdit = useCallback((id: string) => {
    onExpenseUpdate(id, 'edit');
  }, [onExpenseUpdate]);

  const handleDelete = useCallback((id: string) => {
    onExpenseUpdate(id, 'delete');
  }, [onExpenseUpdate]);

  return (
    <div>
      {expenses.map(expense => (
        <ExpenseItem
          key={expense.id}
          expense={expense}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
};
```

#### 2. **Virtualization for Large Lists**
```typescript
// For large expense lists, implement virtualization
import { FixedSizeList as List } from 'react-window';

interface VirtualizedExpenseListProps {
  expenses: Expense[];
  height: number;
}

const ExpenseRow: React.FC<{
  index: number;
  style: React.CSSProperties;
  data: Expense[]
}> = ({ index, style, data }) => (
  <div style={style}>
    <ExpenseItem expense={data[index]} />
  </div>
);

export const VirtualizedExpenseList: React.FC<VirtualizedExpenseListProps> = ({
  expenses,
  height
}) => {
  return (
    <List
      height={height}
      itemCount={expenses.length}
      itemSize={80} // Height of each expense item
      itemData={expenses}
    >
      {ExpenseRow}
    </List>
  );
};
```

#### 3. **Debounced Search and Filtering**
```typescript
import { useDeferredValue, useMemo } from 'react';

const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const ExpenseSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<ExpenseFilters>({});

  // Debounce search term to avoid excessive filtering
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Use React 18's useDeferredValue for better performance
  const deferredFilters = useDeferredValue(filters);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      return expense.description
        .toLowerCase()
        .includes(debouncedSearchTerm.toLowerCase());
    });
  }, [expenses, debouncedSearchTerm, deferredFilters]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search expenses..."
        className="w-full p-2 border border-gray-300 rounded"
      />
      <ExpenseList expenses={filteredExpenses} />
    </div>
  );
};
```

### Bundle Optimization

#### 1. **Code Splitting**
```typescript
// Lazy load heavy components
const ExpenseAnalytics = lazy(() => import('./ExpenseAnalytics'));
const MLCategorizer = lazy(() => import('./MLCategorizer'));

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/analytics" element={
          <Suspense fallback={<div>Loading analytics...</div>}>
            <ExpenseAnalytics />
          </Suspense>
        } />
        <Route path="/ml-categorizer" element={
          <Suspense fallback={<div>Loading AI features...</div>}>
            <MLCategorizer />
          </Suspense>
        } />
      </Routes>
    </Router>
  );
};
```

#### 2. **Tree Shaking and Import Optimization**
```typescript
// ❌ Imports entire library
import * as _ from 'lodash';
import * as dateFns from 'date-fns';

// ✅ Import only what you need
import { debounce, throttle } from 'lodash';
import { format, parseISO, isWithinInterval } from 'date-fns';

// ✅ Use tree-shakable utility libraries
import { cn } from '@/lib/utils';
import { formatCurrency } from '@/utils/currency';
```

---

## 🔒 Security Considerations

### Client-Side Security

#### 1. **Input Validation and Sanitization**
```typescript
// Always validate and sanitize user inputs
const validateExpenseData = (data: ExpenseFormData): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate amount
  if (!data.amount || isNaN(parseFloat(data.amount))) {
    errors.push({ field: 'amount', message: 'Invalid amount' });
  } else if (parseFloat(data.amount) <= 0) {
    errors.push({ field: 'amount', message: 'Amount must be positive' });
  } else if (parseFloat(data.amount) > 1000000) {
    errors.push({ field: 'amount', message: 'Amount too large' });
  }

  // Validate description
  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Description required' });
  } else if (data.description.length > 500) {
    errors.push({ field: 'description', message: 'Description too long' });
  }

  // Sanitize description (remove potentially harmful content)
  const sanitizedDescription = data.description
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .trim();

  // Validate category
  if (!isValidExpenseCategory(data.category)) {
    errors.push({ field: 'category', message: 'Invalid category' });
  }

  // Validate date
  if (!isValidDate(data.date)) {
    errors.push({ field: 'date', message: 'Invalid date' });
  }

  return {
    isValid: errors.length === 0,
    errors,
    sanitizedData: {
      ...data,
      description: sanitizedDescription
    }
  };
};
```

#### 2. **Content Security Policy (CSP)**
```typescript
// next.config.ts
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline'", // Needed for Next.js
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: https:",
              "connect-src 'self'",
              "frame-ancestors 'none'"
            ].join('; ')
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          }
        ]
      }
    ];
  }
};
```

#### 3. **Secure Storage Practices**
```typescript
// Avoid storing sensitive data in localStorage
export const secureStorage = {
  // Use sessionStorage for temporary sensitive data
  setTemporaryData: (key: string, data: any) => {
    sessionStorage.setItem(key, JSON.stringify(data));
  },

  // Encrypt sensitive data before localStorage
  setEncryptedData: (key: string, data: any, userKey: string) => {
    const encrypted = encrypt(JSON.stringify(data), userKey);
    localStorage.setItem(key, encrypted);
  },

  // Clear sensitive data on logout
  clearSensitiveData: () => {
    const keysToRemove = [
      'user-preferences',
      'temporary-data',
      'ml-model-cache'
    ];

    keysToRemove.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
  }
};
```

### Data Privacy for ML Features

#### 1. **Privacy-Preserving Data Processing**
```typescript
// Hash sensitive information before processing
export const createPrivacyPreservingFeatures = (
  expenses: Expense[]
): PrivateFeatures => {
  return {
    // Aggregate patterns without exposing individual transactions
    spending_patterns: aggregateSpendingPatterns(expenses),

    // Hash merchant names to protect privacy
    merchant_patterns: expenses.reduce((acc, expense) => {
      const merchantHash = hashMerchantName(expense.description);
      acc[merchantHash] = (acc[merchantHash] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),

    // Quantize amounts to reduce precision
    amount_patterns: expenses.map(expense => ({
      category: expense.category,
      amount_bucket: quantizeAmount(expense.amount),
      time_bucket: quantizeTime(expense.date)
    }))
  };
};

const hashMerchantName = (description: string): string => {
  // Use a one-way hash to anonymize merchant names
  const merchant = extractMerchantName(description);
  return btoa(merchant).substring(0, 8); // Simple hash for demo
};

const quantizeAmount = (amount: number): number => {
  // Reduce precision to protect privacy
  if (amount < 5) return 0;
  if (amount < 25) return 1;
  if (amount < 100) return 2;
  return 3;
};
```

---

## 🚀 Deployment & Operations

### Build and Deployment

#### 1. **Production Build Configuration**
```typescript
// next.config.ts
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable experimental features for better performance
  experimental: {
    turbo: {
      loaders: {
        '.svg': ['@svgr/webpack']
      }
    }
  },

  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60
  },

  // Bundle analyzer for production
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            reportFilename: './analyze/client.html'
          })
        );
      }
      return config;
    }
  }),

  // Environment-specific configurations
  env: {
    CUSTOM_KEY: process.env.NODE_ENV === 'production' ? 'prod-value' : 'dev-value'
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders
      }
    ];
  }
};

const securityHeaders = [
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'origin-when-cross-origin'
  }
];

export default nextConfig;
```

#### 2. **Environment Management**
```bash
# .env.local (development)
NODE_ENV=development
NEXT_PUBLIC_APP_NAME=ExpenseTracker
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_ENABLE_ML=false

# .env.production (production)
NODE_ENV=production
NEXT_PUBLIC_APP_NAME=ExpenseTracker
NEXT_PUBLIC_API_URL=https://your-domain.com/api
NEXT_PUBLIC_ENABLE_ML=true
NEXT_PUBLIC_ML_API_URL=https://ml-api.your-domain.com
```

#### 3. **Deployment Scripts**
```json
// package.json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:e2e": "playwright test",
    "analyze": "ANALYZE=true npm run build",
    "deploy:staging": "npm run build && npm run deploy:vercel:staging",
    "deploy:production": "npm run build && npm run deploy:vercel:production"
  }
}
```

### Monitoring and Analytics

#### 1. **Performance Monitoring**
```typescript
// src/lib/monitoring.ts
export const trackPerformance = (metricName: string, duration: number) => {
  // In development, just log
  if (process.env.NODE_ENV === 'development') {
    console.log(`📊 ${metricName}: ${duration}ms`);
    return;
  }

  // In production, send to analytics service
  if (typeof window !== 'undefined') {
    // Example with web vitals
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(console.log);
      getFID(console.log);
      getFCP(console.log);
      getLCP(console.log);
      getTTFB(console.log);
    });
  }
};

export const trackUserAction = (action: string, properties?: object) => {
  // Track user interactions
  if (process.env.NODE_ENV === 'production') {
    // Send to analytics service
    console.log('User action:', action, properties);
  }
};

// Usage in components
const ExpenseForm = () => {
  const handleSubmit = async (data: ExpenseFormData) => {
    const startTime = performance.now();

    try {
      await submitExpense(data);

      trackPerformance('expense-submit', performance.now() - startTime);
      trackUserAction('expense-created', {
        category: data.category,
        amount_range: getAmountRange(parseFloat(data.amount))
      });
    } catch (error) {
      trackUserAction('expense-creation-failed', {
        error: error.message
      });
    }
  };
};
```

---

## 📚 Claude Commands Reference

### Available Commands

#### `/document-feature [feature-name]`
Automatically generates comprehensive technical and user documentation for features.

**Usage:**
```bash
/document-feature expense-management
/document-feature ml-categorization
/document-feature analytics-dashboard
```

**Generated Files:**
- `docs/technical/[feature-name].md` - Developer documentation
- `docs/user-guides/[feature-name].md` - End-user guide
- Screenshot placeholders and cross-references

#### Custom Commands for This Project

Create additional commands in `.claude/commands/`:

**`.claude/commands/add-expense-category.md`**
```markdown
# Add Expense Category Command

Adds a new expense category with all necessary updates.

## Usage
/add-expense-category [category-name]

## What This Command Does
1. Updates TypeScript types
2. Updates form options
3. Updates chart colors
4. Updates validation logic
5. Runs type checking to ensure consistency

## Example
/add-expense-category Healthcare
```

**`.claude/commands/generate-test-data.md`**
```markdown
# Generate Test Data Command

Creates realistic test expense data for development and testing.

## Usage
/generate-test-data [count] [date-range]

## What This Command Does
1. Generates realistic expense descriptions
2. Assigns appropriate categories
3. Creates varied amounts and dates
4. Exports as JSON file for import

## Example
/generate-test-data 100 last-6-months
```

### Project-Specific Shortcuts

When working with Claude, use these common patterns:

#### Quick Component Creation
"Create a new UI component called [ComponentName] that [functionality] following our established patterns"

#### Adding Features
"Add a [feature description] feature to the expense tracker, following our TypeScript standards and component patterns"

#### Code Review
"Review this code for adherence to our SOLID principles and TypeScript standards: [code]"

#### Performance Analysis
"Analyze the performance implications of [code/feature] and suggest optimizations following our performance patterns"

#### ML Integration
"Help me integrate [ML functionality] following our privacy-preserving patterns and user experience guidelines"

---

## 🎯 Best Practices Summary

### Development Best Practices
1. **Always follow TypeScript strict mode** - No `any` types without explicit reasoning
2. **Use functional components with hooks** - Avoid class components
3. **Implement proper error boundaries** - Graceful error handling
4. **Follow SOLID principles** - Especially Single Responsibility and Open/Closed
5. **Write comprehensive tests** - Aim for >80% coverage
6. **Use semantic commit messages** - Follow Conventional Commits
7. **Optimize for performance** - Use memoization, virtualization, and code splitting
8. **Prioritize accessibility** - WCAG 2.1 AA compliance
9. **Implement proper security measures** - Input validation, CSP, secure storage
10. **Maintain privacy by design** - Especially for ML features

### AI Development Best Practices
1. **Privacy-first approach** - Anonymize data before processing
2. **Graceful degradation** - Always have fallback systems
3. **User feedback loops** - Continuous learning and improvement
4. **Transparent AI** - Explain decisions and confidence levels
5. **Ethical considerations** - Avoid bias and ensure fairness

### Code Quality Checklist
- [ ] TypeScript compilation without errors or warnings
- [ ] ESLint passes without errors
- [ ] All tests pass
- [ ] Performance metrics within acceptable ranges
- [ ] Accessibility requirements met
- [ ] Security best practices followed
- [ ] Documentation updated
- [ ] Code reviewed by peers

---

*This CLAUDE.md file should be updated as the project evolves. Last updated: 2025-09-30*