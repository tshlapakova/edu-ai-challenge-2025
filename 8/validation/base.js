/**
 * Base classes for validation system
 * Separated to avoid circular imports
 */

/**
 * Represents the result of a validation operation
 * @class ValidationResult
 * @example
 * const result = ValidationResult.success('valid data');
 * console.log(result.isValid); // true
 * console.log(result.value);   // 'valid data'
 * console.log(result.errors);  // []
 */
export class ValidationResult {
  /**
   * Creates a ValidationResult instance
   * @param {boolean} isValid - Whether the validation passed
   * @param {*} value - The validated value (undefined if invalid)
   * @param {string[]} errors - Array of error messages
   */
  constructor(isValid, value, errors = []) {
    this.isValid = isValid;
    this.value = value;
    this.errors = errors;
  }

  /**
   * Creates a successful validation result
   * @param {*} value - The validated value
   * @returns {ValidationResult} Success result with the value
   * @static
   * @example
   * const result = ValidationResult.success('hello');
   * console.log(result.isValid); // true
   */
  static success(value) {
    return new ValidationResult(true, value, []);
  }

  /**
   * Creates a failed validation result
   * @param {string|string[]} errors - Error message(s)
   * @param {*} [value] - Optional value that failed validation
   * @returns {ValidationResult} Failure result with errors
   * @static
   * @example
   * const result = ValidationResult.failure('Invalid input');
   * console.log(result.isValid); // false
   * console.log(result.errors);  // ['Invalid input']
   */
  static failure(errors, value = undefined) {
    const errorArray = Array.isArray(errors) ? errors : [errors];
    return new ValidationResult(false, value, errorArray);
  }
}

/**
 * Base validator class that all specific validators extend
 * Provides common functionality like optional/nullable handling and custom validators
 * @class Validator
 * @abstract
 * @example
 * // Don't instantiate directly, use specific validators like StringValidator
 * const validator = string().min(5).makeOptional();
 */
export class Validator {
  /**
   * Creates a Validator instance
   * @param {string} [name='unknown'] - Name of the validator for error messages
   */
  constructor(name = 'unknown') {
    /** @type {string} Name used in error messages */
    this.name = name;
    /** @type {boolean} Whether undefined values are allowed */
    this.optional = false;
    /** @type {boolean} Whether null values are allowed */
    this.nullable = false;
    /** @type {Array<{validator: Function, message: string}>} Custom validation functions */
    this.customValidators = [];
  }

  /**
   * Core validation method - must be implemented by subclasses
   * @param {*} value - Value to validate
   * @returns {ValidationResult} Validation result
   * @abstract
   * @throws {Error} If not implemented by subclass
   */
  validate(value) {
    throw new Error('validate method must be implemented by subclasses');
  }

  /**
   * Makes this validator accept undefined values
   * @returns {Validator} New validator instance that accepts undefined
   * @example
   * const validator = string().makeOptional();
   * const result = validate(undefined, validator); // passes
   */
  makeOptional() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    newValidator.optional = true;
    return newValidator;
  }

  /**
   * Makes this validator accept null values
   * @returns {Validator} New validator instance that accepts null
   * @example
   * const validator = string().makeNullable();
   * const result = validate(null, validator); // passes
   */
  makeNullable() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    newValidator.nullable = true;
    return newValidator;
  }

  /**
   * Adds a custom validation function
   * @param {Function} validator - Function that returns true if valid
   * @param {string} [message] - Custom error message
   * @returns {Validator} New validator instance with the custom validator
   * @example
   * const validator = string().addCustom(
   *   (value) => value.includes('@'),
   *   'Must contain @ symbol'
   * );
   */
  addCustom(validator, message) {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    newValidator.customValidators = [...this.customValidators, { validator, message }];
    return newValidator;
  }

  /**
   * Internal validation pipeline that handles optional/nullable logic
   * and runs custom validators
   * @param {*} value - Value to validate
   * @returns {ValidationResult} Validation result
   * @private
   */
  _validate(value) {
    // Handle undefined values
    if (value === undefined) {
      if (this.optional) {
        return ValidationResult.success(value);
      }
      return ValidationResult.failure(`${this.name} is required`);
    }

    // Handle null values
    if (value === null) {
      if (this.nullable) {
        return ValidationResult.success(value);
      }
      return ValidationResult.failure(`${this.name} cannot be null`);
    }

    // Run type-specific validation
    const typeResult = this.validate(value);
    if (!typeResult.isValid) {
      return typeResult;
    }

    // Run custom validators
    for (const { validator, message } of this.customValidators) {
      try {
        if (!validator(typeResult.value)) {
          return ValidationResult.failure(message || `${this.name} failed custom validation`);
        }
      } catch (error) {
        return ValidationResult.failure(`${this.name} custom validation error: ${error.message}`);
      }
    }

    return typeResult;
  }
} 