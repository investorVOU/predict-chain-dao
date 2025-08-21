
# PredictChain Production Deployment Guide

This guide covers deploying PredictChain to production environments with proper security, scalability, and monitoring considerations.

## 🏗 Production Architecture

### Recommended Stack
- **Frontend**: React app served via CDN or static hosting
- **Backend**: Node.js API server with load balancing
- **Database**: PostgreSQL with connection pooling
- **Blockchain**: Ethereum mainnet with backup RPC providers
- **Monitoring**: Application and blockchain monitoring
- **Security**: SSL/TLS, WAF, rate limiting

## 🚀 Deployment Options

### Option 1: Replit Deployment (Recommended for MVP)

#### Advantages
- Zero-config deployment
- Built-in SSL certificates
- Automatic scaling
- Integrated database
- Simple environment management

#### Steps
1. **Prepare Environment**
   ```bash
   # Ensure production environment variables are set
   NODE_ENV=production
   DATABASE_URL=your_production_db_url
   VITE_THIRDWEB_CLIENT_ID=your_production_client_id
   ```

2. **Build Optimization**
   ```bash
   npm run build
   ```

3. **Deploy on Replit**
   - Use Replit's deployment feature
   - Configure custom domain if needed
   - Enable autoscaling
   - Set up monitoring

### Option 2: Traditional Cloud Deployment

#### Infrastructure Components
- **Web Server**: Nginx reverse proxy
- **Application**: PM2 process manager for Node.js
- **Database**: Managed PostgreSQL instance
- **CDN**: CloudFlare or AWS CloudFront
- **Load Balancer**: Application load balancer
- **Monitoring**: DataDog, New Relic, or similar

## 🔐 Production Environment Variables

```env
# Core Application
NODE_ENV=production
PORT=5000

# Database
DATABASE_URL=postgresql://user:password@host:port/database
DATABASE_POOL_SIZE=20

# ThirdWeb Configuration
VITE_THIRDWEB_CLIENT_ID=your_production_client_id
THIRDWEB_SECRET_KEY=your_secret_key

# Security
SESSION_SECRET=your_super_secure_session_secret
JWT_SECRET=your_jwt_secret

# Blockchain
ETHEREUM_RPC_URL=https://mainnet.infura.io/v3/your-project-id
ETHEREUM_RPC_BACKUP=https://eth-mainnet.alchemyapi.io/v2/your-api-key

# Monitoring
SENTRY_DSN=your_sentry_dsn
DATADOG_API_KEY=your_datadog_key

# Email (if implemented)
SMTP_HOST=your_smtp_host
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password

# Storage (if using file uploads)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET=your_s3_bucket
```

## 📊 Database Configuration

### Production PostgreSQL Setup

```sql
-- Create production database
CREATE DATABASE predictchain_prod;

-- Create application user with limited privileges
CREATE USER predictchain_app WITH PASSWORD 'secure_password';
GRANT CONNECT ON DATABASE predictchain_prod TO predictchain_app;
GRANT USAGE ON SCHEMA public TO predictchain_app;
GRANT CREATE ON SCHEMA public TO predictchain_app;

-- Connection pooling configuration
-- Use connection pooler like PgBouncer for better performance
```

### Database Optimizations

```javascript
// drizzle.config.ts - Production configuration
export default {
  schema: './shared/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  },
  // Production optimizations
  verbose: false,
  strict: true,
} satisfies Config;
```

## 🛡 Security Hardening

### Application Security

1. **Rate Limiting**
   ```javascript
   // Add to server/index.ts
   import rateLimit from 'express-rate-limit';
   
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 100, // limit each IP to 100 requests per windowMs
     message: 'Too many requests from this IP',
   });
   
   app.use('/api', limiter);
   ```

2. **CORS Configuration**
   ```javascript
   app.use(cors({
     origin: process.env.ALLOWED_ORIGINS?.split(',') || 'http://localhost:3000',
     credentials: true,
   }));
   ```

3. **Security Headers**
   ```javascript
   import helmet from 'helmet';
   app.use(helmet());
   ```

4. **Input Validation**
   ```javascript
   import { body, validationResult } from 'express-validator';
   
   // Add validation middleware to all endpoints
   const validateInput = (req, res, next) => {
     const errors = validationResult(req);
     if (!errors.isEmpty()) {
       return res.status(400).json({ errors: errors.array() });
     }
     next();
   };
   ```

### Smart Contract Security

1. **Audit Contracts**
   - Professional audit before mainnet deployment
   - Automated security scanning tools
   - Comprehensive testing suite

2. **Multi-signature Wallets**
   - Use multi-sig for contract ownership
   - Timelock for parameter changes
   - Emergency pause mechanisms

3. **Oracle Security**
   - Multiple data sources
   - Price deviation checks
   - Oracle failure handling

## 📈 Performance Optimization

### Frontend Optimization

