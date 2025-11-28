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
    defaultValue: 'development',
    validator: (value) =>
      ['development', 'production', 'qa', 'local', 'test'].includes(value),
    errorMessage:
      'NODE_ENV must be one of: development, production, qa, local, test',
  },
  {
    name: 'PORT',
    required: true,
    type: 'number',
    defaultValue: 5001,
  },
  {
    name: 'SERVICE_NAME',
    required: true,
    type: 'string',
    defaultValue: 'APP_SERVICE',
  },
];

/**
 * Validate environment variables
 * Gracefully handles validation errors by using defaults instead of crashing
 */
export function validateEnvironmentVariables(): void {
  const errors: string[] = [];
  const warnings: string[] = [];

  for (const envVar of envVars) {
    let value = process.env[envVar.name];

    // Clean up value: remove quotes and trim whitespace
    if (value) {
      value = value.replace(/^['"]|['"]$/g, '').trim();
      // Update process.env with cleaned value
      process.env[envVar.name] = value;
    }

    // Check if required variable is missing
    if (envVar.required && !value) {
      // Use default if available, otherwise log as warning instead of error
      if (envVar.defaultValue !== undefined) {
        process.env[envVar.name] = String(envVar.defaultValue);
        warnings.push(
          `Required environment variable ${envVar.name} not set, using default: ${envVar.defaultValue}`,
        );
        continue;
      }
      warnings.push(`Required environment variable ${envVar.name} is missing`);
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
    if (value && envVar.validator) {
      // Clean value before validation
      const cleanedValue = value.replace(/^['"]|['"]$/g, '').trim();
      if (!envVar.validator(cleanedValue)) {
        // For NODE_ENV and other critical vars, use default instead of error to prevent crashes
        if (envVar.defaultValue !== undefined) {
          const defaultValue = String(envVar.defaultValue);
          warnings.push(
            `Invalid ${envVar.name} value "${value}". Using default: ${defaultValue}`,
          );
          process.env[envVar.name] = defaultValue;
          continue;
        }
        warnings.push(
          envVar.errorMessage ||
            `Invalid value for environment variable ${envVar.name}: "${value}"`,
        );
        continue;
      }
      // Update with cleaned value if it was modified
      if (cleanedValue !== value) {
        process.env[envVar.name] = cleanedValue;
      }
    }

    // Type validation - convert to warnings instead of errors
    if (value) {
      if (envVar.type === 'number' && isNaN(Number(value))) {
        if (envVar.defaultValue !== undefined) {
          process.env[envVar.name] = String(envVar.defaultValue);
          warnings.push(
            `Environment variable ${envVar.name} must be a number. Using default: ${envVar.defaultValue}`,
          );
        } else {
          warnings.push(`Environment variable ${envVar.name} must be a number`);
        }
      } else if (
        envVar.type === 'boolean' &&
        !['true', 'false'].includes(value.toLowerCase())
      ) {
        warnings.push(
          `Environment variable ${envVar.name} must be a boolean (true/false). Current value: "${value}"`,
        );
      }
    }
  }

  // Log warnings (treating most issues as warnings for graceful degradation)
  if (warnings.length > 0) {
    warnings.forEach((warning) => logger.info('ENV_WARNING', warning));
  }

  // Log critical errors (but don't throw - let app continue with defaults)
  if (errors.length > 0) {
    errors.forEach((error) => logger.error('ENV_ERROR', error));
    logger.info(
      'ENV_VALIDATION',
      'Environment validation completed with errors. Application will continue with default values.',
    );
  } else if (warnings.length === 0) {
    logger.info(
      'ENV_VALIDATION',
      'Environment variables validated successfully',
    );
  } else {
    logger.info(
      'ENV_VALIDATION',
      'Environment variables validated with warnings. Application will continue.',
    );
  }
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
