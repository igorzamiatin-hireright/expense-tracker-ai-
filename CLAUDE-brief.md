# CLAUDE-brief.md - Quick Reference Guide

> **Project**: Personal Expense Tracker with AI Categorization
> **Stack**: Next.js 15 + TypeScript + Tailwind CSS
> **Full Guide**: [CLAUDE.md](https://github.com/igorzamiatin-hireright/expense-tracker-ai-/blob/main/CLAUDE.md)

## 🏗️ Architecture Overview

```
src/
├── app/              # Next.js 15 App Router pages
├── components/       # React components
│   ├── ui/          # Reusable primitives (Button, Card, Input)
│   ├── forms/       # Form components
│   └── charts/      # Data visualization
├── hooks/           # Custom React hooks (useExpenses)
├── types/           # TypeScript definitions
├── utils/           # Utility functions
└── lib/             # Library configurations
```

**Core Types:**
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

export type ExpenseCategory = 'Food' | 'Transportation' | 'Entertainment' | 'Shopping' | 'Bills' | 'Other';
```

## 🔄 Development Workflow

**Branch Strategy:**
- `feature-*` - New features
- `bugfix-*` - Bug fixes
- `main` - Production ready

**Commit Format:**
```bash
feat: add ML-powered expense categorization
fix: resolve date parsing issue in ExpenseForm
docs: update API documentation
```

**Quality Gates:**
```bash
npm run lint        # ESLint check
npm run type-check  # TypeScript check
npm run build      # Build verification
```

## 📝 Code Standards

**Component Pattern:**
```typescript
interface ComponentProps {
  data: Expense[];
  onSubmit: (data: FormData) => void;
  loading?: boolean;
}

export const Component: React.FC<ComponentProps> = ({
  data,
  onSubmit,
  loading = false
}) => {
  // Implementation
};
```

**Hook Pattern:**
```typescript
export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);

  return {
    expenses,
    loading,
    addExpense,
    updateExpense,
    deleteExpense
  };
};
```

**Error Handling:**
```typescript
const handleSubmit = async (data: FormData) => {
  try {
    setLoading(true);
    await submitExpense(data);
    toast.success('Success');
  } catch (error) {
    console.error('Error:', error);
    toast.error('Failed to submit');
  } finally {
    setLoading(false);
  }
};
```

## 🛠️ Common Tasks

**Add New Category:**
1. Update `ExpenseCategory` type in `types/expense.ts`
2. Update `categoryOptions` in `ExpenseForm.tsx`
3. Add color mapping in `CategoryChart.tsx`

**Create UI Component:**
```typescript
// src/components/ui/NewComponent.tsx
interface NewComponentProps {
  variant?: 'default' | 'success' | 'error';
  className?: string;
}

export const NewComponent: React.FC<NewComponentProps> = ({
  variant = 'default',
  className
}) => {
  return (
    <div className={cn('base-styles', variants[variant], className)}>
      {children}
    </div>
  );
};
```

**Add New Page:**
```typescript
// src/app/new-page/page.tsx
export default function NewPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Page Title
      </h1>
      {/* Content */}
    </div>
  );
}
```

## 🤖 AI Guidelines

**Feature Extraction:**
```typescript
interface TransactionFeatures {
  description_tokens: string[];
  merchant_name: string;
  amount: number;
  day_of_week: number;
  user_category_history: Record<string, number>;
}
```

**Privacy Pattern:**
```typescript
const createPrivateFeatures = (transaction: Expense) => ({
  amount_bin: quantizeAmount(transaction.amount),
  merchant_hash: hashString(transaction.description),
  day_of_week: new Date(transaction.date).getDay()
});
```

## 🔧 Troubleshooting

**TypeScript Errors:**
```typescript
// ❌ Avoid
expense.category = 'NewCategory';

// ✅ Use
if (isValidCategory(newCategory)) {
  expense.category = newCategory as ExpenseCategory;
}
```

**State Updates:**
```typescript
// ❌ Stale closure
setCount(count + 1);

// ✅ Functional update
setCount(prev => prev + 1);
```

**Performance:**
```typescript
// Memoize expensive calculations
const analytics = useMemo(() => {
  return calculateExpenseAnalytics(expenses);
}, [expenses]);

// Memoize callbacks
const handleEdit = useCallback((id: string) => {
  onExpenseUpdate(id, 'edit');
}, [onExpenseUpdate]);
```

## ⚡ Performance Tips

- Use `React.memo` for list items
- Implement virtualization for 100+ items
- Debounce search (300ms delay)
- Lazy load heavy components
- Memoize calculations with `useMemo`

## 🔒 Security Essentials

**Input Validation:**
```typescript
const validateExpenseData = (data: ExpenseFormData) => {
  if (!data.amount || parseFloat(data.amount) <= 0) {
    throw new Error('Invalid amount');
  }
  if (!data.description?.trim()) {
    throw new Error('Description required');
  }
  // Sanitize description
  const sanitized = data.description.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  return { ...data, description: sanitized };
};
```

**Secure Storage:**
```typescript
export const secureStorage = {
  setEncryptedData: (key: string, data: any, userKey: string) => {
    const encrypted = encrypt(JSON.stringify(data), userKey);
    localStorage.setItem(key, encrypted);
  },
  clearSensitiveData: () => {
    ['user-preferences', 'ml-model-cache'].forEach(key => {
      localStorage.removeItem(key);
    });
  }
};
```

## 📚 Commands

**Document Feature:**
```bash
/document-feature [feature-name]
# Generates technical and user docs in docs/ folder
```

**Common Patterns:**
- "Create a new UI component [ComponentName] that [functionality] following our established patterns"
- "Add [feature] following our TypeScript standards and component patterns"
- "Review this code for SOLID principles adherence: [code]"

## 🎯 Quality Checklist

- [ ] TypeScript compilation without errors
- [ ] ESLint passes
- [ ] All tests pass
- [ ] Components follow established patterns
- [ ] Proper error handling implemented
- [ ] Performance optimizations applied
- [ ] Security best practices followed

**Key Principles:**
1. **SOLID Design** - Always follow single responsibility
2. **Type Safety** - No `any` without justification
3. **Privacy First** - Especially for ML features
4. **Performance** - Memoization and virtualization
5. **Accessibility** - WCAG 2.1 AA compliance

---
📖 **Full Documentation**: [CLAUDE.md](https://github.com/igorzamiatin-hireright/expense-tracker-ai-/blob/main/CLAUDE.md)