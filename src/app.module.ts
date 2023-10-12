import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import dbProvider from 'infra/providers';
import { AccountModule } from 'modules/account/account.module';
import { AuthModule } from 'modules/auth/auth.module';
import { FeatureModule } from 'modules/feature/feature.module';
import { OrganizationModule } from 'modules/organization/organization.module';
import { ProjectModule } from 'modules/project/project.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({ ...dbProvider, synchronize: true }),
    AccountModule,
    AuthModule,
    ProjectModule,
    FeatureModule,
    OrganizationModule
  ]
})
export class AppModule {}
