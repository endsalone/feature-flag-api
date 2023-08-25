import { ClassConstructor, plainToClass } from 'class-transformer';

export function castWithObfuscation<T, V>(classDestination: ClassConstructor<T>, objectOrigin: V): T {
  return plainToClass(classDestination, objectOrigin, { excludeExtraneousValues: true });
}

export function castWithoutObfuscation<T, V>(classDestination: ClassConstructor<T>, objectOrigin: V): T {
  return plainToClass(classDestination, objectOrigin, { ignoreDecorators: true });
}
