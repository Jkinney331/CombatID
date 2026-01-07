# Netlify Deployment Optimization Guide

## Current Configuration Summary

### Build Configuration
- **Base Directory:** `apps/web` (monorepo app location)
- **Build Command:** `cd ../.. && npm run build --workspace=@combatid/web`
- **Publish Directory:** `.next`
- **Node Version:** 18
- **Build Plugin:** `@netlify/plugin-nextjs` v5.15.4

### Output Mode
- **Type:** Standard Next.js build (NOT standalone)
- **Compatibility:** Full Netlify serverless support
- **Dynamic Routes:** Automatically converted to Netlify Functions

---

## Performance Optimizations

### 1. Static Asset Caching
```toml
# Already configured in netlify.toml
[[headers]]
for = "/_next/static/*"
  [headers.values]
  Cache-Control = "public, max-age=31536000, immutable"
```

**Impact:**
- 1 year cache for versioned assets
- Reduced bandwidth usage
- Faster page loads on return visits

### 2. Incremental Static Regeneration (ISR)

Add to pages that update periodically:

```typescript
// apps/web/src/app/[route]/page.tsx
export const revalidate = 3600 // Revalidate every hour

export default async function Page() {
  const data = await fetchData()
  return <div>{data}</div>
}
```

**Benefits:**
- Serve static content with automatic updates
- Reduce server load
- Better performance than pure SSR

### 3. Edge Functions (Optional Upgrade)

For global low-latency:

```toml
# Add to netlify.toml
[functions]
  directory = ".netlify/functions"

[[edge_functions]]
  function = "geo-redirect"
  path = "/api/*"
```

### 4. Image Optimization

Update `next.config.js`:

```javascript
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },
}
```

---

## Build Optimizations

### 1. Faster Builds with Caching

Netlify automatically caches:
- `node_modules/`
- `.next/cache/`

To clear cache: Netlify Dashboard > Deploys > Clear cache and deploy

### 2. Parallel Builds (Monorepo)

If you need to build multiple apps:

```toml
[build]
  command = "npm run build --workspaces"
```

But for now, single app is optimal.

### 3. Bundle Analysis

Add to `package.json`:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true next build"
  }
}
```

Install dependency:
```bash
npm install --save-dev @next/bundle-analyzer
```

Update `next.config.js`:
```javascript
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

module.exports = withBundleAnalyzer({
  // ... your config
})
```

---

## Security Headers (Already Configured)

Current headers provide:
- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Prevents MIME sniffing
- **X-XSS-Protection:** Browser XSS protection
- **Referrer-Policy:** Controls referrer information

### Additional Recommended Headers

Add to `netlify.toml`:

```toml
[[headers]]
for = "/*"
  [headers.values]
  # Existing headers...
  Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
  Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

**Note:** Adjust CSP based on your actual needs (API domains, CDNs, etc.)

---

## Environment Variables Best Practices

### Public vs Private Variables

**Public (NEXT_PUBLIC_*):**
```
NEXT_PUBLIC_API_URL=https://api.combatid.com
NEXT_PUBLIC_APP_ENV=production
```

**Private (Server-side only):**
```
DATABASE_URL=postgresql://...
JWT_SECRET=...
API_KEY=...
```

### Setting in Netlify

1. Dashboard > Site Settings > Environment Variables
2. Add variables
3. Set scope: Production, Deploy Previews, or Branch deploys

### Local Development

Create `.env.local`:
```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001

# Database
DATABASE_URL=postgresql://localhost:5432/combatid

# Never commit this file!
```

---

## Monitoring & Analytics

### 1. Netlify Analytics

Enable in Dashboard > Analytics

Provides:
- Page views
- Top pages
- Bandwidth usage
- 404 errors

### 2. Build Plugins for Monitoring

Add to `netlify.toml`:

