import { Module } from '@nestjs/common';
import { AuditController } from './audit.controller';
import { AuditService } from './audit.service';
import { AuditSchema } from './audit.entity';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Audit', schema: AuditSchema }])
  ],
  providers: [AuditService],
  controllers: [AuditController]
})
export class AuditModule { }
