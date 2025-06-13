import { Validator, ValidationResult } from '../base.js';

export class NumberValidator extends Validator {
  constructor() {
    super('number');
    this.minValue = null;
    this.maxValue = null;
    this.integerOnly = false;
    this.positiveOnly = false;
    this.negativeOnly = false;
    this.multipleOf = null;
  }

  validate(value) {
    // Type check
    if (typeof value !== 'number') {
      return ValidationResult.failure(`Expected number, got ${typeof value}`);
    }

    // NaN check
    if (isNaN(value)) {
      return ValidationResult.failure('Value cannot be NaN');
    }

    // Infinity check
    if (!isFinite(value)) {
      return ValidationResult.failure('Value must be finite');
    }

    // Integer validation
    if (this.integerOnly && !Number.isInteger(value)) {
      return ValidationResult.failure('Value must be an integer');
    }

    // Range validations
    if (this.minValue !== null && value < this.minValue) {
      return ValidationResult.failure(
        `Value must be at least ${this.minValue}, got ${value}`
      );
    }

    if (this.maxValue !== null && value > this.maxValue) {
      return ValidationResult.failure(
        `Value must be at most ${this.maxValue}, got ${value}`
      );
    }

    // Sign validations
    if (this.positiveOnly && value <= 0) {
      return ValidationResult.failure('Value must be positive');
    }

    if (this.negativeOnly && value >= 0) {
      return ValidationResult.failure('Value must be negative');
    }

    // Multiple validation
    if (this.multipleOf !== null && value % this.multipleOf !== 0) {
      return ValidationResult.failure(
        `Value must be a multiple of ${this.multipleOf}`
      );
    }

    return ValidationResult.success(value);
  }

  // Fluent API methods
  min(value) {
    const newValidator = this._clone();
    newValidator.minValue = value;
    return newValidator;
  }

  max(value) {
    const newValidator = this._clone();
    newValidator.maxValue = value;
    return newValidator;
  }

  range(min, max) {
    const newValidator = this._clone();
    newValidator.minValue = min;
    newValidator.maxValue = max;
    return newValidator;
  }

  integer() {
    const newValidator = this._clone();
    newValidator.integerOnly = true;
    return newValidator;
  }

  positive() {
    const newValidator = this._clone();
    newValidator.positiveOnly = true;
    return newValidator;
  }

  negative() {
    const newValidator = this._clone();
    newValidator.negativeOnly = true;
    return newValidator;
  }

  multiple(divisor) {
    const newValidator = this._clone();
    newValidator.multipleOf = divisor;
    return newValidator;
  }

  // Convenience methods for common validations
  port() {
    return this.integer().range(1, 65535);
  }

  percentage() {
    return this.range(0, 100);
  }

  // Helper methods
  _clone() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    return newValidator;
  }
} 