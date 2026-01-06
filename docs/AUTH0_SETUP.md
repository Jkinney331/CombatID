# Auth0 Setup Guide for CombatID

This guide walks you through setting up Auth0 for local development.

## 1. Create an Auth0 Account

1. Go to [https://auth0.com](https://auth0.com)
2. Sign up for a free account
3. Create a new tenant (e.g., `combatid-dev`)

## 2. Create an API

1. Go to **Applications** > **APIs**
2. Click **Create API**
3. Configure:
   - **Name**: `CombatID API`
   - **Identifier**: `https://api.combatid.com`
   - **Signing Algorithm**: `RS256`
4. Click **Create**

## 3. Create Applications

### 3.1 Single Page Application (Web Portal)

1. Go to **Applications** > **Applications**
2. Click **Create Application**
3. Configure:
   - **Name**: `CombatID Web`
   - **Type**: `Single Page Application`
4. Click **Create**
5. In Settings:
   - **Allowed Callback URLs**: `http://localhost:3000/callback`
   - **Allowed Logout URLs**: `http://localhost:3000`
   - **Allowed Web Origins**: `http://localhost:3000`
6. Save Changes

### 3.2 Machine-to-Machine Application (API Testing)

1. Click **Create Application**
2. Configure:
   - **Name**: `CombatID API Testing`
   - **Type**: `Machine to Machine Applications`
3. Select the `CombatID API` and grant all permissions
4. Click **Authorize**

## 4. Configure User Roles

1. Go to **User Management** > **Roles**
2. Create the following roles:
   - `super_admin` - Full system access
   - `commission_admin` - Commission portal access
   - `promotion_admin` - Promotion portal access
   - `gym_admin` - Gym portal access
   - `fighter` - Fighter portal access

## 5. Configure Rules (Optional)

Add user metadata to tokens:

1. Go to **Auth Pipeline** > **Rules**
2. Create a new rule:

```javascript
function addUserMetadataToToken(user, context, callback) {
  const namespace = 'https://combatid.com';

  // Add user roles
  context.accessToken[namespace + '/roles'] = context.authorization?.roles || [];

  // Add user metadata
  context.accessToken[namespace + '/user_metadata'] = user.user_metadata || {};

  callback(null, user, context);
}
```

## 6. Update Environment Variables

Copy the following values to your `.env` file:

```bash
# From your Auth0 tenant
AUTH0_DOMAIN=your-tenant.auth0.com

# From the CombatID Web application
AUTH0_CLIENT_ID=your-spa-client-id
AUTH0_CLIENT_SECRET=your-spa-client-secret

# The API identifier you created
AUTH0_AUDIENCE=https://api.combatid.com
```

## 7. Test the Configuration

### Using the Auth0 Dashboard

1. Go to **Getting Started** > **Try your Login box**
2. Create a test user
3. Verify login works

### Using curl (Machine-to-Machine)

```bash
# Get an access token
curl --request POST \
  --url 'https://YOUR_DOMAIN/oauth/token' \
  --header 'content-type: application/json' \
  --data '{
    "client_id": "YOUR_M2M_CLIENT_ID",
    "client_secret": "YOUR_M2M_CLIENT_SECRET",
    "audience": "https://api.combatid.com",
    "grant_type": "client_credentials"
  }'

# Test the API
curl --request GET \
  --url 'http://localhost:3001/api/v1/health' \
  --header 'Authorization: Bearer YOUR_ACCESS_TOKEN'
```

## 8. Social Login (Optional)

To enable Google/Apple sign-in:

1. Go to **Authentication** > **Social**
2. Enable desired providers
3. Configure OAuth credentials for each provider

## Troubleshooting

### Token Validation Errors

- Ensure `AUTH0_AUDIENCE` matches exactly
- Check that `AUTH0_DOMAIN` includes no trailing slash
- Verify the token hasn't expired

### CORS Errors

- Add your frontend URL to "Allowed Web Origins"
- Ensure the API allows the correct origins

### Role-Based Access Issues

- Verify roles are attached to the user
- Check that the rule is adding roles to tokens
- Inspect the JWT at [jwt.io](https://jwt.io)
