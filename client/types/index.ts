
// ============================================
// API Response Types (matching server structure)
// ============================================

/**
 * Success response structure from the server
 * Server returns: { message: string, data: T }
 */
export interface ApiSuccessResponse<T> {
  message: string;
  data: T;
}

/**
 * Error response structure from the server error handler
 * Server returns: { success: false, message, code?, rawErrors?, stack? }
 */
export interface ApiErrorResponse {
  success: false;
  message: string;
  rawErrors?: string[];
  code?: AuthErrorCode;
  stack?: string;
}

/**
 * Auth-specific error codes returned by the server
 */
export type AuthErrorCode =
  | "ACCESS_TOKEN_MISSING"
  | "ACCESS_TOKEN_EXPIRED"
  | "ACCESS_TOKEN_INVALID"
  | "REFRESH_TOKEN_MISSING"
  | "REFRESH_TOKEN_EXPIRED"
  | "REFRESH_TOKEN_INVALID"
  | "REFRESH_TOKEN_REVOKED"
  | "USER_NOT_FOUND";


/**
 * Axios error with typed response data
 */
export interface AxiosAuthError {
  response?: {
    status: number;
    data?: ApiErrorResponse;
  };
  message?: string;
}

/**
 * Type guard to check if an error is an AxiosAuthError
 */
export function isAxiosAuthError(error: unknown): error is AxiosAuthError {
  return (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as AxiosAuthError).response === "object"
  );
}
