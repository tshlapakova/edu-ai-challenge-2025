import { Validator, ValidationResult } from '../base.js';

export class ObjectValidator extends Validator {
  constructor(schema = {}) {
    super('object');
    this.schema = schema;
    this.strictMode = false; // If true, disallow extra properties
    this.requiredKeys = new Set();
    this.forbiddenKeys = new Set();
  }

  validate(value) {
    // Type check
    if (typeof value !== 'object' || value === null || Array.isArray(value)) {
      return ValidationResult.failure(`Expected object, got ${Array.isArray(value) ? 'array' : typeof value}`);
    }

    const errors = [];
    const validatedObject = {};
    const inputKeys = new Set(Object.keys(value));

    // Check required keys
    for (const requiredKey of this.requiredKeys) {
      if (!inputKeys.has(requiredKey)) {
        errors.push(`Missing required property: ${requiredKey}`);
      }
    }

    // Check forbidden keys
    for (const forbiddenKey of this.forbiddenKeys) {
      if (inputKeys.has(forbiddenKey)) {
        errors.push(`Forbidden property: ${forbiddenKey}`);
      }
    }

    // Validate schema properties
    for (const [key, validator] of Object.entries(this.schema)) {
      if (validator && typeof validator._validate === 'function') {
        const propertyResult = validator._validate(value[key]);
        
        if (!propertyResult.isValid) {
          errors.push(`Property '${key}': ${propertyResult.errors.join(', ')}`);
        } else {
          validatedObject[key] = propertyResult.value;
        }
      } else {
        // If no validator specified, just copy the value
        validatedObject[key] = value[key];
      }
      
      inputKeys.delete(key);
    }

    // Handle extra properties
    if (this.strictMode && inputKeys.size > 0) {
      errors.push(`Unexpected properties: ${Array.from(inputKeys).join(', ')}`);
    } else if (!this.strictMode) {
      // Copy over extra properties
      for (const key of inputKeys) {
        validatedObject[key] = value[key];
      }
    }

    if (errors.length > 0) {
      return ValidationResult.failure(errors);
    }

    return ValidationResult.success(validatedObject);
  }

  // Fluent API methods
  shape(schema) {
    const newValidator = this._clone();
    newValidator.schema = { ...this.schema, ...schema };
    return newValidator;
  }

  strict() {
    const newValidator = this._clone();
    newValidator.strictMode = true;
    return newValidator;
  }

  require(...keys) {
    const newValidator = this._clone();
    newValidator.requiredKeys = new Set([...this.requiredKeys, ...keys]);
    return newValidator;
  }

  forbid(...keys) {
    const newValidator = this._clone();
    newValidator.forbiddenKeys = new Set([...this.forbiddenKeys, ...keys]);
    return newValidator;
  }

  // Convenience method for common patterns
  pick(...keys) {
    const newSchema = {};
    for (const key of keys) {
      if (this.schema[key]) {
        newSchema[key] = this.schema[key];
      }
    }
    return new ObjectValidator(newSchema);
  }

  omit(...keys) {
    const newSchema = { ...this.schema };
    for (const key of keys) {
      delete newSchema[key];
    }
    return new ObjectValidator(newSchema);
  }

  extend(additionalSchema) {
    const newValidator = this._clone();
    newValidator.schema = { ...this.schema, ...additionalSchema };
    return newValidator;
  }

  // Helper methods
  _clone() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    newValidator.schema = { ...this.schema };
    newValidator.requiredKeys = new Set([...this.requiredKeys]);
    newValidator.forbiddenKeys = new Set([...this.forbiddenKeys]);
    return newValidator;
  }
} 