import { StackClientApp } from "@stackframe/stack";

export const stackClientApp = new StackClientApp({
  tokenStore: "nextjs-cookie",
  urls: {
    signIn: "/sign-in",
    signUp: "/sign-up",
    afterSignIn: "/home",
    afterSignUp: "/home",
    afterSignOut: "/",
    home: "/home",
    handler: "/handler",
  },
});
