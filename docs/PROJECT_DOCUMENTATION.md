# Finance Tracker - Project Documentation

## 📋 Table of Contents
1. [What is This Project](#what-is-this-project)
2. [What Does It Do](#what-does-it-do)
3. [Project Scope](#project-scope)
4. [Features & Functionalities](#features--functionalities)
5. [Pages & Screens](#pages--screens)
6. [User Roles & Permissions](#user-roles--permissions)
7. [Technical Architecture](#technical-architecture)

---

## 🎯 What is This Project

**Finance Tracker** is a modern, full-stack **B2B SaaS expense management application** designed for teams and organizations to collaboratively track, manage, and analyze their financial transactions.

### Project Type
- **Category**: Financial Management / Expense Tracking
- **Architecture**: Multi-tenant B2B SaaS
- **Deployment**: Cloud-based (Vercel + Railway)
- **Target Users**: Small to medium businesses, teams, families

### Key Characteristics
- **Multi-tenant**: Each organization has isolated data
- **Real-time**: Live updates across team members
- **Collaborative**: Team-based with role permissions
- **Secure**: Row-level security and JWT authentication
- **Scalable**: Built for growth with performance optimizations

---

## 💡 What Does It Do

Finance Tracker helps organizations and teams:

### Primary Functions
1. **Track Financial Transactions**
   - Record income and expenses
   - Support for 10 currencies with real-time exchange rates
   - Categorize transactions (food, housing, utilities, etc.)
   - Add detailed descriptions and dates

2. **Automate Recurring Transactions**
   - Set up automatic recurring income/expenses
   - Flexible scheduling (daily, weekly, monthly, yearly)
   - Custom intervals (e.g., every 2 weeks)
   - Automatic transaction creation via scheduled jobs

3. **Manage Budgets**
   - Set spending limits by category
   - Track budget progress in real-time
   - Visual alerts when approaching or exceeding limits
   - Monthly and yearly budget periods

4. **Generate Reports & Analytics**
   - Interactive charts and visualizations
   - Spending trends over time
   - Category breakdown analysis
   - Period-over-period comparisons
   - Export reports as PDF or CSV

5. **Collaborate with Teams**
   - Invite team members via email
   - Role-based access control (Owner, Admin, Member, Viewer)
   - Real-time updates across all team members
   - Activity tracking and audit logs

### Problem It Solves
- **Manual tracking**: Eliminates spreadsheets and manual calculations
- **Lack of visibility**: Provides real-time financial insights
- **Team coordination**: Enables collaborative expense management
- **Budget overruns**: Alerts before exceeding spending limits
- **Data loss**: Cloud-based with automatic backups

---

## 📊 Project Scope

### In Scope ✅

#### Phase 1: Core Features (Completed)
- User authentication and authorization
- Organization creation and management
- Transaction CRUD operations
- Multi-currency support
- Real-time data synchronization
- Basic reporting and analytics

#### Phase 2: Team Collaboration (Completed)
- Team member invitations
- Role-based permissions
- Real-time updates across team
- Member management

#### Phase 3: Advanced Features (Completed)
- Recurring transactions with automation
- Budget tracking with alerts
- Advanced reports and visualizations
- PDF/CSV export functionality

#### Phase 4: Polish & Performance (Completed)
- Code splitting and lazy loading
- API response caching
- Toast notifications
- Skeleton loaders
- Form validation
- Accessibility improvements

### Out of Scope ❌

#### Not Included in Current Version
- Bank account integration / automatic imports
- Receipt scanning with OCR
- Investment portfolio tracking
- Tax reporting and filing
- Mobile native apps (iOS/Android)
- Cryptocurrency tracking
- Multi-organization support per user
- Advanced forecasting and predictions
- Integration with accounting software (QuickBooks, Xero)
- Payroll management

#### Future Considerations
- Mobile app development (React Native)
- Bank API integrations (Plaid, Yodlee)
- AI-powered insights and recommendations
- Advanced tax reporting
- Blockchain/crypto support
- API webhooks for third-party integrations

---

## ✨ Features & Functionalities

### 1. Authentication & Authorization

#### Sign Up
- **Description**: Create a new user account
- **Method**: Email and password via Clerk
- **Features**:
  - Email verification
  - Password strength requirements
  - Social login support (Google, GitHub)
  - Secure session management

#### Sign In
- **Description**: Access existing account
- **Method**: Email/password or social login
- **Features**:
  - Remember me functionality
  - Forgot password recovery
  - Session persistence
  - Automatic token refresh

#### Sign Out
- **Description**: Securely end user session
- **Features**:
  - Clear authentication tokens
  - Redirect to sign-in page
  - Session cleanup

### 2. Organization Management

#### Create Organization
- **Description**: Set up a new organization/workspace
- **Features**:
  - Custom organization name
  - Automatic slug generation
  - User becomes owner automatically
  - Default categories created

#### View Organization
- **Description**: See organization details
- **Features**:
  - Organization name and settings
  - Member count
  - Subscription status
  - Creation date

### 3. Transaction Management

#### Add Transaction
- **Description**: Record a new financial transaction
- **Input Fields**:
  - Description (required, min 3 characters)
  - Amount (required, positive number)
  - Currency (10 options: USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN)
  - Type (Income or Expense)
  - Category (varies by type)
  - Date (defaults to today)
- **Features**:
  - Real-time form validation
  - Visual feedback (green checkmark/red border)
  - Idempotency key to prevent duplicates
  - Automatic currency conversion
  - Toast notification on success

#### View Transactions
- **Description**: See all transactions in a list
- **Display**:
  - Transaction description
  - Amount with currency symbol
  - Type (income/expense with color coding)
  - Category
  - Date
  - Created by (user name)
- **Features**:
  - Sortable columns (date, amount, description)
  - Ascending/descending order toggle
  - Pagination (loads all, should add pagination)
  - Empty state message

#### Edit Transaction
- **Description**: Modify existing transaction
- **Permissions**:
  - Own transactions: All members
  - Any transaction: Owners and Admins
- **Features**:
  - Inline editing
  - Same validation as add
  - Optimistic UI updates
  - Rollback on error

#### Delete Transaction
- **Description**: Remove a transaction
- **Permissions**: Same as edit
- **Features**:
  - Confirmation dialog
  - Permanent deletion
  - Toast notification
  - Immediate UI update

#### Filter Transactions
- **Description**: Narrow down transaction list
- **Filter Options**:
  - By type (All, Income, Expense)
  - By category (All, or specific category)
  - By date range (start date, end date)
  - By search term (description)
- **Features**:
  - Multiple filters can be combined
  - Real-time filtering
  - Filter count indicator

#### Sort Transactions
- **Description**: Order transactions by criteria
- **Sort Options**:
  - By date (newest/oldest first)
  - By amount (highest/lowest first)
  - By description (A-Z, Z-A)
- **Features**:
  - Toggle sort order
  - Visual indicator of active sort

#### Clear All Transactions
- **Description**: Delete all transactions in organization
- **Permissions**: Owners and Admins only
- **Features**:
  - Confirmation dialog with warning
  - Bulk delete operation
  - Cannot be undone

### 4. Recurring Transactions

#### Add Recurring Transaction
- **Description**: Set up automatic recurring transaction
- **Input Fields**:
  - Description
  - Amount
  - Currency
  - Type (Income/Expense)
  - Category
  - Frequency (Daily, Weekly, Monthly, Yearly)
  - Interval (e.g., every 2 weeks)
  - Start date
  - End date (optional)
- **Features**:
  - Automatic transaction creation
  - Runs daily at midnight via cron job
  - Calculates next occurrence date
  - Auto-deactivates when end date reached

#### View Recurring Transactions
- **Description**: See all recurring transaction templates
- **Display**:
  - Description and amount
  - Frequency and interval
  - Next occurrence date
  - Active/inactive status
  - Start and end dates
- **Features**:
  - Real-time updates
  - Status indicators

#### Edit Recurring Transaction
- **Description**: Modify recurring template
- **Features**:
  - Update any field
  - Recalculates next occurrence
  - Affects future transactions only

#### Delete Recurring Transaction
- **Description**: Remove recurring template
- **Features**:
  - Confirmation dialog
  - Does not delete already created transactions
  - Stops future automatic creation

#### Toggle Active/Inactive
- **Description**: Pause or resume recurring transaction
- **Features**:
  - Quick toggle button
  - Paused transactions skip processing
  - Can be reactivated anytime

### 5. Budget Management

#### Create Budget
- **Description**: Set spending limit for a category
- **Input Fields**:
  - Category
  - Amount limit
  - Currency
  - Period (Monthly, Quarterly, Yearly)
  - Start date
  - End date (optional)
  - Alert threshold (default 80%)
- **Features**:
  - Multiple budgets per category
  - Overlapping periods allowed
  - Automatic spending calculation

#### View Budgets
- **Description**: See all active budgets
- **Display**:
  - Category name
  - Budget amount
  - Spent amount
  - Remaining amount
  - Progress bar with color coding:
    - Green: < 80%
    - Amber: 80-99%
    - Red: ≥ 100%
  - Percentage used
- **Features**:
  - Real-time spending updates
  - Visual progress indicators
  - Top 3 budgets on dashboard

#### Edit Budget
- **Description**: Modify budget settings
- **Features**:
  - Update amount or period
  - Change alert threshold
  - Recalculates progress

#### Delete Budget
- **Description**: Remove budget
- **Features**:
  - Confirmation dialog
  - Does not affect transactions
  - Stops tracking

#### Budget Alerts
- **Description**: Automatic warnings for budget status
- **Alert Types**:
  - Warning: 80% of budget used
  - Critical: 100% of budget exceeded
- **Features**:
  - Displayed on dashboard
  - Color-coded alerts
  - Dismissible notifications

### 6. Reports & Analytics

#### Dashboard Summary
- **Description**: Overview of financial health
- **Metrics**:
  - Total Income (sum of all income)
  - Total Expenses (sum of all expenses)
  - Balance (income - expenses)
- **Features**:
  - Real-time calculations
  - Multi-currency conversion to USD
  - Color-coded values

#### Spending by Category (Pie Chart)
- **Description**: Visual breakdown of expenses
- **Features**:
  - Interactive pie chart
  - Percentage per category
  - Hover for details
  - Color-coded categories

#### Income vs Expenses (Line Chart)
- **Description**: Trend over time
- **Features**:
  - Dual-line chart
  - Monthly aggregation
  - Hover for exact values
  - Responsive design

#### Spending Trends
- **Description**: Detailed spending analysis
- **Features**:
  - Bar chart by category
  - Time period selection
  - Comparison view

#### Period Comparison
- **Description**: Compare different time periods
- **Features**:
  - Month-over-month comparison
  - Year-over-year comparison
  - Percentage change indicators
  - Trend arrows (up/down)

#### Export Reports
- **Description**: Download reports for offline use
- **Export Formats**:
  - PDF: Formatted report with charts
  - CSV: Raw transaction data
- **Features**:
  - Custom date range
  - Filtered data export
  - Professional formatting

### 7. Team Collaboration

#### Invite Team Member
- **Description**: Add new member to organization
- **Input Fields**:
  - Email address
  - Role (Admin, Member, Viewer)
- **Features**:
  - Email invitation sent via Resend
  - Unique invitation token
  - 7-day expiration
  - Professional email template
  - Invitation tracking

#### View Team Members
- **Description**: See all organization members
- **Display**:
  - User name and email
  - Role
  - Join date
  - Status (Active/Pending)
- **Features**:
  - Real-time member list
  - Role indicators

#### Change Member Role
- **Description**: Update member permissions
- **Permissions**: Owners and Admins only
- **Features**:
  - Dropdown role selector
  - Immediate permission update
  - Cannot demote yourself

#### Remove Team Member
- **Description**: Remove member from organization
- **Permissions**: Owners and Admins only
- **Features**:
  - Confirmation dialog
  - Member loses access immediately
  - Cannot remove yourself

#### Accept Invitation
- **Description**: Join organization via invitation link
- **Features**:
  - Unique token validation
  - Expiration check
  - Automatic role assignment
  - Redirect to dashboard

#### View Pending Invitations
- **Description**: See sent invitations
- **Display**:
  - Invited email
  - Role
  - Sent date
  - Expiration date
  - Status
- **Features**:
  - Resend invitation
  - Revoke invitation

### 8. Settings & Preferences

#### View Profile
- **Description**: See user account details
- **Display**:
  - Name and email
  - Profile picture
  - Account creation date
- **Features**:
  - Managed by Clerk
  - Update profile button

#### Change Password
- **Description**: Update account password
- **Features**:
  - Handled by Clerk
  - Email verification
  - Password strength requirements

#### Manage Notifications
- **Description**: Control notification preferences
- **Features**:
  - Email notifications toggle
  - Budget alert preferences
  - Team activity notifications

### 9. Real-time Features

#### Live Updates
- **Description**: Automatic data synchronization
- **Technology**: Supabase WebSocket subscriptions
- **Features**:
  - Instant updates when team members make changes
  - Automatic fallback to 30-second polling
  - "Live" indicator when connected
  - No manual refresh needed

#### Optimistic UI Updates
- **Description**: Immediate feedback before server confirmation
- **Features**:
  - Instant UI updates on actions
  - Rollback on error
  - Smooth user experience

### 10. Multi-currency Support

#### Currency Selection
- **Description**: Choose transaction currency
- **Supported Currencies**:
  1. USD - US Dollar ($)
  2. EUR - Euro (€)
  3. GBP - British Pound (£)
  4. JPY - Japanese Yen (¥)
  5. CAD - Canadian Dollar (C$)
  6. AUD - Australian Dollar (A$)
  7. CHF - Swiss Franc (CHF)
  8. CNY - Chinese Yuan (¥)
  9. INR - Indian Rupee (₹)
  10. MXN - Mexican Peso (MX$)

#### Exchange Rate Updates
- **Description**: Real-time currency conversion
- **Features**:
  - Fetches rates from frankfurter.app API
  - Updates hourly automatically
  - Manual refresh button
  - Fallback to static rates if API fails
  - All calculations in USD base currency

---

## 📱 Pages & Screens

### 1. Sign Up Page
**Route**: `/sign-up`

**Purpose**: Create a new user account

**Components**:
- Clerk SignUp component
- Email input field
- Password input field
- Social login buttons (Google, GitHub)
- Terms of service link
- Sign in link

**Features**:
- Email verification
- Password strength indicator
- Real-time validation
- Error messages
- Redirect to organization creation after signup

**Access**: Public (unauthenticated users only)

---

### 2. Sign In Page
**Route**: `/sign-in`

**Purpose**: Access existing account

**Components**:
- Clerk SignIn component
- Email input field
- Password input field
- Remember me checkbox
- Forgot password link
- Social login buttons
- Sign up link

**Features**:
- Session persistence
- Automatic redirect to dashboard
- Error handling
- Loading states

**Access**: Public (unauthenticated users only)

---

### 3. Create Organization Page
**Route**: `/organization/create`

**Purpose**: Set up new organization after signup

**Components**:
- Organization name input
- Create button
- Skip button (if applicable)

**Features**:
- Auto-generated slug
- Validation (min 3 characters)
- Loading state
- Error handling
- Redirect to dashboard after creation

**Access**: Protected (authenticated users without organization)

---

### 4. Dashboard Page
**Route**: `/dashboard`

**Purpose**: Main overview of financial status

**Components**:
- Header with organization name
- "Add Transaction" button
- "Clear All" button
- Summary cards (Income, Expenses, Balance)
- Budget alerts section
- Spending by Category chart (pie chart)
- Income vs Expenses chart (line chart)
- Budget Overview (top 3 budgets)
- Recent transactions list (last 10)
- Real-time "Live" indicator

**Features**:
- Real-time data updates
- Skeleton loaders while loading
- Interactive charts
- Quick actions
- Responsive layout
- Empty states

**Access**: Protected (authenticated users with organization)

---

### 5. Transactions Page
**Route**: `/transactions`

**Purpose**: Manage all transactions

**Components**:
- Page header
- "Add Transaction" button
- Filter controls:
  - Type filter (All, Income, Expense)
  - Category filter dropdown
  - Date range pickers (start, end)
  - Search input
- Sort controls:
  - Sort by dropdown (Date, Amount, Description)
  - Sort order toggle (Asc/Desc)
- Transaction table:
  - Description column
  - Amount column
  - Type column (with badge)
  - Category column
  - Date column
  - Actions column (Edit, Delete)
- Pagination controls (if implemented)

**Features**:
- Real-time filtering
- Inline editing
- Bulk selection (future)
- Export button
- Empty state
- Loading states

**Access**: Protected (authenticated users with organization)

---

### 6. Add/Edit Transaction Modal
**Route**: Modal overlay (not a separate route)

**Purpose**: Create or modify transaction

**Components**:
- Modal header with title
- Close button (X)
- Form fields:
  - Description input (with validation)
  - Amount input (with validation)
  - Currency dropdown
  - Type dropdown (Income/Expense)
  - Category dropdown (filtered by type)
  - Date picker (defaults to today)
- Submit button
- Cancel button

**Features**:
- Real-time validation
- Visual feedback (green checkmark/red border)
- Error messages
- Loading state on submit
- Keyboard shortcuts (Escape to close)
- Focus management

**Access**: Protected (triggered from Dashboard or Transactions page)

---

### 7. Recurring Transactions Page
**Route**: `/recurring`

**Purpose**: Manage recurring transaction templates

**Components**:
- Page header
- "Add Recurring Transaction" button
- Recurring transactions list:
  - Description and amount
  - Frequency badge
  - Next occurrence date
  - Active/Inactive toggle
  - Edit button
  - Delete button
- Empty state

**Features**:
- Real-time updates
- Quick toggle active/inactive
- Visual status indicators
- Confirmation dialogs

**Access**: Protected (authenticated users with organization)

---

### 8. Add/Edit Recurring Transaction Modal
**Route**: Modal overlay

**Purpose**: Create or modify recurring template

**Components**:
- Modal header
- Form fields:
  - Description input
  - Amount input
  - Currency dropdown
  - Type dropdown
  - Category dropdown
  - Frequency dropdown (Daily, Weekly, Monthly, Yearly)
  - Interval input (e.g., every 2 weeks)
  - Start date picker
  - End date picker (optional)
- Submit button
- Cancel button

**Features**:
- Validation
- Next occurrence calculation preview
- Help text for frequency options

**Access**: Protected (triggered from Recurring page)

---

### 9. Budgets Page
**Route**: `/budgets`

**Purpose**: Track and manage spending budgets

**Components**:
- Page header
- "Create Budget" button
- Budget cards grid:
  - Category name
  - Budget amount
  - Spent amount
  - Remaining amount
  - Progress bar (color-coded)
  - Percentage indicator
  - Edit button
  - Delete button
- Empty state

**Features**:
- Real-time spending updates
- Color-coded progress (green/amber/red)
- Visual alerts
- Responsive grid layout

**Access**: Protected (authenticated users with organization)

---

### 10. Create/Edit Budget Modal
**Route**: Modal overlay

**Purpose**: Set up or modify budget

**Components**:
- Modal header
- Form fields:
  - Category dropdown
  - Amount input
  - Currency dropdown
  - Period dropdown (Monthly, Quarterly, Yearly)
  - Start date picker
  - End date picker (optional)
  - Alert threshold slider (0-100%)
- Submit button
- Cancel button

**Features**:
- Validation
- Period calculation
- Threshold preview

**Access**: Protected (triggered from Budgets page)

---

### 11. Reports Page
**Route**: `/reports`

**Purpose**: View detailed analytics and export data

**Components**:
- Page header
- Date range selector
- Export buttons (PDF, CSV)
- Charts section:
  - Spending Trends (bar chart)
  - Category Breakdown (pie chart)
  - Income vs Expenses (line chart)
  - Period Comparison (comparison table)
- Summary statistics:
  - Total income
  - Total expenses
  - Average transaction
  - Transaction count
  - Top categories

**Features**:
- Interactive charts
- Custom date ranges
- Export functionality
- Responsive layout
- Print-friendly

**Access**: Protected (authenticated users with organization)

---

### 12. Team Page
**Route**: `/team`

**Purpose**: Manage organization members and invitations

**Components**:
- Page header
- "Invite Member" button
- Members section:
  - Member cards/table:
    - Name and email
    - Role badge
    - Join date
    - Role dropdown (for admins)
    - Remove button
- Pending Invitations section:
  - Invitation cards:
    - Email
    - Role
    - Sent date
    - Expires date
    - Resend button
    - Revoke button

**Features**:
- Real-time member updates
- Role management
- Invitation tracking
- Confirmation dialogs

**Access**: Protected (authenticated users with organization)

---

### 13. Invite Member Modal
**Route**: Modal overlay

**Purpose**: Send invitation to new team member

**Components**:
- Modal header
- Form fields:
  - Email input (with validation)
  - Role dropdown (Admin, Member, Viewer)
  - Role description text
- Send Invitation button
- Cancel button

**Features**:
- Email validation
- Role descriptions
- Loading state
- Success/error messages

**Access**: Protected (Owners and Admins only)

---

### 14. Accept Invitation Page
**Route**: `/invitation/:token`

**Purpose**: Join organization via invitation link

**Components**:
- Organization name display
- Role information
- Accept button
- Decline button
- Invitation details (sender, date)

**Features**:
- Token validation
- Expiration check
- Automatic redirect after acceptance
- Error handling for invalid/expired tokens

**Access**: Protected (authenticated users only)

---

### 15. Settings Page
**Route**: `/settings`

**Purpose**: Manage account and organization settings

**Components**:
- Page header
- Settings sections:
  - Profile Settings:
    - Name
    - Email
    - Profile picture
    - Change password button
  - Organization Settings:
    - Organization name
    - Subscription status
    - Billing information
  - Notification Preferences:
    - Email notifications toggle
    - Budget alerts toggle
    - Team activity toggle
  - Danger Zone:
    - Delete organization button
    - Leave organization button

**Features**:
- Form validation
- Confirmation dialogs for destructive actions
- Integration with Clerk for profile management

**Access**: Protected (authenticated users with organization)

---

### 16. Layout (Navigation)
**Component**: Wraps all protected pages

**Purpose**: Consistent navigation and layout

**Components**:
- Top navigation bar:
  - Logo/Brand name
  - Navigation links:
    - Dashboard
    - Transactions
    - Recurring
    - Budgets
    - Reports
    - Team
    - Settings
  - User menu (Clerk UserButton):
    - Profile
    - Sign out
- Main content area (Outlet)
- Footer (optional)

**Features**:
- Active link highlighting
- Responsive navigation
- User avatar
- Organization name display
- Sticky header

**Access**: Protected (all authenticated pages)

---

## 👥 User Roles & Permissions

### Role Hierarchy

#### 1. Owner
**Description**: Organization creator with full control

**Permissions**:
- ✅ View all transactions
- ✅ Create transactions
- ✅ Edit all transactions
- ✅ Delete all transactions
- ✅ Create budgets
- ✅ Edit budgets
- ✅ Delete budgets
- ✅ Create recurring transactions
- ✅ Edit recurring transactions
- ✅ Delete recurring transactions
- ✅ View reports
- ✅ Export data
- ✅ Invite members
- ✅ Change member roles
- ✅ Remove members
- ✅ Edit organization settings
- ✅ Delete organization
- ✅ View audit logs

**Restrictions**:
- Cannot remove themselves
- Cannot change own role

---

#### 2. Admin
**Description**: Trusted member with management capabilities

**Permissions**:
- ✅ View all transactions
- ✅ Create transactions
- ✅ Edit all transactions
- ✅ Delete all transactions
- ✅ Create budgets
- ✅ Edit budgets
- ✅ Delete budgets
- ✅ Create recurring transactions
- ✅ Edit recurring transactions
- ✅ Delete recurring transactions
- ✅ View reports
- ✅ Export data
- ✅ Invite members
- ✅ Change member roles (except Owner)
- ✅ Remove members (except Owner)

**Restrictions**:
- ❌ Cannot edit organization settings
- ❌ Cannot delete organization
- ❌ Cannot change Owner role
- ❌ Cannot remove Owner

---

#### 3. Member
**Description**: Regular user with transaction management

**Permissions**:
- ✅ View all transactions
- ✅ Create transactions
- ✅ Edit own transactions
- ✅ Delete own transactions
- ✅ View budgets
- ✅ View recurring transactions
- ✅ View reports
- ✅ View team members

**Restrictions**:
- ❌ Cannot edit others' transactions
- ❌ Cannot delete others' transactions
- ❌ Cannot create/edit/delete budgets
- ❌ Cannot create/edit/delete recurring transactions
- ❌ Cannot export data
- ❌ Cannot invite members
- ❌ Cannot change roles
- ❌ Cannot remove members

---

#### 4. Viewer
**Description**: Read-only access for observers

**Permissions**:
- ✅ View all transactions
- ✅ View budgets
- ✅ View recurring transactions
- ✅ View reports
- ✅ View team members

**Restrictions**:
- ❌ Cannot create transactions
- ❌ Cannot edit transactions
- ❌ Cannot delete transactions
- ❌ Cannot create/edit/delete budgets
- ❌ Cannot create/edit/delete recurring transactions
- ❌ Cannot export data
- ❌ Cannot invite members
- ❌ Cannot change roles
- ❌ Cannot remove members

---

## 🏗️ Technical Architecture

### Frontend Stack
- **Framework**: React 19
- **Build Tool**: Vite 7
- **Routing**: React Router 7 (with lazy loading)
- **Styling**: Tailwind CSS 3
- **Authentication**: Clerk React
- **Database Client**: Supabase JS
- **Charts**: Recharts
- **PDF Export**: jsPDF + html2canvas
- **Error Tracking**: Sentry React
- **Analytics**: PostHog React

### Backend Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Authentication**: Clerk SDK (JWT verification)
- **Database**: PostgreSQL (Supabase)
- **Email**: Resend
- **Scheduling**: node-cron
- **CORS**: cors middleware

### Database
- **Type**: PostgreSQL
- **Provider**: Supabase
- **Tables**: 9 (organizations, organization_members, categories, transactions, attachments, budgets, recurring_transactions, invitations, audit_logs)
- **Security**: Row Level Security (RLS)
- **Real-time**: WebSocket subscriptions

### Infrastructure
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Railway / Render
- **Database Hosting**: Supabase Cloud
- **Email Service**: Resend
- **Monitoring**: Sentry + PostHog

### Performance Optimizations
- Code splitting (60% reduction in initial load)
- API response caching (70% reduction in API calls)
- Lazy loading of routes
- Memoization of expensive calculations
- Optimized database indexes
- CDN for static assets

### Security Features
- JWT authentication
- Row Level Security (RLS)
- HTTPS encryption
- CORS protection
- Input validation
- XSS protection
- Environment variable security

---

## 📈 Project Statistics

- **Total Lines of Code**: 8,672
  - Frontend: 6,798 lines
  - Backend: 1,874 lines
- **Components**: 28
- **Pages**: 8
- **API Endpoints**: 20+
- **Database Tables**: 9
- **Supported Currencies**: 10
- **User Roles**: 4
- **E2E Tests**: 239+
- **Documentation**: 40,000+ words

---

## 🎯 Target Users

### Primary Users
1. **Small Business Owners**: Track business expenses and income
2. **Freelancers**: Manage project-based finances
3. **Families**: Collaborative household budget management
4. **Teams**: Shared expense tracking for projects
5. **Startups**: Early-stage financial management

### Use Cases
- Personal finance management
- Business expense tracking
- Team budget management
- Project cost tracking
- Household expense sharing
- Freelance income/expense tracking

---

## 📞 Support & Resources

- **User Guide**: USER_GUIDE.md
- **API Documentation**: API_DOCUMENTATION.md
- **Deployment Guide**: DEPLOYMENT.md
- **Contributing Guide**: CONTRIBUTING.md
- **Bug Reports**: GitHub Issues

---

**Document Version**: 1.0.0  
**Last Updated**: 2026-04-14  
**Status**: Production Ready  
**Prepared By**: Development Team
