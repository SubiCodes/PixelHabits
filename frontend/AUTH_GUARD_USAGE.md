# Authentication Guard Usage Examples

## Client-Side AuthGuard

Use `AuthGuard` for client components when you need client-side interactivity:

```tsx
"use client";

import { AuthGuard } from "@/components";

export default function ProtectedPage() {
  return (
    <AuthGuard>
      <div>
        <h1>Protected Content</h1>
        <p>Only logged-in users can see this!</p>
      </div>
    </AuthGuard>
  );
}
```

### With Custom Loading State

```tsx
"use client";

import { AuthGuard } from "@/components";

export default function ProtectedPage() {
  return (
    <AuthGuard 
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <div>Protected content here</div>
    </AuthGuard>
  );
}
```

### With Custom Redirect

```tsx
"use client";

import { AuthGuard } from "@/components";

export default function ProtectedPage() {
  return (
    <AuthGuard redirectTo="/custom-login">
      <div>Protected content here</div>
    </AuthGuard>
  );
}
```

## Server-Side ServerAuthGuard (Recommended)

Use `ServerAuthGuard` for server components for better security and SEO:

```tsx
import { ServerAuthGuard } from "@/components";

export default async function ProtectedPage() {
  return (
    <ServerAuthGuard>
      <div>
        <h1>Protected Content</h1>
        <p>Only logged-in users can see this!</p>
      </div>
    </ServerAuthGuard>
  );
}
```

### With Custom Redirect

```tsx
import { ServerAuthGuard } from "@/components";

export default async function ProtectedPage() {
  return (
    <ServerAuthGuard redirectTo="/custom-login">
      <div>Protected content here</div>
    </ServerAuthGuard>
  );
}
```

## Which Guard Should You Use?

### Use ServerAuthGuard when:
- ✅ You want better security (no flash of content)
- ✅ You're using server components
- ✅ You want better SEO
- ✅ You don't need client-side state/hooks in the guard itself

### Use AuthGuard when:
- ✅ You need client-side interactivity
- ✅ You want to show custom loading states
- ✅ You're already using "use client" directive
- ✅ You need access to client-side hooks

## Complete Example: Protected Dashboard

```tsx
import { ServerAuthGuard } from "@/components";
import { stackServerApp } from "@/stack/server";

export default async function DashboardPage() {
  // You can safely fetch user data here since ServerAuthGuard ensures user exists
  const user = await stackServerApp.getUser();

  return (
    <ServerAuthGuard>
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-4">
          Welcome, {user?.displayName || user?.primaryEmail}!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Your dashboard content */}
        </div>
      </div>
    </ServerAuthGuard>
  );
}
```
