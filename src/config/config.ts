import dotenv from 'dotenv';
import path from 'path';
import { validateEnvironmentVariables } from './env-validation';
// import { Options } from 'sequelize';

// Load environment variables
// Store NODE_ENV before loading env file to ensure it's preserved
let nodeEnv = process.env.NODE_ENV;

// Clean up NODE_ENV: remove quotes and trim whitespace
if (nodeEnv) {
  nodeEnv = nodeEnv.replace(/^['"]|['"]$/g, '').trim();
  process.env.NODE_ENV = nodeEnv;
}

if (nodeEnv) {
  const currentPath = __dirname;
  const parentPath = path.resolve(path.resolve(currentPath, '..'), '..');
  const envPath = path.join(parentPath, `${String(nodeEnv).trim()}.env`);
  // Load env file and override existing vars to ensure NODE_ENV from file is used
  dotenv.config({ path: envPath, override: false });
  // Ensure NODE_ENV is set (from command line or env file) and cleaned
  if (process.env.NODE_ENV) {
    process.env.NODE_ENV = process.env.NODE_ENV.replace(
      /^['"]|['"]$/g,
      '',
    ).trim();
  } else if (nodeEnv) {
    process.env.NODE_ENV = nodeEnv;
  }
} else {
  console.log('CLOUD ENVIRONMENT INITIALIZING.....');
  dotenv.config();
  // Clean NODE_ENV after loading from .env file
  if (process.env.NODE_ENV) {
    process.env.NODE_ENV = process.env.NODE_ENV.replace(
      /^['"]|['"]$/g,
      '',
    ).trim();
  }
}

// Validate environment variables (only in non-test environments)
// Validation is now graceful and won't crash the app
if (process.env.NODE_ENV !== 'test') {
  validateEnvironmentVariables();

  // Ensure NODE_ENV is always set to a valid value
  if (
    !process.env.NODE_ENV ||
    !['development', 'production', 'qa', 'local', 'test'].includes(
      process.env.NODE_ENV,
    )
  ) {
    process.env.NODE_ENV = 'development';
  }
}

export const environment = process.env.NODE_ENV;
export const appConfig = {
  port: process.env.PORT || 5001,
  appInsightsKey:
    process.env.APP_INSIGHTS_KEY || '00000000-0000-0000-0000-000000000000',
  serviceName: process.env.SERVICE_NAME || 'APP_SERVICE',
};
