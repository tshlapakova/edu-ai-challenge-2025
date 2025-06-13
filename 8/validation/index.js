/**
 * Robust Validation Library for JavaScript
 * Provides type-safe validation for primitive and complex data structures
 * 
 * @module ValidationLibrary
 * @version 1.0.0
 * @author Validation Library Development Team
 * @example
 * import { string, number, object, validate } from './validation/index.js';
 * 
 * const userValidator = object({
 *   name: string().min(1),
 *   age: number().min(0).integer()
 * });
 * 
 * const result = validate({ name: 'John', age: 25 }, userValidator);
 */

// Export base classes
export { ValidationResult, Validator } from './base.js';

// Import validator classes
import { StringValidator } from './validators/string.js';
import { NumberValidator } from './validators/number.js';
import { BooleanValidator } from './validators/boolean.js';
import { ArrayValidator } from './validators/array.js';
import { ObjectValidator } from './validators/object.js';

// Export all validator types
export { StringValidator, NumberValidator, BooleanValidator, ArrayValidator, ObjectValidator };

/**
 * Creates a new string validator
 * @returns {StringValidator} String validator instance
 * @example
 * const validator = string().min(5).max(100).email();
 * const result = validate('user@example.com', validator);
 */
export const string = () => new StringValidator();

/**
 * Creates a new number validator
 * @returns {NumberValidator} Number validator instance
 * @example
 * const validator = number().min(0).max(100).integer();
 * const result = validate(42, validator);
 */
export const number = () => new NumberValidator();

/**
 * Creates a new boolean validator
 * @returns {BooleanValidator} Boolean validator instance
 * @example
 * const validator = boolean().true();
 * const result = validate(true, validator);
 */
export const boolean = () => new BooleanValidator();

/**
 * Creates a new array validator
 * @param {Validator} [elementValidator] - Optional validator for array elements
 * @returns {ArrayValidator} Array validator instance
 * @example
 * const validator = array().of(string()).min(1).unique();
 * const result = validate(['a', 'b', 'c'], validator);
 */
export const array = (elementValidator) => new ArrayValidator(elementValidator);

/**
 * Creates a new object validator
 * @param {Object<string, Validator>} [schema] - Object schema with property validators
 * @returns {ObjectValidator} Object validator instance
 * @example
 * const validator = object({
 *   name: string().min(1),
 *   age: number().min(0)
 * });
 * const result = validate({ name: 'John', age: 25 }, validator);
 */
export const object = (schema) => new ObjectValidator(schema);

/**
 * Validates data against a validator
 * @param {*} data - Data to validate
 * @param {Validator} validator - Validator instance to use
 * @returns {ValidationResult} Validation result with isValid, value, and errors
 * @throws {Error} If validator is invalid
 * @example
 * const result = validate('hello@example.com', string().email());
 * if (result.isValid) {
 *   console.log('Valid email:', result.value);
 * } else {
 *   console.log('Errors:', result.errors);
 * }
 */
export const validate = (data, validator) => {
  if (!validator || typeof validator._validate !== 'function') {
    throw new Error('Invalid validator provided');
  }
  return validator._validate(data);
};

/**
 * Validates data against an object schema
 * @param {Object} data - Data object to validate
 * @param {Object<string, Validator>} schema - Schema object with property validators
 * @returns {Object} Validation result with isValid, results, errors, and data
 * @throws {Error} If schema is not a valid object
 * @example
 * const schema = {
 *   name: string().min(1),
 *   age: number().min(18)
 * };
 * 
 * const result = validateSchema({ name: 'John', age: 25 }, schema);
 * if (result.isValid) {
 *   console.log('Valid data:', result.data);
 * } else {
 *   console.log('Validation errors:', result.errors);
 * }
 */
export const validateSchema = (data, schema) => {
  if (typeof schema !== 'object' || schema === null) {
    throw new Error('Schema must be a valid object');
  }

  const results = {};
  const errors = [];

  for (const [key, validator] of Object.entries(schema)) {
    const result = validate(data[key], validator);
    results[key] = result;
    
    if (!result.isValid) {
      errors.push(...result.errors.map(error => `${key}: ${error}`));
    }
  }

  return {
    isValid: errors.length === 0,
    results,
    errors,
    data: errors.length === 0 ? Object.fromEntries(
      Object.entries(results).map(([key, result]) => [key, result.value])
    ) : undefined
  };
}; 