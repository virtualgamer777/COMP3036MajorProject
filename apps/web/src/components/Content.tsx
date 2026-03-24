import type { PropsWithChildren } from "react";

export function Content({ children }: PropsWithChildren) {
  return <div className="flex-1 min-w-0 h-full overflow-y-auto">{children}</div>;
}
