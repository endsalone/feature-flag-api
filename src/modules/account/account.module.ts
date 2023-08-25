import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AccountController } from 'modules/account/application/account.controller';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { AccountService } from 'modules/account/domain/account.service';
import { CreateAccount } from 'modules/account/use-cases/create-account';
import { GetProfileInfo } from 'modules/account/use-cases/get-profile-info';
import { UpdateAccount } from 'modules/account/use-cases/update-account';

@Module({
  imports: [TypeOrmModule.forFeature([AccountEntity])],
  providers: [AccountService, CreateAccount, GetProfileInfo, JwtService, UpdateAccount],
  controllers: [AccountController]
})
export class AccountModule {}
