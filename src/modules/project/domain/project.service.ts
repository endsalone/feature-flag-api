/* eslint-disable max-lines */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { slugify } from 'common/string-manipulation';
import { AccountEntity } from 'modules/account/domain/account.entity';
import { ProjectAlreadyExistsException } from 'modules/project/domain/exception/project-exists';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectEntity } from 'modules/project/domain/project.entity';
import { FindOptionsWhere, Repository } from 'typeorm';

@Injectable()
export class ProjectService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectsRepository: Repository<ProjectEntity>
  ) {}

  async createProject(project: ProjectEntity, accountId: number): Promise<ProjectEntity> {
    const slug = slugify(project.name);

    const hasProject = await this.findOneBySlugAndAccount(`'${slug}'`, accountId);
    if (hasProject) {
      throw new ProjectAlreadyExistsException();
    }

    const account = new AccountEntity();
    account.id = accountId;

    const projectWithSlug: ProjectEntity = { ...project, slug, permissions: [account] };

    const projectSaved = await this.projectsRepository.save(projectWithSlug);

    return projectSaved;
  }

  async updateProject(project: Partial<ProjectEntity>, accountId: number): Promise<Partial<ProjectEntity>> {
    const newSlug = slugify(project.name);
    const formatedSlug = `'${newSlug}', '${project.slug}'`;

    const existingProjectList: ProjectEntity[] = await this.findBySlugsAndAccount(formatedSlug, accountId);
    if (!existingProjectList.length) {
      throw new ProjectDoesNotExistException();
    }

    if (existingProjectList.length > 1) {
      throw new ProjectAlreadyExistsException();
    }

    const firstProject = {
      ...existingProjectList[0],
      ...project,
      slug: newSlug
    };

    await this.projectsRepository.save(firstProject);

    return firstProject;
  }

  async findOne(where: FindOptionsWhere<Partial<ProjectEntity>>): Promise<ProjectEntity> {
    return this.projectsRepository.findOne({ where });
  }

  async findBySlugsAndAccount(slug: string, accountId: number): Promise<ProjectEntity[]> {
    return this.projectsRepository.query(`
      SELECT
        "projects"."id" AS "id",
        "projects"."name" AS "name",
        "projects"."slug" AS "slug",
        "projects"."description" AS "description"
      FROM "projects"
        INNER JOIN "permissions_projects" ON
          "permissions_projects"."project_id"="projects"."id" AND
          "permissions_projects".account_id=${accountId}
        WHERE
          "projects"."slug" IN (${slug}) AND
          "projects"."deleted_at" IS NULL;
    `);
  }

  async findOneBySlugAndAccount(slug: string, accountId: number): Promise<ProjectEntity> {
    const projectList: Promise<ProjectEntity[]> = await this.projectsRepository.query(`
      SELECT
        "projects"."id" AS "id",
        "projects"."name" AS "name",
        "projects"."slug" AS "slug",
        "projects"."description" AS "description"
      FROM "projects"
        INNER JOIN "permissions_projects" ON
          "permissions_projects"."project_id"="projects"."id" AND
          "permissions_projects".account_id=${accountId}
        WHERE
          "projects"."slug" = ${slug} AND
          "projects"."deleted_at" IS NULL
        LIMIT 1;
    `);

    return projectList[0];
  }

  async find(where: FindOptionsWhere<Partial<ProjectEntity>>): Promise<ProjectEntity[]> {
    return this.projectsRepository.find({ where });
  }

  async findByAccountId(accountId: number): Promise<ProjectEntity[]> {
    return this.projectsRepository.query(`
      SELECT
        "projects"."id" AS "id",
        "projects"."name" AS "name",
        "projects"."slug" AS "slug",
        "projects"."description" AS "description"
      FROM "projects"
        INNER JOIN "permissions_projects" ON
          "permissions_projects"."project_id"="projects"."id" AND
          "permissions_projects".account_id=${accountId} AND
          "projects"."deleted_at" IS NULL;
    `);
  }

  async delete(slug: string, accountId: number): Promise<void> {
    const project: ProjectEntity = await this.findOne({ slug, permissions: { id: accountId } });
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    await this.projectsRepository.softDelete(project.id);
  }
}
