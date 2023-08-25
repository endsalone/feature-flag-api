import { HttpStatus } from '@nestjs/common';
import { JsonApiError, ProjectErrorType } from 'common/errors.type';

export class ProjectAlreadyExistsException implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = ProjectErrorType.PROJECT_ALREADY_EXISTS;
    this.detail = 'Project already exists';
    this.source = { pointer: 'name' };
  }
}
