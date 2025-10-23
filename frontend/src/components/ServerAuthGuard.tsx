import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";

interface ServerAuthGuardProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * ServerAuthGuard - Server-side authentication guard component
 * 
 * Protects pages by checking if a user is logged in on the server.
 * If no user is found, redirects to sign-in page.
 * 
 * This is more secure than client-side guard as it prevents the page
 * from rendering at all if the user is not authenticated.
 * 
 * @example
 * ```tsx
 * export default async function ProtectedPage() {
 *   return (
 *     <ServerAuthGuard>
 *       <div>Protected content here</div>
 *     </ServerAuthGuard>
 *   );
 * }
 * ```
 * 
 * @param children - Content to show when user is authenticated
 * @param redirectTo - Optional custom redirect path (defaults to /sign-in)
 */
export async function ServerAuthGuard({ 
  children, 
  redirectTo = "/sign-in" 
}: ServerAuthGuardProps) {
  const user = await stackServerApp.getUser();

  if (!user) {
    redirect(redirectTo);
  }

  return <>{children}</>;
}
