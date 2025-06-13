/**
 * TypeScript declarations for the Robust Validation Library
 * Provides type safety and better IDE support
 */

/**
 * Represents the result of a validation operation
 */
export interface ValidationResult<T = any> {
  /** Whether the validation passed */
  isValid: boolean;
  /** The validated value (undefined if invalid) */
  value: T | undefined;
  /** Array of error messages */
  errors: string[];
}

/**
 * Base validator interface
 */
export interface Validator<T = any> {
  /** Name of the validator for error messages */
  name: string;
  /** Whether undefined values are allowed */
  optional: boolean;
  /** Whether null values are allowed */
  nullable: boolean;
  /** Array of custom validation functions */
  customValidators: Array<{
    validator: (value: T) => boolean;
    message: string;
  }>;

  /** Core validation method */
  validate(value: any): ValidationResult<T>;
  /** Makes this validator accept undefined values */
  makeOptional(): this;
  /** Makes this validator accept null values */
  makeNullable(): this;
  /** Adds a custom validation function */
  addCustom(validator: (value: T) => boolean, message?: string): this;
  /** Internal validation pipeline */
  _validate(value: any): ValidationResult<T>;
}

/**
 * String validator interface
 */
export interface StringValidator extends Validator<string> {
  /** Sets minimum length */
  min(length: number): this;
  /** Sets maximum length */
  max(length: number): this;
  /** Sets exact length or length range */
  length(min: number, max?: number): this;
  /** Sets regex pattern to match */
  matches(pattern: RegExp | string, flags?: string): this;
  /** Validates email format */
  email(): this;
  /** Validates URL format */
  url(): this;
  /** Validates UUID format */
  uuid(): this;
  /** Validates alphanumeric characters only */
  alphanum(): this;
  /** Validates numeric characters only */
  numeric(): this;
}

/**
 * Number validator interface
 */
export interface NumberValidator extends Validator<number> {
  /** Sets minimum value */
  min(value: number): this;
  /** Sets maximum value */
  max(value: number): this;
  /** Sets value range */
  range(min: number, max: number): this;
  /** Requires integer values */
  integer(): this;
  /** Requires positive values (> 0) */
  positive(): this;
  /** Requires negative values (< 0) */
  negative(): this;
  /** Requires value to be multiple of divisor */
  multiple(divisor: number): this;
  /** Validates port number (1-65535) */
  port(): this;
  /** Validates percentage (0-100) */
  percentage(): this;
}

/**
 * Boolean validator interface
 */
export interface BooleanValidator extends Validator<boolean> {
  /** Requires value to be true */
  true(): this;
  /** Requires value to be false */
  false(): this;
}

/**
 * Array validator interface
 */
export interface ArrayValidator<T = any> extends Validator<T[]> {
  /** Sets validator for array elements */
  of<U>(elementValidator: Validator<U>): ArrayValidator<U>;
  /** Sets minimum array length */
  min(length: number): this;
  /** Sets maximum array length */
  max(length: number): this;
  /** Sets array length or length range */
  length(min: number, max?: number): this;
  /** Requires all elements to be unique */
  unique(): this;
  /** Requires non-empty array */
  nonempty(): this;
}

/**
 * Object validator interface
 */
export interface ObjectValidator<T = Record<string, any>> extends Validator<T> {
  /** Sets object schema */
  shape<U extends Record<string, Validator>>(schema: U): ObjectValidator<{
    [K in keyof U]: U[K] extends Validator<infer V> ? V : never;
  }>;
  /** Enables strict mode (no extra properties) */
  strict(): this;
  /** Marks keys as required */
  require<K extends keyof T>(...keys: K[]): this;
  /** Marks keys as forbidden */
  forbid<K extends keyof T>(...keys: K[]): this;
  /** Creates validator with only specified keys */
  pick<K extends keyof T>(...keys: K[]): ObjectValidator<Pick<T, K>>;
  /** Creates validator excluding specified keys */
  omit<K extends keyof T>(...keys: K[]): ObjectValidator<Omit<T, K>>;
  /** Extends schema with additional properties */
  extend<U extends Record<string, Validator>>(additionalSchema: U): ObjectValidator<T & {
    [K in keyof U]: U[K] extends Validator<infer V> ? V : never;
  }>;
}

