import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import { AccountUnauthorized } from 'modules/auth/domain/exception/account-unauthorized';
import { ProfessionalAccountIncomplete } from 'modules/auth/domain/exception/professional-account-incomplete';
import { LoginRequest } from 'modules/auth/dtos/login.request';
import { LoginResponse } from 'modules/auth/dtos/login.response';

@Injectable()
export class JwtLogin {
  constructor(private jwtService: JwtService, private accountService: AccountService) {}

  async execute(login: LoginRequest): Promise<LoginResponse> {
    const account = await this.accountService.findByEmail(login.email, ['accounts.password']);
    if (!account) {
      throw new AccountUnauthorized();
    }

    if (account.type === ACCOUNT_TYPE.PROFESSIONAL) {
      this.validateProfessionalAccount(account);
    }

    const password = await compare(login.password, account.password);
    if (!password) {
      throw new AccountUnauthorized();
    }

    return {
      token: this.jwtService.sign({
        id: account.id,
        email: account.email,
        type: account.type,
        status: account.status,
        active: account.active
      })
    } as LoginResponse;
  }

  private validateProfessionalAccount(account: AccountEntity): void {
    if (account.status === ACCOUNT_STATUS.PENDING) {
      throw new ProfessionalAccountIncomplete();
    }
  }
}
