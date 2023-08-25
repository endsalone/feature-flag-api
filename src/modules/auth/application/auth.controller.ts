import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { Public } from 'common/auth-permission';
import { LoginRequest } from 'modules/auth/dtos/login.request';
import { JwtLogin } from 'modules/auth/use-cases/jwt-login';

@Controller('auth')
export class AuthController {
  constructor(private jwtLogin: JwtLogin) {}

  @Public()
  @Post('login')
  @HttpCode(200)
  async login(@Body() login: LoginRequest) {
    return this.jwtLogin.execute(login);
  }
}
