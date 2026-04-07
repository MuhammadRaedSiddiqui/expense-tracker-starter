# Finance Tracker - User Guide

Welcome to Finance Tracker! This guide will help you get started and make the most of all features.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Dashboard](#dashboard)
3. [Transactions](#transactions)
4. [Recurring Transactions](#recurring-transactions)
5. [Budgets](#budgets)
6. [Reports & Analytics](#reports--analytics)
7. [Team Collaboration](#team-collaboration)
8. [Settings](#settings)

---

## Getting Started

### Creating an Account

1. Visit the application URL
2. Click "Sign Up" to create a new account
3. Enter your email and password
4. Verify your email address
5. Create your organization (e.g., "Personal Finances" or "Family Budget")

### First Steps

After creating your account:
1. You'll be redirected to the Dashboard
2. Click "Add Transaction" to record your first transaction
3. Explore the navigation menu to access different features

---

## Dashboard

The Dashboard provides an overview of your financial health.

### Summary Cards

- **Total Income**: Sum of all income transactions
- **Total Expenses**: Sum of all expense transactions
- **Balance**: Net amount (Income - Expenses)

### Visualizations

- **Spending by Category**: Pie chart showing expense distribution
- **Income vs Expenses**: Line chart showing trends over time
- **Budget Overview**: Top 3 active budgets with progress bars
- **Budget Alerts**: Warnings when budgets are at 80%+ or exceeded

### Recent Transactions

View your latest transactions with quick actions:
- Edit transaction details
- Delete transactions
- Filter by type or category

---

## Transactions

Manage all your income and expense transactions.

### Adding a Transaction

1. Click "Add Transaction" button
2. Fill in the form:
   - **Description**: What the transaction is for (e.g., "Grocery shopping")
   - **Amount**: Transaction amount (must be positive)
   - **Currency**: Select from 10 supported currencies
   - **Type**: Income or Expense
   - **Category**: Choose appropriate category
3. Click "Add Transaction"

**Validation**: The form validates in real-time:
- Green checkmark appears for valid fields
- Red border and error message for invalid fields
- Description must be at least 3 characters
- Amount must be a positive number

### Editing Transactions

1. Find the transaction in the list
2. Click the "Edit" button
3. Modify the fields
4. Click "Save" to update

### Deleting Transactions

1. Find the transaction in the list
2. Click the "Delete" button
3. Confirm the deletion

### Filtering & Sorting

**Filters:**
- Type: All, Income, or Expense
- Category: Filter by specific category
- Date Range: Set start and end dates
- Search: Find transactions by description

**Sorting:**
- Sort by: Date, Amount, or Description
- Order: Ascending or Descending

### Multi-Currency Support

The app supports 10 currencies:
- USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN

Exchange rates are fetched automatically and can be manually refreshed.

---

## Recurring Transactions

Automate regular income or expenses.

### Creating a Recurring Transaction

1. Navigate to "Recurring" in the menu
2. Click "Add Recurring Transaction"
3. Fill in the form:
   - **Description**: Transaction name
   - **Amount**: Transaction amount
   - **Type**: Income or Expense
   - **Category**: Choose category
   - **Frequency**: Daily, Weekly, Monthly, or Yearly
   - **Interval**: Every X periods (e.g., "Every 2 weeks")
   - **Start Date**: When to begin
   - **End Date** (optional): When to stop

4. Click "Create"

### How It Works

- Recurring transactions are processed automatically at 2 AM daily
- When due, a regular transaction is created automatically
- The next execution date is calculated based on frequency
- Transactions stop automatically when end date is reached

### Managing Recurring Transactions

- **Toggle Active/Inactive**: Pause without deleting
- **Edit**: Update details or schedule
- **Delete**: Remove permanently

### Examples

- **Monthly Salary**: Income, Monthly, 1st of each month
- **Weekly Groceries**: Expense, Weekly, Every Sunday
- **Quarterly Insurance**: Expense, Monthly, Every 3 months

---

## Budgets

Set spending limits and track progress.

### Creating a Budget

1. Navigate to "Budgets" in the menu
2. Click "Create Budget"
3. Fill in the form:
   - **Category**: Which category to track
   - **Amount**: Budget limit
   - **Currency**: Budget currency
   - **Period**: Monthly or Yearly
   - **Start Date**: When budget begins
   - **End Date** (optional): When budget expires

4. Click "Create Budget"

### Budget Status

Budgets show real-time spending:
- **Green**: Under 80% of budget
- **Amber**: 80-99% of budget (warning)
- **Red**: Over budget (critical)

### Budget Alerts

The Dashboard shows alerts for:
- Budgets at 80%+ (warning)
- Budgets exceeded (critical)

### Viewing Budget Details

Each budget card shows:
- Category name
- Amount spent / Budget limit
- Percentage used
- Progress bar with color coding
- Remaining amount

### Managing Budgets

- **Edit**: Update budget amount or dates
- **Delete**: Remove budget
- **View Status**: See detailed spending breakdown

---

## Reports & Analytics

Analyze your financial data with comprehensive reports.

### Date Range Selection

Choose the period to analyze:
- **Quick Ranges**: Last Month, 3 Months, 6 Months, Year
- **Custom Range**: Select specific start and end dates

### Summary Statistics

View key metrics for the selected period:
- Total Income
- Total Expenses
- Net Amount
- Transaction Count

### Period Comparison

Compare current period with previous period:
- Income change (%)
- Expense change (%)
- Net amount change (%)
- Transaction count change (%)

**Color Coding:**
- Green: Positive change (income up, expenses down)
- Red: Negative change (income down, expenses up)

### Visualizations

**Spending Trends**
- Monthly bar chart comparing income vs expenses
- Interactive tooltips on hover
- Automatic scaling

**Category Breakdown**
- Expense distribution by category
- Progress bars with percentages
- Top 10 categories

### Exporting Data

**CSV Export:**
1. Click "Export as CSV"
2. File downloads with all transactions in the date range
3. Opens in Excel, Google Sheets, etc.

**PDF Export:**
1. Click "Export as PDF"
2. Generates a formatted report with:
   - Summary statistics
   - Period comparison
   - Charts and visualizations
3. Perfect for printing or sharing

---

## Team Collaboration

Work together with family or team members.

### Inviting Members

1. Navigate to "Team" in the menu
2. Click "Invite Member"
3. Enter email address
4. Select role:
   - **Owner**: Full access, can manage members
   - **Admin**: Can manage transactions and budgets
   - **Member**: Can view and add transactions
5. Click "Send Invitation"

An email is sent with an invitation link.

### Accepting Invitations

1. Click the link in the invitation email
2. Sign in or create an account
3. Accept the invitation
4. You're added to the organization

### Managing Members

**Change Role:**
1. Find the member in the list
2. Select new role from dropdown
3. Changes apply immediately

**Remove Member:**
1. Find the member in the list
2. Click "Remove"
3. Confirm the action

### Pending Invitations

View and manage pending invitations:
- See who has been invited
- Revoke invitations if needed
- Resend invitation emails

### Real-Time Collaboration

Changes made by team members appear automatically:
- New transactions show up instantly
- Budget updates are reflected immediately
- "Live" indicator shows when real-time is active

---

## Settings

Manage your account and organization settings.

### User Profile

View your account information:
- Email address
- Full name
- Account creation date

### Organization Details

View organization information:
- Organization name
- Creation date
- Member count

### Preferences

Additional settings and customization options will be available in future updates.

### Danger Zone

**Delete Account:**
- Permanently removes your account
- Cannot be undone
- Feature coming in future update

---

## Tips & Best Practices

### Transaction Management

1. **Be Consistent**: Record transactions regularly
2. **Use Categories**: Proper categorization helps with reports
3. **Add Details**: Clear descriptions make tracking easier
4. **Review Weekly**: Check your transactions weekly

### Budget Planning

1. **Start Small**: Begin with 2-3 key categories
2. **Be Realistic**: Set achievable budget limits
3. **Review Monthly**: Adjust budgets based on actual spending
4. **Use Alerts**: Pay attention to budget warnings

### Team Collaboration

1. **Set Clear Roles**: Assign appropriate permissions
2. **Communicate**: Discuss major expenses with team
3. **Review Together**: Use reports for team meetings
4. **Stay Organized**: Use consistent categories

### Data Analysis

1. **Compare Periods**: Look for trends over time
2. **Identify Patterns**: Find areas to reduce spending
3. **Export Reports**: Share with accountant or advisor
4. **Set Goals**: Use data to set financial targets

---

## Keyboard Shortcuts

- **Ctrl/Cmd + K**: Quick search (coming soon)
- **Esc**: Close modals
- **Tab**: Navigate form fields

---

## Troubleshooting

### Transactions Not Appearing

1. Check your filters (type, category, date range)
2. Verify you're in the correct organization
3. Refresh the page
4. Check internet connection

### Real-Time Updates Not Working

- The app automatically falls back to polling (30-second refresh)
- "Live" indicator shows when real-time is active
- No action needed - updates still work

### Budget Not Updating

1. Ensure transactions are in the correct category
2. Check budget date range
3. Verify currency matches
4. Refresh the page

### Export Issues

**CSV Export:**
- Ensure you have transactions in the selected date range
- Check browser download settings

**PDF Export:**
- Allow pop-ups if blocked
- Try a different browser if issues persist
- Ensure sufficient disk space

---

## Support

For additional help:
- Check the API documentation for developers
- Review the deployment guide for hosting
- Report issues on GitHub
- Contact support team

---

## What's Next?

Upcoming features:
- Mobile app
- Receipt scanning
- Investment tracking
- Tax reporting
- Custom categories
- Advanced analytics
- API access

Thank you for using Finance Tracker!
