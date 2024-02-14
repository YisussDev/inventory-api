import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Module } from '@nestjs/common';

import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './user.model';
import { AuditSchema } from 'src/audit/audit.entity';
import { JwtService } from '@nestjs/jwt';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: 'User', schema: UserSchema },
            // { name: 'Audit', schema: AuditSchema },
        ])
    ],
    providers: [
        UsersService,
        JwtService
    ],
    controllers: [
        UsersController,
    ]
})
export class UsersModule { }
