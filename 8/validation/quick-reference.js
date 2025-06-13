/**
 * Quick Reference Guide - Inline Examples for All Validators
 * Copy and paste these examples directly into your code!
 */

import { string, number, boolean, array, object, validate } from './index.js';

// ==========================================
// STRING VALIDATOR EXAMPLES
// ==========================================

// Basic string validation
const nameValidator = string();
// validate('John', nameValidator) → ✅ passes

// Length constraints
const usernameValidator = string().min(3).max(20);
// validate('john_doe', usernameValidator) → ✅ passes
// validate('jo', usernameValidator) → ❌ fails (too short)

// Email validation
const emailValidator = string().email();
// validate('user@example.com', emailValidator) → ✅ passes
// validate('invalid-email', emailValidator) → ❌ fails

// URL validation
const urlValidator = string().url();
// validate('https://example.com', urlValidator) → ✅ passes
// validate('not-a-url', urlValidator) → ❌ fails

// UUID validation
const uuidValidator = string().uuid();
// validate('123e4567-e89b-12d3-a456-426614174000', uuidValidator) → ✅ passes

// Pattern matching
const phoneValidator = string().matches(/^\d{3}-\d{3}-\d{4}$/);
// validate('123-456-7890', phoneValidator) → ✅ passes

// Alphanumeric only
const codeValidator = string().alphanum();
// validate('ABC123', codeValidator) → ✅ passes
// validate('ABC-123', codeValidator) → ❌ fails (contains hyphen)

// Numeric string
const numericStringValidator = string().numeric();
// validate('12345', numericStringValidator) → ✅ passes
// validate('123a5', numericStringValidator) → ❌ fails

// Optional string
const bioValidator = string().makeOptional();
// validate(undefined, bioValidator) → ✅ passes
// validate('Software developer', bioValidator) → ✅ passes

// Nullable string
const middleNameValidator = string().makeNullable();
// validate(null, middleNameValidator) → ✅ passes
// validate('Jane', middleNameValidator) → ✅ passes

// ==========================================
// NUMBER VALIDATOR EXAMPLES
// ==========================================

// Basic number validation
const priceValidator = number();
// validate(29.99, priceValidator) → ✅ passes
// validate('29.99', priceValidator) → ❌ fails (string)

// Range validation
const ageValidator = number().min(0).max(120);
// validate(25, ageValidator) → ✅ passes
// validate(-5, ageValidator) → ❌ fails (too low)

// Integer only
const countValidator = number().integer();
// validate(42, countValidator) → ✅ passes
// validate(42.5, countValidator) → ❌ fails (not integer)

// Positive numbers only
const scoreValidator = number().positive();
// validate(100, scoreValidator) → ✅ passes
// validate(0, scoreValidator) → ❌ fails (not positive)

// Port number validation
const portValidator = number().port();
// validate(8080, portValidator) → ✅ passes
// validate(70000, portValidator) → ❌ fails (too high)

// Percentage validation
const percentageValidator = number().percentage();
// validate(75, percentageValidator) → ✅ passes
// validate(150, percentageValidator) → ❌ fails (over 100)

// Multiple validation
const evenValidator = number().multiple(2);
// validate(8, evenValidator) → ✅ passes
// validate(9, evenValidator) → ❌ fails (not even)

// ==========================================
// BOOLEAN VALIDATOR EXAMPLES
// ==========================================

// Basic boolean validation
const isActiveValidator = boolean();
// validate(true, isActiveValidator) → ✅ passes
// validate('true', isActiveValidator) → ❌ fails (string)

// Must be true
const termsValidator = boolean().true();
// validate(true, termsValidator) → ✅ passes
// validate(false, termsValidator) → ❌ fails

// Must be false
const disabledValidator = boolean().false();
// validate(false, disabledValidator) → ✅ passes
// validate(true, disabledValidator) → ❌ fails

// ==========================================
// ARRAY VALIDATOR EXAMPLES
// ==========================================

// Basic array validation
const listValidator = array();
// validate([1, 2, 3], listValidator) → ✅ passes
// validate('not array', listValidator) → ❌ fails

// Array with element validation
const stringArrayValidator = array().of(string());
// validate(['a', 'b', 'c'], stringArrayValidator) → ✅ passes
// validate(['a', 123, 'c'], stringArrayValidator) → ❌ fails (number in array)

