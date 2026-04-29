# Performance Optimization Guide

This guide covers strategies for optimizing the performance of the expense tracker application.

## Frontend Performance

### React Optimization

#### 1. Memoization

Use `React.memo` for expensive components:

```javascript
import { memo } from 'react';

const TransactionItem = memo(({ transaction, onEdit, onDelete }) => {
  return (
    <div className="transaction-item">
      <span>{transaction.description}</span>
      <span>{formatCurrency(transaction.amount)}</span>
    </div>
  );
});

export default TransactionItem;
```

#### 2. useMemo and useCallback

Optimize expensive calculations and callbacks:

```javascript
import { useMemo, useCallback } from 'react';

const TransactionList = ({ transactions }) => {
  // Memoize expensive calculations
  const totalExpenses = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);

  // Memoize callbacks to prevent re-renders
  const handleEdit = useCallback((id) => {
    // Edit logic
  }, []);

  return (
    <div>
      <p>Total: {totalExpenses}</p>
      {transactions.map(t => (
        <TransactionItem key={t.id} transaction={t} onEdit={handleEdit} />
      ))}
    </div>
  );
};
```

#### 3. Virtual Scrolling

For large lists, use virtual scrolling:

```javascript
import { useVirtualizer } from '@tanstack/react-virtual';

const TransactionList = ({ transactions }) => {
  const parentRef = useRef(null);

  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 60,
  });

  return (
    <div ref={parentRef} style={{ height: '600px', overflow: 'auto' }}>
      <div style={{ height: `${virtualizer.getTotalSize()}px` }}>
        {virtualizer.getVirtualItems().map(virtualRow => (
          <div
            key={virtualRow.index}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            <TransactionItem transaction={transactions[virtualRow.index]} />
          </div>
        ))}
      </div>
    </div>
  );
};
```

### TanStack Query Optimization

#### 1. Stale Time Configuration

```javascript
const { data } = useQuery({
  queryKey: ['transactions', orgId],
  queryFn: () => fetchTransactions(orgId),
  staleTime: 5 * 60 * 1000, // 5 minutes
  cacheTime: 10 * 60 * 1000, // 10 minutes
});
```

#### 2. Prefetching

```javascript
const queryClient = useQueryClient();

// Prefetch on hover
const handleMouseEnter = () => {
  queryClient.prefetchQuery({
    queryKey: ['transaction', id],
    queryFn: () => fetchTransaction(id),
  });
};
```

#### 3. Optimistic Updates

```javascript
const mutation = useMutation({
  mutationFn: updateTransaction,
  onMutate: async (newTransaction) => {
    await queryClient.cancelQueries(['transactions']);
    
    const previousTransactions = queryClient.getQueryData(['transactions']);
    
    queryClient.setQueryData(['transactions'], old => 
      old.map(t => t.id === newTransaction.id ? newTransaction : t)
    );
    
    return { previousTransactions };
  },
  onError: (err, newTransaction, context) => {
    queryClient.setQueryData(['transactions'], context.previousTransactions);
  },
});
```

### Code Splitting

#### 1. Route-based Splitting

```javascript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Transactions = lazy(() => import('./pages/Transactions'));
const Budgets = lazy(() => import('./pages/Budgets'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/budgets" element={<Budgets />} />
      </Routes>
    </Suspense>
  );
}
```

#### 2. Component-based Splitting

```javascript
const HeavyChart = lazy(() => import('./components/HeavyChart'));

function Analytics() {
  return (
    <div>
      <h1>Analytics</h1>
      <Suspense fallback={<div>Loading chart...</div>}>
        <HeavyChart data={data} />
      </Suspense>
    </div>
  );
}
```

### Image Optimization

```javascript
// Use WebP format with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="Description" loading="lazy" />
</picture>

// Lazy load images
<img src="image.jpg" loading="lazy" alt="Description" />
```

### Bundle Size Optimization

```bash
# Analyze bundle size
npm run build
npx vite-bundle-visualizer

# Tree-shake unused code
# Import only what you need
import { formatCurrency } from './utils'; // Good
import * as utils from './utils'; // Avoid
```

---

## Backend Performance

### Database Optimization

#### 1. Indexes

```sql
-- Add indexes for frequently queried columns
CREATE INDEX idx_transactions_org_date 
ON transactions(organization_id, transaction_date DESC);

CREATE INDEX idx_transactions_user 
ON transactions(user_id);

CREATE INDEX idx_transactions_type 
ON transactions(type);

-- Composite index for common query patterns
CREATE INDEX idx_transactions_org_type_date 
ON transactions(organization_id, type, transaction_date DESC);
```

#### 2. Query Optimization

