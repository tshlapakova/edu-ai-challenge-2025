# Robust JavaScript Validation Library

A comprehensive, type-safe validation library for JavaScript that supports both primitive and complex data structures with a fluent API.

## Features

- **Type-safe validation** for primitive types (string, number, boolean)
- **Complex type support** for arrays and objects
- **Fluent API** with method chaining
- **Optional and nullable** field support
- **Custom validation** functions
- **Schema validation** for complex data structures
- **Comprehensive error reporting**
- **Zero dependencies** 
- **ES6 module support**

## Installation

Since this is part of the Sea Battle CLI project, you can import it directly:

```javascript
import { 
  string, 
  number, 
  boolean, 
  array, 
  object, 
  validate, 
  validateSchema 
} from './src/validation/index.js';
```

## Quick Start

### Basic Validation

```javascript
import { string, number, validate } from './src/validation/index.js';

// String validation
const nameValidator = string().min(2).max(50);
const result = validate('John Doe', nameValidator);

if (result.isValid) {
  console.log('Valid name:', result.value);
} else {
  console.log('Errors:', result.errors);
}

// Number validation
const ageValidator = number().min(0).max(120).integer();
const ageResult = validate(25, ageValidator);
```

### Object Schema Validation

```javascript
import { object, string, number, validate } from './src/validation/index.js';

const userValidator = object({
  name: string().min(1),
  email: string().email(),
  age: number().min(0).max(120).integer()
});

const userData = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30
};

const result = validate(userData, userValidator);
```

## API Reference

### String Validator

```javascript
string()
  .min(length)           // Minimum length
  .max(length)           // Maximum length  
  .length(min, max)      // Exact length or range
  .matches(pattern)      // Regex pattern matching
  .email()               // Email format validation
  .url()                 // URL format validation
  .uuid()                // UUID format validation
  .alphanum()            // Alphanumeric characters only
  .numeric()             // Numeric characters only
  .makeOptional()        // Allow undefined values
  .makeNullable()        // Allow null values
  .addCustom(fn, msg)    // Custom validation function
```

#### Examples

```javascript
// Email validation
const emailValidator = string().email();

// Password validation with custom rules
const passwordValidator = string()
  .min(8)
  .addCustom(
    (value) => /[A-Z]/.test(value),
    'Must contain uppercase letter'
  )
  .addCustom(
    (value) => /[0-9]/.test(value),
    'Must contain a number'
  );

// Optional field
const bioValidator = string().makeOptional();
```

### Number Validator

```javascript
number()
  .min(value)            // Minimum value
  .max(value)            // Maximum value
  .range(min, max)       // Value range
  .integer()             // Must be integer
  .positive()            // Must be positive (> 0)
  .negative()            // Must be negative (< 0)
  .multiple(divisor)     // Must be multiple of divisor
  .port()                // Valid port number (1-65535)
  .percentage()          // Percentage (0-100)
  .makeOptional()        // Allow undefined values
  .makeNullable()        // Allow null values
  .addCustom(fn, msg)    // Custom validation function
```

#### Examples

```javascript
// Age validation
const ageValidator = number().min(0).max(120).integer();

// Price validation
const priceValidator = number().min(0);

// Port validation
const portValidator = number().port();
```

### Boolean Validator

```javascript
boolean()
  .true()                // Must be true
  .false()               // Must be false
  .makeOptional()        // Allow undefined values
  .makeNullable()        // Allow null values
  .addCustom(fn, msg)    // Custom validation function
```

#### Examples

```javascript
// Basic boolean
const activeValidator = boolean();

// Must accept terms
const termsValidator = boolean().true();
```

### Array Validator

```javascript
array()
  .of(elementValidator)  // Validate each element
  .min(length)           // Minimum length
  .max(length)           // Maximum length
  .length(min, max)      // Length range
  .unique()              // All elements must be unique
  .nonempty()            // Array must not be empty
  .makeOptional()        // Allow undefined values
  .makeNullable()        // Allow null values
  .addCustom(fn, msg)    // Custom validation function
```

#### Examples

```javascript
// Array of strings
const tagsValidator = array().of(string()).min(1).max(10);

// Array of unique numbers
const numbersValidator = array().of(number()).unique();

// Nested validation
const usersValidator = array().of(object({
  name: string(),
  email: string().email()
}));
```

### Object Validator

```javascript
object(schema)
  .shape(schema)         // Define object schema
  .strict()              // Disallow extra properties
  .require(...keys)      // Mark keys as required
  .forbid(...keys)       // Mark keys as forbidden
  .pick(...keys)         // Create validator with only specified keys
  .omit(...keys)         // Create validator excluding specified keys
  .extend(schema)        // Extend schema with additional properties
  .makeOptional()        // Allow undefined values
  .makeNullable()        // Allow null values
  .addCustom(fn, msg)    // Custom validation function
```

#### Examples

