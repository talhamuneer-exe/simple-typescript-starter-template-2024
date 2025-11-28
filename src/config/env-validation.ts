import { logger } from '../utils';

/**
 * Environment Variable Validation
 * Validates required environment variables at startup
 */

interface EnvVar {
  name: string;
  required: boolean;
  type: 'string' | 'number' | 'boolean';
  defaultValue?: string | number | boolean;
  validator?: (value: string) => boolean;
  errorMessage?: string;
}

const envVars: EnvVar[] = [
  {
    name: 'NODE_ENV',
    required: true,
    type: 'string',
    validator: (value) =>
      ['development', 'production', 'qa', 'local'].includes(value),
    errorMessage: 'NODE_ENV must be one of: development, production, qa, local',
  },
  {
    name: 'PORT',
    required: false,
    type: 'number',
    defaultValue: 5001,
  },
  {
    name: 'SERVICE_NAME',
    required: false,
    type: 'string',
    defaultValue: 'APP_SERVICE',
  },
];

/**
 * Validate environment variables
 */
export function validateEnvironmentVariables(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of envVars) {
    const value = process.env[envVar.name];

    // Check if required variable is missing
    if (envVar.required && !value) {
      errors.push(`Required environment variable ${envVar.name} is missing`);
      continue;
    }

    // Use default value if not set
    if (!value && envVar.defaultValue !== undefined) {
      process.env[envVar.name] = String(envVar.defaultValue);
      warnings.push(
        `Environment variable ${envVar.name} not set, using default: ${envVar.defaultValue}`,
      );
      continue;
    }

    // Validate value if validator provided
    if (value && envVar.validator && !envVar.validator(value)) {
      errors.push(
        envVar.errorMessage ||
          `Invalid value for environment variable ${envVar.name}`,
      );
      continue;
    }

    // Type validation
    if (value) {
      if (envVar.type === 'number' && isNaN(Number(value))) {
        errors.push(`Environment variable ${envVar.name} must be a number`);
      } else if (
        envVar.type === 'boolean' &&
        !['true', 'false'].includes(value.toLowerCase())
      ) {
        errors.push(
          `Environment variable ${envVar.name} must be a boolean (true/false)`,
        );
      }
    }
  }

  // Log warnings
  if (warnings.length > 0) {
    warnings.forEach((warning) => logger.info('ENV_WARNING', warning));
  }

  // Throw errors if any
  if (errors.length > 0) {
    errors.forEach((error) => logger.error('ENV_ERROR', error));
    throw new Error(`Environment validation failed:\n${errors.join('\n')}`);
  }

  logger.info('ENV_VALIDATION', 'Environment variables validated successfully');
}

/**
 * Get validated environment variable
 */
export function getEnvVar(name: string, defaultValue?: string): string {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  return value || defaultValue!;
}

/**
 * Get validated number environment variable
 */
export function getEnvNumber(name: string, defaultValue?: number): number {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  const numValue = value ? Number(value) : defaultValue!;
  if (isNaN(numValue)) {
    throw new Error(`Environment variable ${name} must be a valid number`);
  }
  return numValue;
}

/**
 * Get validated boolean environment variable
 */
export function getEnvBoolean(name: string, defaultValue?: boolean): boolean {
  const value = process.env[name];
  if (!value && defaultValue === undefined) {
    throw new Error(`Environment variable ${name} is required but not set`);
  }
  if (!value) {
    return defaultValue!;
  }
  return value.toLowerCase() === 'true';
}
