import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack/server";

// Correct type for Next.js App Router page props
export default function Handler(props: { params: Record<string, string | string[]>; searchParams: Record<string, string | string[] | undefined> }) {
  return (
    <StackHandler
      fullPage
      app={stackServerApp}
      routeProps={props} // Pass the actual route props
    />
  );
} 
