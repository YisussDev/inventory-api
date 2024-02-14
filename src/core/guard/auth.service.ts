import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/users/user.model';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt'

@Injectable()
export class AuthService {

  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) { }

  async loginWithEmail(user: User) {
    const userInDB = await this.usersService.findByEmail(user.email);

    if (userInDB.length === 0) {
      throw new HttpException('Usuario no encontrado', HttpStatus.NOT_FOUND);
    }

    if (userInDB[0].password !== user.password) {
      throw new HttpException('Contraseña incorrecta', HttpStatus.UNAUTHORIZED);
    }

    const dataToEncrypt = {
      email: userInDB[0].email,
      id: userInDB[0].id,
      name: userInDB[0].name,
      img_url: userInDB[0].img_url,
      rol: userInDB[0].rol
    };
    const token = this.jwtService.sign(dataToEncrypt);

    return {
      name: userInDB[0].name,
      img_url: userInDB[0].img_url,
      id: userInDB[0].id,
      token: token,
      rol: userInDB[0].rol
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      const decoded = this.jwtService.verify(token);
      return !!decoded;
    } catch (error) {
      return false;
    }
  }


  getTokenOfHeader(header: any): string | undefined {
    const [type, token] = header.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

}
