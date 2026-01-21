'use client'

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { authService } from '@/services/auth.service'
import type { RegisterDto, LoginDto } from '@/types/auth'

/**
 * =============================================================================
 * UNIFIED AUTH HOOK - Main Authentication Hook
 * =============================================================================
 * 
 * This hook provides comprehensive authentication state and automatic handling
 * of token expiration. Use this in all components that need auth information.
 * 
 * TOKEN FLOW:
 * - Access Token (15min): Automatically refreshed by API interceptor
 * - Refresh Token (7days): When expired, user is logged out
 * 
 * USAGE:
 * ```tsx
 * const { user, isAuthenticated, isLoading } = useAuth()
 * 
 * if (isLoading) return <Loading />
 * if (!isAuthenticated) return <LoginPrompt />
 * return <Dashboard user={user} />
 * ```
 */
export function useAuth() {
    const router = useRouter()
    const { data: user, isLoading, error } = useCurrentUser()

    // Determine authentication status
    const isAuthenticated = !!user && !error

    // Check if session has expired (refresh token is invalid/expired)
    const errorCode = (error as any)?.response?.data?.code
    const isSessionExpired =
        errorCode === 'REFRESH_TOKEN_EXPIRED' ||
        errorCode === 'REFRESH_TOKEN_INVALID' ||
        errorCode === 'REFRESH_TOKEN_MISSING' ||
        errorCode === 'USER_NOT_FOUND'

    // Auto-redirect to login when session expires
    // Don't redirect on access token errors - those are handled by interceptor
    useEffect(() => {
        if (!isLoading && isSessionExpired) {
            router.push('/')
        }
    }, [isLoading, isSessionExpired, router])

    return {
        /** Current authenticated user, null if not authenticated */
        user: user ?? null,

        /** Whether the user is authenticated */
        isAuthenticated,

        /** Whether auth status is still being checked */
        isLoading,

        /** Whether the session has completely expired (7-day refresh token) */
        isSessionExpired,

        /** Any error from the auth check */
        error,
    }
}

/**
 * =============================================================================
 * PROTECTED ROUTE - Redirect if not authenticated
 * =============================================================================
 * 
 * Use this hook in pages that require authentication.
 * Automatically redirects to login if user is not authenticated.
 * 
 * USAGE:
 * ```tsx
 * export default function DashboardPage() {
 *   const { user, isLoading } = useRequireAuth()
 *   
 *   if (isLoading) return <Loading />
 *   return <Dashboard user={user} />
 * }
 * ```
 */
export function useRequireAuth() {
    const router = useRouter()
    const auth = useAuth()

    useEffect(() => {
        // Only redirect if we've finished loading and user is not authenticated
        if (!auth.isLoading && !auth.isAuthenticated) {
            router.push('/')
        }
    }, [auth.isLoading, auth.isAuthenticated, router])

    return auth
}

/**
 * =============================================================================
 * PUBLIC ROUTE - Redirect if already authenticated
 * =============================================================================
 * 
 * Use this hook in login/register pages.
 * Automatically redirects to dashboard if user is already authenticated.
 * 
 * USAGE:
 * ```tsx
 * export default function LoginPage() {
 *   const { isLoading } = useRedirectIfAuthenticated()
 *   
 *   if (isLoading) return <Loading />
 *   return <LoginForm />
 * }
 * ```
 */
export function useRedirectIfAuthenticated(redirectTo: string = '/dashboard') {
    const router = useRouter()
    // Only check auth status once, don't continuously refetch
    const { data: user, isLoading } = useCurrentUser({
        enabled: true,
        // Prevent any refetching on public pages to avoid unnecessary API calls
        refetchOnWindowFocus: false,
        refetchOnMount: false,
        refetchOnReconnect: false,
        staleTime: Infinity,
    })

    useEffect(() => {
        // Only redirect if we've finished loading and user is authenticated
        if (!isLoading && user) {
            router.push(redirectTo)
        }
    }, [isLoading, user, router, redirectTo])

    return {
        isLoading,
    }
}

/**
 * =============================================================================
 * AUTH MUTATIONS - Login, Register, Logout
 * =============================================================================
 */

/**
 * Hook for registering a new user.
 * 
 * @returns A mutation object for user registration.
 */
export function useRegister() {
    return useMutation({
        mutationFn: (data: RegisterDto) => authService.register(data),
        onSuccess: (data) => {
            console.log('Registration successful:', data)
        },
        onError: (error: any) => {
            console.error('Registration failed:', error.response?.data || error.message)
        },
    })
}

/**
 * Hook for authenticating a user.
 * 
 * @returns A mutation object for user login.
 */
export function useLogin() {
    return useMutation({
        mutationFn: (data: LoginDto) => authService.login(data),
        onSuccess: () => {
            console.log('Login successful')
        },
        onError: (error: any) => {
            console.error('Login failed:', error.response?.data || error.message)
        },
    })
}

/**
 * Hook for logging out the current user session.
 * 
 * @returns A mutation object for user logout.
 */
export function useLogout() {
    return useMutation({
        mutationFn: () => authService.logout(),
        onSuccess: () => {
            console.log('Logout successful')
        },
        onError: (error: any) => {
            console.error('Logout failed:', error.response?.data || error.message)
        },
    })
}

/**
 * Hook for invalidating all active sessions for the current user.
 * 
 * @returns A mutation object for logging out from all devices.
 */
export function useLogoutAll() {
    return useMutation({
        mutationFn: () => authService.logoutAll(),
        onSuccess: () => {
            console.log('Logged out from all devices')
        },
        onError: (error: any) => {
            console.error('Logout all failed:', error.response?.data || error.message)
        },
    })
}

/**
 * Hook for refreshing the authentication tokens.
 * 
 * @returns A mutation object for token refresh.
 */
export function useRefreshToken() {
    return useMutation({
        mutationFn: () => authService.refresh(),
        onSuccess: () => {
            console.log('Token refreshed successfully')
        },
        onError: (error: any) => {
            console.error('Token refresh failed:', error.response?.data || error.message)
        },
    })
}

/**
 * Hook for retrieving the currently authenticated user's profile information.
 * 
 * @param options - Query options including enabled flag to conditionally fetch user
 * @returns A query object containing the current user data.
 */
export function useCurrentUser(options?: {
    enabled?: boolean
    refetchOnWindowFocus?: boolean
    refetchOnMount?: boolean
    refetchOnReconnect?: boolean
    staleTime?: number
}) {
    return useQuery({
        queryKey: ['currentUser'],
        queryFn: () => authService.me(),
        retry: false,
        staleTime: options?.staleTime ?? 5 * 60 * 1000,
        enabled: options?.enabled ?? true,
        refetchOnWindowFocus: options?.refetchOnWindowFocus ?? true,
        refetchOnMount: options?.refetchOnMount ?? true,
        refetchOnReconnect: options?.refetchOnReconnect ?? true,
    })
}

/**
 * Hook for updating the current user's profile details.
 * Automatically invalidates the 'currentUser' query on success.
 * 
 * @returns A mutation object for updating user profile.
 */
export function useUpdateProfile() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: { name?: string; email?: string }) => authService.updateProfile(data),
        onSuccess: () => {
            console.log('Profile updated successfully')
            queryClient.invalidateQueries({ queryKey: ['currentUser'] })
        },
        onError: (error: any) => {
            console.error('Profile update failed:', error.response?.data || error.message)
        },
    })
}
