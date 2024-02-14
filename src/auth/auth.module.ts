import { AuthService } from '../core/guard/auth.service';
import { AuthController } from './controllers/auth.controller';
import { Module } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt'
import { UserSchema } from 'src/users/user.model';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    ],
    controllers: [
        AuthController
    ],
    providers: [
        AuthService,
        UsersService
    ],
})
export class AuthModule { }
