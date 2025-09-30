# New Commands for Expense Tracker Project

Based on analysis of the `feature-data-export-v3` and `docs` branches, here are three completely new commands tailored specifically for the expense tracker project:

## Command 1: Export Data Analysis

```markdown
# Export Data Analysis Command

Analyzes exported expense data and generates comprehensive insights and recommendations.

## Usage
```
/analyze-export [file-path] [analysis-type]
```

## Parameters
- `file-path`: Path to exported CSV or JSON file (optional, defaults to latest export)
- `analysis-type`: Type of analysis - `spending`, `trends`, `categories`, `budget`, `all` (default: `all`)

## What This Command Does

This command takes your exported expense data and performs intelligent analysis to provide actionable insights:

1. **Data Validation**: Checks exported data integrity and completeness
2. **Spending Pattern Analysis**: Identifies unusual spending patterns and trends
3. **Category Insights**: Analyzes category distribution and suggests optimizations
4. **Budget Recommendations**: Provides budget suggestions based on spending history
5. **Anomaly Detection**: Flags unusual transactions for review
6. **Seasonal Analysis**: Identifies seasonal spending patterns
7. **Report Generation**: Creates detailed analysis report with visualizations

## Output Files Generated
- `analysis/spending-insights-[date].md` - Detailed spending analysis
- `analysis/recommendations-[date].md` - Actionable recommendations
- `analysis/anomalies-[date].json` - Flagged unusual transactions
- `analysis/budget-suggestions-[date].json` - Suggested budget allocations

## Analysis Types

### `spending`
Focuses on spending velocity, frequency, and amount patterns:
- Daily/weekly/monthly spending trends
- Average transaction sizes by category
- Spending velocity changes over time
- High-impact expense identification

### `trends`
Analyzes temporal patterns and forecasting:
- Seasonal spending variations
- Growth trends by category
- Predictive spending forecasts
- Comparative period analysis

### `categories`
Deep-dives into category-specific insights:
- Category efficiency analysis
- Spending distribution optimization
- Cross-category correlations
- Category growth/decline patterns

### `budget`
Provides budget planning and optimization:
- Realistic budget recommendations
- Variance analysis from ideal spending
- Budget allocation suggestions
- Savings opportunity identification

## Example Usage

```bash
# Analyze latest export with full analysis
/analyze-export all

# Analyze specific file for spending patterns
/analyze-export exports/expenses-2024.csv spending

# Focus on budget recommendations
/analyze-export budget

# Analyze trends from quarterly export
/analyze-export exports/q4-2024.json trends
```

## Sample Output

```markdown
# Expense Analysis Report - 2024-09-30

## Executive Summary
- Total analyzed transactions: 1,247
- Analysis period: Jan 2024 - Sep 2024
- Average monthly spending: $2,856
- Top spending category: Food (32.4%)

## Key Insights
🔴 **Alert**: Food spending increased 23% in last 3 months
🟡 **Notice**: Entertainment spending varies significantly (±45%)
🟢 **Positive**: Transportation costs decreased 15% year-over-year

## Recommendations
1. Consider meal planning to reduce food expenses
2. Set monthly entertainment budget cap at $350
3. Maintain current transportation optimization strategies

## Budget Suggestions
- Food: $800/month (currently $925)
- Transportation: $400/month (currently $380)
- Entertainment: $350/month (currently varies $200-600)
```

## Integration Features
- Connects with existing export utilities in `src/utils/export.ts`
- Uses ML categorization data if available
- Integrates with analytics dashboard components
- Supports multiple export formats (CSV, JSON, PDF)

---
```

## Command 2: Smart Category Audit

```markdown
# Smart Category Audit Command

Performs intelligent auditing of expense categorizations and suggests improvements.

## Usage
```
/audit-categories [time-period] [confidence-threshold]
```

## Parameters
- `time-period`: Time period to audit - `last-month`, `last-3-months`, `last-6-months`, `all` (default: `last-3-months`)
- `confidence-threshold`: Minimum confidence for flagging (0.0-1.0, default: 0.7)

## What This Command Does

This command analyzes your expense categorizations and identifies potential improvements:

1. **Categorization Accuracy Check**: Compares similar expenses for consistency
2. **Merchant Pattern Analysis**: Identifies merchants consistently categorized incorrectly
3. **Amount-Based Validation**: Flags categories with unusual amount patterns
4. **Temporal Consistency Check**: Ensures similar transactions are categorized consistently
5. **ML-Based Suggestions**: Uses pattern recognition to suggest better categories
6. **Bulk Recategorization**: Provides tools to fix multiple similar transactions
7. **Learning Integration**: Updates categorization rules based on corrections

## Output Files Generated
- `audits/category-audit-[date].md` - Detailed audit report
- `audits/suggested-changes-[date].json` - Specific recategorization suggestions
- `audits/merchant-rules-[date].json` - Suggested merchant categorization rules
- `audits/consistency-report-[date].html` - Visual consistency analysis

## Audit Categories

### **Inconsistency Detection**
```
🔍 Found 15 potential inconsistencies:

