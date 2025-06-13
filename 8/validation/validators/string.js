import { Validator, ValidationResult } from '../base.js';

export class StringValidator extends Validator {
  constructor() {
    super('string');
    this.minLength = null;
    this.maxLength = null;
    this.pattern = null;
    this.formats = [];
  }

  validate(value) {
    // Type check
    if (typeof value !== 'string') {
      return ValidationResult.failure(`Expected string, got ${typeof value}`);
    }

    // Length validations
    if (this.minLength !== null && value.length < this.minLength) {
      return ValidationResult.failure(
        `String must be at least ${this.minLength} characters long, got ${value.length}`
      );
    }

    if (this.maxLength !== null && value.length > this.maxLength) {
      return ValidationResult.failure(
        `String must be at most ${this.maxLength} characters long, got ${value.length}`
      );
    }

    // Pattern validation
    if (this.pattern && !this.pattern.test(value)) {
      return ValidationResult.failure(`String does not match required pattern`);
    }

    // Format validations
    for (const format of this.formats) {
      const formatResult = this._validateFormat(value, format);
      if (!formatResult.isValid) {
        return formatResult;
      }
    }

    return ValidationResult.success(value);
  }

  // Fluent API methods
  min(length) {
    const newValidator = this._clone();
    newValidator.minLength = length;
    return newValidator;
  }

  max(length) {
    const newValidator = this._clone();
    newValidator.maxLength = length;
    return newValidator;
  }

  length(min, max = min) {
    const newValidator = this._clone();
    newValidator.minLength = min;
    newValidator.maxLength = max;
    return newValidator;
  }

  matches(pattern, flags) {
    const newValidator = this._clone();
    newValidator.pattern = pattern instanceof RegExp ? pattern : new RegExp(pattern, flags);
    return newValidator;
  }

  email() {
    const newValidator = this._clone();
    newValidator.formats = [...this.formats, 'email'];
    return newValidator;
  }

  url() {
    const newValidator = this._clone();
    newValidator.formats = [...this.formats, 'url'];
    return newValidator;
  }

  uuid() {
    const newValidator = this._clone();
    newValidator.formats = [...this.formats, 'uuid'];
    return newValidator;
  }

  alphanum() {
    const newValidator = this._clone();
    newValidator.formats = [...this.formats, 'alphanum'];
    return newValidator;
  }

  numeric() {
    const newValidator = this._clone();
    newValidator.formats = [...this.formats, 'numeric'];
    return newValidator;
  }

  // Helper methods
  _clone() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    newValidator.formats = [...this.formats];
    return newValidator;
  }

  _validateFormat(value, format) {
    const formats = {
      email: {
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: 'Invalid email format'
      },
      url: {
        pattern: /^https?:\/\/.+/,
        message: 'Invalid URL format'
      },
      uuid: {
        pattern: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
        message: 'Invalid UUID format'
      },
      alphanum: {
        pattern: /^[a-zA-Z0-9]+$/,
        message: 'String must contain only alphanumeric characters'
      },
      numeric: {
        pattern: /^\d+$/,
        message: 'String must contain only numeric characters'
      }
    };

    const formatConfig = formats[format];
    if (!formatConfig) {
      return ValidationResult.failure(`Unknown format: ${format}`);
    }

    if (!formatConfig.pattern.test(value)) {
      return ValidationResult.failure(formatConfig.message);
    }

    return ValidationResult.success(value);
  }
} 