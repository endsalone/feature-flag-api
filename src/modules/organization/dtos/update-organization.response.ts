import { Expose } from 'class-transformer';

export class UpdateProjectResponse {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  slug: string;
}
