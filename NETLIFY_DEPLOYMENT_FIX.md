# Netlify Deployment Fix - 404 Error Resolution

## Problem Summary
The Next.js 14 app was showing "Page not found" 404 errors on Netlify despite successful builds.

## Root Causes Identified

### 1. Standalone Output Mode (CRITICAL)
**Issue:** Next.js was building in `standalone` mode, which creates a self-contained Node.js server deployment. This is incompatible with Netlify's serverless platform.

**Evidence:**
```json
// Found in .next/required-server-files.json
"output": "standalone"
```

**Impact:** Netlify's `@netlify/plugin-nextjs` expects a standard Next.js build, not standalone. The standalone mode creates a different directory structure that Netlify cannot serve properly.

### 2. Duplicate Configuration Files
**Issue:** Two `netlify.toml` files existed:
- `/netlify.toml` (root)
- `/apps/web/netlify.toml` (app-level)

**Impact:** Conflicting configurations can cause unpredictable deployment behavior.

### 3. Monorepo Build Command
**Issue:** Build command didn't properly handle monorepo workspace context.

---

## Solutions Implemented

### Fix 1: Remove Standalone Output
**File:** `/apps/web/next.config.js`

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove standalone output - not compatible with Netlify
  // Netlify's @netlify/plugin-nextjs handles the deployment
  output: undefined,

  // Ensure proper trailing slash behavior
  trailingSlash: false,

  // Enable static generation where possible
  // This helps with Netlify's edge caching
};

module.exports = nextConfig;
```

**Why:** Setting `output: undefined` ensures Next.js builds in standard mode, which is compatible with Netlify's plugin system.

### Fix 2: Consolidated Netlify Configuration
**File:** `/netlify.toml` (root level only)

```toml
[build]
# Monorepo: Set base directory to the Next.js app
base = "apps/web"

# Build command: Use workspace-specific build to avoid monorepo issues
command = "cd ../.. && npm run build --workspace=@combatid/web"

# Publish directory: For Next.js with @netlify/plugin-nextjs
# The plugin handles serving from .next correctly
publish = ".next"

# Environment variables for build
[build.environment]
  NODE_VERSION = "18"
  NPM_FLAGS = "--legacy-peer-deps"

# Essential Netlify Next.js plugin
# This plugin adapts Next.js for Netlify's serverless platform
[[plugins]]
package = "@netlify/plugin-nextjs"

# Cache control headers for static assets
[[headers]]
for = "/_next/static/*"
  [headers.values]
  Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
for = "/static/*"
  [headers.values]
  Cache-Control = "public, max-age=31536000, immutable"

# Security headers
[[headers]]
for = "/*"
  [headers.values]
  X-Frame-Options = "DENY"
  X-Content-Type-Options = "nosniff"
  X-XSS-Protection = "1; mode=block"
  Referrer-Policy = "strict-origin-when-cross-origin"
```

**Actions Taken:**
- Moved duplicate `/apps/web/netlify.toml` to `/apps/web/netlify.toml.backup`
- Consolidated all configuration in root `netlify.toml`
- Fixed build command to properly handle monorepo workspace
- Added performance and security headers

---

## Verification Steps

### Local Build Test
```bash
cd apps/web
rm -rf .next
npm run build
```

**Expected Output:**
- Build completes successfully
- No `standalone` directory in `.next/`
- Standard Next.js build structure with `server/` directory
- Routes manifest shows all app routes

**Verified:** ✅ Build successful with correct output structure

### Deploy to Netlify
1. Commit and push changes:
```bash
git add .
git commit -m "Fix: Remove standalone output for Netlify compatibility"
git push
```

2. Netlify will automatically rebuild with the new configuration

3. Verify deployment:
   - Check build logs for successful build
   - Test homepage: `https://your-site.netlify.app/`
   - Test dynamic routes: `/commission/events`, `/fighter`, etc.
   - Verify no 404 errors

---

## Configuration Explained

### Why `publish = ".next"`?
The `@netlify/plugin-nextjs` plugin knows how to serve from the `.next` directory. It:
- Extracts serverless functions from `.next/server/`
- Serves static files from `.next/static/`
- Handles dynamic routes automatically
- Sets up proper redirects and rewrites

### Why `base = "apps/web"`?
In a monorepo, this tells Netlify:
- Where to run the build command
- Where to find `node_modules` and `package.json`
- The context for relative paths

### Why the custom build command?
```bash
cd ../.. && npm run build --workspace=@combatid/web
```

This:
1. Goes to monorepo root (`cd ../..`)
2. Uses npm workspaces to build only the web app
3. Ensures all monorepo dependencies are resolved correctly
4. Prevents building unrelated packages

---

## Troubleshooting

### If 404s Still Occur
1. **Clear Netlify Cache:**
   - Go to Netlify Dashboard > Deploys > Trigger Deploy > Clear cache and deploy

2. **Check Build Logs:**
   - Verify `@netlify/plugin-nextjs` is running
   - Look for "Next.js Functions" being created
   - Check for any error messages

3. **Verify Plugin Installation:**
   ```bash
   cd apps/web
   npm list @netlify/plugin-nextjs
   ```
   Should show version 5.15.4 or later

4. **Check Routes:**
   - Look at `.next/routes-manifest.json` in build output
   - Verify all your routes are listed

### If Build Fails
1. **Dependencies:**
   ```bash
   # At monorepo root
   rm -rf node_modules package-lock.json
   rm -rf apps/web/node_modules
   npm install
   ```

2. **TypeScript Errors:**
   - Fix any type errors shown in build logs
   - Or temporarily bypass: Add `typescript: { ignoreBuildErrors: true }` to next.config.js

3. **Memory Issues:**
   - Add to `netlify.toml`:
   ```toml
   [build.environment]
     NODE_OPTIONS = "--max-old-space-size=4096"
   ```

---

## Next.js on Netlify Best Practices

### 1. Use App Router (Next.js 13+)
You're already using it! The App Router provides:
- Better static optimization
- Improved streaming and caching
- Server Components support

### 2. Leverage Static Generation
```typescript
// In your page components
export const dynamic = 'force-static' // for static pages
export const revalidate = 3600 // ISR with 1 hour revalidation
```

### 3. Optimize Images
```typescript
// next.config.js
module.exports = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
}
```

### 4. Environment Variables
Add in Netlify Dashboard under Site Settings > Environment Variables:
- `NEXT_PUBLIC_API_URL` - Your API endpoint
- `DATABASE_URL` - Database connection (if using)
- Any other runtime variables

### 5. Preview Deployments
Netlify automatically creates preview deployments for pull requests, perfect for testing before production.

---

## Files Modified

1. **`/apps/web/next.config.js`** - Removed standalone output, added documentation
2. **`/netlify.toml`** - Updated build command, added headers, consolidated config
3. **`/apps/web/netlify.toml`** - Moved to `.backup` to avoid conflicts

## Files Created

1. **`/NETLIFY_DEPLOYMENT_FIX.md`** - This documentation

---

## Additional Resources

- [Netlify Next.js Documentation](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [@netlify/plugin-nextjs GitHub](https://github.com/netlify/netlify-plugin-nextjs)

---

## Summary

The 404 errors were caused by Next.js building in `standalone` mode, which is incompatible with Netlify's serverless architecture. By removing the standalone output and properly configuring Netlify for a monorepo setup, the deployment should now work correctly.

**Status:** ✅ Fixed and verified locally
**Next Step:** Deploy to Netlify and verify in production
