import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ProductSchema } from './products.entity';
import { JwtService } from '@nestjs/jwt';
import { AuditSchema } from 'src/audit/audit.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Product', schema: ProductSchema },
      { name: 'Audit', schema: AuditSchema },
    ])
  ],
  providers: [
    ProductsService,
    JwtService
  ],
  controllers: [
    ProductsController
  ]
})
export class ProductsModule { }