```toml
[[plugins]]
  package = "netlify-plugin-lighthouse"

  [plugins.inputs.audits]
    performance = 0.9
    accessibility = 0.9
    best-practices = 0.9
    seo = 0.9
```

Fails builds if Lighthouse scores drop below thresholds.

### 3. Error Tracking

Integrate Sentry or similar:

```bash
npm install @sentry/nextjs
```

Configure in `next.config.js`:
```javascript
const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig({
  // your config
}, {
  silent: true,
  org: "your-org",
  project: "combatid-web",
})
```

---

## Deployment Strategies

### 1. Branch Deploys (Current)
- `main` → Production
- Other branches → Preview deployments

### 2. Deploy Previews for PRs
Automatically enabled. Each PR gets a unique URL.

**Test before merging:**
```
Preview URL: https://deploy-preview-123--your-site.netlify.app
```

### 3. Rollback Strategy

**Instant Rollback:**
1. Netlify Dashboard > Deploys
2. Find previous successful deploy
3. Click "Publish deploy"

**No downtime, instant switch**

### 4. A/B Testing (Advanced)

Use Netlify Split Testing:

```toml
[[redirects]]
  from = "/*"
  to = "/:splat"
  status = 200
  force = true
  conditions = {Cookie = ["ab_test=variant-b"]}
```

---

## Cost Optimization

### Free Tier Limits
- 100GB bandwidth/month
- 300 build minutes/month
- Unlimited sites

### Reducing Build Minutes

**1. Build only when needed:**
```toml
[build]
  ignore = "git diff --quiet HEAD^ HEAD apps/web/"
```

**2. Use Netlify Deploy Hooks:**
Only build when content changes, not code.

**3. Conditional Builds:**
```bash
# In build command
if [ "$CONTEXT" != "production" ]; then
  npm run build:preview
else
  npm run build
fi
```

---

## Advanced: Edge Functions

For ultra-low latency API routes:

**Create:** `.netlify/edge-functions/hello.ts`
```typescript
export default async (request: Request) => {
  return new Response("Hello from the edge!")
}

export const config = { path: "/api/hello" }
```

**Deploy:** Automatically deployed with your site

**Benefits:**
- < 50ms response time globally
- No cold starts
- Runs on Deno runtime

---

## Troubleshooting Performance

### Slow Builds

**Check build logs for:**
- Large dependencies
- Type checking taking too long
- Linting issues

**Solutions:**
```toml
[build.environment]
  # Skip linting in build (lint in CI instead)
  NEXT_TELEMETRY_DISABLED = "1"

  # Increase Node memory if needed
  NODE_OPTIONS = "--max-old-space-size=4096"
```

### Slow Page Loads

**Use Next.js Speed Insights:**
```bash
npm install @vercel/speed-insights
```

```typescript
// apps/web/src/app/layout.tsx
import { SpeedInsights } from '@vercel/speed-insights/next'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  )
}
```

---

## Best Practices Checklist

- [x] Use `@netlify/plugin-nextjs` for Next.js apps
- [x] Set proper cache headers for static assets
- [x] Configure security headers
- [ ] Enable ISR for frequently updated pages
- [ ] Set up error tracking (Sentry/LogRocket)
- [ ] Configure environment variables properly
- [ ] Use preview deployments for testing
- [ ] Monitor Lighthouse scores
- [ ] Optimize images with Next.js Image component
- [ ] Implement analytics (Netlify or third-party)

---

## Resources

- [Netlify Next.js Plugin Docs](https://github.com/netlify/netlify-plugin-nextjs)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Netlify Build Configuration](https://docs.netlify.com/configure-builds/file-based-configuration/)
- [Next.js Performance](https://nextjs.org/docs/advanced-features/measuring-performance)

---

## Support

For issues:
1. Check `/NETLIFY_DEPLOYMENT_FIX.md`
2. Review `/DEPLOYMENT_CHECKLIST.md`
3. Netlify Support: support@netlify.com
4. Next.js Discord: https://nextjs.org/discord
