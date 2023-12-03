import { Secret } from 'modules/project/domain/secret';

export interface Environment {
  id: number;
  name: string;
  key: string;
  secret: Secret;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
