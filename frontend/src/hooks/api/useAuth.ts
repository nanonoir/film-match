import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { authService } from '@/api/services';
import { TokenManager } from '@/lib/auth/token-manager';
import { queryKeys, QUERY_CACHE_TIMES } from '@/lib/cache/query-cache';
import type { UserDTO, GoogleAuthPayload, LoginResponse } from '@/api/types';

/**
 * useAuth hook
 * Manages authentication state and operations
 * - getCurrentUser: Fetch authenticated user (requires token)
 * - getGoogleAuthUrl: Get OAuth flow URL
 * - loginWithGoogle: Perform Google OAuth login
 * - logout: Clear authentication
 */
export const useAuth = () => {
  const queryClient = useQueryClient();

  // Query: Get current authenticated user
  const {
    data: currentUser,
    isLoading: isLoadingUser,
    error: userError,
    isError: isUserError,
  } = useQuery({
    queryKey: queryKeys.auth.currentUser(),
    queryFn: () => authService.getCurrentUser(),
    staleTime: QUERY_CACHE_TIMES.CURRENT_USER,
    enabled: TokenManager.isAuthenticated(), // Only fetch if user has token
    retry: (failureCount, error: any) => {
      // Stop retrying if auth error (token invalid/expired)
      if (error?.status === 401) {
        return false;
      }
      return failureCount < 2;
    },
  });

  // Query: Get Google OAuth URL
  // Disabled by default - only fetch when user clicks login
  const { data: googleAuthUrl, isLoading: isLoadingAuthUrl } = useQuery({
    queryKey: queryKeys.auth.authUrl(),
    queryFn: () => authService.getGoogleAuthUrl(),
    staleTime: 60 * 60 * 1000, // 1 hour (URL doesn't change)
    enabled: false, // Don't fetch automatically
  });

  // Mutation: Login with Google
  const loginWithGoogleMutation = useMutation({
    mutationFn: async (payload: GoogleAuthPayload) => {
      const response = await authService.loginWithGoogle(payload.token);
      // Store tokens immediately after successful login
      TokenManager.setTokens(response.accessToken, response.refreshToken);
      return response;
    },
    onSuccess: (response: LoginResponse) => {
      // Invalidate and refetch current user
      queryClient.invalidateQueries({
        queryKey: queryKeys.auth.currentUser(),
      });
      // Set new user data in cache
      queryClient.setQueryData(queryKeys.auth.currentUser(), response.user);
    },
    onError: (error: any) => {
      // Clear tokens on login failure
      TokenManager.clearTokens();
    },
  });

  // Mutation: Logout
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await authService.logout();
    },
    onSuccess: () => {
      // Clear tokens
      TokenManager.clearTokens();

      // Clear auth-related cache
      queryClient.removeQueries({
        queryKey: queryKeys.auth.all,
      });

      // Clear user-specific data (ratings, collections, etc.)
      queryClient.removeQueries({
        queryKey: queryKeys.ratings.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.collections.all,
      });

      queryClient.removeQueries({
        queryKey: queryKeys.rag.all,
      });
    },
  });

  return {
    // User data
    currentUser,
    isLoadingUser,
    isUserError,
    userError,

    // Auth URL
    googleAuthUrl,
    isLoadingAuthUrl,

    // Authentication status
    isAuthenticated: TokenManager.isAuthenticated(),
    isTokenExpired: TokenManager.isTokenExpired(),

    // Mutations
    loginWithGoogle: (token: string) =>
      loginWithGoogleMutation.mutate({ token }),
    isLoggingIn: loginWithGoogleMutation.isPending,
    loginError: loginWithGoogleMutation.error,

    logout: () => logoutMutation.mutate(),
    isLoggingOut: logoutMutation.isPending,
    logoutError: logoutMutation.error,
  };
};

export default useAuth;
