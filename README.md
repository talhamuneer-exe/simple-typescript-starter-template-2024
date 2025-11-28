# 🧰 Simple TypeScript Starter | 2025-26

> This template is particularly focused around Domain-Driven Design and large-scale enterprise application patterns. Hope you find it useful in your future projects.

### Features

- Minimal
- TypeScript v5.9.3
- Testing with Jest
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- VS Code debugger scripts
- Nodemon integrated
- Updated every month
- Sequelize ORM integration
- **Systematic Error System** with error codes, messages, and prefixes
- **Route-Specific Codes** - Define success and error codes for each route
- Validation with joi
- Awesome response template for managing logs
- Winston integrated
- Support for multiple environments
- Modern TypeScript configuration
- Enhanced error handling and logging

### Scripts

#### `npm run start:dev`

Starts the application in development using `nodemon` and `rimraf` to do hot reloading.

#### `npm run start:qa`

Starts the application in qa (UAT) using `nodemon` and `rimraf` to do hot reloading.

#### `npm run start:prod`

Starts the application in production using `nodemon` and `rimraf` to do hot reloading.

#### `npm run start:local`

Starts the application in local using `nodemon` and `rimraf` to do hot reloading.

#### `npm run start`

Starts the app in production by first building the project with `npm run build`, and then executing the compiled JavaScript at `build/index.js`.

#### `npm run build`

Builds the app at `build`, cleaning the folder first.

#### `npm run test`

Runs the `jest` tests once.

#### `npm run test:dev`

Run the `jest` tests in watch mode, waiting for file changes.

#### `npm run test:coverage`

Run tests with coverage report.

#### `npm run test:verbose`

Run tests with verbose output.

#### `npm run test:ci`

Run tests optimized for CI/CD environments.

#### `npm run test:debug`

Run tests with open handle detection to identify async operations that keep running.

#### `npm run test:debug:verbose`

Run tests with open handle detection and verbose output.

#### `npm run prettier-format`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.

### Documentation

- **[Error System Guide](./ERROR_SYSTEM.md)** - Complete guide to the systematic error handling system
- **[Route Codes Guide](./ROUTE_CODES_GUIDE.md)** - Guide to using route-specific success and error codes
- **[Request & Response Tracking](./REQUEST_RESPONSE_TRACKING.md)** - Comprehensive request/response tracking and metadata
- **[ESLint Custom Rules](./ESLINT_CUSTOM_RULES.md)** - Custom linting rules for response consistency
- **[Testing Guide](./TESTING_GUIDE.md)** - Complete guide to writing tests with Jest
- **[Testing Troubleshooting](./TESTING_TROUBLESHOOTING.md)** - Troubleshooting guide for test issues
- **[Improvements Summary](./IMPROVEMENTS.md)** - Summary of all improvements made to the boilerplate

### Quick Start: Route-Specific Codes

Define codes for your routes:

```typescript
// In src/utils/route-codes.ts
export const GET_USERS_CODES = createRouteCodes('get-users', {
  success: {
    USERS_RETRIEVED: {
      code: 'USR-001-SUC',
      message: 'Users retrieved successfully',
    },
  },
  error: {
    USERS_FETCH_FAILED: {
      code: 'USR-001-ERR',
      message: 'Failed to fetch users',
    },
  },
});
```

Use in your controller:

```typescript
import { GET_USERS_CODES } from '../../utils/route-codes';
import { SuccessResponse } from '../../utils';

const successCode = GET_USERS_CODES.success.USERS_RETRIEVED;
new SuccessResponse(
  res,
  successCode.message,
  { users },
  successCode.code, // USR-001-SUC
).send();
```

See [ROUTE_CODES_GUIDE.md](./ROUTE_CODES_GUIDE.md) for complete documentation.
