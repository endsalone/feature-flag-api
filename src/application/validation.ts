import { ArgumentMetadata, PipeTransform, UnprocessableEntityException } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate, ValidationError } from "class-validator";
import { JsonApiError } from "common/errors.type";

export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (metatype.name === 'String') {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const result = await validate(object);
    if (result.length > 0) {
      const errors = this.extractErrors(result);
      throw new UnprocessableEntityException(errors);
    }

    return value;
  }

  extractErrors(errors: ValidationError[]): JsonApiError[] {
    return errors.map((error) => ({
      code: Object.values(error.constraints)[0],
      source: { pointer: error.property },
    }));
  }
}