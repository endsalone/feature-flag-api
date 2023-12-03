import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { ProjectDoesNotExistException } from 'modules/project/domain/exception/project-not-exists';
import { ProjectService } from 'modules/project/domain/project.service';
import { Observable } from 'rxjs';

@Injectable()
export class EnvironmentInterceptor implements NestInterceptor {
  constructor(private readonly projectService: ProjectService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const projectSlug = context.switchToHttp().getRequest().params.slug;
    if (!projectSlug) {
      return next.handle();
    }

    const account = context.switchToHttp().getRequest().user;
    if (!account) {
      return next.handle();
    }

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
