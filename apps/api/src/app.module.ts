import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { FightersModule } from './fighters/fighters.module';
import { DocumentsModule } from './documents/documents.module';
import { OrganizationsModule } from './organizations/organizations.module';
import { EventsModule } from './events/events.module';
import { EligibilityModule } from './eligibility/eligibility.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    AuthModule,
    UsersModule,
    FightersModule,
    DocumentsModule,
    OrganizationsModule,
    EventsModule,
    EligibilityModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
