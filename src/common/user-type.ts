import { Request } from 'express';
import { ACCOUNT_STATUS, ACCOUNT_TYPE } from 'modules/account/domain/account.type';
import { Feature } from 'modules/feature/domain/feature';
import { OrganizationInterceptorDto } from 'modules/organization/dtos/organization.interceptor.dto';
import { Project } from 'modules/project/domain/project';

export type UserOption = {
  id: number;
  email: string;
  type: ACCOUNT_TYPE;
  status: ACCOUNT_STATUS;
  active: boolean;
  organization: Partial<OrganizationInterceptorDto>;
  feature: Partial<Feature>;
  project: Partial<Project>;
};

export type RequestOptions = {
  user: UserOption;
} & Request;
