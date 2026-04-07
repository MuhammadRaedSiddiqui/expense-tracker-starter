# Contributing to Finance Tracker

Thank you for your interest in contributing to Finance Tracker! This guide will help you get started.

## Table of Contents

1. [Code of Conduct](#code-of-conduct)
2. [Getting Started](#getting-started)
3. [Development Workflow](#development-workflow)
4. [Coding Standards](#coding-standards)
5. [Commit Guidelines](#commit-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Testing](#testing)
8. [Documentation](#documentation)

---

## Code of Conduct

### Our Pledge

We are committed to providing a welcoming and inclusive environment for all contributors.

### Expected Behavior

- Be respectful and considerate
- Welcome newcomers and help them get started
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy towards other contributors

### Unacceptable Behavior

- Harassment or discriminatory language
- Trolling or insulting comments
- Personal or political attacks
- Publishing others' private information
- Any conduct that could be considered inappropriate

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- Git
- Code editor (VS Code recommended)
- Basic knowledge of React, Node.js, and PostgreSQL

### Fork and Clone

1. Fork the repository on GitHub
2. Clone your fork locally:
```bash
git clone https://github.com/YOUR_USERNAME/expense-tracker-starter.git
cd expense-tracker-starter
```

3. Add upstream remote:
```bash
git remote add upstream https://github.com/MuhammadRaedSiddiqui/expense-tracker-starter.git
```

### Install Dependencies

```bash
# Frontend
npm install

# Backend
cd server
npm install
cd ..
```

### Set Up Environment

1. Copy environment files:
```bash
cp .env.example .env.local
cp server/.env.example server/.env
```

2. Fill in your credentials (see README.md for details)

3. Run database migrations (see DEPLOYMENT.md)

### Start Development

```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
cd server
npm run dev
```

---

## Development Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

### Creating a Feature Branch

```bash
# Update your local main
git checkout main
git pull upstream main

# Create feature branch
git checkout -b feature/your-feature-name
```

### Keeping Your Branch Updated

```bash
# Fetch upstream changes
git fetch upstream

# Rebase on main
git rebase upstream/main
```

### Making Changes

1. Make your changes in small, logical commits
2. Test your changes thoroughly
3. Run linter and fix any issues
4. Update documentation if needed
5. Add tests for new features

---

## Coding Standards

### JavaScript/React

**Style Guide**: Follow the ESLint configuration provided

**Key Principles**:
- Use functional components with hooks
- Prefer `const` over `let`, avoid `var`
- Use meaningful variable names
- Keep functions small and focused
- Extract reusable logic into custom hooks
- Use PropTypes or TypeScript for type checking

**Example**:
```javascript
// Good
function TransactionList({ transactions, onDelete }) {
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => t.amount > 0);
  }, [transactions]);

  return (
    <div>
      {filteredTransactions.map(t => (
        <TransactionItem key={t.id} transaction={t} onDelete={onDelete} />
      ))}
    </div>
  );
}

// Bad
function TransactionList(props) {
  var filtered = props.transactions.filter(function(t) {
    return t.amount > 0;
  });

  return (
    <div>
      {filtered.map(function(t) {
        return <TransactionItem key={t.id} transaction={t} onDelete={props.onDelete} />;
      })}
    </div>
  );
}
```

### File Organization

**Components**:
- One component per file
- Use PascalCase for component files
- Co-locate related files (styles, tests)

**Utilities**:
- Use camelCase for utility files
- Group related utilities together
- Export named functions

**Structure**:
```
src/
├── components/
│   ├── TransactionList.jsx
│   ├── TransactionItem.jsx
│   └── Modal.jsx
├── hooks/
│   ├── useOrganization.js
│   └── useRealtime.js
└── lib/
    ├── apiClient.js
    └── cache.js
```

### CSS/Styling

- Use Tailwind CSS utility classes
- Avoid inline styles unless dynamic
- Use consistent spacing (4, 8, 16, 24, 32px)
- Follow mobile-first approach

**Example**:
```jsx
// Good
<button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
  Click Me
</button>

// Avoid
<button style={{ padding: '8px 16px', backgroundColor: '#2563eb' }}>
  Click Me
</button>
```

### Backend Code

**API Routes**:
- Use RESTful conventions
- Validate input data
- Handle errors gracefully
- Return consistent response format

**Example**:
```javascript
// Good
router.post('/api/transactions', async (req, res) => {
  try {
    // Validate input
    const { description, amount, type } = req.body;
    if (!description || !amount || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Process request
    const transaction = await createTransaction(req.body);
    
    // Return success
    res.status(201).json({ transaction });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
```

### Performance

- Use React.memo() for expensive components
- Use useMemo() for expensive calculations
- Use useCallback() for stable function references
- Implement code splitting for routes
- Optimize images and assets
- Cache API responses when appropriate

---

## Commit Guidelines

### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```bash
feat(transactions): add CSV export functionality

Implement CSV export for transactions with proper formatting
and date range filtering.

Closes #123

---

fix(budgets): correct spending calculation for multi-currency

The budget spending calculation was not converting currencies
properly, leading to incorrect percentages.

Fixes #456

---

docs(api): update authentication section

Add examples for JWT token usage and error handling.
```

### Commit Best Practices

- Write clear, descriptive commit messages
- Keep commits focused on a single change
- Reference issue numbers when applicable
- Use present tense ("add feature" not "added feature")
- Capitalize the first letter of the subject
- Don't end the subject with a period

---

## Pull Request Process

### Before Submitting

1. **Update your branch**:
```bash
git fetch upstream
git rebase upstream/main
```

2. **Run tests**:
```bash
npm run lint
npm run build
```

3. **Update documentation**:
- Update README.md if needed
- Update API docs for API changes
- Add comments for complex code

4. **Self-review**:
- Review your own changes
- Check for console.logs or debug code
- Verify all files are necessary

### Creating a Pull Request

1. Push your branch:
```bash
git push origin feature/your-feature-name
```

2. Go to GitHub and create a Pull Request

3. Fill in the PR template:

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
Describe how you tested your changes.

## Screenshots (if applicable)
Add screenshots for UI changes.

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex code
- [ ] Documentation updated
- [ ] No new warnings
- [ ] Tests added/updated
```

### PR Review Process

1. **Automated Checks**: CI/CD runs linting and builds
2. **Code Review**: Maintainers review your code
3. **Feedback**: Address any requested changes
4. **Approval**: Once approved, PR will be merged

### Responding to Feedback

- Be open to suggestions
- Ask questions if unclear
- Make requested changes promptly
- Push updates to the same branch
- Mark conversations as resolved

---

## Testing

### Manual Testing

Before submitting a PR, test:

1. **Happy Path**: Feature works as expected
2. **Edge Cases**: Empty states, max values, etc.
3. **Error Handling**: Invalid input, network errors
4. **Cross-browser**: Test in Chrome, Firefox, Safari
5. **Responsive**: Test on mobile and desktop

### Testing Checklist

**For New Features**:
- [ ] Feature works as described
- [ ] Error states handled
- [ ] Loading states shown
- [ ] Success feedback provided
- [ ] Works on mobile
- [ ] Accessible (keyboard navigation, screen readers)

**For Bug Fixes**:
- [ ] Bug is fixed
- [ ] No regression in other features
- [ ] Root cause addressed
- [ ] Similar bugs checked

### Writing Tests (Future)

When test infrastructure is added:

```javascript
// Example unit test
describe('TransactionList', () => {
  it('filters transactions by type', () => {
    const transactions = [
      { id: 1, type: 'income', amount: 100 },
      { id: 2, type: 'expense', amount: 50 }
    ];
    
    const result = filterByType(transactions, 'income');
    
    expect(result).toHaveLength(1);
    expect(result[0].type).toBe('income');
  });
});
```

---

## Documentation

### When to Update Documentation

- Adding new features
- Changing API endpoints
- Modifying environment variables
- Updating dependencies
- Changing deployment process

### Documentation Files

- **README.md**: Project overview and quick start
- **USER_GUIDE.md**: End-user documentation
- **API_DOCUMENTATION.md**: API reference
- **DEPLOYMENT.md**: Deployment instructions
- **CONTRIBUTING.md**: This file

### Writing Good Documentation

**Be Clear**:
- Use simple language
- Avoid jargon when possible
- Define technical terms

**Be Complete**:
- Include all necessary steps
- Don't assume prior knowledge
- Provide examples

**Be Accurate**:
- Test all instructions
- Keep docs up to date
- Fix errors promptly

**Example**:
```markdown
## Adding a New API Endpoint

1. Create route file in `server/routes/`:
   ```javascript
   // server/routes/example.js
   import express from 'express';
   const router = express.Router();
   
   router.get('/api/example', async (req, res) => {
     // Implementation
   });
   
   export default router;
   ```

2. Register route in `server/index.js`:
   ```javascript
   import exampleRoutes from './routes/example.js';
   app.use(exampleRoutes);
   ```

3. Update API documentation in `API_DOCUMENTATION.md`

4. Test the endpoint:
   ```bash
   curl http://localhost:3001/api/example
   ```
```

---

## Areas for Contribution

### High Priority

- [ ] Unit tests for components
- [ ] Integration tests for API
- [ ] E2E tests with Playwright
- [ ] Mobile app (React Native)
- [ ] Receipt scanning feature
- [ ] Bank integrations

### Medium Priority

- [ ] Custom categories
- [ ] Advanced filtering
- [ ] Bulk operations
- [ ] Export templates
- [ ] Email notifications
- [ ] Webhooks

### Low Priority

- [ ] Dark mode improvements
- [ ] Keyboard shortcuts
- [ ] Accessibility enhancements
- [ ] Performance optimizations
- [ ] UI polish

### Documentation

- [ ] Video tutorials
- [ ] API examples in multiple languages
- [ ] Troubleshooting guide
- [ ] Architecture diagrams
- [ ] Contributing examples

---

## Getting Help

### Resources

- **Documentation**: Check USER_GUIDE.md and API_DOCUMENTATION.md
- **Issues**: Search existing issues on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Code**: Read the codebase for examples

### Asking Questions

When asking for help:

1. **Search first**: Check if question already answered
2. **Be specific**: Describe what you're trying to do
3. **Provide context**: Share relevant code and error messages
4. **Show effort**: Explain what you've already tried

**Good Question**:
```
I'm trying to add a new field to the transaction form, but the validation
isn't working. I added the field to TransactionForm.jsx (line 45) and
updated the validation schema (line 20), but I'm getting this error:

[Error message]

I've checked the API documentation and the field is accepted by the backend.
What am I missing?
```

---

## Recognition

Contributors will be:
- Listed in the README
- Mentioned in release notes
- Credited in commit history

Thank you for contributing to Finance Tracker! 🎉

---

## Questions?

If you have questions about contributing, please:
- Open a GitHub Discussion
- Comment on relevant issues
- Reach out to maintainers

We're here to help!
