import { Expose } from 'class-transformer';
import { ProjectEntity } from '../domain/project.entity';

export class ListProjectResponse implements Partial<ProjectEntity> {
  @Expose()
  name: string;
  @Expose()
  description: string;
  @Expose()
  slug: string;
}
