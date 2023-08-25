import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, Request } from '@nestjs/common';
import { Public } from 'common/auth-permission';
import { RequestOptions } from 'common/user-type';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountCreateRequest } from 'modules/account/dtos/account-create.request';
import { AccountUpdateRequest } from 'modules/account/dtos/account-update.request';
import { CreateAccount } from 'modules/account/use-cases/create-account';
import { GetProfileInfo } from 'modules/account/use-cases/get-profile-info';
import { UpdateAccount } from '../use-cases/update-account';

@Controller('accounts')
export class AccountController {
  constructor(
    private readonly createAccountUseCase: CreateAccount,
    private readonly getProfileUseCase: GetProfileInfo,
    private readonly updateProfileUseCase: UpdateAccount
  ) {}

  @Post()
  @Public()
  @HttpCode(HttpStatus.CREATED)
  async createAccount(@Body() account: AccountCreateRequest): Promise<Partial<AccountEntity>> {
    return this.createAccountUseCase.execute(account);
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  async getProfile(@Request() options: RequestOptions): Promise<AccountEntity> {
    return this.getProfileUseCase.execute(options.user);
  }

  @Put('me')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateProfile(@Request() options: RequestOptions, @Body() requestUpdate: AccountUpdateRequest): Promise<any> {
    return this.updateProfileUseCase.execute(requestUpdate, options.user);
  }
}
