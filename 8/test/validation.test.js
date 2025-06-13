/**
 * Tests for the Robust Validation Library
 */

import { 
  string, 
  number, 
  boolean, 
  array, 
  object, 
  validate, 
  validateSchema,
  ValidationResult,
  Validator
} from '../validation/index.js';

describe('Validation Library', () => {
  describe('Base Classes', () => {
    test('ValidationResult should create success result', () => {
      const result = ValidationResult.success('test');
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('test');
      expect(result.errors).toEqual([]);
    });

    test('ValidationResult should create failure result', () => {
      const result = ValidationResult.failure('error message');
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(['error message']);
    });

    test('ValidationResult should handle array of errors', () => {
      const result = ValidationResult.failure(['error1', 'error2']);
      expect(result.isValid).toBe(false);
      expect(result.errors).toEqual(['error1', 'error2']);
    });
  });

  describe('String Validator', () => {
    test('should validate string type', () => {
      const validator = string();
      const result = validate('hello', validator);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe('hello');
    });

    test('should reject non-string types', () => {
      const validator = string();
      const result = validate(123, validator);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Expected string');
    });

    test('should validate minimum length', () => {
      const validator = string().min(5);
      expect(validate('hello', validator).isValid).toBe(true);
      expect(validate('hi', validator).isValid).toBe(false);
    });

    test('should validate maximum length', () => {
      const validator = string().max(3);
      expect(validate('hi', validator).isValid).toBe(true);
      expect(validate('hello', validator).isValid).toBe(false);
    });

    test('should validate email format', () => {
      const validator = string().email();
      expect(validate('test@example.com', validator).isValid).toBe(true);
      expect(validate('invalid-email', validator).isValid).toBe(false);
    });

    test('should validate URL format', () => {
      const validator = string().url();
      expect(validate('https://example.com', validator).isValid).toBe(true);
      expect(validate('not-a-url', validator).isValid).toBe(false);
    });

    test('should validate UUID format', () => {
      const validator = string().uuid();
      expect(validate('123e4567-e89b-12d3-a456-426614174000', validator).isValid).toBe(true);
      expect(validate('not-a-uuid', validator).isValid).toBe(false);
    });

    test('should validate regex patterns', () => {
      const validator = string().matches(/^[A-Z]+$/);
      expect(validate('HELLO', validator).isValid).toBe(true);
      expect(validate('hello', validator).isValid).toBe(false);
    });

    test('should handle optional strings', () => {
      const validator = string().makeOptional();
      expect(validate(undefined, validator).isValid).toBe(true);
      expect(validate('hello', validator).isValid).toBe(true);
      expect(validate(123, validator).isValid).toBe(false);
    });
  });

  describe('Number Validator', () => {
    test('should validate number type', () => {
      const validator = number();
      const result = validate(42, validator);
      expect(result.isValid).toBe(true);
      expect(result.value).toBe(42);
    });

    test('should reject non-number types', () => {
      const validator = number();
      const result = validate('not a number', validator);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Expected number');
    });

    test('should reject NaN', () => {
      const validator = number();
      const result = validate(NaN, validator);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('cannot be NaN');
    });

    test('should reject Infinity', () => {
      const validator = number();
      const result = validate(Infinity, validator);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('must be finite');
    });

    test('should validate minimum value', () => {
      const validator = number().min(0);
      expect(validate(5, validator).isValid).toBe(true);
      expect(validate(-1, validator).isValid).toBe(false);
    });

    test('should validate maximum value', () => {
      const validator = number().max(100);
      expect(validate(50, validator).isValid).toBe(true);
      expect(validate(150, validator).isValid).toBe(false);
    });

    test('should validate integer constraint', () => {
      const validator = number().integer();
      expect(validate(42, validator).isValid).toBe(true);
      expect(validate(42.5, validator).isValid).toBe(false);
    });

    test('should validate positive constraint', () => {
      const validator = number().positive();
      expect(validate(1, validator).isValid).toBe(true);
      expect(validate(-1, validator).isValid).toBe(false);
      expect(validate(0, validator).isValid).toBe(false);
    });

    test('should validate port numbers', () => {
      const validator = number().port();
      expect(validate(8080, validator).isValid).toBe(true);
      expect(validate(0, validator).isValid).toBe(false);
      expect(validate(70000, validator).isValid).toBe(false);
    });
  });

  describe('Boolean Validator', () => {
    test('should validate boolean type', () => {
      const validator = boolean();
      expect(validate(true, validator).isValid).toBe(true);
      expect(validate(false, validator).isValid).toBe(true);
    });

    test('should reject non-boolean types', () => {
      const validator = boolean();
      const result = validate('true', validator);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Expected boolean');
    });

    test('should validate true constraint', () => {
      const validator = boolean().true();
      expect(validate(true, validator).isValid).toBe(true);
      expect(validate(false, validator).isValid).toBe(false);
    });

    test('should validate false constraint', () => {
      const validator = boolean().false();
      expect(validate(false, validator).isValid).toBe(true);
      expect(validate(true, validator).isValid).toBe(false);
    });
  });

  describe('Array Validator', () => {
    test('should validate array type', () => {
      const validator = array();
      const result = validate([1, 2, 3], validator);
      expect(result.isValid).toBe(true);
      expect(result.value).toEqual([1, 2, 3]);
    });

    test('should reject non-array types', () => {
      const validator = array();
      const result = validate('not an array', validator);
      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('Expected array');
    });

    test('should validate minimum length', () => {
      const validator = array().min(2);
      expect(validate([1, 2], validator).isValid).toBe(true);
      expect(validate([1], validator).isValid).toBe(false);
    });

    test('should validate element types', () => {
      const validator = array().of(string());
      expect(validate(['a', 'b', 'c'], validator).isValid).toBe(true);
      expect(validate(['a', 123, 'c'], validator).isValid).toBe(false);
    });

    test('should validate unique elements', () => {
      const validator = array().unique();
      expect(validate([1, 2, 3], validator).isValid).toBe(true);
      expect(validate([1, 2, 2], validator).isValid).toBe(false);
    });

    test('should validate non-empty arrays', () => {
      const validator = array().nonempty();
      expect(validate([1], validator).isValid).toBe(true);
      expect(validate([], validator).isValid).toBe(false);
    });
  });

  describe('Object Validator', () => {
    test('should validate object type', () => {
      const validator = object();
      const result = validate({ name: 'John' }, validator);
      expect(result.isValid).toBe(true);
    });

    test('should reject non-object types', () => {
      const validator = object();
      expect(validate(null, validator).isValid).toBe(false);
      expect(validate([], validator).isValid).toBe(false);
      expect(validate('string', validator).isValid).toBe(false);
    });

    test('should validate object schema', () => {
      const validator = object({
        name: string(),
        age: number().min(0)
      });
      
      const valid = { name: 'John', age: 30 };
      const invalid = { name: 'John', age: -5 };
      
      expect(validate(valid, validator).isValid).toBe(true);
      expect(validate(invalid, validator).isValid).toBe(false);
    });

    test('should handle strict mode', () => {
      const validator = object({ name: string() }).strict();
      const dataWithExtra = { name: 'John', extra: 'not allowed' };
      
      expect(validate(dataWithExtra, validator).isValid).toBe(false);
    });

    test('should validate required properties', () => {
      const validator = object({
        name: string(),
        age: number()
      }).require('name', 'age');
      
      const missingAge = { name: 'John' };
      expect(validate(missingAge, validator).isValid).toBe(false);
    });
  });

  describe('Custom Validators', () => {
    test('should support custom validation functions', () => {
      const validator = string().addCustom(
        (value) => value.startsWith('hello'),
        'String must start with "hello"'
      );
      
      expect(validate('hello world', validator).isValid).toBe(true);
      expect(validate('goodbye world', validator).isValid).toBe(false);
    });
  });

  describe('Nullable and Optional', () => {
    test('should handle nullable values', () => {
      const validator = string().makeNullable();
      expect(validate(null, validator).isValid).toBe(true);
      expect(validate('hello', validator).isValid).toBe(true);
      expect(validate(123, validator).isValid).toBe(false);
    });

    test('should handle optional values', () => {
      const validator = number().makeOptional();
      expect(validate(undefined, validator).isValid).toBe(true);
      expect(validate(42, validator).isValid).toBe(true);
      expect(validate('not a number', validator).isValid).toBe(false);
    });
  });

  describe('Schema Validation', () => {
    test('should validate complex schemas', () => {
      const schema = {
        user: object({
          name: string().min(1),
          email: string().email(),
          age: number().min(0).max(120)
        }),
        tags: array().of(string()).min(1),
        active: boolean()
      };

      const validData = {
        user: {
          name: 'John Doe',
          email: 'john@example.com',
          age: 30
        },
        tags: ['developer', 'javascript'],
        active: true
      };

      const result = validateSchema(validData, schema);
      expect(result.isValid).toBe(true);
    });

    test('should collect all validation errors', () => {
      const schema = {
        name: string().min(5),
        age: number().min(18)
      };

      const invalidData = {
        name: 'Jo',
        age: 16
      };

      const result = validateSchema(invalidData, schema);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBe(2);
    });
  });
}); 
