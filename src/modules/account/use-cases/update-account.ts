import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { UserOption } from 'common/user-type';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import { AccountDoesNotExistException } from 'modules/account/domain/exception/account-does-not-exists';
import { AccountUpdateRequest } from 'modules/account/dtos/account-update.request';

@Injectable()
export class UpdateAccount {
  constructor(private readonly accountService: AccountService) {}

  async execute(accountDto: AccountUpdateRequest, options: UserOption): Promise<AccountEntity> {
    const existingAccount = await this.accountService.findById(options.id);
    if (!existingAccount) {
      throw new AccountDoesNotExistException();
    }

    const account = castWithObfuscation(AccountEntity, accountDto);
    await this.accountService.updateAccount(account, options.id);

    return account;
  }
}