// Array length constraints
const tagsValidator = array().min(1).max(5);
// validate(['tag1', 'tag2'], tagsValidator) → ✅ passes
// validate([], tagsValidator) → ❌ fails (empty)

// Unique elements only
const uniqueNumbersValidator = array().of(number()).unique();
// validate([1, 2, 3], uniqueNumbersValidator) → ✅ passes
// validate([1, 2, 2], uniqueNumbersValidator) → ❌ fails (duplicate)

// Non-empty array
const categoriesValidator = array().nonempty();
// validate(['tech', 'gaming'], categoriesValidator) → ✅ passes
// validate([], categoriesValidator) → ❌ fails (empty)

// Nested array validation
const matrixValidator = array().of(array().of(number()));
// validate([[1, 2], [3, 4]], matrixValidator) → ✅ passes

// ==========================================
// OBJECT VALIDATOR EXAMPLES
// ==========================================

// Basic object validation
const personValidator = object({
  name: string().min(1),
  age: number().min(0)
});
// validate({ name: 'John', age: 25 }, personValidator) → ✅ passes

// Nested object validation
const addressValidator = object({
  street: string(),
  city: string(),
  coordinates: object({
    lat: number(),
    lng: number()
  })
});

// Strict mode (no extra properties)
const strictUserValidator = object({
  username: string(),
  email: string().email()
}).strict();
// validate({ username: 'john', email: 'john@example.com' }, strictUserValidator) → ✅ passes
// validate({ username: 'john', email: 'john@example.com', extra: 'field' }, strictUserValidator) → ❌ fails

// Required properties
const profileValidator = object({
  name: string(),
  bio: string().makeOptional()
}).require('name');

// Forbidden properties
const publicDataValidator = object({
  name: string(),
  email: string()
}).forbid('password', 'ssn');

// ==========================================
// CUSTOM VALIDATION EXAMPLES
// ==========================================

// Password with custom rules
const passwordValidator = string()
  .min(8)
  .addCustom(
    (value) => /[A-Z]/.test(value),
    'Must contain uppercase letter'
  )
  .addCustom(
    (value) => /[0-9]/.test(value),
    'Must contain number'
  );

// Even number validator
const evenNumberValidator = number().addCustom(
  (value) => value % 2 === 0,
  'Must be even number'
);

// Business email validator
const businessEmailValidator = string()
  .email()
  .addCustom(
    (value) => !value.includes('gmail.com'),
    'Business email required (no Gmail)'
  );

// ==========================================
// COMPLEX REAL-WORLD EXAMPLES
// ==========================================

// User registration form
const userRegistrationValidator = object({
  username: string().min(3).max(20).alphanum(),
  email: string().email(),
  password: string().min(8).addCustom(
    (value) => /[A-Z]/.test(value) && /[0-9]/.test(value),
    'Password must contain uppercase letter and number'
  ),
  age: number().min(13).max(120).integer(),
  terms: boolean().true(),
  newsletter: boolean().makeOptional()
});

// API configuration
const apiConfigValidator = object({
  baseURL: string().url(),
  timeout: number().min(1000).max(30000),
  retries: number().min(0).max(5).integer(),
  headers: object({
    'Content-Type': string(),
    'Authorization': string().makeOptional()
  }),
  endpoints: array().of(string().url()).min(1)
});

// Product catalog item
const productValidator = object({
  id: string().uuid(),
  name: string().min(1).max(100),
  price: number().min(0),
  categories: array().of(string()).min(1).unique(),
  inStock: boolean(),
  metadata: object({
    weight: number().min(0).makeOptional(),
    dimensions: object({
      length: number().min(0),
      width: number().min(0),
      height: number().min(0)
    }).makeOptional()
  }).makeOptional()
});

// Usage examples:
// const result = validate(userData, userRegistrationValidator);
// const configResult = validate(config, apiConfigValidator);
// const productResult = validate(product, productValidator);

/**
 * Quick validation helper function
 * @param {*} data - Data to validate
 * @param {Validator} validator - Validator to use
 * @returns {boolean} True if valid, false otherwise
 */
export function isValid(data, validator) {
  return validate(data, validator).isValid;
}

/**
 * Get validation errors as array
 * @param {*} data - Data to validate
 * @param {Validator} validator - Validator to use
 * @returns {string[]} Array of error messages
 */
export function getErrors(data, validator) {
  return validate(data, validator).errors;
}

// Quick validation examples:
// isValid('john@example.com', string().email()) → true
// getErrors('invalid', string().email()) → ['Invalid email format'] 