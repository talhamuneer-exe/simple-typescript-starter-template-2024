import dotenv from 'dotenv';
import path from 'path';
// import { Options } from 'sequelize';
if (process.env.NODE_ENV) {
  const currentPath = __dirname;
  const parentPath = path.resolve(path.resolve(currentPath, '..'), '..');
  const envPath = path.join(
    parentPath,
    `${String(process.env.NODE_ENV).trim()}.env`,
  );
  dotenv.config({ path: envPath });
} else {
  console.log('CLOUD ENVIRONMENT INITIALIZING.....');
  dotenv.config();
}

export const environment = process.env.NODE_ENV;
export const appConfig = {
  port: process.env.PORT || 3000,
  appInsightsKey:
    process.env.APP_INSIGHTS_KEY || '00000000-0000-0000-0000-000000000000',
  serviceName: process.env.SERVICE_NAME || 'APP_SERVICE',
};
