import { Provider, SetMetadata } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'application/jwt-guard';
import { ACCOUNT_TYPE } from 'modules/account/domain/account.type';

export const IS_PUBLIC_KEY = 'isPublic';
export const HAS_ROLE_KEY = 'hasRole';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
export const Role = (type: ACCOUNT_TYPE) => SetMetadata(HAS_ROLE_KEY, type);

export const AuthProvider: Provider = { provide: APP_GUARD, useClass: JwtAuthGuard };
