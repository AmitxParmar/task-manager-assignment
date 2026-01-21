import { authService } from "@/services/auth.service";
import type { AuthErrorCode, ApiErrorResponse } from "@/types";
import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

/**
 * Extended axios request config with retry flag
 */
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

/**
 * Helper to extract error code from axios error
 */
const getErrorCode = (error: AxiosError<ApiErrorResponse>): AuthErrorCode | undefined => {
  return error.response?.data?.code;
};

const api = axios.create({
  // Use Next.js API proxy instead of direct backend URL
  // This routes through /api/* which is rewritten to backend in next.config.ts
  baseURL: "/api",
  withCredentials: true, // important for cookies
});

let isRefreshing = false;
let refreshSubscribers: Array<() => void> = [];
let queryClient: QueryClient | null = null;

// Set query client instance (called from app initialization)
export const setQueryClient = (client: QueryClient) => {
  queryClient = client;
};

const subscribeTokenRefresh = (cb: () => void) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

/**
 * Axios Response Interceptor for Automatic Token Refresh
 * 
 * This interceptor handles JWT token expiration and refresh logic:
 * 
 * TOKEN FLOW:
 * 1. Access Token (15min): Short-lived token for API requests
 * 2. Refresh Token (7days): Long-lived token to get new access tokens
 * 
 * REFRESH LOGIC:
 * - When access token expires (ACCESS_TOKEN_EXPIRED), automatically refresh it
 * - When refresh token expires (REFRESH_TOKEN_EXPIRED), logout user
 * - Handles concurrent requests by queuing them during refresh
 * - Retries original request after successful refresh
 * 
 * ERROR CODES:
 * - ACCESS_TOKEN_EXPIRED: 15min token expired → Try refresh
 * - ACCESS_TOKEN_INVALID: Token malformed → Try refresh
 * - ACCESS_TOKEN_MISSING: No token sent → Try refresh
 * - REFRESH_TOKEN_EXPIRED: 7day token expired → Logout
 * - REFRESH_TOKEN_INVALID: Refresh token malformed → Logout
 * - REFRESH_TOKEN_MISSING: No refresh token → Logout
 * - USER_NOT_FOUND: User deleted → Logout
 */
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const response = error.response;
    const config = error.config as ExtendedAxiosRequestConfig | undefined;
    const requestUrl: string | undefined = config?.url;

    // Check if this is the refresh endpoint itself (fixed path)
    const isAuthRefreshEndpoint = requestUrl?.includes('/auth/refresh');
    const errorCode = getErrorCode(error);

    // ========================================================================
    // CASE 1: Refresh token errors - Don't attempt refresh, just logout
    // ========================================================================
    if (
      response?.status === 401 &&
      (errorCode === "REFRESH_TOKEN_MISSING" ||
        errorCode === "REFRESH_TOKEN_EXPIRED" ||
        errorCode === "REFRESH_TOKEN_INVALID" ||
        errorCode === "REFRESH_TOKEN_REVOKED" ||
        errorCode === "USER_NOT_FOUND")
    ) {
      // These errors mean the session is completely invalid
      // Clear everything and redirect to login
      queryClient?.clear();
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        // Only redirect if not already on login page to prevent infinite loop
        window.location.href = "/";
      }
      return Promise.reject(error);
    }

    // ========================================================================
    // CASE 2: Access token errors - Attempt to refresh
    // ========================================================================
    const shouldRefreshToken =
      response?.status === 401 &&
      (errorCode === "ACCESS_TOKEN_EXPIRED" ||
        errorCode === "ACCESS_TOKEN_INVALID" ||
        errorCode === "ACCESS_TOKEN_MISSING");

    if (shouldRefreshToken) {
      // If the refresh call itself failed with 401, redirect immediately
      if (isAuthRefreshEndpoint) {
        isRefreshing = false;
        refreshSubscribers = [];
        queryClient?.clear();
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }

      // Prevent infinite retry loops
      if (config?._retry) {
        queryClient?.clear();
        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(error);
      }

      // If already refreshing, queue this request
      if (isRefreshing && config) {
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh(() => {
            api(config).then(resolve).catch(reject);
          });
        });
      }

      // Mark this request as retried and start refresh
      if (config) {
        config._retry = true;
      }
      isRefreshing = true;

      try {
        // Try to refresh the token - server will set new cookies
        await authService.refresh();
        isRefreshing = false;
        onRefreshed();

        // Retry the original request with new token
        if (config) {
          return api(config);
        }
      } catch (refreshError) {
        // Refresh failed - clear state and logout
        isRefreshing = false;
        refreshSubscribers = [];
        queryClient?.clear();

        if (typeof window !== "undefined" && window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(refreshError);
      }
    }

    // ========================================================================
    // CASE 3: Non-auth errors - Show toast notification
    // ========================================================================
    if (response?.status !== 401) {
      const errorMessage =
        response?.data?.message || error.message || "An unexpected error occurred";
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default api;
