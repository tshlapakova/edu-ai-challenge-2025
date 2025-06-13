/**
 * Examples of using the Robust Validation Library
 * Demonstrates various use cases and patterns
 */

import { 
  string, 
  number, 
  boolean, 
  array, 
  object, 
  validate, 
  validateSchema 
} from './index.js';

// Example 1: Basic primitive validation
console.log('=== Basic Primitive Validation ===');

const nameValidator = string().min(2).max(50);
const ageValidator = number().min(0).max(120).integer();
const activeValidator = boolean();

console.log('Valid name:', validate('John Doe', nameValidator));
console.log('Invalid name (too short):', validate('J', nameValidator));
console.log('Valid age:', validate(25, ageValidator));
console.log('Invalid age (negative):', validate(-5, ageValidator));

// Example 2: Email and URL validation
console.log('\n=== Email and URL Validation ===');

const emailValidator = string().email();
const urlValidator = string().url();

console.log('Valid email:', validate('user@example.com', emailValidator));
console.log('Invalid email:', validate('not-an-email', emailValidator));
console.log('Valid URL:', validate('https://example.com', urlValidator));
console.log('Invalid URL:', validate('not-a-url', urlValidator));

// Example 3: Array validation
console.log('\n=== Array Validation ===');

const stringArrayValidator = array().of(string()).min(1);
const uniqueNumbersValidator = array().of(number()).unique();

console.log('Valid string array:', validate(['a', 'b', 'c'], stringArrayValidator));
console.log('Invalid string array:', validate(['a', 123, 'c'], stringArrayValidator));
console.log('Valid unique numbers:', validate([1, 2, 3], uniqueNumbersValidator));
console.log('Invalid duplicate numbers:', validate([1, 2, 2], uniqueNumbersValidator));

// Example 4: Object validation
console.log('\n=== Object Validation ===');

const userValidator = object({
  name: string().min(1),
  email: string().email(),
  age: number().min(0).max(120).integer(),
  preferences: object({
    theme: string().matches(/^(light|dark)$/),
    notifications: boolean()
  })
});

const validUser = {
  name: 'John Doe',
  email: 'john@example.com',
  age: 30,
  preferences: {
    theme: 'dark',
    notifications: true
  }
};

const invalidUser = {
  name: '',
  email: 'invalid-email',
  age: -5,
  preferences: {
    theme: 'invalid-theme',
    notifications: 'not-boolean'
  }
};

console.log('Valid user:', validate(validUser, userValidator));
console.log('Invalid user:', validate(invalidUser, userValidator));

// Example 5: Optional and nullable fields
console.log('\n=== Optional and Nullable Fields ===');

const profileValidator = object({
  username: string().min(3),
  bio: string().makeOptional(),
  avatar: string().url().makeOptional().makeNullable(),
  age: number().makeOptional()
});

const profile1 = { username: 'johndoe' };
const profile2 = { 
  username: 'johndoe', 
  bio: 'Software developer',
  avatar: null,
  age: 25 
};

console.log('Minimal profile:', validate(profile1, profileValidator));
console.log('Complete profile:', validate(profile2, profileValidator));

// Example 6: Custom validation
console.log('\n=== Custom Validation ===');

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

console.log('Valid password:', validate('MyPassword123!', passwordValidator));
console.log('Invalid password:', validate('weakpass', passwordValidator));

// Example 7: Nested array validation
console.log('\n=== Nested Array Validation ===');

const blogPostValidator = object({
  title: string().min(1).max(200),
  content: string().min(10),
  tags: array().of(string().min(1)).min(1).max(10),
  comments: array().of(object({
    author: string().min(1),
    text: string().min(1),
    timestamp: number().min(0)
  }))
});

const blogPost = {
  title: 'Introduction to Validation',
  content: 'This is a comprehensive guide to data validation...',
  tags: ['validation', 'javascript', 'programming'],
  comments: [
    {
      author: 'Alice',
      text: 'Great post!',
      timestamp: 1234567890
    },
    {
      author: 'Bob',
      text: 'Very helpful, thanks!',
      timestamp: 1234567900
    }
  ]
};

console.log('Valid blog post:', validate(blogPost, blogPostValidator));

// Example 8: API request validation
console.log('\n=== API Request Validation ===');

const createUserRequestValidator = object({
  name: string().min(1).max(100),
  email: string().email(),
  password: string().min(8),
  age: number().min(13).max(120).integer(),
  terms: boolean().true()
});

const apiRequest = {
  name: 'John Doe',
  email: 'john@example.com',
  password: 'securepassword123',
  age: 25,
  terms: true
};

console.log('Valid API request:', validate(apiRequest, createUserRequestValidator));

// Example 9: Configuration validation
console.log('\n=== Configuration Validation ===');

const configValidator = object({
  server: object({
    port: number().port(),
    host: string().min(1),
    ssl: boolean()
  }),
  database: object({
    url: string().min(1), // MongoDB URLs don't match HTTP pattern, so just validate it's not empty
    maxConnections: number().min(1).max(100),
    timeout: number().min(1000)
  }),
  features: object({
    analytics: boolean(),
    logging: boolean(),
    debug: boolean()
  })
});

const config = {
  server: {
    port: 3000,
    host: 'localhost',
    ssl: false
  },
  database: {
    url: 'mongodb://localhost:27017/myapp',
    maxConnections: 10,
    timeout: 5000
  },
  features: {
    analytics: true,
    logging: true,
    debug: false
  }
};

console.log('Valid configuration:', validate(config, configValidator));

// Example 10: Schema validation with multiple objects
console.log('\n=== Schema Validation with Multiple Objects ===');

const orderSchema = {
  customer: object({
    name: string().min(1),
    email: string().email(),
    phone: string().matches(/^\+?[\d\s-()]+$/)
  }),
  items: array().of(object({
    name: string().min(1),
    price: number().min(0),
    quantity: number().min(1).integer()
  })).min(1),
  total: number().min(0),
  status: string().matches(/^(pending|processing|shipped|delivered|cancelled)$/)
};

const orderData = {
  customer: {
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+1-555-123-4567'
  },
  items: [
    { name: 'Product A', price: 29.99, quantity: 2 },
    { name: 'Product B', price: 15.50, quantity: 1 }
  ],
  total: 75.48,
  status: 'pending'
};

const schemaResult = validateSchema(orderData, orderSchema);
console.log('Schema validation result:', schemaResult);

// Example 11: Error handling patterns
console.log('\n=== Error Handling Patterns ===');

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

processUserData({ name: 'Jo', email: 'invalid', age: 16 });
processUserData({ name: 'John Doe', email: 'john@example.com', age: 25 });

console.log('\n=== Validation Library Examples Complete ==='); 
