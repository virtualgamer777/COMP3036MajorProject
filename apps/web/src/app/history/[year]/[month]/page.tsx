"use server"

import { AppLayout } from "@/components/Layout/AppLayout";
import { Main } from "@/components/Main";
import { getPosts } from "@repo/db/data";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {

  const {year, month} = await params;
  let posts = await getPosts();
  
  return (
    <AppLayout>
      <Main posts={posts.filter((post) => post.date.getUTCFullYear().toString() == year && (post.date.getUTCMonth()+1).toString() == month)} />
    </AppLayout>
  );
}
