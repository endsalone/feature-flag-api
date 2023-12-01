import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UseInterceptors
} from '@nestjs/common';
import { RequestOptions } from 'common/user-type';
import { OrganizationInterceptor } from 'modules/organization/application/organization.interceptor';
import { CreateProjectRequest } from 'modules/project/dtos/create-project.request';
import { CreateProjectResponse } from 'modules/project/dtos/create-project.response';
import { ListProjectResponse } from 'modules/project/dtos/list-project.response';
import { UpdateProjectRequest } from 'modules/project/dtos/update-project.request';
import { UpdateProjectResponse } from 'modules/project/dtos/update-project.response';
import { CreateProject } from 'modules/project/use-cases/create-project';
import { DeleteProject } from 'modules/project/use-cases/delete-project';
import { GetProject } from 'modules/project/use-cases/get-project';
import { ListProject } from 'modules/project/use-cases/list-project';
import { UpdateProject } from 'modules/project/use-cases/update-project';

@Controller('/organizations/:organizationHash/projects')
@UseInterceptors(OrganizationInterceptor)
export class ProjectsController {
  constructor(
    private createProjectUseCase: CreateProject,
    private updateProjectUseCase: UpdateProject,
    private deleteProjectUseCase: DeleteProject,
    private listProjectUseCase: ListProject,
    private getProjectUseCase: GetProject
  ) {}

  @Post('/')
  @HttpCode(HttpStatus.CREATED)
  async createProject(
    @Request() options: RequestOptions,
    @Body() body: CreateProjectRequest
  ): Promise<CreateProjectResponse> {
    return this.createProjectUseCase.execute(body, options.user);
  }

  @Put('/:slug')
  @HttpCode(HttpStatus.OK)
  async updateProject(
    @Request() options: RequestOptions,
    @Body() body: UpdateProjectRequest,
    @Param('slug') slug: string
  ): Promise<UpdateProjectResponse> {
    return this.updateProjectUseCase.execute(slug, body, options.user);
  }

  @Delete('/:slug')
  @HttpCode(HttpStatus.OK)
  async deleteProject(@Request() options: RequestOptions, @Param('slug') slug: string): Promise<void> {
    return this.deleteProjectUseCase.execute(slug, options.user);
  }

  @Get('/')
  @HttpCode(HttpStatus.OK)
  async listProjects(@Request() options: RequestOptions): Promise<ListProjectResponse> {
    return this.listProjectUseCase.execute(options.user);
  }

  @Get('/:slug')
  @HttpCode(HttpStatus.OK)
  async getProject(@Request() options: RequestOptions, @Param('slug') slug: string): Promise<ListProjectResponse> {
    return this.getProjectUseCase.execute(slug, options.user);
  }
}
