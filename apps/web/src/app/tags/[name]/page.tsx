"use server"
import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;
  const posts = await getPosts();

  return (
    <AppLayout>
      <Main posts={posts.filter((post) => toUrlPath(post.tags).includes(name) && post.active)}/> 
    </AppLayout>
  );
}