Merchant: "STARBUCKS #1234"
├─ Currently: Food (8 times), Entertainment (3 times)
├─ Suggestion: Standardize to "Food"
└─ Confidence: 85%

Merchant: "AMAZON.COM*ORDER"
├─ Currently: Shopping (12), Bills (2), Entertainment (1)
├─ Suggestion: Review each transaction individually
└─ Confidence: 62%
```

### **Amount Pattern Analysis**
```
💰 Unusual amount patterns detected:

Category: Transportation
├─ Typical range: $15-45
├─ Outliers found: $156 (gas station), $8.50 (parking)
├─ Suggestion: Verify large transactions
└─ Auto-fix small parking fees

Category: Food
├─ Grocery pattern: $85-150
├─ Restaurant pattern: $25-65
├─ Outliers: $8 (coffee?), $245 (catering?)
└─ Suggestions: Create subcategories or recategorize
```

### **Machine Learning Suggestions**
```
🤖 ML-powered recommendations:

Transaction: "SHELL STATION #3456 - $67.82"
├─ Current: Shopping
├─ ML Suggestion: Transportation (94% confidence)
├─ Reasoning: Amount typical for gas, merchant is fuel station
└─ Action: ✅ Accept suggestion

Transaction: "NETFLIX.COM - $15.99"
├─ Current: Bills
├─ ML Suggestion: Entertainment (89% confidence)
├─ Reasoning: Streaming service, entertainment pattern
└─ Action: 🤔 Review (recurring subscription)
```

## Interactive Audit Process

```typescript
// Command generates interactive prompts
interface AuditSuggestion {
  transactionId: string;
  currentCategory: ExpenseCategory;
  suggestedCategory: ExpenseCategory;
  confidence: number;
  reasoning: string;
  action: 'accept' | 'reject' | 'review' | 'create_rule';
}
```

## Bulk Operations

```bash
# Apply all high-confidence suggestions (>90%)
/audit-categories --auto-apply --min-confidence=0.9

# Review only merchant inconsistencies
/audit-categories --focus=merchants

# Audit specific category
/audit-categories --category=Transportation

# Generate merchant rules for future categorization
/audit-categories --generate-rules
```

## Example Usage

```bash
# Standard audit of last 3 months
/audit-categories

# Audit all data with high confidence threshold
/audit-categories all 0.85

# Quick audit of last month only
/audit-categories last-month 0.6

# Focus on merchant inconsistencies
/audit-categories last-6-months 0.7 --merchants-only
```

## Integration Features
- Works with existing `useExpenses` hook
- Integrates with ML categorization system (when available)
- Updates expense data in storage
- Generates training data for ML models
- Creates categorization rules for future use

---
```

## Command 3: Expense Health Check

```markdown
# Expense Health Check Command

Performs comprehensive health assessment of your expense tracking system and data quality.

## Usage
```
/health-check [scope] [fix-mode]
```

## Parameters
- `scope`: What to check - `data`, `system`, `performance`, `security`, `all` (default: `all`)
- `fix-mode`: Auto-fix level - `none`, `safe`, `aggressive` (default: `safe`)

## What This Command Does

This command performs a comprehensive health assessment of your expense tracking system:

1. **Data Integrity Check**: Validates all expense records for completeness and accuracy
2. **System Performance Analysis**: Checks application performance and optimization opportunities
3. **Security Audit**: Reviews data security and privacy compliance
4. **Storage Health**: Analyzes local storage usage and efficiency
5. **Component Health**: Tests all expense-related components and hooks
6. **Export System Validation**: Verifies export functionality and data integrity
7. **ML System Status**: Checks AI categorization system health (if enabled)

## Health Check Categories

### **Data Health Assessment**
```
📊 DATA HEALTH REPORT
═══════════════════════════════════

✅ Total Expenses: 1,247 records
✅ Data Completeness: 98.4% (19 incomplete records)
⚠️  Duplicate Detection: 3 potential duplicates found
❌ Date Validation: 2 invalid dates detected
✅ Amount Validation: All amounts valid
⚠️  Category Distribution: Uneven (85% in 3 categories)

