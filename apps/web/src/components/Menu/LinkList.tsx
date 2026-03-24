import type { PropsWithChildren } from "react";

export function LinkList(props: PropsWithChildren<{ title: string }>) {
  return (
    <section>
      <h2>{props.title}</h2>
      <div>{props.children}</div>
    </section>
  );
}
