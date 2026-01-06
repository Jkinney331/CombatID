import { Module } from '@nestjs/common';
import { BoutsService } from './bouts.service';
import { BoutsController } from './bouts.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [PrismaModule, AuditModule],
  controllers: [BoutsController],
  providers: [BoutsService],
  exports: [BoutsService],
})
export class BoutsModule {}
