# Security Policy

## Supported Versions

We release security updates for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **security@your-domain.com**

You should receive a response within 48 hours. If for some reason you do not, please follow up via email to ensure we received your original message.

### What to Include

Please include the following information:
- Type of vulnerability
- Full paths of source file(s) related to the vulnerability
- Location of the affected source code (tag/branch/commit or direct URL)
- Step-by-step instructions to reproduce the issue
- Proof-of-concept or exploit code (if possible)
- Impact of the vulnerability
- Suggested fix (if you have one)

### Response Timeline

- **Initial Response**: Within 48 hours
- **Status Update**: Within 7 days
- **Fix Timeline**: Depends on severity
  - Critical: 1-7 days
  - High: 7-30 days
  - Medium: 30-90 days
  - Low: Best effort

## Security Best Practices

### For Users

1. **Keep Dependencies Updated**
   ```bash
   npm audit
   npm audit fix
   ```

2. **Use Environment Variables**
   - Never commit secrets to Git
   - Use `.env` files (already in `.gitignore`)
   - Rotate secrets regularly

3. **Enable 2FA**
   - Enable 2FA on Clerk accounts
   - Enable 2FA on GitHub
   - Enable 2FA on cloud providers

4. **Monitor for Vulnerabilities**
   - Enable Dependabot alerts
   - Review Sentry error reports
   - Monitor Supabase logs

### For Developers

1. **Input Validation**
   ```javascript
   // ✅ Good - Validate and sanitize
   const amount = parseFloat(req.body.amount);
   if (isNaN(amount) || amount <= 0) {
     return res.status(400).json({ error: 'Invalid amount' });
   }
   
   // ❌ Bad - No validation
   const amount = req.body.amount;
   ```

2. **SQL Injection Prevention**
   ```javascript
   // ✅ Good - Use parameterized queries
   const { data } = await supabase
     .from('transactions')
     .select('*')
     .eq('user_id', userId);
   
   // ❌ Bad - String concatenation
   const query = `SELECT * FROM transactions WHERE user_id = '${userId}'`;
   ```

3. **XSS Prevention**
   ```javascript
   // ✅ Good - React escapes by default
   <div>{userInput}</div>
   
   // ❌ Bad - dangerouslySetInnerHTML without sanitization
   <div dangerouslySetInnerHTML={{ __html: userInput }} />
   ```

4. **Authentication**
   ```javascript
   // ✅ Good - Verify JWT on every request
   const verifyAuth = async (req, res, next) => {
     const token = req.headers.authorization?.split(' ')[1];
     if (!token) return res.status(401).json({ error: 'Unauthorized' });
     
     try {
       const user = await clerkClient.verifyToken(token);
       req.user = user;
       next();
     } catch (error) {
       return res.status(401).json({ error: 'Invalid token' });
     }
   };
   ```

5. **Rate Limiting**
   ```javascript
   // Implement rate limiting on API endpoints
   const rateLimit = require('express-rate-limit');
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100 // limit each IP to 100 requests per windowMs
   });
   
   app.use('/api/', limiter);
   ```

## Known Security Considerations

### Authentication
- **Clerk JWT Verification**: All API endpoints verify JWT tokens
- **Session Management**: Handled by Clerk
- **Password Security**: Managed by Clerk (bcrypt hashing)

### Authorization
- **Row Level Security (RLS)**: Enabled on all Supabase tables
- **Role-Based Access**: Owner, Admin, Member roles enforced
- **Organization Isolation**: Users can only access their organization's data

### Data Protection
- **Encryption in Transit**: HTTPS enforced in production
- **Encryption at Rest**: Supabase encrypts data at rest
- **Sensitive Data**: No credit card or SSN storage

### API Security
- **CORS**: Configured to allow only frontend domain
- **Rate Limiting**: Implemented on all endpoints
- **Input Validation**: All inputs validated and sanitized
- **Error Messages**: Generic errors in production (no stack traces)

### Dependencies
- **Regular Updates**: Dependencies updated monthly
- **Vulnerability Scanning**: GitHub Dependabot enabled
- **Minimal Dependencies**: Only essential packages included

## Security Checklist

### Before Deployment

- [ ] All secrets in environment variables
- [ ] `.env` files in `.gitignore`
- [ ] HTTPS enforced
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] RLS policies active and tested
- [ ] JWT verification on all protected endpoints
- [ ] Input validation on all endpoints
- [ ] Error handling doesn't leak sensitive info
- [ ] Dependencies up to date
- [ ] Security headers configured
- [ ] Webhook signatures verified
- [ ] Database backups configured
- [ ] Monitoring and alerting active

### Regular Maintenance

- [ ] Review access logs weekly
- [ ] Update dependencies monthly
- [ ] Rotate secrets quarterly
- [ ] Review RLS policies quarterly
- [ ] Security audit annually
- [ ] Penetration testing annually

## Security Headers

The following security headers are configured:

```javascript
// In production
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Content-Security-Policy', "default-src 'self'");
  next();
});
```

## Incident Response

In case of a security incident:

1. **Contain**: Isolate affected systems
2. **Assess**: Determine scope and impact
3. **Notify**: Inform affected users within 72 hours
4. **Fix**: Deploy patches
5. **Review**: Post-mortem and lessons learned
6. **Document**: Update security documentation

## Compliance

This application follows:
- OWASP Top 10 security practices
- GDPR principles (data minimization, right to deletion)
- SOC 2 Type II (via Supabase and Clerk)

## Security Tools

- **Sentry**: Error tracking and monitoring
- **Dependabot**: Dependency vulnerability scanning
- **npm audit**: Package vulnerability checking
- **Supabase**: Built-in security features (RLS, encryption)
- **Clerk**: Secure authentication and session management

## Contact

For security concerns, contact: **security@your-domain.com**

For general questions, use GitHub issues.

---

Last updated: 2026-04-29
