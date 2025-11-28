/**
 * Server Metadata Utilities
 * Provides standardized server information that's automatically included in responses
 */

/**
 * Server metadata that's automatically included in all responses
 * These fields are non-editable and always present
 */
export interface ServerMetadata {
  version: string;
  environment: string;
  uptime: number; // Server uptime in seconds
  server: {
    nodeVersion: string;
    platform: string;
    arch: string;
  };
  memory: {
    used: number; // MB
    total: number; // MB
    percentage: number;
  };
}

/**
 * Customizable fields that can be overridden per response
 */
export interface CustomizableMetadata {
  status?: string; // e.g., 'healthy', 'degraded', 'unhealthy'
  service?: string; // Service name/identifier
}

/**
 * Get standardized server metadata
 * This is automatically included in all responses
 */
export function getServerMetadata(): ServerMetadata {
  const memoryUsage = process.memoryUsage();

  return {
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    uptime: process.uptime(),
    server: {
      nodeVersion: process.version,
      platform: process.platform,
      arch: process.arch,
    },
    memory: {
      used: Math.round((memoryUsage.heapUsed / 1024 / 1024) * 100) / 100, // MB
      total: Math.round((memoryUsage.heapTotal / 1024 / 1024) * 100) / 100, // MB
      percentage: Math.round(
        (memoryUsage.heapUsed / memoryUsage.heapTotal) * 100,
      ),
    },
  };
}

/**
 * Merge custom data with server metadata
 * Custom data can override status and service, but not server metadata fields
 */
export function mergeWithServerMetadata(
  customData?: unknown,
): Record<string, unknown> {
  const serverMetadata = getServerMetadata();

  // If customData is an object, merge it with server metadata
  if (
    customData &&
    typeof customData === 'object' &&
    !Array.isArray(customData)
  ) {
    const custom = customData as Record<string, unknown>;

    // Extract customizable fields
    const customizable: CustomizableMetadata = {};
    if (custom.status !== undefined)
      customizable.status = String(custom.status);
    if (custom.service !== undefined)
      customizable.service = String(custom.service);

    // Remove server metadata fields from custom data to prevent override
    const {
      version: _version,
      environment: _environment,
      uptime: _uptime,
      server: _server,
      memory: _memory,
      status: _status,
      service: _service,
      ...restCustomData
    } = custom;

    // Merge: server metadata + customizable fields + rest of custom data
    return {
      ...(serverMetadata as unknown as Record<string, unknown>),
      ...customizable,
      ...restCustomData,
    };
  }

  // If no custom data or not an object, return just server metadata
  return serverMetadata as unknown as Record<string, unknown>;
}
