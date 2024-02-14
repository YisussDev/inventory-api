import { Controller, Post, Body, Get, Headers, HttpException, HttpStatus } from '@nestjs/common';
import { AuthService } from '../../core/guard/auth.service';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class AuthController {

    constructor(
        private authServices: AuthService,
        private jwtServices: JwtService
    ) { }

    @Post('login')
    async login(@Body() body: any) {
        try {
            return this.authServices.loginWithEmail(body)
        } catch (error) {
            return new HttpException(error, HttpStatus.BAD_GATEWAY);
        }
    }

    @Get('validate-token')
    async validateToken(@Headers('Authorization') authorization: string) {
        const token = this.extractToken(authorization);
        if (!token) {
            return { isValid: false };
        }
        const isValid = await this.authServices.validateToken(token);
        if (isValid) {
            const dataUser = this.jwtServices.decode(token);
            return { data: dataUser, token, isValid };
        }
        return { isValid };
    }

    private extractToken(authorizationHeader: string): string | null {
        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            return null;
        }
        return authorizationHeader.split(' ')[1];
    }

}
