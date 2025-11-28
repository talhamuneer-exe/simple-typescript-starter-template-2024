/**
 * Request Metadata Interface
 * Stores additional request information for tracking and debugging
 */
export interface RequestMetadata {
  requestId: string;
  correlationId: string; // For distributed tracing
  traceId: string; // For request tracing
  requestTimestamp: string; // When request was received (UTC)
  method: string;
  path: string;
  originalUrl: string;
  ip: string;
  userAgent?: string;
  referer?: string;
  contentType?: string;
  contentLength?: number;
  queryParams?: Record<string, unknown>;
  userId?: string; // If authenticated
  sessionId?: string; // If session exists
}

declare namespace Express {
  export interface Request {
    id?: string;
    metadata?: RequestMetadata;
    user?: {
      id?: string;
      email?: string;
      [key: string]: unknown;
    };
    sessionID?: string;
  }
  export interface Response {
    id?: string;
    metadata?: RequestMetadata;
    locals: {
      startTime?: number;
      [key: string]: unknown;
    };
  }
}
