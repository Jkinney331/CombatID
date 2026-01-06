import { Module } from '@nestjs/common';
import { SuspensionsService } from './suspensions.service';
import { SuspensionsController } from './suspensions.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [SuspensionsController],
  providers: [SuspensionsService],
  exports: [SuspensionsService],
})
export class SuspensionsModule {}
