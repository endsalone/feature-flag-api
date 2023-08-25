import { HttpStatus } from "@nestjs/common";
import { AccountErrorType, JsonApiError } from "common/errors.type";

export class ProfessionalAccountIncomplete implements JsonApiError {
  statusCode?: number;
  code?: string;
  detail?: string;
  source?: {
    pointer?: string;
  };

  constructor() {
    this.statusCode = HttpStatus.BAD_REQUEST;
    this.code = AccountErrorType.PROFESSIONAL_ACCOUNT_INCOMPLETE;
    this.detail = 'Professional account is incomplete';
    this.source = {};
  }
}