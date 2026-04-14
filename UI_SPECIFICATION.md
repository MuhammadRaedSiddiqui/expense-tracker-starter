# Expense Tracker - UI/UX Specification

## Table of Contents
1. [Design System](#design-system)
2. [Authentication Screens](#authentication-screens)
3. [Dashboard](#dashboard)
4. [Transactions](#transactions)
5. [Recurring Transactions](#recurring-transactions)
6. [Budgets](#budgets)
7. [Reports](#reports)
8. [Team Management](#team-management)
9. [Settings](#settings)
10. [Modals & Dialogs](#modals--dialogs)

---

## Design System

### Color Palette
- **Primary**: Slate-700 (#334155) - Main actions, headers
- **Primary Hover**: Slate-800 (#1e293b)
- **Background**: Gray-50 (#f9fafb)
- **Surface**: White (#ffffff)
- **Border**: Gray-200 (#e5e7eb), Gray-300 (#d1d5db)
- **Text Primary**: Slate-900 (#0f172a)
- **Text Secondary**: Slate-500 (#64748b), Slate-600 (#475569)
- **Success**: Green-600 (#16a34a), Green-100 (#dcfce7)
- **Error/Danger**: Rose-600 (#e11d48), Rose-50 (#fff1f2)
- **Warning**: Amber-500 (#f59e0b), Amber-50 (#fffbeb)
- **Info**: Blue-500 (#3b82f6), Blue-50 (#eff6ff)

### Typography
- **Headings**: 
  - H1: 3xl (30px), font-semibold
  - H2: 2xl (24px), font-semibold
  - H3: xl (20px), font-semibold
- **Body**: Base (16px), font-normal
- **Small**: sm (14px), xs (12px)
- **Font Family**: System default (sans-serif)

### Spacing
- Container max-width: 7xl (80rem / 1280px)
- Padding: px-4 sm:px-6 lg:px-8
- Section spacing: mb-6, mb-8
- Component gaps: gap-3, gap-4, gap-6

### Components
- **Buttons**: Rounded-md (6px), shadow-md, hover:shadow-lg
- **Cards**: Rounded-lg (8px), shadow-sm, bg-white
- **Inputs**: Rounded-md, border, focus:ring-2
- **Modals**: Rounded-lg, shadow-xl, backdrop blur

---

## Authentication Screens

### 1. Sign In Screen

**Layout:**
```
┌─────────────────────────────────────┐
│                                     │
│         Finance Tracker             │
│   Track your income and expenses    │
│           with ease                 │
│                                     │
│     ┌─────────────────────┐        │
│     │                     │        │
│     │   Clerk Sign In     │        │
│     │   Component         │        │
│     │                     │        │
│     └─────────────────────┘        │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Centered layout with gray-50 background
- Title: "Finance Tracker" (3xl, bold, slate-900)
- Subtitle: "Track your income and expenses with ease" (sm, slate-600)
- Clerk SignIn component with shadow-lg card

**Interactions:**
- Email/password or OAuth sign in
- Link to sign up page
- Forgot password flow

---

### 2. Sign Up Screen

**Layout:** Same as Sign In with Clerk SignUp component

**Components:**
- Centered layout
- Title and subtitle
- Clerk SignUp component
- Link to sign in page

---

## Dashboard

### Layout Overview
```
┌────────────────────────────────────────────────────────┐
│  Sidebar  │  Main Content Area                         │
│           │                                            │
│  Nav      │  Header (Dashboard + Live Badge)          │
│  Links    │  Exchange Rate Info                       │
│           │  [Add Transaction] [Clear All]            │
│           │  ─────────────────────────────────────    │
│           │                                            │
│           │  Budget Alerts (if any)                   │
│           │                                            │
│           │  Summary Cards (Income, Expenses, Balance)│
│           │                                            │
│           │  ┌──────────┬──────────┬──────────┐      │
│           │  │ Spending │ Income   │ Budget   │      │
│           │  │ by Cat.  │ vs Exp.  │ Overview │      │
│           │  └──────────┴──────────┴──────────┘      │
│           │                                            │
│           │  Transaction List with Filters            │
│           │                                            │
└────────────────────────────────────────────────────────┘
```

### Header Section

**Components:**
1. **Title Area** (left)
   - "Dashboard" heading (3xl, semibold, slate-900)
   - Live badge (if real-time active): Green pill with pulsing dot
   - Subtitle: "Track your income and expenses" (sm, slate-500)
   - Exchange rate info: 
     - Last updated time (xs, slate-400)
     - Refresh button (↻ icon, hover:slate-700)
     - Error message if rates failed (xs, rose-600)

2. **Action Buttons** (right)
   - "Add Transaction" button (primary, slate-700, shadow-md)
   - "Clear All" button (secondary, white with border)

### Budget Alerts Section

**Layout:**
- Appears below header if budgets are exceeded or near limit
- Alert cards with warning/danger styling
- Shows budget name, spent amount, limit, and percentage

**Visual States:**
- Warning (80-99%): Amber background
- Danger (100%+): Rose background

### Summary Cards

**Layout:** 3-column grid (responsive: 1 column on mobile)

**Card 1: Total Income**
- Icon: ↑ (green circle)
- Label: "Total Income" (sm, gray-600)
- Amount: Large, bold, green-600
- Currency symbol included

**Card 2: Total Expenses**
- Icon: ↓ (red circle)
- Label: "Total Expenses" (sm, gray-600)
- Amount: Large, bold, rose-600
- Currency symbol included

**Card 3: Balance**
- Icon: = (blue circle)
- Label: "Balance" (sm, gray-600)
- Amount: Large, bold, color based on positive/negative
  - Positive: green-600
  - Negative: rose-600
- Currency symbol included

**Card Styling:**
- White background
- Rounded-lg
- Shadow-sm
- Padding: p-6
- Hover: shadow-md transition

### Charts Section

**Layout:** 3-column grid (responsive: 1 column on mobile)

**Chart 1: Spending by Category (Pie Chart)**
- Title: "Spending by Category"
- Pie chart showing expense distribution
- Legend with category names and amounts
- Empty state: "No expense data available"

**Chart 2: Income vs Expenses (Line Chart)**
- Title: "Income vs Expenses"
- Line chart showing trends over time
- Two lines: Income (green), Expenses (red)
- X-axis: Dates
- Y-axis: Amounts
- Empty state: "No data available"

**Chart 3: Budget Overview**
- Title: "Budget Overview"
- List of budgets with progress bars
- Each budget shows:
  - Category name
  - Spent / Limit amounts
  - Progress bar (color-coded)
  - Percentage
- "View All Budgets" link
- Empty state: "No budgets set"

### Transaction List Section

**Components:**
1. **Filter Bar**
   - Type filter: Dropdown (All, Income, Expense)
   - Category filter: Dropdown (All categories)
   - Search input: Text field with search icon
   - Date range: Start date and end date pickers
   - Sort controls: Sort by (Date, Amount, Description) + Order toggle

2. **Transaction Table**
   - Columns: Date, Description, Category, Amount, Actions
   - Row styling: Hover effect, alternating backgrounds
   - Amount color: Green for income, red for expenses
   - Actions: Edit (pencil icon), Delete (trash icon)
   - Empty state: "No transactions found"

3. **Pagination** (if needed)
   - Page numbers
   - Previous/Next buttons

---

## Transactions

### Layout
Similar to Dashboard but focused on transaction management

**Key Differences:**
- No summary cards or charts
- Expanded filter options
- Bulk actions available
- Export functionality

**Components:**
1. Header with "Transactions" title
2. Action buttons: Add Transaction, Export, Bulk Delete
3. Advanced filters panel
4. Transaction table (full width)
5. Pagination

---

## Recurring Transactions

### Layout
```
┌────────────────────────────────────────────────────────┐
│  Header: Recurring Transactions                        │
│  [Add Recurring Transaction]                           │
│  ─────────────────────────────────────────────────────│
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ Recurring Transaction Card 1                 │    │
│  │ Description | Category | Amount               │    │
│  │ Frequency: Monthly | Next: Apr 15, 2026      │    │
│  │ [Edit] [Delete] [Pause]                      │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ Recurring Transaction Card 2                 │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components:**

1. **Recurring Transaction Card**
   - Description (bold, lg)
   - Category badge
   - Amount (color-coded)
   - Frequency: Daily, Weekly, Monthly, Yearly
   - Next occurrence date
   - Status indicator: Active (green), Paused (gray)
   - Action buttons: Edit, Delete, Pause/Resume

2. **Add Recurring Transaction Form**
   - All standard transaction fields
   - Additional fields:
     - Frequency dropdown
     - Start date
     - End date (optional)
     - Day of month/week selector

**Empty State:**
- Icon: Calendar with repeat symbol
- Message: "No recurring transactions set up"
- CTA: "Add Recurring Transaction" button

---

## Budgets

### Layout
```
┌────────────────────────────────────────────────────────┐
│  Header: Budgets                                       │
│  [Create Budget]                                       │
│  ─────────────────────────────────────────────────────│
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ Budget Card: Groceries                       │    │
│  │ $450 / $500 (90%)                            │    │
│  │ ████████████░░ Progress Bar                  │    │
│  │ $50 remaining                                │    │
│  │ Period: Monthly | Resets: May 1              │    │
│  │ [Edit] [Delete]                              │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components:**

1. **Budget Card**
   - Category name (lg, bold)
   - Spent / Limit display
   - Percentage
   - Progress bar:
     - Green: 0-79%
     - Amber: 80-99%
     - Red: 100%+
   - Remaining amount
   - Period: Weekly, Monthly, Yearly
   - Reset date
   - Action buttons: Edit, Delete

2. **Create/Edit Budget Modal**
   - Category selector
   - Amount limit input
   - Period selector (Weekly, Monthly, Yearly)
   - Start date
   - Alert threshold (optional, default 80%)
   - Save/Cancel buttons

**Visual States:**
- Under budget: Green accent
- Near limit (80-99%): Amber accent
- Over budget: Red accent, warning icon

---

## Reports

### Layout
```
┌────────────────────────────────────────────────────────┐
│  Header: Reports                                       │
│  Date Range Selector | Export PDF                     │
│  ─────────────────────────────────────────────────────│
│                                                        │
│  Summary Statistics                                    │
│  ┌──────┬──────┬──────┬──────┐                       │
│  │Income│Expense│Balance│Avg  │                       │
│  └──────┴──────┴──────┴──────┘                       │
│                                                        │
│  ┌─────────────────────────────────────────────┐     │
│  │ Income vs Expenses Trend (Line Chart)       │     │
│  │                                              │     │
│  └─────────────────────────────────────────────┘     │
│                                                        │
│  ┌──────────────┬──────────────┐                     │
│  │ Category     │ Period       │                     │
│  │ Breakdown    │ Comparison   │                     │
│  └──────────────┴──────────────┘                     │
│                                                        │
│  Top Categories Table                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components:**

1. **Date Range Selector**
   - Preset options: This Month, Last Month, This Year, Custom
   - Start and end date pickers
   - Apply button

2. **Summary Statistics Cards**
   - Total Income
   - Total Expenses
   - Net Balance
   - Average Transaction
   - Transaction Count

3. **Charts**
   - Income vs Expenses Trend (line chart)
   - Spending by Category (pie chart)
   - Period Comparison (bar chart)

4. **Top Categories Table**
   - Category name
   - Total spent
   - Transaction count
   - Percentage of total
   - Trend indicator (↑↓)

5. **Export Options**
   - Export as PDF
   - Export as CSV
   - Email report

---

## Team Management

### Layout
```
┌────────────────────────────────────────────────────────┐
│  Header: Team                                          │
│  Organization: [Name]                                  │
│  ─────────────────────────────────────────────────────│
│                                                        │
│  Team Members                                          │
│  [Invite Member]                                       │
│                                                        │
│  ┌──────────────────────────────────────────────┐    │
│  │ Avatar | Name | Email | Role | [Remove]      │    │
│  ├──────────────────────────────────────────────┤    │
│  │ Avatar | Name | Email | Role | [Remove]      │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
│  Pending Invitations                                   │
│  ┌──────────────────────────────────────────────┐    │
│  │ Email | Role | Sent | [Resend] [Cancel]      │    │
│  └──────────────────────────────────────────────┘    │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components:**

1. **Team Members List**
   - User avatar (or initials)
   - Full name
   - Email address
   - Role badge (Owner, Admin, Member)
   - Remove button (not for owners)
   - Current user highlighted

2. **Invite Member Modal**
   - Email input
   - Role selector (Admin, Member)
   - Personal message (optional)
   - Send Invitation button

3. **Pending Invitations Table**
   - Email address
   - Role
   - Sent date
   - Status: Pending
   - Actions: Resend, Cancel

4. **Role Badges**
   - Owner: Blue badge
   - Admin: Purple badge
   - Member: Gray badge

---

## Settings

### Layout
```
┌────────────────────────────────────────────────────────┐
│  Header: Settings                                      │
│  ─────────────────────────────────────────────────────│
│                                                        │
│  ┌─────────────────────────────────────────────┐     │
│  │ Profile Settings                            │     │
│  │ Name, Email, Avatar                         │     │
│  └─────────────────────────────────────────────┘     │
│                                                        │
│  ┌─────────────────────────────────────────────┐     │
│  │ Preferences                                 │     │
│  │ Currency, Date Format, Theme                │     │
│  └─────────────────────────────────────────────┘     │
│                                                        │
│  ┌─────────────────────────────────────────────┐     │
│  │ Notifications                               │     │
│  │ Email alerts, Budget warnings               │     │
│  └─────────────────────────────────────────────┘     │
│                                                        │
│  ┌─────────────────────────────────────────────┐     │
│  │ Organization Settings                       │     │
│  │ Name, Currency, Members                     │     │
│  └─────────────────────────────────────────────┘     │
│                                                        │
└────────────────────────────────────────────────────────┘
```

**Components:**

1. **Profile Settings Section**
   - Avatar upload
   - Name input
   - Email (read-only, managed by Clerk)
   - Save button

2. **Preferences Section**
   - Default currency dropdown (10 currencies)
   - Date format selector
   - Theme toggle (Light/Dark)
   - Language selector (future)

3. **Notification Settings**
   - Email notifications toggle
   - Budget alert threshold
   - Weekly summary email toggle
   - Transaction reminders toggle

4. **Organization Settings** (Admin only)
   - Organization name
   - Default currency
   - Member management link
   - Delete organization (danger zone)

---

## Modals & Dialogs

### 1. Add/Edit Transaction Modal

**Layout:**
```
┌─────────────────────────────────────┐
│  Add Transaction              [×]   │
├─────────────────────────────────────┤
│                                     │
│  Type: ○ Income  ● Expense         │
│                                     │
│  Description: [____________]        │
│                                     │
│  Amount: [____________]             │
│                                     │
│  Currency: [USD ▼]                  │
│                                     │
│  Category: [Select ▼]               │
│                                     │
│  Date: [Apr 14, 2026]               │
│                                     │
│  [Cancel]  [Add Transaction]        │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Type selector: Radio buttons (Income/Expense)
- Description: Text input
- Amount: Number input with currency symbol
- Currency: Dropdown (10 currencies)
- Category: Dropdown (filtered by type)
- Date: Date picker (defaults to today)
- Validation errors displayed inline
- Loading state on submit button

**Validation:**
- Description: Required, max 100 characters
- Amount: Required, positive number
- Category: Required
- Date: Required, not in future

---

### 2. Confirm Dialog

**Layout:**
```
┌─────────────────────────────────────┐
│  Delete Transaction           [×]   │
├─────────────────────────────────────┤
│                                     │
│  ⚠️                                 │
│                                     │
│  Are you sure you want to delete    │
│  this transaction? This action      │
│  cannot be undone.                  │
│                                     │
│  [Cancel]  [Delete]                 │
│                                     │
└─────────────────────────────────────┘
```

**Variants:**
1. **Delete Transaction**
   - Warning icon
   - Confirmation message
   - Cancel (secondary) + Delete (danger) buttons

2. **Clear All Transactions**
   - Warning icon
   - Stronger warning message
   - Cancel + Clear All (danger) buttons

3. **Delete Budget**
   - Warning icon
   - Confirmation message
   - Cancel + Delete (danger) buttons

**Styling:**
- Danger buttons: Red background (rose-600)
- Warning icon: Amber color
- Backdrop: Semi-transparent black with blur

---

### 3. Budget Modal

**Layout:**
```
┌─────────────────────────────────────┐
│  Create Budget                [×]   │
├─────────────────────────────────────┤
│                                     │
│  Category: [Select ▼]               │
│                                     │
│  Limit Amount: [____________]       │
│                                     │
│  Period: [Monthly ▼]                │
│                                     │
│  Start Date: [Apr 1, 2026]          │
│                                     │
│  Alert at: [80]% of limit           │
│                                     │
│  [Cancel]  [Create Budget]          │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Category selector (expense categories only)
- Limit amount input
- Period selector (Weekly, Monthly, Yearly)
- Start date picker
- Alert threshold slider (0-100%)
- Preview of reset date

---

## Common UI Patterns

### Loading States

1. **Skeleton Loaders**
   - Summary cards: Animated gray rectangles
   - Charts: Pulsing placeholder
   - Tables: Row skeletons with shimmer effect

2. **Spinner**
   - Centered spinner for full-page loads
   - Inline spinner for button actions
   - Color: Slate-700

3. **Progress Indicators**
   - Linear progress bar for uploads/exports
   - Circular progress for percentage-based operations

### Empty States

**Pattern:**
```
┌─────────────────────────────────────┐
│                                     │
│           📊 Icon                   │
│                                     │
│      No transactions yet            │
│                                     │
│   Get started by adding your        │
│   first transaction                 │
│                                     │
│      [Add Transaction]              │
│                                     │
└─────────────────────────────────────┘
```

**Components:**
- Relevant icon (large, gray)
- Primary message (lg, semibold)
- Secondary message (sm, gray)
- Call-to-action button

### Toast Notifications

**Position:** Top-right corner

**Types:**
1. **Success** (green)
   - ✓ icon
   - "Transaction added successfully"
   - Auto-dismiss: 3 seconds

2. **Error** (red)
   - ✗ icon
   - "Failed to add transaction"
   - Auto-dismiss: 5 seconds

3. **Warning** (amber)
   - ⚠ icon
   - "Budget limit approaching"
   - Auto-dismiss: 4 seconds

4. **Info** (blue)
   - ℹ icon
   - "Exchange rates updated"
   - Auto-dismiss: 3 seconds

### Responsive Breakpoints

- **Mobile**: < 640px (sm)
  - Single column layouts
  - Stacked cards
  - Hamburger menu
  - Bottom navigation

- **Tablet**: 640px - 1024px (md, lg)
  - 2-column grids
  - Sidebar visible
  - Compact spacing

- **Desktop**: > 1024px (xl, 2xl)
  - 3-column grids
  - Full sidebar
  - Expanded spacing
  - Hover effects

---

## Accessibility Features

### Keyboard Navigation
- Tab order follows visual flow
- Focus indicators on all interactive elements
- Escape key closes modals
- Enter key submits forms

### Screen Reader Support
- ARIA labels on all buttons and inputs
- ARIA roles for semantic regions
- Live regions for dynamic content
- Alt text for icons and images

### Color Contrast
- All text meets WCAG AA standards
- Focus indicators have 3:1 contrast
- Error states use both color and icons

### Form Accessibility
- Labels associated with inputs
- Error messages linked to fields
- Required fields indicated
- Validation feedback announced

---

## Animation & Transitions

### Micro-interactions
- Button hover: Scale 1.02, shadow increase
- Card hover: Shadow elevation
- Input focus: Border color + ring
- Toggle switches: Smooth slide

### Page Transitions
- Fade in: 200ms
- Slide in (modals): 300ms
- Skeleton to content: Fade 150ms

### Loading Animations
- Spinner: Continuous rotation
- Skeleton: Shimmer effect (1.5s loop)
- Progress bar: Smooth fill

---

## Performance Considerations

### Optimization Strategies
1. **Lazy Loading**
   - Route-based code splitting
   - Image lazy loading
   - Chart libraries loaded on demand

2. **Caching**
   - Exchange rates cached for 1 hour
   - Transaction list cached with real-time updates
   - Static assets cached

3. **Debouncing**
   - Search input: 300ms debounce
   - Filter changes: 200ms debounce
   - Auto-save: 1000ms debounce

4. **Pagination**
   - 50 transactions per page
   - Virtual scrolling for large lists
   - Infinite scroll option

---

## Error Handling

### Error Display Patterns

1. **Inline Errors** (Form validation)
   - Red text below field
   - Red border on input
   - Error icon

2. **Banner Errors** (Page-level)
   - Red background banner
   - Error message
   - Retry button if applicable

3. **Toast Errors** (Action feedback)
   - Red toast notification
   - Error message
   - Auto-dismiss

4. **Empty State Errors**
   - Icon + message
   - Suggested action
   - Support link

### Common Error Messages
- "Failed to load transactions. Please refresh."
- "Invalid amount. Please enter a positive number."
- "Network error. Check your connection."
- "Session expired. Please sign in again."

---

## Future Enhancements

### Planned Features
1. **Dark Mode**
   - Toggle in settings
   - Persistent preference
   - System preference detection

2. **Mobile App**
   - Native iOS/Android apps
   - Push notifications
   - Offline support

3. **Advanced Analytics**
   - Predictive spending
   - Savings goals
   - Investment tracking

4. **Integrations**
   - Bank account sync
   - Receipt scanning
   - Export to accounting software

---

## Design Files & Assets

### Required Assets
- Logo (SVG)
- Favicon (ICO, PNG)
- Category icons (SVG)
- Empty state illustrations
- Loading animations

### Export Specifications
- Icons: 24x24px, SVG
- Images: WebP format, responsive sizes
- Charts: Canvas/SVG rendering
- PDF exports: A4 size, 300 DPI

---

*Document Version: 1.0*  
*Last Updated: April 14, 2026*  
*Created for: Expense Tracker Application*
