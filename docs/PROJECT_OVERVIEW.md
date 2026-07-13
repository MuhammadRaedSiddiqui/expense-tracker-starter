# Finance Tracker - Project Overview

## What Is This?

Finance Tracker is a collaborative expense management platform designed for teams and organizations. It gives businesses a centralized place to track all financial activity — income, expenses, budgets, and recurring payments — with real-time visibility shared across team members.

The core problem it solves: most teams rely on spreadsheets or disconnected personal finance tools that don't support collaboration, automation, or real-time oversight. Finance Tracker replaces that with a purpose-built application where everyone in an organization can see, manage, and analyze financial data together.

---

## Who Is It For?

- **Small businesses** managing day-to-day income and expenses across a team
- **Startups** that need budget enforcement and spending visibility without enterprise software
- **Finance teams** that want automated recurring transactions and real-time budget alerts
- **Freelancers/agencies** tracking multi-currency income from international clients

---

## Core Use Cases

### 1. Track All Financial Activity in One Place

Users record every income and expense event with categorization, currency, and date. The transaction ledger serves as the single source of truth for the organization's finances.

**What users can do:**
- Add income (salary, freelance, investment, gift) or expense (food, housing, utilities, transport, entertainment, healthcare, shopping) transactions
- Record amounts in any of 10 supported currencies (USD, EUR, GBP, JPY, CAD, AUD, CHF, CNY, INR, MXN)
- Edit or delete any transaction
- Search by description, filter by type/category/date range
- Sort by date, amount, or description
- Export filtered data as CSV

---

### 2. Set and Enforce Budgets

Organizations set spending limits per category to prevent overspending. The system tracks actual spending against budgets in real-time and warns when limits are approached.

**What users can do:**
- Create budgets for any expense category (e.g., "Marketing: $5,000/month")
- Choose monthly or yearly budget periods
- Set start and optional end dates
- See utilization percentage (actual spend vs. limit) with color-coded indicators:
  - Green: under budget
  - Amber: approaching limit (80%+)
  - Red: over budget (100%+)
- Receive alerts when budgets hit 80% and 100%
- View aggregate budget health across all categories

---

### 3. Automate Recurring Payments

Recurring transactions (rent, subscriptions, payroll) are scheduled once and automatically created on their cadence, eliminating manual entry for predictable expenses.

**What users can do:**
- Create automations for any income or expense
- Set frequency: daily, weekly, monthly, or yearly
- Configure start and end dates
- Toggle auto-approval (automatic creation vs. manual confirmation)
- Activate or deactivate automations without deleting them
- View total monthly recurring commitment (all frequencies normalized)
- See the next scheduled billing date

---

### 4. Collaborate as a Team

Finance tracking is organization-scoped. Multiple team members share the same data, with role-based permissions controlling who can do what.

**What users can do:**
- Create an organization and invite team members by email
- Assign roles:
  - **Admin** — Full access to all features and settings
  - **Member** — Can create and manage transactions
  - **Viewer** — Read-only access to dashboards and reports
- See team member list and pending invitations
- Real-time data sync — when one member adds a transaction, all members see it instantly via WebSocket subscriptions

---

### 5. Understand Financial Health at a Glance

The dashboard provides an executive summary of the organization's financial state without requiring users to dig through individual transactions.

**What users see:**
- **Net Balance** — Total income minus total expenses
- **Monthly Income** — Current month's earnings with progress indicator
- **Monthly Expenses** — Current month's spending with over-budget warning
- **Budget Alerts** — Banner when any budget is near or over its limit
- **Performance Chart** — Visual trend of financial activity over time
- **Live Feed** — Real-time stream of the latest transactions
- **Category Allocation** — Breakdown of where money is going
- **Recent Ledger** — Quick-access table of recent entries

---

### 6. Generate Reports and Export Data

Users can analyze spending patterns over time and export the data for accounting, tax preparation, or stakeholder reporting.

**What users can do:**
- View spending trends over time (line/area chart)
- See category breakdown as a donut chart
- Compare spending across different time periods
- Export full reports as PDF documents
- Export raw transaction data as CSV files

---

### 7. Manage Multi-Currency Finances

For organizations dealing with international transactions, the app handles currency conversion automatically.

**What users can do:**
- Record transactions in any of 10 currencies
- View all amounts converted to a base currency (USD)
- Exchange rates are maintained for accurate conversion
- Set budget amounts in any supported currency

---

## How It Works (User Flow)

