# ExpenseTracker - Personal Finance Management

A modern, professional NextJS expense tracking application that helps users manage their personal finances with intuitive design and powerful analytics.

## ✨ Features

### Core Functionality
- **Add Expenses**: Create expense records with date, amount, category, and description
- **View & Organize**: Clean, organized expense list with sorting capabilities
- **Filter & Search**: Advanced filtering by date range, category, and text search
- **Edit & Delete**: Modify or remove existing expenses with confirmation dialogs
- **Data Persistence**: All data stored in browser localStorage for demo purposes

### Categories
- Food
- Transportation
- Entertainment
- Shopping
- Bills
- Other

### Dashboard & Analytics
- **Summary Cards**: Total expenses, monthly spending, transaction counts
- **Recent Expenses**: Quick view of latest transactions
- **Top Categories**: Visual breakdown of spending by category
- **Interactive Charts**: Pie charts and line/bar charts for spending trends
- **Category Analysis**: Detailed breakdown with percentages and averages

### Export & Reporting
- **CSV Export**: Export filtered expenses or all data
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Professional UI**: Clean, modern interface with excellent user experience

## 🚀 Getting Started

### Prerequisites
- Node.js 18.0 or later
- npm or yarn package manager

### Installation

1. **Clone or download the project**
   ```bash
   # If you received this as a zip file, extract it
   # Or clone if from a repository:
   git clone <repository-url>
   cd expense-tracker-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   - Navigate to [http://localhost:3000](http://localhost:3000) in your browser
   - The application will be ready to use immediately

### Building for Production

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Start the production server**
   ```bash
   npm start
   ```

## 📱 How to Use

### Adding Your First Expense
1. Click **"Add Expense"** button on the dashboard or navigate to the Add Expense page
2. Fill in the expense details:
   - **Amount**: Enter the expense amount (USD)
   - **Category**: Select from predefined categories
   - **Description**: Add a meaningful description
   - **Date**: Select the expense date
3. Click **"Add Expense"** to save

### Managing Expenses
- **View All**: Go to "All Expenses" to see complete list
- **Search**: Use the search box to find specific expenses
- **Filter**: Filter by category, date range, or combination
- **Edit**: Click the edit button on any expense to modify
- **Delete**: Click the delete button and confirm to remove

### Analytics & Insights
- **Dashboard**: Overview of your spending with summary cards
- **Analytics Page**: Detailed charts and category breakdowns
- **Export Data**: Download your expenses as CSV for external analysis

### Navigation
- **Dashboard**: Main overview and recent activity
- **Add Expense**: Quick expense entry form
- **All Expenses**: Complete expense management with filters
- **Analytics**: Visual spending analysis and insights

## 🛠 Technical Details

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS for modern design
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React icons
- **Date Handling**: date-fns utility library

### Architecture
- **Components**: Reusable UI components with proper typing
- **Hooks**: Custom React hooks for state management
- **Utils**: Utility functions for common operations
- **Types**: Comprehensive TypeScript interfaces
- **Storage**: Browser localStorage for data persistence

### Key Files Structure
```
src/
├── app/                    # Next.js 14 app router pages
├── components/
│   ├── ui/                # Reusable UI components
│   ├── forms/             # Form components
│   └── charts/            # Chart components
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript definitions
├── utils/                 # Utility functions
└── lib/                   # Library configurations
```

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Features Implemented
✅ Expense CRUD operations
✅ Form validation
✅ Date picker integration
✅ Search and filtering
✅ Responsive design
✅ Data visualization
✅ CSV export
✅ Loading states
✅ Error handling
✅ TypeScript coverage
✅ Modern UI/UX

## 💾 Data Storage

This application uses browser localStorage for data persistence. This means:
- ✅ Data persists between browser sessions
- ✅ No server or database required
- ✅ Fast, responsive experience
- ⚠️ Data is device/browser specific
- ⚠️ Clearing browser data will remove expenses

For production use, you might want to integrate with:
- Database (PostgreSQL, MongoDB)
- Cloud storage (Firebase, Supabase)
- User authentication system

## 🎨 Customization

### Adding New Categories
Update the categories in `src/types/expense.ts`:
```typescript
export type ExpenseCategory =
  | 'Food'
  | 'Transportation'
  | 'Entertainment'
  | 'Shopping'
  | 'Bills'
  | 'Other'
  | 'YourNewCategory'; // Add here
```

### Modifying Colors
Update colors in `src/components/charts/CategoryChart.tsx` and Tailwind classes throughout the app.

### Currency Support
Modify `src/utils/currency.ts` to change currency formatting.

## 🤝 Support

If you encounter any issues or have questions:
1. Check this README for common solutions
2. Ensure all dependencies are properly installed
3. Verify Node.js version compatibility
4. Clear browser cache and localStorage if needed

## 📄 License

This project is created for demonstration purposes. Feel free to use and modify as needed.

---

**Happy expense tracking! 💰📊**