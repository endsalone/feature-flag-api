import { Injectable } from '@nestjs/common';
import { genSalt, hash } from 'bcrypt';
import { castWithObfuscation } from 'common/casting';
import config from 'common/config';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import { AccountCreateRequest } from 'modules/account/dtos/account-create.request';

@Injectable()
export class CreateAccount {
  constructor(private readonly accountService: AccountService) {}

  async execute(accountDto: AccountCreateRequest): Promise<AccountEntity> {
    const account = await this.buildAccount(accountDto);
    const newAccount = await this.accountService.createAccount(account);

    return castWithObfuscation(AccountEntity, newAccount);
  }

  private async buildAccount(accountDto: AccountCreateRequest): Promise<AccountEntity> {
    const account = castWithObfuscation(AccountEntity, accountDto);
    account.status = accountDto.type === ACCOUNT_TYPE.PROFESSIONAL ? ACCOUNT_STATUS.PENDING : ACCOUNT_STATUS.ACTIVE;
    account.active = accountDto.type === ACCOUNT_TYPE.PROFESSIONAL ? false : true;
    account.password = await this.generateHash(accountDto.password);

    return account;
  }

  private async generateHash(password: string): Promise<string> {
    const salt = await genSalt(config.jwt.salt);
    return hash(password, salt);
  }
}
