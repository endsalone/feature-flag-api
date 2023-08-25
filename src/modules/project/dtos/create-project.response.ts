import { Expose } from 'class-transformer';

export class CreateProjectResponse {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  createdAt: string;
}
