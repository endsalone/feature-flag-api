import { Expose } from 'class-transformer';

export class CreateProjectResponse {
  @Expose()
  name: string;
  @Expose()
  slug: string;
  @Expose()
  description: string;
}
