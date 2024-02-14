import { Module } from '@nestjs/common';
import { ProvidersController } from './providers.controller';
import { ProvidersService } from './providers.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProviderSchema } from './providers.entity';
import { AuditSchema } from 'src/audit/audit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Provider', schema: ProviderSchema },
      { name: 'Audit', schema: AuditSchema },
    ])
  ],
  providers: [
    ProvidersService
  ],
  controllers: [
    ProvidersController
  ]
})
export class ProvidersModule { }
