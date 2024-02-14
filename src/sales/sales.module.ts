import { Module } from '@nestjs/common';
import { SalesController } from './sales.controller';
import { SalesService } from './sales.service';
import { SaleSchema } from './sales.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from 'src/products/products.entity';
import { AuditSchema } from 'src/audit/audit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Sale', schema: SaleSchema },
      { name: 'Product', schema: ProductSchema },
      { name: 'Audit', schema: AuditSchema },
    ]),
  ],
  providers: [SalesService],
  controllers: [SalesController]
})
export class SalesModule { }
