import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';
import { Observable } from 'rxjs';

@Injectable()
export class ProjectInterceptor implements NestInterceptor {
  constructor(private readonly projectService: ProjectService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const hasOrganization = context.switchToHttp().getRequest().user.organization;
    if (!hasOrganization) {
      return next.handle();
    }

    const projectSlug = context.switchToHttp().getRequest().params.projectSlug;
    if (!projectSlug) {
      return next.handle();
    }

    const featureKey = context.switchToHttp().getRequest().params.featureKey;
    if (!featureKey) {
      return next.handle();
    }

    const account = context.switchToHttp().getRequest().user;

    const project = await this.projectService.findOneBySlugAndAccountAndOrganization(
      `'${projectSlug}'`,
      account.id,
      account.organization.id
    );
    if (!project) {
      throw new ProjectDoesNotExistException();
    }

    context.switchToHttp().getRequest().user.project = project;

    return next.handle();
  }
}
