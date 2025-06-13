import { Validator, ValidationResult } from '../base.js';

export class ArrayValidator extends Validator {
  constructor(elementValidator = null) {
    super('array');
    this.elementValidator = elementValidator;
    this.minLength = null;
    this.maxLength = null;
    this.uniqueElements = false;
  }

  validate(value) {
    // Type check
    if (!Array.isArray(value)) {
      return ValidationResult.failure(`Expected array, got ${typeof value}`);
    }

    // Length validations
    if (this.minLength !== null && value.length < this.minLength) {
      return ValidationResult.failure(
        `Array must have at least ${this.minLength} elements, got ${value.length}`
      );
    }

    if (this.maxLength !== null && value.length > this.maxLength) {
      return ValidationResult.failure(
        `Array must have at most ${this.maxLength} elements, got ${value.length}`
      );
    }

    // Unique elements validation
    if (this.uniqueElements) {
      const seen = new Set();
      for (let i = 0; i < value.length; i++) {
        const element = value[i];
        const key = typeof element === 'object' && element !== null 
          ? JSON.stringify(element) 
          : element;
        
        if (seen.has(key)) {
          return ValidationResult.failure(`Duplicate element found at index ${i}`);
        }
        seen.add(key);
      }
    }

    // Element validation
    if (this.elementValidator) {
      const validatedElements = [];
      const errors = [];

      for (let i = 0; i < value.length; i++) {
        const elementResult = this.elementValidator._validate(value[i]);
        
        if (!elementResult.isValid) {
          errors.push(`Element at index ${i}: ${elementResult.errors.join(', ')}`);
        } else {
          validatedElements.push(elementResult.value);
        }
      }

      if (errors.length > 0) {
        return ValidationResult.failure(errors);
      }

      return ValidationResult.success(validatedElements);
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

  unique() {
    const newValidator = this._clone();
    newValidator.uniqueElements = true;
    return newValidator;
  }

  of(elementValidator) {
    const newValidator = this._clone();
    newValidator.elementValidator = elementValidator;
    return newValidator;
  }

  // Convenience methods
  nonempty() {
    return this.min(1);
  }

  // Helper methods
  _clone() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    return newValidator;
  }
} 