1. **Build Configuration**
   ```javascript
   // vite.config.ts - Production optimizations
   export default defineConfig({
     build: {
       minify: 'terser',
       rollupOptions: {
         output: {
           manualChunks: {
             vendor: ['react', 'react-dom'],
             web3: ['@thirdweb-dev/react', '@thirdweb-dev/sdk'],
           },
         },
       },
     },
     define: {
       'process.env.NODE_ENV': '"production"',
     },
   });
   ```

2. **Code Splitting**
   ```javascript
   // Lazy load pages
   const Dashboard = lazy(() => import('./pages/Dashboard'));
   const Predictions = lazy(() => import('./pages/Predictions'));
   ```

3. **Image Optimization**
   - Use WebP format
   - Implement lazy loading
   - Optimize image sizes

### Backend Optimization

1. **Database Connection Pooling**
   ```javascript
   // Use connection pooling
   const pool = new Pool({
     connectionString: process.env.DATABASE_URL,
     max: 20,
     idleTimeoutMillis: 30000,
     connectionTimeoutMillis: 2000,
   });
   ```

2. **Caching Strategy**
   ```javascript
   import Redis from 'ioredis';
   
   const redis = new Redis(process.env.REDIS_URL);
   
   // Cache market data
   const cacheKey = `market:${marketId}`;
   const cachedData = await redis.get(cacheKey);
   
   if (!cachedData) {
     const data = await fetchMarketData(marketId);
     await redis.setex(cacheKey, 300, JSON.stringify(data)); // Cache for 5 minutes
     return data;
   }
   
   return JSON.parse(cachedData);
   ```

## 📊 Monitoring & Logging

### Application Monitoring

1. **Error Tracking**
   ```javascript
   import * as Sentry from '@sentry/node';
   
   Sentry.init({
     dsn: process.env.SENTRY_DSN,
     environment: process.env.NODE_ENV,
   });
   ```

2. **Performance Monitoring**
   ```javascript
   // Add performance tracking
   import { performance } from 'perf_hooks';
   
   const trackPerformance = (operation) => {
     const start = performance.now();
     return {
       end: () => {
         const duration = performance.now() - start;
         console.log(`${operation} took ${duration.toFixed(2)}ms`);
       },
     };
   };
   ```

3. **Health Checks**
   ```javascript
   app.get('/health', async (req, res) => {
     try {
       // Check database connection
       await db.raw('SELECT 1');
       
       // Check blockchain connection
       const blockNumber = await provider.getBlockNumber();
       
       res.json({
         status: 'healthy',
         timestamp: new Date().toISOString(),
         database: 'connected',
         blockchain: { blockNumber },
       });
     } catch (error) {
       res.status(503).json({
         status: 'unhealthy',
         error: error.message,
       });
     }
   });
   ```

### Blockchain Monitoring

1. **Transaction Monitoring**
   - Monitor pending transactions
   - Track gas price trends
   - Alert on failed transactions

2. **Contract Monitoring**
   - Monitor contract events
   - Track contract balance
   - Alert on unusual activity

## 🚨 Disaster Recovery

### Backup Strategy

1. **Database Backups**
   ```bash
   # Automated daily backups
   pg_dump $DATABASE_URL > backup_$(date +%Y%m%d_%H%M%S).sql
   
   # Upload to cloud storage
   aws s3 cp backup_*.sql s3://your-backup-bucket/
   ```

2. **Smart Contract Recovery**
   - Emergency pause mechanisms
   - Upgrade patterns (proxy contracts)
   - Multi-signature wallet recovery

### Incident Response

1. **Monitoring Alerts**
   - Set up alerts for critical metrics
   - Define escalation procedures
   - Maintain incident response playbook

2. **Rollback Procedures**
   - Database rollback scripts
   - Application version rollback
   - Smart contract emergency procedures

## 📋 Deployment Checklist

### Pre-deployment
- [ ] Security audit completed
- [ ] Performance testing completed
- [ ] Database migrations tested
- [ ] Environment variables configured
- [ ] SSL certificates configured
- [ ] Monitoring and logging configured
- [ ] Backup procedures tested

### Deployment
- [ ] Deploy to staging environment
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify all services are running
- [ ] Run post-deployment tests
- [ ] Monitor for issues

### Post-deployment
- [ ] Monitor application metrics
- [ ] Check error rates
- [ ] Verify blockchain connectivity
- [ ] Test user flows
- [ ] Document any issues
- [ ] Update team on deployment status

## 🔄 Continuous Deployment

### CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Build application
        run: npm run build
        
      - name: Deploy to Replit
        run: |
          # Add deployment script
          echo "Deploying to production..."
```

## 📞 Support & Maintenance

### Ongoing Maintenance
- Regular security updates
- Performance monitoring
- Database optimization
- Smart contract upgrades
- User feedback incorporation

### Support Channels
- Technical documentation
- Community support forum
- Direct support for critical issues
- Emergency contact procedures

---

**Note**: This production guide should be customized based on your specific requirements, scale, and infrastructure choices. Always conduct thorough testing before deploying to production.
