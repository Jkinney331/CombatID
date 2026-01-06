import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger, VersioningType } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger as PinoLogger } from 'nestjs-pino';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  // Create application
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  // Use Pino logger
  app.useLogger(app.get(PinoLogger));

  // Enable shutdown hooks
  app.enableShutdownHooks();

  // Enable CORS
  const corsOrigins = process.env.CORS_ORIGIN?.split(',') || [
    'http://localhost:3000',
    'http://localhost:8081',
  ];

  app.enableCors({
    origin: corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe with detailed error messages
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      errorHttpStatusCode: 422,
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // API versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // API prefix
  app.setGlobalPrefix('api');

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('CombatID API')
    .setDescription(
      'Digital identity and compliance platform for combat sports. ' +
      'This API provides endpoints for managing fighters, organizations, events, ' +
      'documents, and eligibility verification.'
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('health', 'Health check endpoints')
    .addTag('auth', 'Authentication and authorization')
    .addTag('users', 'User management')
    .addTag('fighters', 'Fighter profiles and records')
    .addTag('documents', 'Document vault and verification')
    .addTag('organizations', 'Gyms, promotions, and commissions')
    .addTag('events', 'Event and bout management')
    .addTag('eligibility', 'Fighter eligibility verification')
    .addServer('http://localhost:3001', 'Local development')
    .addServer('https://api-dev.combatid.com', 'Development')
    .addServer('https://api-staging.combatid.com', 'Staging')
    .addServer('https://api.combatid.com', 'Production')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
    },
  });

  // Start server
  const port = process.env.PORT ?? 3001;
  const host = '0.0.0.0'; // Listen on all interfaces for Docker compatibility

  await app.listen(port, host);

  logger.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🥊 CombatID API - Phase 0 Infrastructure               ║
║                                                           ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                    ║
║   Port:        ${port}                                         ║
║                                                           ║
║   🚀 API:      http://localhost:${port}/api/v1            ║
║   📚 Docs:     http://localhost:${port}/api/docs          ║
║   ❤️  Health:   http://localhost:${port}/health            ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
}

bootstrap().catch((error) => {
  const logger = new Logger('Bootstrap');
  logger.error('Failed to start application', error);
  process.exit(1);
});
