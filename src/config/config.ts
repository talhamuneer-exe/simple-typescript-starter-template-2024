import dotenv from 'dotenv';
import path from 'path';
import { validateEnvironmentVariables } from './env-validation';
// import { Options } from 'sequelize';

// Load environment variables
// Store NODE_ENV before loading env file to ensure it's preserved
const nodeEnv = process.env.NODE_ENV;

if (nodeEnv) {
  const currentPath = __dirname;
  const parentPath = path.resolve(path.resolve(currentPath, '..'), '..');
  const envPath = path.join(parentPath, `${String(nodeEnv).trim()}.env`);
  // Load env file and override existing vars to ensure NODE_ENV from file is used
  dotenv.config({ path: envPath, override: false });
  // Ensure NODE_ENV is set (from command line or env file)
  if (!process.env.NODE_ENV && nodeEnv) {
    process.env.NODE_ENV = nodeEnv;
  }
} else {
  console.log('CLOUD ENVIRONMENT INITIALIZING.....');
  dotenv.config();
}

// Validate environment variables (only in non-test environments)
if (process.env.NODE_ENV !== 'test') {
  try {
    validateEnvironmentVariables();
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}

export const environment = process.env.NODE_ENV;
export const appConfig = {
  port: process.env.PORT || 5001,
  appInsightsKey:
    process.env.APP_INSIGHTS_KEY || '00000000-0000-0000-0000-000000000000',
  serviceName: process.env.SERVICE_NAME || 'APP_SERVICE',
};
