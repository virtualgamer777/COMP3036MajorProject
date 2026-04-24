"use server"

import type { Post } from "@repo/db/data";
import BlogList from "./Blog/List";

export async function Main({
  posts,
  className,
}: {
  posts: Post[];
  className?: string;
}) {
  return (
    <main className={className}>
      <BlogList posts={posts} />
    </main>
  );
}
