import { ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PassportStrategy } from '@nestjs/passport';
import { HAS_ROLE_KEY, IS_PUBLIC_KEY } from 'common/auth-permission';
import config from 'common/config';
import { ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import { JwtPayload, UserOptions } from 'modules/auth/jwt.type';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtAuthGuard extends PassportStrategy(Strategy) {
  private isPublic: boolean;
  private hasRole: ACCOUNT_TYPE;
  private httpError: HttpException | Error;
  private userPayload: UserOptions;

  constructor(private reflector: Reflector) {
    super({
      ignoreExpiration: false,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jsonWebTokenOptions: {
        complete: true
      },
      secretOrKey: config.jwt.secret
    });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    this.resetRequestState(context);

    if (this.isPublic) {
      return true;
    }

    await super.authenticate(context.switchToHttp().getRequest());

    if (this.httpError) {
      throw this.httpError;
    }

    if (this.userPayload) {
      context.switchToHttp().getRequest().user = this.userPayload;
    }
    return true;
  }

  async validate(payload: JwtPayload): Promise<JwtPayload> {
    if (this.hasRole && this.hasRole !== payload.payload.type) {
      this.httpError = new HttpException("You don't have permission", HttpStatus.FORBIDDEN);
    }

    return payload;
  }

  async success(jwt: JwtPayload): Promise<void> {
    this.userPayload = jwt.payload;
  }

  fail(error: any): void {
    this.httpError = new HttpException(error.message as Error, HttpStatus.UNAUTHORIZED);
  }

  private resetRequestState(context: ExecutionContext): void {
    this.error = null;
    this.userPayload = null;
    this.httpError = null;

    this.isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
    this.hasRole = this.reflector.getAllAndOverride<ACCOUNT_TYPE>(HAS_ROLE_KEY, [
      context.getHandler(),
      context.getClass()
    ]);
  }
}
