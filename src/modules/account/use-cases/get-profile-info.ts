import { Injectable } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import { UserOptions } from 'modules/auth/jwt.type';

@Injectable()
export class GetProfileInfo {
  constructor(
    private readonly accountService: AccountService,
  ) { }

  async execute(userOptions: UserOptions): Promise<AccountEntity> {
    const account = await this.accountService.findOne({ id: userOptions.id });
    return castWithObfuscation(AccountEntity, account);
  }
}