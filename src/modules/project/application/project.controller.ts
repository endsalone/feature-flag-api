import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put, Request } from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { CreateProjectRequest } from 'modules/project/dtos/create-project.request';
import { UpdateProjectRequest } from 'modules/project/dtos/update-project.request';
import { CreateProject } from 'modules/project/use-cases/create-project';
import { DeleteProject } from 'modules/project/use-cases/delete-project';
import { GetProject } from 'modules/project/use-cases/get-project';
import { ListProject } from 'modules/project/use-cases/list-project';
import { ListProjectFeature } from 'modules/project/use-cases/list-project-feature';
import { UpdateProject } from 'modules/project/use-cases/update-project';

@Controller('projects')
export class ProjectsController {
  constructor(
    private createProjectUseCase: CreateProject,
    private updateProjectUseCase: UpdateProject,
    private deleteProjectUseCase: DeleteProject,
    private listProjectUseCase: ListProject,
    private listProjectFeature: ListProjectFeature,
    private getProjectUseCase: GetProject
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createProject(@Request() options: RequestOptions, @Body() body: CreateProjectRequest): Promise<unknown> {
    return this.createProjectUseCase.execute(body, options.user);
  }

  @Put('/:slug')
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Request() options: RequestOptions,
    @Body() body: UpdateProjectRequest,
    @Param('slug') slug: string
  ): Promise<Partial<unknown>> {
    return this.updateProjectUseCase.execute(slug, body, options.user);
  }

  @Delete('/:slug')
  @HttpCode(HttpStatus.OK)
  async deleteProject(@Request() options: RequestOptions, @Param('slug') slug: string): Promise<void> {
    return this.deleteProjectUseCase.execute(slug, options.user);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async listProjects(@Request() options: RequestOptions): Promise<unknown> {
    return this.listProjectUseCase.execute(options.user);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  async getProject(@Request() options: RequestOptions, @Param('slug') slug: string): Promise<unknown> {
    return this.getProjectUseCase.execute(slug, options.user);
  }
}
