# New Commands - Quick Reference

> **Three new Claude commands for expense tracker optimization**
> **Full Documentation**: [NEW_COMMANDS.md](https://github.com/igorzamiatin-hireright/expense-tracker-ai-/blob/main/NEW_COMMANDS.md)

## 📊 /analyze-export

**Purpose**: Analyzes exported expense data and generates actionable insights

**Usage**: `/analyze-export [file-path] [analysis-type]`

**Parameters**:
- `file-path`: CSV/JSON export file (optional, uses latest)
- `analysis-type`: `spending` | `trends` | `categories` | `budget` | `all` (default: `all`)

**What it does**:
- Validates exported data integrity
- Identifies spending patterns and anomalies
- Provides budget recommendations
- Generates seasonal analysis
- Creates detailed reports with visualizations

**Quick Examples**:
```bash
/analyze-export all                           # Full analysis of latest export
/analyze-export exports/q4-2024.csv spending # Spending patterns only
/analyze-export budget                        # Budget recommendations
```

**Sample Output**:
```
📈 EXPENSE ANALYSIS - Sep 2024
Total: $2,856 | Top Category: Food (32.4%)
🔴 Alert: Food spending +23% (3 months)
🟢 Positive: Transportation -15% (year-over-year)
Recommendations: Meal planning, $350 entertainment cap
```

**Generated Files**:
- `analysis/spending-insights-[date].md`
- `analysis/recommendations-[date].md`
- `analysis/budget-suggestions-[date].json`

---

## 🔍 /audit-categories

**Purpose**: Audits expense categorizations and suggests improvements

**Usage**: `/audit-categories [time-period] [confidence-threshold]`

**Parameters**:
- `time-period`: `last-month` | `last-3-months` | `last-6-months` | `all` (default: `last-3-months`)
- `confidence-threshold`: 0.0-1.0 (default: 0.7)

**What it does**:
- Checks categorization consistency
- Analyzes merchant patterns
- Validates amount patterns by category
- Provides ML-based suggestions
- Enables bulk recategorization

**Quick Examples**:
```bash
/audit-categories                                    # Standard 3-month audit
/audit-categories all 0.85                         # Full audit, high confidence
/audit-categories --auto-apply --min-confidence=0.9 # Auto-fix high confidence
```

**Sample Detection**:
```
🔍 INCONSISTENCIES FOUND (15 total):

"STARBUCKS #1234"
├─ Current: Food (8x), Entertainment (3x)
├─ Suggestion: Standardize to "Food"
└─ Confidence: 85%

"SHELL STATION #3456 - $67.82"
├─ Current: Shopping
├─ ML Suggestion: Transportation (94%)
└─ Action: ✅ Accept (gas station pattern)
```

**Features**:
- Interactive audit process
- Bulk operation support
- ML integration for smart suggestions
- Merchant rule generation

---

## 🏥 /health-check

**Purpose**: Comprehensive system health assessment and optimization

**Usage**: `/health-check [scope] [fix-mode]`

**Parameters**:
- `scope`: `data` | `system` | `performance` | `security` | `all` (default: `all`)
- `fix-mode`: `none` | `safe` | `aggressive` (default: `safe`)

**What it does**:
- Validates data integrity
- Analyzes system performance
- Audits security and privacy
- Checks storage efficiency
- Tests component health
- Validates export functionality

**Quick Examples**:
```bash
/health-check all safe        # Full check with safe auto-fixes
/health-check data none       # Data check only, no fixes
/health-check performance     # Performance optimization check
```

**Sample Reports**:

**📊 Data Health**:
```
✅ Total Expenses: 1,247 records (98.4% complete)
⚠️  Duplicates: 3 found
❌ Invalid Dates: 2 detected
🔧 Actions: Fix dates, review duplicates
```

**⚡ Performance Health**:
```
✅ Load Time: 45ms (excellent)
❌ Bundle Size: 2.1MB (too large)
⚠️  List Rendering: 340ms (needs virtualization)
🚀 Actions: Code splitting, virtualization
```

**🔒 Security Health**:
```
✅ Input Validation: Proper
⚠️  Storage: 85% capacity used
⚠️  Privacy: Plain text merchant names
🛡️ Actions: Clean storage, hash merchants
```

**Auto-Fix Capabilities**:
- **Safe**: Remove duplicates, fix formatting, clean whitespace
- **Aggressive**: Merge transactions, ML categorization, bulk updates

---

## 🎯 Command Integration

**Works With**:
- Existing export utilities (`src/utils/export.ts`)
- ML categorization system (when available)
- Analytics dashboard components
- Storage and data management hooks

**Generated Output Structure**:
```
project/
├── analysis/          # Export analysis reports
├── audits/           # Category audit results
├── reports/          # Health check dashboards
└── recommendations/  # Action items and fixes
```

## 🚀 Quick Start Guide

**1. Analyze Your Spending**:
```bash
/analyze-export all
# Review generated insights in analysis/ folder
```

**2. Clean Up Categories**:
```bash
/audit-categories --auto-apply --min-confidence=0.9
# Accept high-confidence categorization fixes
```

**3. System Health Check**:
```bash
/health-check all safe
# Get comprehensive health report with safe fixes
```

## 💡 Pro Tips

- Run `/health-check` before major releases
- Use `/audit-categories` monthly for data quality
- `/analyze-export` provides great budget planning insights
- Combine commands: health check → audit → analyze for full optimization
- Set up scheduled runs for continuous monitoring

**📖 Full Documentation**: [NEW_COMMANDS.md](https://github.com/igorzamiatin-hireright/expense-tracker-ai-/blob/main/NEW_COMMANDS.md)