/**
 * Schema validation result
 */
export interface SchemaValidationResult<T = Record<string, any>> {
  /** Whether the entire schema validation passed */
  isValid: boolean;
  /** Individual validation results for each property */
  results: Record<string, ValidationResult>;
  /** Array of all error messages */
  errors: string[];
  /** Validated data (undefined if invalid) */
  data: T | undefined;
}

// Factory functions
/**
 * Creates a new string validator
 */
export function string(): StringValidator;

/**
 * Creates a new number validator
 */
export function number(): NumberValidator;

/**
 * Creates a new boolean validator
 */
export function boolean(): BooleanValidator;

/**
 * Creates a new array validator
 */
export function array<T = any>(elementValidator?: Validator<T>): ArrayValidator<T>;

/**
 * Creates a new object validator
 */
export function object<T extends Record<string, Validator>>(schema?: T): ObjectValidator<{
  [K in keyof T]: T[K] extends Validator<infer V> ? V : never;
}>;

// Utility functions
/**
 * Validates data against a validator
 */
export function validate<T>(data: any, validator: Validator<T>): ValidationResult<T>;

/**
 * Validates data against an object schema
 */
export function validateSchema<T extends Record<string, Validator>>(
  data: any,
  schema: T
): SchemaValidationResult<{
  [K in keyof T]: T[K] extends Validator<infer V> ? V : never;
}>;

// Quick helper functions
/**
 * Quick validation helper - returns boolean
 */
export function isValid<T>(data: any, validator: Validator<T>): boolean;

/**
 * Get validation errors as array
 */
export function getErrors<T>(data: any, validator: Validator<T>): string[];

// Base classes (for advanced usage)
export class ValidationResult<T = any> {
  constructor(isValid: boolean, value: T | undefined, errors?: string[]);
  static success<T>(value: T): ValidationResult<T>;
  static failure<T>(errors: string | string[], value?: T): ValidationResult<T>;
}

export abstract class Validator<T = any> {
  constructor(name?: string);
  abstract validate(value: any): ValidationResult<T>;
  makeOptional(): this;
  makeNullable(): this;
  addCustom(validator: (value: T) => boolean, message?: string): this;
  _validate(value: any): ValidationResult<T>;
}

// Specific validator classes (for advanced usage)
export class StringValidator extends Validator<string> {
  min(length: number): this;
  max(length: number): this;
  length(min: number, max?: number): this;
  matches(pattern: RegExp | string, flags?: string): this;
  email(): this;
  url(): this;
  uuid(): this;
  alphanum(): this;
  numeric(): this;
}

export class NumberValidator extends Validator<number> {
  min(value: number): this;
  max(value: number): this;
  range(min: number, max: number): this;
  integer(): this;
  positive(): this;
  negative(): this;
  multiple(divisor: number): this;
  port(): this;
  percentage(): this;
}

export class BooleanValidator extends Validator<boolean> {
  true(): this;
  false(): this;
}

export class ArrayValidator<T = any> extends Validator<T[]> {
  of<U>(elementValidator: Validator<U>): ArrayValidator<U>;
  min(length: number): this;
  max(length: number): this;
  length(min: number, max?: number): this;
  unique(): this;
  nonempty(): this;
}

export class ObjectValidator<T = Record<string, any>> extends Validator<T> {
  shape<U extends Record<string, Validator>>(schema: U): ObjectValidator<{
    [K in keyof U]: U[K] extends Validator<infer V> ? V : never;
  }>;
  strict(): this;
  require<K extends keyof T>(...keys: K[]): this;
  forbid<K extends keyof T>(...keys: K[]): this;
  pick<K extends keyof T>(...keys: K[]): ObjectValidator<Pick<T, K>>;
  omit<K extends keyof T>(...keys: K[]): ObjectValidator<Omit<T, K>>;
  extend<U extends Record<string, Validator>>(additionalSchema: U): ObjectValidator<T & {
    [K in keyof U]: U[K] extends Validator<infer V> ? V : never;
  }>;
} 