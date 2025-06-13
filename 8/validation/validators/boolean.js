import { Validator, ValidationResult } from '../base.js';

export class BooleanValidator extends Validator {
  constructor() {
    super('boolean');
    this.mustBeTrue = false;
    this.mustBeFalse = false;
  }

  validate(value) {
    // Type check
    if (typeof value !== 'boolean') {
      return ValidationResult.failure(`Expected boolean, got ${typeof value}`);
    }

    // Value constraints
    if (this.mustBeTrue && value !== true) {
      return ValidationResult.failure('Value must be true');
    }

    if (this.mustBeFalse && value !== false) {
      return ValidationResult.failure('Value must be false');
    }

    return ValidationResult.success(value);
  }

  // Fluent API methods
  true() {
    const newValidator = this._clone();
    newValidator.mustBeTrue = true;
    return newValidator;
  }

  false() {
    const newValidator = this._clone();
    newValidator.mustBeFalse = true;
    return newValidator;
  }

  // Helper methods
  _clone() {
    const newValidator = Object.create(Object.getPrototypeOf(this));
    Object.assign(newValidator, this);
    return newValidator;
  }
} 