```javascript
// Bad - N+1 query problem
const transactions = await supabase.from('transactions').select('*');
for (const t of transactions) {
  const user = await supabase.from('users').select('*').eq('id', t.user_id);
}

// Good - Join in single query
const { data } = await supabase
  .from('transactions')
  .select(`
    *,
    user:users(id, full_name, email)
  `);
```

#### 3. Pagination

```javascript
// Always paginate large result sets
const { data, count } = await supabase
  .from('transactions')
  .select('*', { count: 'exact' })
  .range(offset, offset + limit - 1);
```

#### 4. Connection Pooling

```javascript
// Use connection pooling for better performance
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    db: {
      schema: 'public',
    },
    auth: {
      persistSession: false,
    },
  }
);
```

### Caching

#### 1. Redis Caching

```javascript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Cache frequently accessed data
async function getOrganization(id) {
  const cacheKey = `org:${id}`;
  
  // Try cache first
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const { data } = await supabase
    .from('organizations')
    .select('*')
    .eq('id', id)
    .single();
  
  // Cache for 5 minutes
  await redis.setex(cacheKey, 300, JSON.stringify(data));
  
  return data;
}
```

#### 2. HTTP Caching

```javascript
// Set cache headers
app.get('/api/organizations/:id', async (req, res) => {
  const org = await getOrganization(req.params.id);
  
  res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  res.json(org);
});
```

### Rate Limiting

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### Response Compression

```javascript
import compression from 'compression';

app.use(compression({
  level: 6,
  threshold: 1024, // Only compress responses > 1KB
}));
```

---

## Database Performance

### Query Analysis

```sql
-- Analyze query performance
EXPLAIN ANALYZE 
SELECT * FROM transactions 
WHERE organization_id = 'xxx' 
  AND transaction_date >= '2026-01-01'
ORDER BY transaction_date DESC;

-- Look for:
-- - Sequential scans (should use indexes)
-- - High execution time
-- - Large row counts
```

### Materialized Views

```sql
-- Create materialized view for expensive aggregations
CREATE MATERIALIZED VIEW monthly_summary AS
SELECT 
  organization_id,
  DATE_TRUNC('month', transaction_date) as month,
  type,
  SUM(amount) as total_amount,
  COUNT(*) as transaction_count
FROM transactions
GROUP BY organization_id, month, type;

-- Refresh periodically
REFRESH MATERIALIZED VIEW monthly_summary;
```

### Partitioning

```sql
-- Partition large tables by date
CREATE TABLE transactions_2026_01 PARTITION OF transactions
FOR VALUES FROM ('2026-01-01') TO ('2026-02-01');

CREATE TABLE transactions_2026_02 PARTITION OF transactions
FOR VALUES FROM ('2026-02-01') TO ('2026-03-01');
```

---

## Monitoring Performance

### Frontend Monitoring

```javascript
// Use React DevTools Profiler
import { Profiler } from 'react';

function onRenderCallback(
  id, phase, actualDuration, baseDuration, startTime, commitTime
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="TransactionList" onRender={onRenderCallback}>
  <TransactionList />
</Profiler>
```

### Backend Monitoring

```javascript
// Log slow queries
const logSlowQueries = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (duration > 1000) { // Log queries > 1s
      console.warn(`Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
  });
  
  next();
};

app.use(logSlowQueries);
```

### Database Monitoring

```sql
-- Find slow queries
SELECT 
  query,
  calls,
  total_time,
  mean_time,
  max_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

---

## Performance Benchmarks

### Target Metrics

| Metric | Target | Current |
|--------|--------|---------|
| First Contentful Paint | < 1.5s | - |
| Time to Interactive | < 3.5s | - |
| API Response Time (p95) | < 200ms | - |
| Database Query Time (p95) | < 50ms | - |
| Bundle Size | < 500KB | - |

### Measuring Performance

```bash
# Frontend
npm run build
npx lighthouse http://localhost:5173 --view

# Backend
npm install -g autocannon
autocannon -c 100 -d 30 http://localhost:3001/api/transactions

# Database
# Use Supabase dashboard → Performance tab
```

---

## Performance Checklist

### Frontend
- [ ] Components memoized where appropriate
- [ ] Virtual scrolling for large lists
- [ ] Code splitting implemented
- [ ] Images optimized and lazy loaded
- [ ] Bundle size < 500KB
- [ ] TanStack Query caching configured
- [ ] Lighthouse score > 90

### Backend
- [ ] Database indexes created
- [ ] Queries optimized (no N+1)
- [ ] Pagination implemented
- [ ] Caching strategy in place
- [ ] Rate limiting enabled
- [ ] Response compression enabled
- [ ] API response time < 200ms

### Database
- [ ] Indexes on frequently queried columns
- [ ] Connection pooling configured
- [ ] Slow queries identified and optimized
- [ ] Materialized views for expensive queries
- [ ] Regular VACUUM and ANALYZE

---

Last updated: 2026-04-29