```
Sign Up (Clerk) → Create Organization → Invite Team
       │
       ▼
┌─────────────────────────────────────────────┐
│                 DAILY USE                    │
├─────────────────────────────────────────────┤
│  Add transactions (income/expense)          │
│  View dashboard for real-time summary       │
│  Check budget health                        │
│  Review automated recurring payments        │
│  Generate reports for stakeholders          │
└─────────────────────────────────────────────┘
```

1. **Sign up** using email, Google, or GitHub via Clerk
2. **Create an organization** — all data is scoped to this entity
3. **Invite team members** — they receive an email invitation and join with an assigned role
4. **Add transactions** as they occur, or set up recurring automations for predictable ones
5. **Set budgets** for categories where spending needs to be controlled
6. **Monitor the dashboard** daily for a quick health check
7. **Generate reports** monthly/quarterly for stakeholders or tax purposes

---

## Feature Matrix

| Feature | Description | Status |
|---------|-------------|--------|
| Transaction CRUD | Create, read, update, delete financial entries | Active |
| Transaction Filtering | Search, filter by type/category/date, sort | Active |
| Multi-Currency | 10 currencies with conversion | Active |
| Budgets | Category-based spending limits with alerts | Active |
| Recurring Transactions | Automated scheduled entries (daily/weekly/monthly/yearly) | Active |
| Team Management | Invite members, assign roles (Admin/Member/Viewer) | Active |
| Real-time Sync | Live updates across all team members via WebSocket | Active |
| Dashboard Analytics | Net balance, monthly metrics, trend charts, live feed | Active |
| Reports | Spending trends, category breakdown, period comparison | Active |
| PDF/CSV Export | Export transactions and reports | Active |
| Dark Mode | Persistent theme toggle | Active |
| Command Palette | Cmd+K quick navigation and actions | Active |
| Email Notifications | Weekly digest and budget alerts | UI ready, backend pending |
| Reporting Currency | View all data in a single currency | UI ready, backend pending |
| Invoice Parsing | Automated categorization from receipts | Planned |
| Bank Integrations | Direct import from bank accounts | Planned |
| Mobile App | React Native companion | Planned |

---

## Supported Categories

### Income
| Category | Use Case |
|----------|----------|
| Salary | Regular employment income |
| Freelance | Contract or gig work |
| Investment | Returns, dividends, capital gains |
| Gift | Received gifts or bonuses |
| Other | Miscellaneous income |

### Expenses
| Category | Use Case |
|----------|----------|
| Food | Groceries, dining, catering |
| Housing | Rent, mortgage, property maintenance |
| Utilities | Electricity, water, internet, phone |
| Transport | Fuel, transit, vehicle maintenance |
| Entertainment | Subscriptions, events, recreation |
| Healthcare | Medical, dental, insurance |
| Shopping | Office supplies, equipment, retail |
| Other | Miscellaneous expenses |

---

## Supported Currencies

| Code | Symbol | Currency |
|------|--------|----------|
| USD | $ | US Dollar |
| EUR | € | Euro |
| GBP | £ | British Pound |
| JPY | ¥ | Japanese Yen |
| CAD | C$ | Canadian Dollar |
| AUD | A$ | Australian Dollar |
| CHF | CHF | Swiss Franc |
| CNY | ¥ | Chinese Yuan |
| INR | ₹ | Indian Rupee |
| MXN | MX$ | Mexican Peso |

---

## Pricing Tiers

| Tier | Price | Includes |
|------|-------|----------|
| Basic | Free | Up to 3 users, basic analytics |
| Pro | $49/month | Unlimited users, advanced analytics, automated workflows |
| Enterprise | Custom | Custom integrations, dedicated support, SLA |

---

## Security Model

- **Authentication** — Clerk handles sign-in/sign-up with JWT tokens
- **Authorization** — Organization-scoped data with role-based access (Admin/Member/Viewer)
- **Database** — Row Level Security ensures users can only access their organization's data
- **API** — Rate-limited (300 read / 100 write requests per 15 minutes), validated with Zod
- **Transport** — HTTPS enforced, security headers via Helmet
- **Monitoring** — All errors reported to Sentry with user context for debugging

---

## What Makes This Different

1. **Organization-first** — Not a personal finance app stretched to fit teams. Data, permissions, and workflows are designed around the organization as the core unit.

2. **Real-time collaboration** — Changes propagate instantly to all members via WebSocket. No refresh needed, no stale data.

3. **Automation built in** — Recurring transactions aren't just reminders; they're automatically created on schedule via server-side cron jobs.

4. **Budget enforcement** — Budgets aren't passive tracking. The system actively warns at 80% and alerts at 100%, giving teams time to adjust before overspending.

5. **Multi-currency native** — International transactions are a first-class feature, not an afterthought. Amounts are stored in their original currency and converted for unified reporting.
