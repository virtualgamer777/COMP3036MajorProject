import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";
import { toUrlPath } from "@repo/utils/url";

export default async function Page({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const { name } = await params;

  return (
    <AppLayout>
      <Main posts={posts.filter((post) => toUrlPath(post.category) == name && post.active)}/> 
    </AppLayout>
  );
}
