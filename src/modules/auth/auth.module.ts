import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'application/jwt-guard';
import { AuthProvider } from 'common/auth-permission';
import config from 'common/config';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import { AuthController } from 'modules/auth/application/auth.controller';
import { JwtLogin } from 'modules/auth/use-cases/jwt-login';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity]),
    PassportModule,
    JwtModule.register({
      secret: config.jwt.secret,
      signOptions: { expiresIn: config.jwt.expiresIn }
    })
  ],
  providers: [AccountService, AuthProvider, JwtLogin, JwtAuthGuard],
  controllers: [AuthController]
})
export class AuthModule {}
