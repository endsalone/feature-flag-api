import { Secret } from 'modules/organization/domain/secret';

export interface Environment {
  id: number;
  name: string;
  key: string;
  secret: Secret;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
