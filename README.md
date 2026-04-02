# Expense Tracker - B2B SaaS

A modern, production-ready expense tracking application built with React, Tailwind CSS, and Supabase.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (free tier)
- Clerk account (free tier)

### Installation

1. Clone the repository
```bash
git clone https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter.git
cd expense-tracker-starter
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

Edit `.env.local` with your actual credentials:
- Supabase URL and anon key
- Clerk publishable key
- Stripe publishable key (for payments)

4. Run the development server
```bash
npm run dev
```

Visit `http://localhost:5173`

## 📁 Project Structure

```
expense-tracker-starter/
├── api/                      # Vercel serverless functions
│   ├── health.js             # Health check endpoint
│   ├── auth/                 # Authentication endpoints
│   ├── transactions/         # Transaction CRUD
│   ├── organizations/        # Organization management
│   └── webhooks/             # Webhook handlers (Stripe, etc.)
├── src/
│   ├── components/           # React components
│   ├── constants.js          # App constants
│   ├── utils.js              # Utility functions
│   ├── App.jsx               # Main app component
│   └── main.jsx              # Entry point
├── .env.example              # Environment variables template
├── .prettierrc               # Prettier configuration
├── eslint.config.js          # ESLint configuration
├── tailwind.config.js        # Tailwind CSS configuration
├── vercel.json               # Vercel deployment config
└── vite.config.js            # Vite configuration
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🔧 Tech Stack

### Frontend
- **React 19** - UI library
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Data visualization
- **Vite** - Build tool

### Backend
- **Supabase** - PostgreSQL database, authentication, storage
- **Clerk** - User authentication and management
- **Vercel** - Serverless functions and hosting

### Payments
- **Stripe** - Payment processing and subscriptions

### Monitoring
- **Sentry** - Error tracking
- **PostHog** - Product analytics

## 🚧 Development Phases

### ✅ Phase 0: Foundation & Setup (Current)
- [x] Project restructure
- [x] Environment variables setup
- [x] ESLint + Prettier configuration
- [x] API folder structure
- [x] Vercel configuration
- [ ] Supabase database setup
- [ ] Monitoring integration

### 🔄 Phase 1: Backend & Authentication (Next)
- [ ] Supabase integration
- [ ] Clerk authentication
- [ ] API layer
- [ ] Real-time sync

### 📋 Upcoming Phases
- Phase 2: Multi-tenancy & Teams
- Phase 3: Billing & Monetization
- Phase 4: Onboarding & UX Polish
- Phase 5: Core Features Enhancement
- Phase 6: Integrations & API
- Phase 7: Enterprise Features
- Phase 8: Testing & Quality
- Phase 9: Mobile & PWA
- Phase 10: Launch Preparation

## 🌟 Features

### Current Features
- ✅ Transaction management (CRUD)
- ✅ Multi-currency support with real-time exchange rates
- ✅ Advanced filtering (type, category, date range, search)
- ✅ Sorting by date, amount, description
- ✅ Charts and visualizations
- ✅ Dark mode
- ✅ Responsive design
- ✅ Modern B2B SaaS UI

### Coming Soon
- 🔄 User authentication
- 🔄 Team collaboration
- 🔄 Subscription billing
- 🔄 Recurring transactions
- 🔄 Receipt attachments
- 🔄 Budget tracking
- 🔄 API access
- 🔄 Bank integrations

## 📝 Environment Variables

See `.env.example` for all required environment variables.

### Required for Development
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_CLERK_PUBLISHABLE_KEY` - Your Clerk publishable key

### Required for Production
- All development variables
- `VITE_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- Additional backend environment variables (see deployment docs)

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

Vercel will automatically:
- Build your frontend
- Deploy serverless functions from `/api`
- Set up preview deployments for PRs

### Manual Deployment

```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🧪 Testing

```bash
# Run linter
npm run lint

# Format code
npm run format

# Check formatting
npm run format:check
```

## 🤝 Contributing

This is a learning project following a structured implementation plan. Contributions are welcome!

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linter and formatter
5. Submit a pull request

## 📄 License

MIT

## 🆘 Support

For issues and questions, please open a GitHub issue.

## 📚 Documentation

- [API Documentation](./api/README.md)
- [Implementation Plan](https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter/issues)

## 🎯 Roadmap

See the full implementation plan in the project documentation. We're currently in Phase 0 (Foundation & Setup) with 10 phases planned total.

## Contact

Muhammad Raed Siddiqui - [@MuhammadRaedSiddiqui](https://github.com/MuhammadRaedSiddiqui)

Project Link: [https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter](https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter)
