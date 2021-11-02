import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userName: string, password: string): Promise<any> {
    const user = await this.userService.getUserByName(userName);

    try {
      if (user && (await argon2.verify(user.password, password))) {
        const { password, ...result } = user;
        return result;
      }
      return null;
    } catch (err) {
      console.log(err);
    }
  }

  async login(user: any) {
    const payload = { username: user.userName, sub: user.userId };
    return { access_token: this.jwtService.sign(payload) };
  }
}