🔧 Recommended Actions:
├─ Fix 2 invalid date entries
├─ Review 3 potential duplicate transactions
├─ Balance category distribution
└─ Complete 19 missing descriptions
```

### **System Performance Check**
```
⚡ PERFORMANCE HEALTH REPORT
═══════════════════════════════════

✅ Component Load Time: 45ms (excellent)
⚠️  Large List Rendering: 340ms (needs optimization)
✅ Storage Operations: 12ms average (good)
❌ Bundle Size: 2.1MB (too large)
✅ Memory Usage: 45MB (normal)
⚠️  Cache Hit Rate: 67% (could improve)

🚀 Performance Recommendations:
├─ Implement virtualization for expense lists (>100 items)
├─ Code split heavy components (charts, ML features)
├─ Optimize bundle with tree shaking
├─ Increase cache hit rate with better strategies
└─ Consider lazy loading for analytics
```

### **Security & Privacy Audit**
```
🔒 SECURITY HEALTH REPORT
═══════════════════════════════════

✅ Local Storage: No sensitive data exposed
✅ Input Validation: All forms properly validated
⚠️  Browser Storage: 85% capacity used
✅ XSS Protection: Content properly sanitized
⚠️  Privacy: Some merchant names stored in plain text
✅ Error Handling: No sensitive data in logs

🛡️ Security Recommendations:
├─ Clean up old storage data (save space)
├─ Hash merchant names for privacy
├─ Implement storage quota monitoring
├─ Add rate limiting for operations
└─ Review error logging for data leaks
```

### **ML System Health (if applicable)**
```
🤖 ML SYSTEM HEALTH REPORT
═══════════════════════════════════

✅ Model Loading: 0.8s (acceptable)
⚠️  Prediction Accuracy: 78% (below target 85%)
✅ Feature Processing: 23ms average
❌ Training Data: Insufficient (need 500+ samples)
⚠️  Model Size: 1.2MB (consider compression)
✅ Privacy Compliance: All data properly anonymized

🎯 ML Recommendations:
├─ Collect more training data (current: 247, need: 500+)
├─ Retrain model with recent data
├─ Implement model compression
├─ Add confidence thresholds
└─ Enable user feedback collection
```

## Auto-Fix Capabilities

### **Safe Fixes** (applied automatically with `--fix-mode=safe`)
- Remove duplicate transactions with identical data
- Fix obvious date formatting issues
- Clean up extra whitespace in descriptions
- Standardize category capitalization
- Remove empty or null expense records

### **Aggressive Fixes** (requires `--fix-mode=aggressive`)
- Merge similar duplicate transactions
- Auto-categorize based on ML suggestions (high confidence only)
- Bulk update merchant names for consistency
- Reformat all dates to ISO standard
- Compress and optimize storage data

## Usage Examples

```bash
# Complete health check with safe auto-fixes
/health-check all safe

# Check only data integrity, no fixes
/health-check data none

# Performance check with aggressive optimization
/health-check performance aggressive

# Security audit only
/health-check security

# System check for deployment readiness
/health-check system safe
```

## Generated Reports

```
reports/
├── health-check-[timestamp].html     # Visual dashboard
├── data-quality-report.json          # Detailed data analysis
├── performance-metrics.json          # Performance benchmarks
├── security-audit.md                 # Security findings
├── recommendations.md                 # Prioritized action items
└── fixes-applied.log                 # Auto-fix changelog
```

## Integration Features
- Works with all existing expense tracker components
- Integrates with ML categorization system
- Uses existing storage utilities
- Connects with export system for validation
- Generates actionable improvement plans
- Creates performance baselines for monitoring

## Monitoring Integration
```typescript
// Sets up ongoing health monitoring
interface HealthMetrics {
  dataQualityScore: number;    // 0-100
  performanceScore: number;    // 0-100
  securityScore: number;       // 0-100
  systemHealth: 'good' | 'warning' | 'critical';
  lastCheckTimestamp: string;
  recommendedActions: string[];
}

// Enables periodic health checks
/health-check --schedule=weekly --alerts=true
```

---
```

## Summary

These three commands provide comprehensive functionality for:

1. **`/analyze-export`** - Advanced data analysis and insights generation
2. **`/audit-categories`** - Smart categorization improvement and consistency checking
3. **`/health-check`** - System-wide health monitoring and optimization

Each command integrates with your existing `feature-data-export-v3` branch capabilities and the documentation structure from the `docs` branch, providing powerful tools for maintaining and optimizing your expense tracking system.