```javascript
// Basic object validation
const userValidator = object({
  name: string().min(1),
  email: string().email(),
  age: number().min(0).integer()
});

// Strict mode (no extra properties allowed)
const strictValidator = object({
  name: string()
}).strict();

// Required fields
const profileValidator = object({
  username: string(),
  bio: string().makeOptional()
}).require('username');

// Nested objects
const orderValidator = object({
  customer: object({
    name: string(),
    email: string().email()
  }),
  items: array().of(object({
    name: string(),
    price: number().min(0)
  }))
});
```

### Validation Functions

#### `validate(data, validator)`

Validates data against a single validator.

```javascript
const result = validate('test@example.com', string().email());

// Result structure:
// {
//   isValid: boolean,
//   value: any,        // Validated value (undefined if invalid)
//   errors: string[]   // Array of error messages
// }
```

#### `validateSchema(data, schema)`

Validates data against an object schema.

```javascript
const schema = {
  name: string().min(1),
  age: number().min(0)
};

const result = validateSchema({ name: 'John', age: 25 }, schema);

// Result structure:
// {
//   isValid: boolean,
//   results: object,   // Individual validation results
//   errors: string[],  // Array of all error messages
//   data: object       // Validated data (undefined if invalid)
// }
```

## Advanced Usage

### Custom Validation

```javascript
const passwordValidator = string()
  .min(8)
  .addCustom(
    (value) => /[A-Z]/.test(value),
    'Password must contain at least one uppercase letter'
  )
  .addCustom(
    (value) => /[0-9]/.test(value),
    'Password must contain at least one number'
  )
  .addCustom(
    (value) => /[!@#$%^&*]/.test(value),
    'Password must contain at least one special character'
  );
```

### Optional and Nullable Fields

```javascript
const profileValidator = object({
  username: string().min(3),                    // Required
  bio: string().makeOptional(),                 // Optional (can be undefined)
  avatar: string().url().makeOptional().makeNullable(), // Optional and nullable
  age: number().makeOptional()                  // Optional
});
```

### Complex Nested Validation

```javascript
const blogPostValidator = object({
  title: string().min(1).max(200),
  content: string().min(10),
  tags: array().of(string().min(1)).min(1).max(10),
  author: object({
    name: string().min(1),
    email: string().email(),
    bio: string().makeOptional()
  }),
  comments: array().of(object({
    author: string().min(1),
    text: string().min(1),
    timestamp: number().min(0),
    replies: array().of(object({
      author: string().min(1),
      text: string().min(1),
      timestamp: number().min(0)
    })).makeOptional()
  }))
});
```

### Error Handling Patterns

```javascript
function processUserData(userData) {
  const validator = object({
    name: string().min(2),
    email: string().email(),
    age: number().min(18).integer()
  });

  const result = validate(userData, validator);
  
  if (!result.isValid) {
    console.log('Validation failed:');
    result.errors.forEach((error, index) => {
      console.log(`  ${index + 1}. ${error}`);
    });
    return null;
  }
  
  console.log('User data is valid:', result.value);
  return result.value;
}
```

## Format Validators

The library includes several built-in format validators:

- **Email**: Basic email format validation
- **URL**: HTTP/HTTPS URL validation  
- **UUID**: Standard UUID format validation
- **Alphanumeric**: Only letters and numbers
- **Numeric**: Only numeric characters

## Error Messages

The library provides clear, descriptive error messages:

```javascript
// Type errors
"Expected string, got number"
"Expected array, got object"

// Constraint errors  
"String must be at least 5 characters long, got 3"
"Value must be at least 0, got -5"
"Array must have at least 1 elements, got 0"

// Format errors
"Invalid email format"
"Invalid UUID format"
"String does not match required pattern"

// Custom errors
"Password must contain at least one uppercase letter"
```

## Performance Considerations

- Validators are immutable - each method call returns a new validator instance
- Use factory functions (`string()`, `number()`, etc.) for convenience
- For repeated validations, store validator instances to avoid recreation
- The library performs minimal allocations and is optimized for speed

## Testing

The library includes comprehensive tests covering all validators and edge cases:

```bash
npm test validation.test.js
```

## Examples

See `src/validation/examples.js` for comprehensive usage examples including:

- Basic primitive validation
- Email and URL validation  
- Array validation with element constraints
- Complex object validation
- Optional and nullable fields
- Custom validation functions
- Nested data structures
- API request validation
- Configuration validation
- Error handling patterns

## Type Safety

While this is a JavaScript library, it's designed with type safety in mind:

- Clear separation between valid and invalid states
- Immutable validator instances
- Predictable return types
- Comprehensive error reporting

## Contributing

This validation library is part of the Sea Battle CLI project. To contribute:

1. Add new validator methods following existing patterns
2. Include comprehensive tests for new functionality
3. Update documentation and examples
4. Ensure backward compatibility

## License

This project is licensed under the MIT License. 