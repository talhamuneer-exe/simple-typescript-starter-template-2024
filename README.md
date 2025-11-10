# 🧰 Simple TypeScript Starter | 2025-26

> This template is particularly focused around Domain-Driven Design and large-scale enterprise application patterns. Hope you find it useful in your future projects.

### Features

- Minimal
- TypeScript v5
- Testing with Jest
- Linting with Eslint and Prettier
- Pre-commit hooks with Husky
- VS Code debugger scripts
- Nodemon integrated
- Updated every month
- Sequelize ORM integration
- Easier error handling
- Validation with joi
- Awesome response template for managing logs
- Winston integrated
- Support for multiple environments

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

#### `npm run prettier-format`

Format your code.

#### `npm run prettier-watch`

Format your code in watch mode, waiting for file changes.
