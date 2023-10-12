import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class OrganizationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    return next.handle();
    // const organizationHash = context.switchToHttp().getRequest().params.organizationHash;
    // if (!organizationHash) {
    //   throw new Error('Organization hash not found');
    // }
  }
  // use(req: any, res: any, next: () => void): void {
  //   // get organization slug from request params
  //   // extract the params from the url
  //   const [organizationSlug] = req.originalUrl.split('/');
  //   next();
  // }
}
