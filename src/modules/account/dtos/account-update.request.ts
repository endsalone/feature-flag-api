import { IsEmail, IsString, Length } from 'class-validator';
import { ErrorType } from 'common/errors.type';

export class AccountUpdateRequest {
  @Length(1, 120, { message: ErrorType.LENGTH })
  @IsString({ message: ErrorType.IS_NOT_STRING })
  name: string;

  @IsEmail({}, { message: ErrorType.IS_NOT_EMAIL })
  email: string;
}
