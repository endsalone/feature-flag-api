import { Variation } from 'modules/feature/domain/variation';

export enum TargetingRuleType {
  USER = 'USER',
  EMAIL = 'EMAIL',
  COUNTRY = 'COUNTRY',
  CONTINENT = 'CONTINENT',
  REGION = 'REGION',
  CITY = 'CITY',
  BROWSER = 'BROWSER',
  DEVICE = 'DEVICE',
  OS = 'OS',
  PLATFORM = 'PLATFORM',
  LANGUAGE = 'LANGUAGE',
  REFERRER = 'REFERRER',
  URL = 'URL',
  PAGE = 'PAGE',
  TIME = 'TIME',
  DATE = 'DATE',
  HOUR = 'HOUR',
  DAY = 'DAY',
  MONTH = 'MONTH',
  YEAR = 'YEAR',
  CUSTOM_ATTRIBUTE = 'CUSTOM_ATTRIBUTE'
}

export enum TargetingRuleOperator {
  EQUALS = 'EQUALS',
  NOT_EQUALS = 'NOT_EQUALS',
  CONTAINS = 'CONTAINS',
  NOT_CONTAINS = 'NOT_CONTAINS',
  STARTS_WITH = 'STARTS_WITH',
  ENDS_WITH = 'ENDS_WITH',
  GREATER_THAN = 'GREATER_THAN',
  GREATER_THAN_OR_EQUALS = 'GREATER_THAN_OR_EQUALS',
  LESS_THAN = 'LESS_THAN',
  LESS_THAN_OR_EQUALS = 'LESS_THAN_OR_EQUALS',
  IN = 'IN',
  NOT_IN = 'NOT_IN',
  MATCHES_REGEX = 'MATCHES_REGEX',
  NOT_MATCHES_REGEX = 'NOT_MATCHES_REGEX',
  EXISTS = 'EXISTS',
  NOT_EXISTS = 'NOT_EXISTS'
}

export interface TargetingRuleDefinition {
  key: string;
  value: string;
  operator: TargetingRuleOperator;
}

export interface TargetingRule {
  id: number;
  name: string;
  definition: TargetingRuleDefinition[];
  serve: Variation;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
