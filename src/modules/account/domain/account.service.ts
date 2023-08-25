import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { FindOptionsWhere, Repository } from 'typeorm';
import { AccountAlreadyExistsException } from './exception/account-exists';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(AccountEntity)
    private accountsRepository: Repository<AccountEntity>
  ) {}

  async createAccount(account: AccountEntity): Promise<AccountEntity> {
    const hasAccount = await this.findOne({ email: account.email });
    if (hasAccount) {
      throw new AccountAlreadyExistsException();
    }

    return this.accountsRepository.save(account);
  }

  async updateAccount(account: Partial<AccountEntity>, id: number): Promise<void> {
    await this.accountsRepository.update(id, account);
  }

  async findOne(where: FindOptionsWhere<Partial<AccountEntity>>): Promise<AccountEntity> {
    return this.accountsRepository.findOne({ where });
  }

  async findByEmail(email: string, selectField?: string[]): Promise<AccountEntity> {
    const query = await this.accountsRepository
      .createQueryBuilder('accounts')
      .where('accounts.email = :email', { email });
    return selectField ? query.addSelect(selectField).getOne() : query.getOne();
  }

  async findById(id: number): Promise<AccountEntity> {
    return this.findOne({ id });
  }

  async find(where: FindOptionsWhere<Partial<AccountEntity>>): Promise<AccountEntity[]> {
    return this.accountsRepository.find({ where });
  }
}
