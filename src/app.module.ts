import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { ProductsModule } from './products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { ProvidersModule } from './providers/providers.module';
import { AuditModule } from './audit/audit.module';
import { SalesModule } from './sales/sales.module';

@Module({
  imports: [
    AuditModule,
    SalesModule,
    ProvidersModule,
    ProductsModule,
    AuthModule,
    UsersModule,
    ProductsModule,
    ProvidersModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    MongooseModule.forRoot(`mongodb+srv://shgzjxd:230815xd@jesusp.jzdyvsd.mongodb.net/inventory-app`),
    JwtModule.register({
      global: true,
      privateKey: 'shgzjxd123',
      secret: 'shgzjxd123',
      signOptions: { expiresIn: '1800s' },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
