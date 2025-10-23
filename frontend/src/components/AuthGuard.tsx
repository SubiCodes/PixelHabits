"use client";

import { useUser } from "@stackframe/stack";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard - Client-side authentication guard component
 * 
 * Protects pages by checking if a user is logged in.
 * If no user is found, redirects to sign-in page or shows fallback UI.
 * 
 * @example
 * ```tsx
 * export default function ProtectedPage() {
 *   return (
 *     <AuthGuard>
 *       <div>Protected content here</div>
 *     </AuthGuard>
 *   );
 * }
 * ```
 * 
 * @param children - Content to show when user is authenticated
 * @param fallback - Optional loading UI to show while checking auth
 * @param redirectTo - Optional custom redirect path (defaults to /sign-in)
 */
export function AuthGuard({ 
  children, 
  fallback = <div className="flex items-center justify-center min-h-screen">Loading...</div>,
  redirectTo = "/sign-in" 
}: AuthGuardProps) {
  const user = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      // User is not logged in, redirect to sign-in
      router.push(redirectTo);
    }
  }, [user, router, redirectTo]);

  // Show loading state while checking authentication
  if (user === undefined) {
    return <>{fallback}</>;
  }

  // User is not authenticated
  if (user === null) {
    return <>{fallback}</>;
  }

  // User is authenticated, show protected content
  return <>{children}</>;
}
