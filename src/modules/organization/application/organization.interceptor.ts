import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { castWithObfuscation } from 'common/casting';
import { OrganizationDoesNotExistException } from 'modules/organization/domain/exception/organization-does-not-exist';
import { OrganizationService } from 'modules/organization/domain/organization.service';
import { OrganizationInterceptorDto } from 'modules/organization/dtos/organization.interceptor.dto';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizationInterceptor implements NestInterceptor {
  constructor(private readonly organizationService: OrganizationService) {}

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const organizationHash = context.switchToHttp().getRequest().params.organizationHash;
    if (!organizationHash) {
      return next.handle();
    }

    const accountId = context.switchToHttp().getRequest().user.id;
    const organization = await this.organizationService.findOneByHashAndAccount(organizationHash, accountId);
    if (!organization) {
      throw new OrganizationDoesNotExistException();
    }

    const orgazationObduscated = castWithObfuscation(OrganizationInterceptorDto, organization);
    context.switchToHttp().getRequest().user.organization = orgazationObduscated;

    return next.handle();
  }
}
