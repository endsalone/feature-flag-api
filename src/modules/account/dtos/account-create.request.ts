import { IsEmail, IsEnum, IsString, Length } from 'class-validator';
import { ErrorType } from 'common/errors.type';
import { ACCOUNT_TYPE } from 'modules/account/domain/account.type';

export class AccountCreateRequest {
  @Length(1, 120, { message: ErrorType.LENGTH })
  @IsString({ message: ErrorType.IS_NOT_STRING })
  name: string;

  @IsEmail({}, { message: ErrorType.IS_NOT_EMAIL })
  email: string;

  @IsString({ message: ErrorType.IS_NOT_STRING })
  password: string;

  @IsEnum(ACCOUNT_TYPE, { message: ErrorType.IS_NOT_TYPE })
  type: ACCOUNT_TYPE;
}
