import { HttpStatus } from '@nestjs/common';
import { JsonApiError, ProjectErrorType } from 'common/errors.type';

export class ProjectDoesNotExistException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.NOT_FOUND;
    this.code = ProjectErrorType.PROJECT_DOES_NOT_EXIST;
    this.detail = 'Project does not exist';
    this.source = { pointer: 'id' };
  }
}
