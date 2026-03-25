import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { posts } from "@repo/db/data";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { q } = await searchParams;
  //filter posts out to only those with titles or descriptions matching the search query
  const filteredPosts = posts.filter((post) => post.title.toLowerCase().includes(q.toLowerCase()) || post.description.toLowerCase().includes(q.toLowerCase())); 

  return (
    <AppLayout query={q}>
      <Main posts={filteredPosts} />
    </AppLayout>
  );
}
