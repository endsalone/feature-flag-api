import { BadRequestException, CallHandler, ExecutionContext, HttpStatus, Injectable, NestInterceptor, NotFoundException, NotImplementedException, UnauthorizedException, UnprocessableEntityException } from "@nestjs/common";
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ExcpetionsInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        switch (error.statusCode ?? error.status) {
          case HttpStatus.UNPROCESSABLE_ENTITY:
            throw new UnprocessableEntityException(error, error.message);
          case HttpStatus.BAD_REQUEST:
            throw new BadRequestException(error);
          case HttpStatus.UNAUTHORIZED:
            throw new UnauthorizedException();
          case HttpStatus.NOT_FOUND:
            throw new NotFoundException(error);
          default:
            throw new NotImplementedException(error);
        }
      }));
  }
}