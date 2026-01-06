export default () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3001', 10),

  // Database
  database: {
    url: process.env.DATABASE_URL,
  },

  // Auth0
  auth0: {
    domain: process.env.AUTH0_DOMAIN,
    audience: process.env.AUTH0_AUDIENCE,
    issuerUrl: process.env.AUTH0_ISSUER_URL,
  },

  // AWS
  aws: {
    region: process.env.AWS_REGION || 'us-east-1',
    s3: {
      bucketName: process.env.AWS_S3_BUCKET_NAME,
    },
  },

  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN?.split(',') || [
      'http://localhost:3000',
      'http://localhost:8081',
    ],
  },

  // Application
  app: {
    name: 'CombatID API',
    version: '1.0.0',
    description: 'Digital identity and compliance platform for combat sports',
  },
});
