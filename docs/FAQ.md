# Frequently Asked Questions (FAQ)

## General Questions

### What is this application?

This is a full-stack expense tracker application that helps individuals and teams manage their finances. It supports multi-currency transactions, budgets, recurring expenses, and team collaboration.

### Is it free to use?

The application code is open source. However, you'll need accounts with third-party services (Supabase, Clerk, etc.) which have free tiers with usage limits.

### What technologies does it use?

- **Frontend**: React, Vite, TanStack Query, React Router 7
- **Backend**: Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Clerk
- **Email**: Resend
- **Monitoring**: Sentry, PostHog

### Can I self-host it?

Yes! You can deploy the frontend to any static hosting service (Vercel, Netlify, etc.) and the backend to any Node.js hosting service (Railway, Render, Fly.io, etc.).

## Features

### Does it support multiple currencies?

Yes! The application supports 10+ currencies with real-time exchange rate conversion via the Frankfurter API.

### Can I collaborate with my team?

Yes! You can create organizations and invite team members with different roles (owner, admin, member).

### Does it have mobile apps?

Not yet. A mobile app (React Native) is planned for Phase 3. The web app is responsive and works on mobile browsers.

### Can I export my data?

Data export (CSV, PDF) is planned for Phase 3. Currently, you can access your data via the API or Supabase dashboard.

### Does it support recurring transactions?

Yes! You can set up recurring income or expenses (daily, weekly, monthly, yearly) that are automatically created by scheduled tasks.

### Can I set budget limits?

Yes! You can set monthly budget limits by category and receive alerts when approaching or exceeding limits.

## Technical Questions

### How is data stored?

Data is stored in a Supabase PostgreSQL database with Row Level Security (RLS) policies to ensure users can only access their organization's data.

### Is my data secure?

Yes! We implement multiple security measures:
- HTTPS encryption in transit
- Database encryption at rest
- Row Level Security (RLS)
- JWT authentication
- Rate limiting
- Input validation and sanitization

See [SECURITY.md](SECURITY.md) for details.

### How does authentication work?

Authentication is handled by Clerk, which provides secure JWT-based authentication with support for email/password, social logins, and multi-factor authentication.

### What happens if I lose my password?

Clerk provides password reset functionality. Click "Forgot password?" on the sign-in page.

### Can I use my own database?

Yes! While the application is designed for Supabase, you can modify it to use any PostgreSQL database. You'll need to update the connection configuration and may need to adjust some Supabase-specific features (like real-time subscriptions).

### How do real-time updates work?

Real-time updates use Supabase's WebSocket subscriptions. When one team member makes a change, other members see it immediately without refreshing.

## Development

### How do I set up the development environment?

See the [Development Guide](docs/DEVELOPMENT.md) for detailed setup instructions.

### How do I run tests?

```bash
# Frontend tests
npm test

# Backend tests
cd server && npm test

# E2E tests
npx playwright test
```

### How do I contribute?

See the [Contributing Guide](docs/CONTRIBUTING.md) for guidelines on contributing to the project.

### What's the code style?

We follow standard JavaScript/React conventions:
- Functional components with hooks
- Destructured props
- Meaningful variable names
- Minimal comments (self-documenting code)

See [CONTRIBUTING.md](docs/CONTRIBUTING.md) for details.

### How do I report bugs?

Create an issue on GitHub with:
- Clear description
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details

## Deployment

### How do I deploy to production?

See the [Deployment Guide](docs/DEPLOYMENT.md) for step-by-step deployment instructions.

### What are the hosting costs?

Estimated monthly costs:
- Vercel: Free (Hobby) or $20+ (Pro)
- Railway: $5+ (usage-based)
- Supabase: Free (500MB) or $25+ (Pro)
- Clerk: Free (10k MAU) or $25+ (Pro)
- Resend: Free (100 emails/day) or $20+ (Pro)
- Sentry: Free (5k errors/mo) or $26+ (Team)
- PostHog: Free (1M events/mo) or usage-based

**Total**: $0-$150+/month depending on usage.

### Can I use a different hosting provider?

Yes! The frontend can be deployed to any static hosting service, and the backend can be deployed to any Node.js hosting service.

### How do I set up custom domains?

See the [Deployment Guide](docs/DEPLOYMENT.md#dns-configuration) for DNS configuration instructions.

## Data & Privacy

### Where is my data stored?

Data is stored in your Supabase project, which you control. Supabase offers data centers in multiple regions.

### Can I delete my data?

Yes! You can delete individual transactions, or delete your entire account (which removes all your data).

### Is my data backed up?

Supabase provides automatic daily backups (7-day retention on free tier, longer on paid plans). You can also create manual backups.

### Who can see my data?

Only you and members of your organization can see your data. Row Level Security (RLS) policies enforce this at the database level.

### Do you sell my data?

No! This is an open-source project. Your data belongs to you and is stored in your own Supabase instance.

## Troubleshooting

### The app won't load

1. Check browser console for errors
2. Verify environment variables are set
3. Ensure backend is running
4. Check network connectivity
5. Try clearing browser cache

### I can't sign in

1. Verify Clerk is configured correctly
2. Check Clerk dashboard for service status
3. Try password reset
4. Check browser console for errors
5. Ensure cookies are enabled

### Transactions aren't saving

1. Check browser console for errors
2. Verify backend is running
3. Check database connection
4. Verify RLS policies
5. Check Sentry for error details

### Real-time updates aren't working

1. Verify Supabase WebSocket connection
2. Check browser console for errors
3. Ensure you're in the same organization
4. Try refreshing the page
5. Check Supabase dashboard for service status

### Email invitations aren't sending

1. Verify Resend API key
2. Check Resend dashboard for errors
3. Verify sender domain is verified
4. Check backend logs
5. Ensure email address is valid

## Migration

### How do I migrate from v0.x to v1.0?

See the [Migration Guide](docs/MIGRATION.md) for detailed migration instructions.

### Will I lose my data during migration?

No! The migration guide includes steps to export your localStorage data and import it into the new database.

### Can I rollback after migrating?

Yes! The migration guide includes rollback instructions if needed.

## Performance

### Why is the app slow?

Possible causes:
- Slow network connection
- Large number of transactions (use pagination)
- Database query performance (add indexes)
- Too many real-time subscriptions
- Browser extensions interfering

### How many transactions can it handle?

The application can handle thousands of transactions per organization. Performance depends on your database plan and query optimization.

### Can I improve performance?

Yes! Performance optimization tips:
- Enable TanStack Query caching
- Use pagination for large lists
- Add database indexes
- Optimize images
- Use lazy loading
- Enable compression

## Support

### Where can I get help?

- **Documentation**: Check [docs/](docs/) folder
- **GitHub Issues**: Search existing issues or create new one
- **Community**: Join our Discord/Slack (if available)
- **Email**: Contact support (if available)

### How do I request a feature?

Create a GitHub issue with the "enhancement" label and describe:
- The problem you're trying to solve
- Your proposed solution
- Alternative solutions considered
- Potential impact

### Is there commercial support available?

Commercial support may be available. Contact us for details.

## Licensing

### What license is this under?

Check the LICENSE file in the repository for licensing details.

### Can I use this for commercial purposes?

Check the LICENSE file for commercial use terms.

### Can I modify the code?

Yes! This is open source. You can modify it to suit your needs. Contributions back to the project are welcome!

---

**Didn't find your answer?** Create an issue on GitHub or check the [documentation](docs/).

Last updated: 2026-04-29
