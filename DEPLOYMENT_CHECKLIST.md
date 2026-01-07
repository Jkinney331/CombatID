# Netlify Deployment Checklist

## Pre-Deployment

- [x] Remove `output: "standalone"` from next.config.js
- [x] Consolidate netlify.toml to root directory only
- [x] Update build command for monorepo workspace
- [x] Add performance headers for static assets
- [x] Add security headers
- [x] Test local build succeeds
- [ ] Commit and push changes to repository

## Netlify Dashboard Setup

### Site Settings
- [ ] Verify repository connected
- [ ] Check branch: `main` is set for production

### Build Settings (Should Auto-Detect from netlify.toml)
- [ ] Base directory: `apps/web`
- [ ] Build command: `cd ../.. && npm run build --workspace=@combatid/web`
- [ ] Publish directory: `apps/web/.next`

### Environment Variables (Add if needed)
```
NEXT_PUBLIC_API_URL=https://your-api-url.com
NODE_VERSION=18
NPM_FLAGS=--legacy-peer-deps
```

### Plugins
- [ ] Verify `@netlify/plugin-nextjs` is enabled
- [ ] Check plugin version is 5.x or higher

## Deployment Steps

1. **Commit Changes:**
```bash
git add .
git commit -m "fix: Configure Next.js for Netlify compatibility"
git push origin main
```

2. **Monitor Build:**
   - Go to Netlify Dashboard > Deploys
   - Watch build logs in real-time
   - Look for "Next.js Functions" creation

3. **Build Success Indicators:**
   - ✅ `@netlify/plugin-nextjs` runs successfully
   - ✅ "Next.js Functions" created for dynamic routes
   - ✅ Build completes without errors
   - ✅ Deploy successful message

## Post-Deployment Testing

### Homepage
- [ ] Visit `https://your-site.netlify.app/`
- [ ] Verify page loads without 404
- [ ] Check browser console for errors

### Static Routes
- [ ] `/commission` - Commission dashboard
- [ ] `/fighter` - Fighter portal
- [ ] `/gym` - Gym management
- [ ] `/promotion` - Promotion management

### Dynamic Routes
- [ ] `/commission/events/[id]` - Test with any ID
- [ ] `/commission/fighters/[id]` - Test with any ID
- [ ] `/fighter/profile` - Fighter profile
- [ ] `/promotion/events/[id]/bouts/[boutId]` - Nested dynamic route

### Performance
- [ ] Check Lighthouse score
- [ ] Verify static assets cache headers (inspect network tab)
- [ ] Test page load speed

### Edge Cases
- [ ] Direct URL navigation (not SPA navigation)
- [ ] Browser refresh on dynamic routes
- [ ] 404 page for invalid routes

## Troubleshooting Commands

### Clear and Rebuild
```bash
# Local
cd apps/web
rm -rf .next
npm run build

# Netlify Dashboard
Deploys > Trigger Deploy > Clear cache and deploy site
```

### Check Plugin
```bash
cd apps/web
npm list @netlify/plugin-nextjs
```

### View Build Locally
```bash
cd apps/web
npm run build
npm run start
# Visit http://localhost:3000
```

## Rollback Plan

If deployment fails:

1. **Quick Rollback:**
   - Netlify Dashboard > Deploys > [Previous successful deploy] > Publish deploy

2. **Investigate:**
   - Download build logs
   - Check error messages
   - Review recent commits

3. **Revert Code:**
```bash
git revert HEAD
git push origin main
```

## Success Criteria

- ✅ Build completes without errors
- ✅ No 404 errors on any route
- ✅ Dynamic routes work correctly
- ✅ Static assets load with proper caching
- ✅ No console errors in browser
- ✅ Lighthouse score > 90 for performance

## Support Resources

- [Netlify Support](https://www.netlify.com/support/)
- [Next.js Discord](https://nextjs.org/discord)
- Project docs: `/NETLIFY_DEPLOYMENT_FIX.md`
