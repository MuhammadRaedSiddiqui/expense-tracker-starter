# Contributing to Expense Tracker

Thank you for your interest in contributing! This document provides guidelines for contributing to the project.

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them get started
- Focus on constructive feedback
- Assume good intentions

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally
   ```bash
   git clone https://github.com/your-username/expense-tracker-starter.git
   cd expense-tracker-starter
   ```
3. **Set up development environment** - Follow the [Development Guide](DEVELOPMENT.md)
4. **Create a branch** for your changes
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Types of Contributions

### Bug Reports

When reporting bugs, include:
- Clear description of the issue
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable
- Environment details (OS, browser, Node version)

**Template:**
```markdown
**Describe the bug**
A clear description of what the bug is.

**To Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected behavior**
What you expected to happen.

**Screenshots**
If applicable, add screenshots.

**Environment:**
- OS: [e.g., Windows 11]
- Browser: [e.g., Chrome 120]
- Node version: [e.g., 18.17.0]
```

### Feature Requests

When requesting features:
- Describe the problem you're trying to solve
- Explain your proposed solution
- Consider alternative solutions
- Discuss potential impact on existing features

### Code Contributions

1. **Check existing issues** - Someone might already be working on it
2. **Discuss major changes** - Open an issue first for significant changes
3. **Follow code style** - Match the existing code style
4. **Write tests** - Add tests for new functionality
5. **Update documentation** - Keep docs in sync with code changes

## Development Workflow

### 1. Make Your Changes

- Write clean, readable code
- Follow the project's code style
- Keep commits focused and atomic
- Write meaningful commit messages

### 2. Test Your Changes

```bash
# Run linter
npm run lint

# Run tests
npm test

# Test manually in browser
npm run dev
```

### 3. Commit Your Changes

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```bash
git commit -m "feat: add budget alert notifications"
git commit -m "fix: resolve transaction sorting issue"
git commit -m "docs: update API reference"
```

**Commit Types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation only
- `style:` - Code style (formatting, semicolons, etc.)
- `refactor:` - Code refactoring
- `perf:` - Performance improvement
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks
- `ci:` - CI/CD changes

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub.

## Pull Request Guidelines

### PR Title

Use the same format as commit messages:
```
feat: add budget alert notifications
fix: resolve transaction date sorting
```

### PR Description

Include:
- **Summary**: What does this PR do?
- **Motivation**: Why is this change needed?
- **Changes**: List of changes made
- **Testing**: How was this tested?
- **Screenshots**: For UI changes
- **Breaking Changes**: If any
- **Related Issues**: Link to related issues

**Template:**
```markdown
## Summary
Brief description of what this PR does.

## Motivation
Why is this change needed? What problem does it solve?

## Changes
- Added X feature
- Fixed Y bug
- Refactored Z component

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manually tested in browser
- [ ] Tested on multiple browsers

## Screenshots
(If applicable)

## Breaking Changes
(If any)

## Related Issues
Closes #123
```

### PR Checklist

Before submitting, ensure:
- [ ] Code follows project style guidelines
- [ ] Tests pass locally
- [ ] New tests added for new functionality
- [ ] Documentation updated
- [ ] Commit messages follow convention
- [ ] No merge conflicts
- [ ] PR description is complete

## Code Style Guidelines

### JavaScript/React

```javascript
// ✅ Good
const TransactionItem = ({ transaction, onEdit }) => {
  const { amount, description } = transaction;
  
  const handleEdit = () => {
    onEdit(transaction.id);
  };
  
  return (
    <div className="transaction-item">
      <span>{description}</span>
      <button onClick={handleEdit}>Edit</button>
    </div>
  );
};

// ❌ Avoid
const TransactionItem = (props) => {
  return (
    <div className="transaction-item">
      <span>{props.transaction.description}</span>
      <button onClick={() => props.onEdit(props.transaction.id)}>Edit</button>
    </div>
  );
};
```

### Key Principles

1. **Use functional components** with hooks
2. **Destructure props** for clarity
3. **Extract complex logic** into custom hooks
4. **Keep components small** - single responsibility
5. **Use meaningful names** - be descriptive
6. **Avoid magic numbers** - use constants
7. **Handle errors gracefully** - don't let errors crash the app
8. **Write self-documenting code** - minimize comments

### File Organization

```javascript
// 1. Imports - external libraries
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

// 2. Imports - internal components
import TransactionForm from './TransactionForm';

// 3. Imports - utilities and constants
import { formatCurrency } from '../utils';
import { TRANSACTION_TYPES } from '../constants';

// 4. Imports - styles
import './TransactionList.css';

// 5. Component definition
const TransactionList = ({ organizationId }) => {
  // Component logic
};

// 6. Export
export default TransactionList;
```

## Testing Requirements

### Unit Tests

Required for:
- Utility functions
- Custom hooks
- Complex component logic

```javascript
describe('formatCurrency', () => {
  it('formats USD correctly', () => {
    expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
  });
});
```

### Integration Tests

Required for:
- API endpoints
- Multi-component interactions
- Critical user flows

### E2E Tests

Required for:
- Major feature additions
- Critical user workflows

## Documentation Requirements

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying database schema
- Changing configuration
- Adding new dependencies

**Files to update:**
- `docs/API_REFERENCE.md` - For API changes
- `docs/DATABASE_SCHEMA.md` - For schema changes
- `docs/DEVELOPMENT.md` - For setup/workflow changes
- `CLAUDE.md` - For project-level changes

## Review Process

1. **Automated checks** run on PR creation
   - Linting
   - Tests
   - Build verification

2. **Code review** by maintainers
   - Code quality
   - Test coverage
   - Documentation
   - Performance considerations

3. **Feedback and iteration**
   - Address review comments
   - Make requested changes
   - Re-request review

4. **Merge**
   - Squash and merge (default)
   - Merge commit (for feature branches)

## Branch Strategy

- `master` - Production-ready code
- `feature/*` - New features
- `fix/*` - Bug fixes
- `docs/*` - Documentation updates
- `refactor/*` - Code refactoring

## Release Process

1. Version bump in `package.json`
2. Update `CHANGELOG.md`
3. Create release tag
4. Deploy to production
5. Announce release

## Getting Help

- **Questions**: Open a discussion on GitHub
- **Stuck**: Comment on your PR or issue
- **Chat**: Join our community chat (if available)

## Recognition

Contributors are recognized in:
- GitHub contributors page
- Release notes
- Project README

Thank you for contributing! 🎉
