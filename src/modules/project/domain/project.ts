export interface Project {
  id: number;
  name: string;
  slug: string;
  description: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
