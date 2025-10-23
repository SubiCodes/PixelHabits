import { StackHandler } from "@stackframe/stack";
import { stackServerApp } from "../../../stack/server";

export default function HandlerLayout() {
  return (
    <StackHandler
      fullPage
      app={stackServerApp}
      routeProps={{}}
    />
  );
}